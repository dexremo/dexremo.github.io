/* DexRemo site configuration.
 * This is the ONLY file you need to edit to publish a release:
 *   1. paste the URL into LINKS (null = shown as "coming soon")
 *   2. change the release's status in RELEASES
 */
window.DEXREMO = {
  /* Fill in when ready. Each author: { name: "...", url: "..." (optional), aff: "1" } */
  /* aff: index into `affiliations` (1-based), e.g. aff: "1" or "1,2". Leave out until confirmed.
   * mark: "†" equal contribution, "*" corresponding author. */
  authors: [
    { name: "Liman Wang", aff: "1", mark: "†", url: "https://limanwang.github.io/#/", email: ["liman.wang", "york.ac.uk"] },
    { name: "Hanyang Zhong", aff: "1", mark: "†", url: "https://hanyangzhong.github.io/", email: ["hanyang.zhong", "york.ac.uk"] },
    { name: "Sun Zhaole", aff: "2", url: "https://sunzhaole.github.io/", email: ["szlhszt", "outlook.com"] },
    { name: "Wenting Cao", aff: "3", email: ["wenting.cao", "uni-jena.de"] },
    { name: "Babar Jamil", aff: "1", url: "https://www.york.ac.uk/physics-engineering-technology/people/babarjamil/", email: ["babar.jamil", "york.ac.uk"] },
    { name: "Andy Tyrrell", aff: "1", url: "https://www.york.ac.uk/physics-engineering-technology/people/andy_tyrrell/", email: ["andy.tyrrell", "york.ac.uk"] },
    { name: "Shan Luo", aff: "4", url: "https://shanluo.github.io/", email: ["shan.luo", "kcl.ac.uk"] },
    { name: "Jihong Zhu", aff: "1", mark: "*", url: "https://jihong-zhu.github.io/", email: ["jihong.zhu", "york.ac.uk"] }
  ],
  affiliations: ["University of York", "University of Edinburgh", "Friedrich Schiller University Jena", "King's College London"],
  /* email is stored as [user, domain] and joined in the browser, so the address is not plain text in the source */
  authorNote: "† Equal contribution · * Corresponding author",

  venue: "Accepted to IEEE Transactions on Robotics (T-RO), 2026",

  /* null  -> button is shown disabled with a "soon" tag
   * "url" -> button becomes a live link                              */
  links: {
    paper: null,          // arXiv / IEEE Xplore URL
    video: "https://youtu.be/yhkofu6_7R4",   // review-time video; replace with the final cut
    bilibili: null,
    github: null,         // GitHub organisation
    hardware: null,       // hardware repo (STEP / STL / drawings / BOM)
    step: null,           // direct download: assembly STEP (zip)
    stl: null,            // direct download: printable STL set (zip)
    drawings: null,       // direct download: machining drawings (PDF zip)
    bom: null,            // BOM spreadsheet
    buildGuide: null,     // assembly guide
    sdk: null,            // minimal driver package
    description: null,    // URDF / MJCF / USD repo
    sensor: null,         // fingertip force sensor files
    teleop: null,         // teleoperation + force visualisation
    code: null,           // training / deployment code
    checkpoints: null,    // pretrained policies
    discord: null,
    subscribe: null       // mailing-list form, or the GitHub repo to Watch
  },

  /* Interactive 3D views. Each one fills the element marked data-model-slot="<key>" in the HTML.
   * file:        path to the .glb
   * poster:      still picture shown until the visitor opens the 3D view
   * orientation: "roll pitch yaw" used to stand the SolidWorks export upright
   * orbit:       starting camera angle
   * colors:      display colour per material index in the .glb (null keeps the exported colour).
   *              The index order comes from the SolidWorks export and can change on re-export.
   * legend:      colour key shown under the viewer                                              */
/* Interactive 3D on/off. A browser has to download a model to show it, so anything shown in 3D
     can be saved by a determined visitor. false = show the rendered still images only. */
  modelsLive: false,

  models: {
    full: {
      title: "Full hand: force-sensing fingertips, wrist-camera mount and arm flange",
      file: "assets/models/dexremo_hand_full.glb", poster: "assets/img/model-full.jpg",
      orientation: "0deg 90deg 0deg", orbit: "35deg 72deg auto",
      /* 0 joint brackets · 1 fingertips · 2 flange + camera mount · 3 fingertip adapter · 4 servos · 5 palm
         6 finger links · 7 load cells · 8 sensor plates */
      colors: ["#12a594", "#f76707", "#ced4da", "#e64980", "#343a40", "#4c8eea", "#f5c211", "#e03131", "#7950f2"],
      legend: [["#f76707", "Fingertip"], ["#7950f2", "Force sensor"], ["#e64980", "Fingertip adapter"], ["#12a594", "Joint bracket"],
               ["#f5c211", "Finger link"], ["#343a40", "Servo"], ["#4c8eea", "Palm"], ["#ced4da", "Flange and camera mount"]]
    },
    hand: {
      title: "Base hand, without force sensing",
      file: "assets/models/dexremo_hand_only.glb", poster: "assets/img/model-hand.jpg",
      orientation: "0deg 90deg 0deg", orbit: "35deg 72deg auto",
      /* 0 fingertips · 1 finger links · 2 joint brackets · 3 servos · 4 mounting flange · 5 palm · 6 fingertip adapter */
      colors: ["#f76707", "#f5c211", "#12a594", "#343a40", "#ced4da", "#4c8eea", "#e64980"],
      legend: [["#f76707", "Fingertip"], ["#e64980", "Fingertip adapter"], ["#12a594", "Joint bracket"], ["#f5c211", "Finger link"],
               ["#343a40", "Servo"], ["#4c8eea", "Palm"], ["#ced4da", "Flange"]]
    },
    sensor: {
      title: "Three-axis fingertip force sensor",
      file: "assets/models/ft_sensor.glb", poster: "assets/img/model-sensor.jpg",
      orientation: "0deg 90deg 0deg", orbit: "30deg 68deg auto",
      /* 0 load cells · 1 mounting plates */
      colors: ["#e03131", "#7950f2"],
      legend: [["#e03131", "S-type load cell (×3)"], ["#7950f2", "Mounting plate"]]
    },
    controller: {
      title: "Leader device: a passive replica of the hand, worn on the operator's fingers",
      file: "assets/models/dexremo_controller.glb", poster: "assets/img/model-controller.jpg",
      orientation: "0deg 90deg 0deg", orbit: "35deg 72deg auto",
      /* 0 joint brackets · 1 finger links · 2 joint units · 3 ring mount · 4 palm · 5 flange and handle · 6 finger rings */
      colors: ["#12a594", "#f5c211", "#343a40", "#e64980", "#4c8eea", "#ced4da", "#f76707"],
      legend: [["#f76707", "Finger ring"], ["#e64980", "Ring mount"], ["#12a594", "Joint bracket"], ["#f5c211", "Finger link"],
               ["#343a40", "Joint unit"], ["#4c8eea", "Palm"], ["#ced4da", "Flange and handle"]]
    },
    nail: {
      title: "Rigid fingernail tip, for prying and scraping",
      file: "assets/models/dexremo_nail_finger.glb", poster: "assets/img/model-nail.jpg",
      orientation: "0deg 90deg 0deg", orbit: "35deg 72deg 145%",
      /* 0 load cells · 1 sensor plates · 2 tip */
      colors: ["#e03131", "#7950f2", "#f76707"],
      legend: [["#f76707", "Fingernail tip"], ["#7950f2", "Sensor plate"], ["#e03131", "Load cell"]]
    },
    mushroom: {
      title: "Spherical core of the soft cleaning tip, wrapped with sponge or tissue",
      file: "assets/models/dexremo_mushroom_finger.glb", poster: "assets/img/model-mushroom.jpg",
      orientation: "0deg 90deg 0deg", orbit: "35deg 72deg 145%",
      /* 0 tip · 1 load cells · 2 sensor plates */
      colors: ["#f76707", "#e03131", "#7950f2"],
      legend: [["#f76707", "Spherical core"], ["#7950f2", "Sensor plate"], ["#e03131", "Load cell"]]
    }
  },

  /* YouTube id for the embedded project video (null hides the player). */
  youtubeId: "yhkofu6_7R4",

  /* status: "released" | "next" | "planned" */
  releases: [
    { id: "R0", title: "Project site", status: "next",
      summary: "Paper, videos, results and this roadmap.",
      items: ["Paper and supplementary video", "Results and failure cases for all nine tasks", "Interactive force-frame demo"] },
    { id: "R1", title: "Hardware", status: "planned",
      summary: "Everything needed to build the hand and make it move.",
      items: ["STEP assemblies and printable STL files", "Machining drawings for the aluminium parts", "Bill of materials with purchase links", "Assembly guide and video", "Leader device for teleoperation", "URDF, MJCF and USD models", "Minimal Python driver: servo setup, zero calibration, joint read/write"] },
    { id: "R2", title: "Force sensing and teleoperation", status: "planned",
      summary: "The three-axis fingertip sensor and the leader–follower stack.",
      items: ["Fingertip sensor files and wiring", "Calibration scripts and procedure", "Leader–follower teleoperation", "Live fingertip force visualisation"] },
    { id: "R3", title: "Learning code", status: "planned",
      summary: "Train and deploy the policies from the paper.",
      items: ["Training and deployment code", "Pretrained checkpoints", "Evaluation scripts for the six core tasks"] },
    { id: "R4", title: "Ecosystem", status: "planned",
      summary: "Arm integration, community builds and new removal tasks.",
      items: ["Arm-mounted configuration", "Community build gallery", "Open call for new removal tasks"] }
  ],

  /* ok / fail: YouTube ids of one successful and one failed rollout (null hides the button). */
  tasks: [
    { id: "A1", family: "A", name: "Barnacle removal from a turtle shell", constraint: "Hot-melt adhesive", img: "a1", ok: "1PkCwWYd1Oo", fail: "ZRzwPyAbVP0" },
    { id: "A2", family: "A", name: "3D-printed part removal from a build plate", constraint: "Nano-adhesive film", img: "a2", ok: "mHo6blWWaE0", fail: "OKMSxTer-nI" },
    { id: "A3", family: "A", name: "Blu-Tack removal from an acrylic plate", constraint: "Blu-Tack adhesion", img: "a3", ok: "FWYAd0IGviE", fail: "4HzpC1T6-AQ" },
    { id: "A4", family: "A", name: "Wood-ear extraction from a tree log", constraint: "Hot-melt adhesive", img: "a4", ok: "7TWhdvHnLzE", fail: "4e-QYmrzYQ4" },
    { id: "A5", family: "A", name: "Fingertip self-cleaning", constraint: "Blu-Tack adhesion", img: "a5", ok: "4nsJrMAWZws", fail: "fc2WWL7BxY4" },
    { id: "B1", family: "B", name: "Wiping marker stains from a ceramic plate", constraint: "Pigment on surface", img: "b1", ok: "_x-GmjfMkLw", fail: "yPktbzjZuuU" },
    { id: "B2", family: "B", name: "Wiping ink marks from silicone skin", constraint: "Pigment on surface", img: "b2", ok: "jyDpRY7INCE", fail: "drgyJwj_ONY" },
    { id: "C1", family: "C", name: "Fossil excavation in sand", constraint: "Granular media", img: "c1", ok: null, fail: "RE2BoalE7xs" },
    { id: "C2", family: "C", name: "Cat litter clump removal", constraint: "Granular media", img: "c2", ok: "5xvzpM_UJEc", fail: "6u8j3mEqveg" }
  ]
};
