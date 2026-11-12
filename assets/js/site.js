/* Shared behaviour: header/footer, link states, roadmap, tasks, video, BibTeX copy. */
(function () {
  const C = window.DEXREMO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    n.innerHTML = html;
    return n;
  };
  const here = location.pathname.split("/").pop() || "index.html";

  /* ---------- header + footer ---------- */
  const NAV = [
    ["index.html", "Home"],
    ["hardware.html", "Hardware"],
    ["software.html", "Software"],
    ["roadmap.html", "Roadmap"]
  ];
  const header = $("#site-header");
  if (header) {
    header.innerHTML =
      '<div class="wrap bar">' +
      '<a class="brand" href="index.html">Dex<span>Remo</span></a>' +
      '<button class="menu" aria-expanded="false" aria-controls="nav">Menu</button>' +
      '<nav id="nav">' +
      NAV.map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ""}>${t}</a>`).join("") +
      '<a class="gh" data-link="github">GitHub</a>' +
      "</nav></div>";
    const btn = $(".menu", header);
    btn.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  }
  const footer = $("#site-footer");
  if (footer) {
    footer.innerHTML =
      '<div class="wrap foot">' +
      "<p><strong>DexRemo</strong> — a force-sensing hand platform and task suite for contact-rich removal manipulation.</p>" +
      '<p class="muted">' + C.venue + ". Files are opened in stages; see the <a href=\"roadmap.html\">roadmap</a>.</p>" +
      '<p class="muted">Licences: hardware files under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>; code and simulation models under the <a href="https://opensource.org/license/mit" target="_blank" rel="noopener">MIT licence</a>.</p>' +
      "</div>";
  }

  /* ---------- authors ---------- */
  const au = $("#authors");
  if (au) {
    if (C.authors.length) {
      au.innerHTML = C.authors
        .map(a => {
          const sup = [a.aff, a.mark].filter(Boolean).join(",");
          const addr = a.email ? a.email.join("@") : "";
          const mail = addr
            ? `<a class="mail" href="mailto:${addr}" title="${addr}" aria-label="Email ${a.name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3z M3.5 6.5l8.5 7 8.5-7"/></svg></a>`
            : "";
          return `<span class="author">` + (a.url ? `<a href="${a.url}" target="_blank" rel="noopener">${a.name}</a>` : a.name) +
            (sup ? `<sup>${sup}</sup>` : "") + mail + `</span>`;
        })
        .join(", ");
      const af = $("#affiliations");
      const numbered = C.authors.some(a => a.aff);   // number affiliations only once authors are mapped to them
      if (af) af.innerHTML =
        C.affiliations.map((a, i) => (numbered ? `<sup>${i + 1}</sup>` : "") + a).join(numbered ? " &nbsp; " : " · ") +
        (C.authorNote ? `<br>${C.authorNote}` : "");
    } else au.remove();
  }

  /* ---------- link states: live or "soon" ---------- */
  function wireLinks(root = document) {
    $$("[data-link]", root).forEach(a => {
      const url = C.links[a.dataset.link];
      if (url) {
        a.href = url;
        if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; }
      } else {
        a.classList.add("soon");
        a.setAttribute("aria-disabled", "true");
        a.removeAttribute("href");
        if (!$(".tag", a)) a.append(el("span", { class: "tag" }, "soon"));
      }
    });
  }

  /* ---------- roadmap ---------- */
  const LABEL = { released: "Released", next: "In progress", planned: "Planned" };
  $$("[data-roadmap]").forEach(box => {
    const full = box.dataset.roadmap === "full";
    box.innerHTML = C.releases.map(r =>
      `<li class="rel ${r.status}">
         <div class="rel-head"><span class="rel-id">${r.id}</span>
           <span class="status">${LABEL[r.status]}</span></div>
         <h3>${r.title}</h3>
         ${full ? `<p>${r.summary}</p>` : ""}
         ${full ? "<ul>" + r.items.map(i => `<li>${i}</li>`).join("") + "</ul>" : ""}
       </li>`).join("");
  });

  /* ---------- task cards ---------- */
  const FAM = { A: "Adhesive detachment", B: "Surface cleaning", C: "Occluded retrieval" };
  const grid = $("[data-tasks]");
  if (grid) {
    const both = t => t.ok && t.fail;      // the comparison needs both clips
    grid.innerHTML = C.tasks.map((t, i) =>
      `<li class="task">
         <div class="task-media"><img src="assets/img/${t.img}.jpg" alt="" loading="lazy" width="800" height="800"></div>
         <div class="task-body">
           <h3><span>${t.id}</span>${t.name}</h3>
           <p>${FAM[t.family]} · ${t.constraint}</p>
           ${both(t) ? `<div class="clips"><button type="button" data-compare="${i}">Success vs baseline failure</button></div>` : ""}</div>
       </li>`).join("");

    /* Side-by-side viewer. Both clips start together, muted and looping; nothing loads from YouTube until it opens. */
    const dlg = el("dialog", { class: "compare", "aria-labelledby": "cmp-title" },
      `<div class="cmp-head"><h2 id="cmp-title"></h2><button type="button" class="cmp-close">Close</button></div>
       <div class="cmp-grid">
         <figure><div class="cmp-player" data-side="ok"></div><figcaption class="ok">Success, full policy</figcaption></figure>
         <figure><div class="cmp-player" data-side="fail"></div><figcaption class="fail">Baseline failure mode</figcaption></figure>
       </div>
       <p class="cmp-note">Both clips play muted and loop. They are separate rollouts, so their lengths differ.</p>`);
    document.body.append(dlg);
    const frame = (id, title) =>
      `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&rel=0&enablejsapi=1"
         title="${title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    const shut = () => { $$(".cmp-player", dlg).forEach(n => (n.innerHTML = "")); if (dlg.open) dlg.close(); };
    grid.addEventListener("click", e => {
      const b = e.target.closest("[data-compare]");
      if (!b) return;
      const t = C.tasks[+b.dataset.compare];
      $("#cmp-title", dlg).textContent = `${t.id} · ${t.name}`;
      $('[data-side="ok"]', dlg).innerHTML = frame(t.ok, `${t.id} successful rollout`);
      $('[data-side="fail"]', dlg).innerHTML = frame(t.fail, `${t.id} baseline failure mode`);
      dlg.showModal();
      /* mute=1 in the address is not always honoured, so also tell each player to mute once it is up */
      $$("iframe", dlg).forEach(fr => {
        const hush = () => { try { fr.contentWindow.postMessage('{"event":"command","func":"mute","args":[]}', "*"); } catch (e) {} };
        fr.addEventListener("load", () => [0, 400, 1000, 2000, 4000].forEach(ms => setTimeout(hush, ms)));
      });
    });
    $(".cmp-close", dlg).addEventListener("click", shut);
    dlg.addEventListener("click", e => { if (e.target === dlg) shut(); });   // click on the backdrop
    dlg.addEventListener("close", shut);                                     // Esc key
  }

  /* text that only makes sense while interactive 3D is on, or only while it is off */
  const live = C.modelsLive !== false;
  $$("[data-live-only]").forEach(n => { if (!live) n.remove(); });
  $$("[data-still-only]").forEach(n => { if (live) n.remove(); });

  /* ---------- 3D model viewers: the library loads only when a visitor opens one ---------- */
  let mvLib;
  $$("[data-model-slot]").forEach(slot => {
    const m = C.models[slot.dataset.modelSlot];
    if (!m) return;
    const legend = (m.legend || []).length
      ? '<ul class="legend">' + m.legend.map(([c, t]) => `<li><i style="background:${c}"></i>${t}</li>`).join("") + "</ul>" : "";
    slot.innerHTML =
      `<figure class="model">
         ${m.file && C.modelsLive !== false
           ? `<button class="model-stage" aria-label="Open the interactive 3D view: ${m.title}">
                <img src="${m.poster}" alt="" loading="lazy"><span>Open 3D view</span></button>`
           : `<div class="model-stage off"><img src="${m.poster}" alt="" loading="lazy"><span>Interactive 3D coming soon</span></div>`}
         <figcaption>${m.title}</figcaption>${legend}
       </figure>`;
    const b = $("button", slot);
    if (b) b.addEventListener("click", () => {
      if (!mvLib) {
        mvLib = document.createElement("script");
        mvLib.type = "module";
        mvLib.src = "assets/js/vendor/model-viewer.min.js";
        document.head.append(mvLib);
      }
      const v = document.createElement("model-viewer");
      v.className = "model-stage live";
      v.setAttribute("src", m.file);
      v.setAttribute("poster", m.poster);
      v.setAttribute("alt", m.title + ", interactive 3D model");
      ["camera-controls", "auto-rotate"].forEach(a => v.setAttribute(a, ""));
      v.setAttribute("touch-action", "pan-y");
      v.setAttribute("shadow-intensity", "0.8");
      v.setAttribute("interaction-prompt", "none");
      if (m.orientation) v.setAttribute("orientation", m.orientation);
      if (m.orbit) v.setAttribute("camera-orbit", m.orbit);
      if (m.colors) v.addEventListener("load", () => m.colors.forEach((c, i) => {
        const mat = v.model && v.model.materials[i];
        if (c && mat) mat.pbrMetallicRoughness.setBaseColorFactor(c);
      }));
      b.replaceWith(v);
    });
  });

  /* ---------- video: click to load, so nothing third-party loads up front ---------- */
  const vid = $("[data-video]");
  if (vid) {
    if (!C.youtubeId) vid.closest("section").remove();
    else vid.addEventListener("click", () => {
      vid.outerHTML =
        `<div class="player"><iframe src="https://www.youtube-nocookie.com/embed/${C.youtubeId}?autoplay=1"
           title="DexRemo project video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
    });
  }

  /* ---------- BibTeX copy ---------- */
  const copy = $("[data-copy]");
  if (copy) copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($(copy.dataset.copy).textContent);
      copy.textContent = "Copied";
      setTimeout(() => (copy.textContent = "Copy"), 1600);
    } catch (e) { copy.textContent = "Select and copy manually"; }
  });

  wireLinks();
})();
