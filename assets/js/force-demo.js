/* Interactive illustration of Eq. (5): the same physical force, read in the
 * fingertip's own frame and in the shared wrist frame. Planar simplification. */
(function () {
  const root = document.getElementById("force-demo");
  if (!root) return;
  const NS = "http://www.w3.org/2000/svg";
  const svg = root.querySelector("svg");
  const qIn = root.querySelector("#fd-q");
  const pIn = root.querySelector("#fd-phi");
  const play = root.querySelector("#fd-play");
  const F = 20;                       // N, fixed magnitude
  const B = { x: 170, y: 62 };        // wrist origin
  const L1 = 96, L2 = 80;
  const rad = d => (d * Math.PI) / 180;
  const mk = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    svg.appendChild(n);
    return n;
  };

  // static: wrist block + wrist axes
  mk("rect", { x: B.x - 46, y: B.y - 34, width: 92, height: 34, rx: 6, class: "fd-body" });
  mk("text", { x: B.x, y: B.y - 13, class: "fd-label", "text-anchor": "middle" }).textContent = "wrist";
  const axis = cls => mk("line", { class: "fd-axis " + cls, "marker-end": "url(#fd-ah-" + cls + ")" });
  const wx = axis("w"), wz = axis("w");
  const wxl = mk("text", { class: "fd-label w" }), wzl = mk("text", { class: "fd-label w" });
  wxl.textContent = "x"; wzl.textContent = "z";
  const set = (l, x1, y1, x2, y2) => { l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2); };
  set(wx, B.x + 60, B.y - 17, B.x + 100, B.y - 17);
  set(wz, B.x + 60, B.y - 17, B.x + 60, B.y + 23);
  wxl.setAttribute("x", B.x + 106); wxl.setAttribute("y", B.y - 13);
  wzl.setAttribute("x", B.x + 56); wzl.setAttribute("y", B.y + 38);

  // moving parts
  const l1 = mk("line", { class: "fd-link" }), l2 = mk("line", { class: "fd-link" });
  const j0 = mk("circle", { r: 7, class: "fd-joint" }), j1 = mk("circle", { r: 7, class: "fd-joint" });
  const tip = mk("circle", { r: 6, class: "fd-tip" });
  const sx = axis("s"), sz = axis("s");
  const sxl = mk("text", { class: "fd-label s" }), szl = mk("text", { class: "fd-label s" });
  sxl.textContent = "x"; szl.textContent = "z";
  const force = mk("line", { class: "fd-force", "marker-end": "url(#fd-ah-f)" });
  const fl = mk("text", { class: "fd-label f" }); fl.textContent = "contact force";

  const bars = {
    sx: root.querySelector("#fd-sx"), sz: root.querySelector("#fd-sz"),
    wx: root.querySelector("#fd-wx"), wz: root.querySelector("#fd-wz")
  };
  function bar(node, v) {
    const pct = Math.min(Math.abs(v) / F, 1) * 50;
    const fill = node.querySelector("i");
    fill.style.width = pct + "%";
    fill.style.left = v >= 0 ? "50%" : 50 - pct + "%";
    node.querySelector("b").textContent = (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1) + " N";
  }

  function draw() {
    const q = +qIn.value, phi = rad(+pIn.value);
    const a1 = rad(q * 0.55 - 12), a2 = a1 + rad(q * 0.75);
    const dir = a => ({ x: Math.sin(a), y: Math.cos(a) });   // angle from "straight down"
    const d1 = dir(a1), d2 = dir(a2);
    const J = { x: B.x + L1 * d1.x, y: B.y + L1 * d1.y };
    const T = { x: J.x + L2 * d2.x, y: J.y + L2 * d2.y };
    const n2 = { x: d2.y, y: -d2.x };                         // sensor x axis (perpendicular to link)
    set(l1, B.x, B.y, J.x, J.y); set(l2, J.x, J.y, T.x, T.y);
    j0.setAttribute("cx", B.x); j0.setAttribute("cy", B.y);
    j1.setAttribute("cx", J.x); j1.setAttribute("cy", J.y);
    tip.setAttribute("cx", T.x); tip.setAttribute("cy", T.y);
    set(sz, T.x, T.y, T.x + 40 * d2.x, T.y + 40 * d2.y);
    set(sx, T.x, T.y, T.x + 40 * n2.x, T.y + 40 * n2.y);
    szl.setAttribute("x", T.x + 52 * d2.x - 4); szl.setAttribute("y", T.y + 52 * d2.y + 4);
    sxl.setAttribute("x", T.x + 52 * n2.x - 4); sxl.setAttribute("y", T.y + 52 * n2.y + 4);

    // force expressed in the wrist frame (x right, z down); drawn pushing INTO the tip
    const f = { x: F * Math.sin(phi), y: F * Math.cos(phi) };
    const s = 3.2;
    set(force, T.x - f.x * s, T.y - f.y * s, T.x - f.x * 0.5, T.y - f.y * 0.5);
    fl.setAttribute("x", T.x - f.x * s + 8); fl.setAttribute("y", T.y - f.y * s - 6);

    bar(bars.wx, f.x); bar(bars.wz, f.y);
    bar(bars.sx, f.x * n2.x + f.y * n2.y);                   // local = R^T · wrist
    bar(bars.sz, f.x * d2.x + f.y * d2.y);
    root.querySelector("#fd-q-out").textContent = q + "°";
    root.querySelector("#fd-phi-out").textContent = pIn.value + "°";
  }

  /* The sweep plays by itself while the demo is on screen. Any click, touch or key press on the
     demo hands control to the visitor; the button starts the sweep again. */
  let raf = 0, t0 = 0, manual = false, visible = false;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function start() {
    if (raf) return;
    // continue from the current flexion instead of jumping back to zero
    const ph = Math.asin(Math.max(-1, Math.min(1, (+qIn.value - 45) / 45)));
    t0 = performance.now() - ph * 900;
    play.textContent = "Pause";
    raf = requestAnimationFrame(tick);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; play.textContent = "Sweep the finger"; }
  function tick(t) {
    qIn.value = Math.round(45 + 45 * Math.sin((t - t0) / 900));
    draw();
    raf = requestAnimationFrame(tick);
  }
  play.addEventListener("click", () => {
    if (raf) { manual = true; stop(); } else { manual = false; start(); }
  });
  const takeOver = e => { if (e.target !== play) { manual = true; stop(); } };
  root.addEventListener("pointerdown", takeOver);
  root.addEventListener("keydown", takeOver);
  qIn.addEventListener("input", draw);
  pIn.addEventListener("input", draw);
  if (!reduce && "IntersectionObserver" in window) {
    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && !manual) start(); else if (!visible && !manual) stop();
    }, { threshold: 0.25 }).observe(root);
  }
  draw();
})();
