/* ===============================================================
   Travel globe - about page only.
   Orthographic projection drawn on a canvas. No libraries.
   Land outline: Natural Earth 110m, simplified and delta-encoded.
   =============================================================== */
(function () {
  var host = document.getElementById("globe");
  if (!host || !host.getContext) return;

  var LAND = "-254,-320;-6,-a;-3d,7;43,3|-638,-31b;-2d,9;19,2;14,-b|-1c4,-30c;13,-14;-6d,-6;37,1a;23,0|-3de,-2cf;1c,-6;-3d,6;21,0|-2ad,-2c6;-3,-c;-17,-3;-27,8;1d,5;4,11;e,6;12,-15|-708,-34f;64,8;77,-f;96,4;-69,d;7,11;-27,9;3e,-2;2a,a;-59,c;-1c,b;-3,b;47,-5;34,9;-1,b;d,2;136,f;3f,-f;4b,3;-18,8;-c,f;4a,-a;47,a;82,-e;49,a;12,a;-e,17;c,1c;5f,24;-2a,-f;-1,-e;-24,-12;27,-1b;a,-1e;-62,-1d;-42,-1;23,-c;-2a,-5;-1,-8;c6,-28;54,f;46,-4;8e,12;-b,a;-3b,-2;-2,c;b7,20;12,6;-8,6;b,8;55,16;43,-7;4f,11;1f,-9;1a,8;89,-5;44,14;2f,-d;9f,28;45,-16;4b,1;8,-d;-13,-b;d,-4;-c,-c;14,-4;28,18;8d,25;11,-9;3d,-3;27,2;1f,10;22,-d;4a,a;3e,-e;96,b;3,9;18,-11;50,1;21,-f;e0,-21;-13,-14;-20,-7;-19,-12;b,-14;17,-6;-34,-4;-14,-11;60,-1d;59,-7;-dff,-2|-2a6,-21a;1b,-9;-29,-8;-37,1b;24,-d;12,10;f,-d|-249,-1ff;5,-8;-20,1;1b,7|5ae,-198;1d,-1;-4,-17;-13,-3;-d,17;7,4|6c2,-199;c,-4;-b,-1a;-10,-3;-16,-18;-1a,4;3f,35|6d2,-16a;16,-11;11,2;-21,-28;-3,12;-b,4;9,15;-15,1d;14,-11|1f5,-88;3,-15;-7,0;-1a,-5c;-1f,-1;-7,1d;b,14;0,27;21,10;f,1a;9,-10|59c,-8a;12,-c;a,-28;18,-e;2b,-39;0,-30;-1f,-41;-25,-10;-d,b;-e,-9;-1e,8;-19,18;1,c;-e,-9;a,18;-12,-14;-11,17;-1e,b;-85,-24;-1e,9;7,1a;-18,37;9,-2;-8,13;7,1a;1,-7;19,12;2a,a;30,37;e,4;19,-c;a,19;14,4;-2,a;29,-8;-a,-1f;2f,-1b;17,46;b,-1f|4dc,-65;-9,-1;10,f;16,3;-1d,-11|43e,-44;16,3;31,-13;-67,f;7,a;19,-9|5f0,-37;-12,-8;-13,6;19,2;7,d;8,-1;-3,-c|53d,-c;e,-16;1c,11;3f,-16;1e,-16;-4,-d;23,-20;-1c,5;-20,19;-15,-11;-32,9;b,b;-8,13;-2a,13;-7,-6;-a,d;11,6;-20,d;13,5;11,-8|4e4,e;-f,-c;-23,0;7,-10;18,8;-12,-d;11,-22;-11,7;-5,14;-6,-1d;-a,1;-6,1a;c,22;34,8|507,b;-6,-14;-2,1f;8,-b|422,-3b;-20,11;-49,61;16,-3;3f,-33;-4,-8;1b,-18;-3,-1c|49b,12;b,-9;-c,-1;-11,-30;-3b,b;-b,18;6,19;21,b;25,26;19,-f;-13,-16;6,-e|4f0,54;-a,-1c;-12,16;-11,-6;24,12;-1,8;a,-e|32c,3e;-d,6;2,1e;11,-17;-6,-d|4d8,67;-a,-d;-6,7;11,f;-1,-9|4e7,7a;-7,-15;-5,19;c,-4|4bd,b9;9,0;3,-e;-8,-1c;17,-5;1,-d;-23,e;-5,b;c,23|-2d6,c7;2b,-d;-1f,-a;-1f,7;16,4;-b,9;8,3|44f,bb;-10,-2;-1,9;16,7;-5,-e|-31d,e4;37,-19;-24,-4;7,5;-10,c;-1f,a;-20,-7;1b,d;1a,-4|4bc,e4;-5,-8;-6,10;e,11;-3,-19|542,155;-16,-b;5,b;11,0|9b,17e;-4,-10;-1b,a;1f,6|5c,19c;5,-14;-9,-3;-6,15;a,2|582,173;-7,-14;-2d,-10;-7,b;-29,-7;a,-8;-7,-10;-b,-1;-8,13;20,15;1f,1;a,12;7,-5;14,e;5,18;f,8;5,-16;-9,-15|59f,1ba;e,2;2,-b;-37,-11;14,28;13,-e|-4d3,1e5;-31,17;1a,-5;17,-12|-231,1fb;-7,-9;21,-6;4,-19;-b,b;-c,-9;-27,7;13,1f;14,9;-7,-9|59c,1fb;b,-11;-f,3;-6,-e;9,-12;-8,6;-6,-7;1,52;e,-23|-44,20b;-20,-5;8,b;-5,a;1e,d;a,-6;-b,-17|-5fa,23b;-11,4;1a,1;-9,-5|-1e,24a;-b,-a;15,1;-b,-11;30,-21;-3,-e;-42,-d;12,e;-13,6;b,3;-4,c;11,5;-15,12;-6,-5;-6,f;c,12;14,0|-354,291;33,-14;-47,-2;14,16|-91,299;9,-e;-33,-10;-29,5;a,4;-16,5;12,5;-15,2;62,9|-2f7,29f;-d,5;15,4;-8,-9|-708,2b2;39,-1b;-3,8;1b,-2;14,-9;-1a,-6;-5,-b;-45,10;-1,-9;e10,0;-1a,-4;12,-17;-37,-6;-22,-12;-e,7;-36,-7;-f,-11;c,-6;-b,-1b;-35,-27;-e,2c;5,e;4e,2b;8,f;-2c,-15;-8,d;-1a,-4;-19,-10;8,-7;-80,-1;-47,-2b;30,-5;f,-14;-20,-3b;-21,-1d;-1a,-1;-30,-23;14,-1e;-4,-11;-1a,-7;-4,17;8,2;-16,c;6,f;-2a,-7;b,f;-6,5;-24,-11;-5,-5;e,-d;23,1;-20,-1a;1b,-20;-2,-23;-3a,-36;-33,-e;-4,-b;-13,e;-1a,-13;22,-40;-1,-11;-28,-1f;-1,d;-32,23;-9,-2a;26,-25;c,-2a;-1c,f;-d,25;-12,d;5,24;-10,37;-1e,-9;1,16;-1d,2e;-2c,-d;-5,-d;-3e,-2b;-4,-37;-18,-18;-28,50;-9,36;-15,-5;-29,2d;-5a,3;-9,e;-12,-6;-20,e;-e,16;-15,-1;1c,-34;8,a;2,-12;16,1;18,17;4,-16;1e,-13;-15,-22;-18,-11;-76,-2e;-8,2a;-51,71;3,e;-a,-13;-f,17;2d,-4f;6,-22;3a,-3e;-6,-7;13,-d;41,10;-1,-e;-21,-40;-4a,-44;-b,-15;-4,-12;14,-52;-d,-14;-2f,-1f;7,-2b;-1d,-10;-4,-1f;-28,-28;-56,-14;-e,9;0,16;-1e,2e;-9,32;-19,28;13,4a;-12,39;-1f,27;6,30;-9,b;-1a,-5;-10,14;-3f,-10;-46,1;-4c,4a;-a,19;f,22;-9,26;1a,2c;30,24;3,1b;22,20;25,-6;25,e;50,8;10,-5;-8,-1f;58,-23;18,19;4a,-13;31,1;18,39;-56,0;-e,1c;49,19;30,-b;22,b;-32,20;18,15;-29,-a;d,-c;-18,-7;-e,9;8,8;-1a,5;-1e,-28;b,-f;-3e,-8;e,-1a;-9,2;-6,-f;-1f,27;1,e;-40,28;-8,-3;3,-d;3b,-27;-10,2;-8,-18;-7,14;-41,2c;-18,-d;-22,0;-1,-c;-16,-9;-7,-17;-16,-14;-21,-8;-b,a;-18,0;-5,3d;50,a;2,14;-22,1b;1e,-1;-3,c;20,3;22,1e;22,4;4,24;15,6;3,-c;-d,-a;d,-f;58,4;10,8;3,16;19,-4;3,e;-b,8;3a,8;-3e,-2;-10,9;2,19;27,13;-20,6;-2c,-1e;-7,-e;11,-c;-14,-e;-9,-1a;-1e,-7;-19,29;-14,-c;-1b,3;-7,22;9,6;85,48;35,c;25,2;1f,-7;-d,-3;b,-6;64,-15;-1b,-f;-34,6;10,-7;1,-f;15,-5;2,c;18,-6;8,3;-6,7;17,a;13,-4;5,7;-a,12;1c,-4;5,-5;-c,-7;7,-3;4a,16;8,-1;-a,-6;40,1;c,6;-5,a;4f,-12;7,5;-17,9;-2,f;19,12;22,0;-8,-e;13,-1e;-18,-15;b,-1;1b,10;-2,c;-d,6;8,a;-d,8;12,7;-2,7;11,-10;-5,7;11,4;27,-6;-a,13;3f,3;-8,6;c,6;88,d;24,d;1c,-c;45,-7;-2f,-10;8a,-c;1,7;25,-1;2b,-1c;a,a;4c,-3;-8,9;e,4;5a,-6;23,-e;3c,1;13,-f;45,2;12,-9;c,3;-3,b;51,-7;-e02,-4|1eb,19d;d,-a;-f,-f;3,-c;2e,-6;1,14;-c,a;2,9;12,1;-a,b;-9,-a;-3,11;-16,12;1b,7;0,10;-27,-5;-18,-12;18,-21|-3bc,2b3;-2a,3;10,7;1a,-a|-389,2b7;0,-a;d,8;13,-15;12,1b;1d,-2;d,-5;-7,-b;7,-5;-14,-c;-19,2;-f,-12;-3b,-1c;-f,-1f;f,-1;9,-11;64,-14;2,-12;16,-15;d,e;-c,15;21,12;-14,17;c,b;-8,18;2b,1;2a,-d;3,-15;10,-8;1f,15;20,-21;-4,-7;2d,-11;10,-19;-2b,-13;-40,0;-2f,-22;3c,18;9,-5;-9,-6;6,-13;1e,-3;a,b;7,-b;-38,-18;-8,a;12,8;-1b,-2;-24,-15;7,-e;-25,-7;12,0;-15,-1;-9,-13;-6,6;4,-b;-8,-c;-5,13;-6,-9;d,-1a;-38,-2a;9,-3e;-d,7;-18,2a;-33,2;-a,-c;-24,6;-1c,-e;-d,-3b;10,-1f;13,-c;18,6;c,6;5,11;20,5;-12,-38;37,-6;-4,-2a;18,-17;12,8;1c,-a;13,19;1f,d;1,-21;3,13;f,c;11,-10;3f,1;-5,-8;35,-27;1f,-2;1b,-10;d,-19;-4,-12;12,-1;0,-a;8,6;1d,-a;3,-b;2e,-2;2c,-16;9,-16;-28,-3a;-16,-58;-43,-1e;-d,-26;-31,-39;-18,-5;-16,a;10,-1e;-18,-12;-1f,-1;-4,-16;-18,-1;10,-f;-11,-9;-4,-f;-11,-6;-3,-7;14,-9;-4,-9;-1f,-1a;9,-11;-1a,-5;-2,-9;-27,f;-7,24;f,12;-f,3;c,19;c,-4;5,15;-10,-8;7,3c;16,30;c,7e;-d,18;-2d,1c;-26,4a;-f,b;-1,e;10,14;-c,5;1,b;26,31;-b,2d;-e,6;-d,-11;-30,1b;-12,22;-a0,32;-14,10;-5,1d;-3e,3e;-9,16;-11,6;1,-10;35,-46;-1c,f;-1,d;-1c,11;9,9;-1f,2c;-21,10;-26,39;5,34;-8,1b;15,-b;-2,13;-2e,12;-4,f;-3f,3a;-82,1c;-2e,-11;b,15;-4e,-35;-40,-10;47,20;7,d;-32,-2;1,9;-2a,13;f,10;26,7;-7,6;7,4;-2a,-4;-1f,d;24,9;1c,-5;-33,17;66,1e;c9,-19;54,10;c0,-1f;b,5;-a,4;6,4;15,1;2e,-c;26,a;10,-4;0,-9;13,12;-17,a;d,12;25,-11;-9,-5;13,-2|-476,2db;-5,-4;30,3;11,-d;-2,e;13,0;14,-15;23,-a;-11,-5;3,-7;-6d,-3;-28,f;31,4;-37,1;12,8;-21,3;f,b;25,4|-362,2dc;8,-7;23,d;f,-11;1e,7;38,-c;34,-18;-12,-5;45,-12;-14,-13;-29,d;21,-1d;-3,-7;-26,a;1a,-12;-56,1c;-1d,-5;-9,4;7,7;27,2;b,16;-3d,19;-3b,-2;-32,c;5,13;24,7;-8,-6|-3ec,2e2;1e,0;-7,-8;10,-4;-2,-9;-1a,-3;-20,b;15,2;-b,7;b,4|-3a4,2d8;-16,-7;-6,d;37,5;-1b,-b|-4b5,2ca;-1a,-5;-1c,a;14,12;-a,6;5e,-8;-32,-15|-3a8,2ee;-20,-1;13,7;d,-6|5ab,2f4;-3d,-a;-14,7;12,8;3f,-5|-3d9,2ff;8,-4;-5,-d;-2b,6;-1,7;29,4|-43a,2fa;19,-7;-41,-b;-11,3;15,5;-3b,0;17,d;3f,-a;-e,9;17,-2|23f,2c3;-26,1;-16,c;29,1f;85,e;-68,-16;-1f,-13;15,-11|-3b3,303;37,-f;51,1;d,-8;-64,-4;-49,17;18,3|-48a,308;-9,-b;-3a,-4;43,f|f7,30b;-28,-2;16,8;12,-6|-3e9,30f;-33,1;a,3;-d,6;36,-a|41b,30f;-39,-4;1b,e;1e,-a|b7,31d;20,-7;-38,-16;-37,1d;4f,0|fe,324;14,-3;-2c,-7;-38,9;50,1|3e7,315;-31,1;-26,d;2f,a;2b,-f;-3,-9|-366,31d;c,-4;-32,-b;-3b,14;2b,b;36,-10|-2ad,33f;42,-5;-5d,-1c;-39,-5;f,-8;-34,-17;-59,3;11,7;-5,7;21,-4;-1e,9;1d,9;-12,a;33,2;-3a,0;-28,e;e7,c|-10f,343;3f,-8;-6f,-5;c5,-9;-4e,-b;17,-1;-14,-d;c,-12;-20,-4;13,-5;2,-9;-b,0;d,-9;-2a,-a;d,-b;-19,1;1e,-10;-25,7;3,-6;-c,-6;29,-1;-af,-2e;-1e,-1c;-6,-1a;-31,8;-21,1b;-18,24;1f,1b;-26,-3;3,c;1e,-2;-2c,b;b,9;-27,1d;-63,6;-1d,9;2e,4;-41,6;4c,e;-17,7;36,11;7a,6;3b,-7;-17,9;c5,9";
  var PINS = [["Saigon",10.8,106.6],["Đà Nẵng",16.1,108.2],["Huế",16.5,107.6],["Quảng Bình",17.5,106.6],["Quảng Ngãi",15.1,108.8],["Phan Thiết",10.9,108.1],["Mỹ Tho",10.4,106.4],["Cần Thơ",10.0,105.8],["Tokyo",35.7,139.7],["Kyoto",35.0,135.8],["Nara",34.7,135.8],["Hiroshima",34.4,132.5],["Taipei",25.0,121.6],["New Taipei City",25.0,121.5],["Jiufen",25.1,121.8],["Shifen",25.0,121.8],["Beitou",25.1,121.5],["Yangmingshan",25.2,121.6],["Icheon, South Korea",37.3,127.4],["Singapore",1.4,103.8],["Cancún",21.2,-86.9],["Cozumel",20.4,-86.9],["Nassau, Bahamas",25.1,-77.3],["Cayman Islands",19.3,-81.4],["Jamaica",18.0,-76.8],["Puerto Rico",18.5,-66.1],["Costa Rica",9.9,-84.1],["Toronto",43.7,-79.4],["Montréal",45.5,-73.6],["Quebec",46.8,-71.2],["California",34.1,-118.2],["Colorado",39.7,-105.0],["Florida",28.5,-81.4],["Georgia",33.7,-84.4],["Massachusetts",42.4,-71.1],["Minnesota",45.0,-93.3],["Montana",45.7,-111.0],["Nevada",36.2,-115.1],["New Orleans",30.0,-90.1],["New York",40.7,-74.0],["North Carolina",35.8,-78.6],["Oregon",45.5,-122.7],["Pennsylvania",40.0,-75.2],["Rhode Island",41.8,-71.4],["South Carolina",32.8,-79.9],["Tennessee",36.2,-86.8],["Ohio",40.0,-83.0],["West Virginia",38.3,-81.6],["Kentucky",38.3,-85.8],["Texas",32.8,-96.8],["Virginia",37.5,-77.4],["Washington",47.6,-122.3],["Yellowstone",44.6,-110.5]];

  /* ---- decode the land outline ---------------------------------- */
  function decodeLand(s) {
    return s.split("|").map(function (r) {
      var px = 0, py = 0;
      return r.split(";").map(function (pair) {
        var c = pair.split(",");
        px += parseInt(c[0], 16);
        py += parseInt(c[1], 16);
        return [px / 10, py / 10];
      });
    });
  }
  var rings = decodeLand(LAND);

  var ctx    = host.getContext("2d");
  var tip    = document.getElementById("globe-tip");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HOME = { rot: -95, tilt: 20, zoom: 1 };
  var rot     = HOME.rot;    // longitude at the centre
  var tiltDeg = HOME.tilt;   // + looks down over the north pole, - from below
  var zoom    = HOME.zoom;
  var sinT = 0, cosT = 1;
  var MINZ = 0.9, MAXZ = 4.5;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  var W = 0, H = 0, R = 0, baseR = 0, cx = 0, cy = 0, dpr = 1;
  var spinning = !reduce, dragging = false, lastX = 0, hoverIdx = -1, visible = true;

  /* hex -> rgba so we can tint without touching globalAlpha */
  function hexA(h, a) {
    h = h.replace("#", "");
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n = parseInt(h, 16);
    return "rgba(" + ((n>>16)&255) + "," + ((n>>8)&255) + "," + (n&255) + "," + a + ")";
  }

  function theme() {
    var s = getComputedStyle(document.documentElement);
    var light = document.documentElement.getAttribute("data-theme") === "light";
    return {
      light: light,
      ink:    s.getPropertyValue("--ink").trim()    || "#EDF1F6",
      accent: s.getPropertyValue("--accent").trim() || "#45CFC2",
      warm:   s.getPropertyValue("--warm").trim()   || "#F0876C",
      rule:   s.getPropertyValue("--rule").trim()   || "#2B3442",
      card:   s.getPropertyValue("--card").trim()   || "#171D27",
      page:   s.getPropertyValue("--page").trim()   || "#10141C"
    };
  }

  function resize() {
    var box = host.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(box.width));
    H = Math.max(1, Math.round(box.height));
    host.width  = W * dpr;
    host.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    baseR = Math.min(W, H) / 2 - 6;
    cx = W / 2;
    cy = H / 2;
  }

  /* ---- lon/lat -> screen ---------------------------------------- */
  function project(lat, lon) {
    var p = (lon + rot) * Math.PI / 180, t = lat * Math.PI / 180;
    var ct = Math.cos(t);
    var x = ct * Math.sin(p), y = Math.sin(t), z = ct * Math.cos(p);
    var y2 =  y * cosT - z * sinT;
    var z2 =  y * sinT + z * cosT;
    return { x: cx + x * R, y: cy - y2 * R, z: z2, ux: x, uy: y2 };
  }

  /* Points on the far side are pushed out to the limb. Where two of
     those land next to each other we follow the limb as an ARC rather
     than a straight chord - otherwise a ring that wraps the globe
     (Antarctica) gets a wedge cut clean across it. */
  function limbPt(pt) {
    if (pt.z > 0) return { x: pt.x, y: pt.y, limb: false, ang: 0 };
    var m = Math.hypot(pt.ux, pt.uy) || 1;
    var ux = pt.ux / m, uy = pt.uy / m;
    return { x: cx + ux * R, y: cy - uy * R, limb: true, ang: Math.atan2(-uy, ux) };
  }

  function limbArc(a0, a1) {
    var d = a1 - a0;
    while (d >  Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    ctx.arc(cx, cy, R, a0, a0 + d, d < 0);
  }

  function draw() {
    var c = theme();
    R = baseR * zoom;
    var tr = tiltDeg * Math.PI / 180;
    sinT = Math.sin(tr); cosT = Math.cos(tr);
    ctx.clearRect(0, 0, W, H);

    // ocean
    var g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    if (c.light) {
      g.addColorStop(0, hexA(c.accent, .10));
      g.addColorStop(1, hexA(c.accent, .30));
    } else {
      g.addColorStop(0, c.rule);
      g.addColorStop(1, c.page);
    }
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = c.accent; ctx.globalAlpha = .35;
    ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;

    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.clip();

    // graticule
    ctx.strokeStyle = c.accent; ctx.globalAlpha = c.light ? .20 : .13; ctx.lineWidth = 1;
    var i, j, lat, lon, pt, sp, started;
    for (lon = -180; lon < 180; lon += 30) {
      ctx.beginPath(); started = false;
      for (lat = -90; lat <= 90; lat += 4) {
        pt = project(lat, lon);
        if (pt.z <= 0) { started = false; continue; }
        if (!started) { ctx.moveTo(pt.x, pt.y); started = true; } else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    for (lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath(); started = false;
      for (lon = -180; lon <= 180; lon += 4) {
        pt = project(lat, lon);
        if (pt.z <= 0) { started = false; continue; }
        if (!started) { ctx.moveTo(pt.x, pt.y); started = true; } else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // land
    for (i = 0; i < rings.length; i++) {
      var ring = rings[i], any = false, pl = [];
      for (j = 0; j < ring.length; j++) {
        pt = project(ring[j][1], ring[j][0]);
        if (pt.z > 0) any = true;
        pl.push(limbPt(pt));
      }
      if (!any) continue;                       // entirely on the far side
      ctx.beginPath();
      ctx.moveTo(pl[0].x, pl[0].y);
      for (j = 1; j <= pl.length; j++) {
        var q0 = pl[j - 1], q1 = pl[j % pl.length];
        if (q0.limb && q1.limb) limbArc(q0.ang, q1.ang);
        else ctx.lineTo(q1.x, q1.y);
      }
      ctx.closePath();
      ctx.fillStyle = c.light ? hexA(c.accent, .40) : hexA(c.accent, .22);
      ctx.globalAlpha = 1; ctx.fill();
      ctx.globalAlpha = c.light ? .85 : .55;
      ctx.strokeStyle = c.accent; ctx.lineWidth = 1; ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // pins
    for (i = 0; i < PINS.length; i++) {
      pt = project(PINS[i][1], PINS[i][2]);
      if (pt.z <= 0) continue;
      var near = .55 + .45 * pt.z;
      var on   = (i === hoverIdx);
      var zs  = Math.min(1 + (zoom - 1) * 0.3, 1.8);
      var rad = (on ? 5 : 3.2) * near * zs;
      ctx.globalAlpha = .5 + .5 * pt.z;
      // halo first, so the marker stays legible over land
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, rad + 1.6, 0, 6.2832);
      ctx.fillStyle = c.light ? "#FFFFFF" : c.page;
      ctx.fill();
      // marker
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, rad, 0, 6.2832);
      ctx.fillStyle = on ? c.warm : c.accent;
      ctx.shadowColor = on ? c.warm : c.accent;
      ctx.shadowBlur = (on ? 14 : 7) * near;
      ctx.fill();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    // tooltip follows its pin
    if (hoverIdx >= 0 && tip) {
      pt = project(PINS[hoverIdx][1], PINS[hoverIdx][2]);
      if (pt.z > 0) {
        tip.textContent = PINS[hoverIdx][0];
        tip.style.left = pt.x + "px";
        tip.style.top  = (pt.y - 12) + "px";
        tip.classList.add("on");
      } else { tip.classList.remove("on"); hoverIdx = -1; }
    } else if (tip) tip.classList.remove("on");
  }

  function frame() {
    if (visible && spinning && !dragging) rot += 0.13;
    draw();
    requestAnimationFrame(frame);
  }

  /* ---- interaction ---------------------------------------------- */
  function pick(mx, my) {
    var best = -1, bd = 15;
    for (var i = 0; i < PINS.length; i++) {
      var pt = project(PINS[i][1], PINS[i][2]);
      if (pt.z <= 0) continue;
      var d = Math.hypot(pt.x - mx, pt.y - my);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  /* active pointers, so two fingers can pinch */
  var pts = {}, pinchDist = 0, pinchZoom = 1;

  function pointerCount() { var n = 0; for (var k in pts) n++; return n; }
  function twoPointers() {
    var a = null, b = null;
    for (var k in pts) { if (!a) a = pts[k]; else if (!b) b = pts[k]; }
    return [a, b];
  }

  host.addEventListener("pointerdown", function (e) {
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    host.setPointerCapture(e.pointerId);
    if (pointerCount() === 2) {
      var pr = twoPointers();
      pinchDist = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y);
      pinchZoom = zoom;
    }
    dragging = true;
    hoverIdx = -1;
  });

  host.addEventListener("pointermove", function (e) {
    var b = host.getBoundingClientRect();

    if (pts[e.pointerId]) {
      var prev = pts[e.pointerId];
      var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };

      if (pointerCount() >= 2) {
        // pinch: distance ratio drives zoom, no rotation
        var pr = twoPointers();
        var d = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y);
        if (pinchDist > 0) zoom = clamp(pinchZoom * (d / pinchDist), MINZ, MAXZ);
      } else {
        rot     += dx * 0.4 / Math.max(zoom, 1);            // horizontal spins
        tiltDeg  = clamp(tiltDeg + dy * 0.35, -85, 85);     // vertical tips over the poles
      }
      return;
    }

    hoverIdx = pick(e.clientX - b.left, e.clientY - b.top);
    host.style.cursor = hoverIdx >= 0 ? "pointer" : "grab";
  });

  function release(e) {
    delete pts[e.pointerId];
    try { host.releasePointerCapture(e.pointerId); } catch (err) {}
    if (pointerCount() === 0) dragging = false;
    if (pointerCount() < 2) pinchDist = 0;
  }
  host.addEventListener("pointerup", release);
  host.addEventListener("pointercancel", release);

  host.addEventListener("pointerleave", function () {
    hoverIdx = -1; spinning = !reduce;
  });
  host.addEventListener("pointerenter", function () { spinning = false; });

  /* wheel zooms. At the limits we let the event through so the page
     still scrolls instead of trapping the reader on the globe. */
  host.addEventListener("wheel", function (e) {
    var next = clamp(zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12), MINZ, MAXZ);
    if (next === zoom) return;
    zoom = next;
    e.preventDefault();
  }, { passive: false });

  /* keyboard: arrows spin and tip, +/- zoom, 0 resets */
  host.addEventListener("keydown", function (e) {
    var k = e.key, used = true;
    if      (k === "ArrowLeft")  rot -= 6;
    else if (k === "ArrowRight") rot += 6;
    else if (k === "ArrowUp")    tiltDeg = clamp(tiltDeg + 5, -85, 85);
    else if (k === "ArrowDown")  tiltDeg = clamp(tiltDeg - 5, -85, 85);
    else if (k === "+" || k === "=") zoom = clamp(zoom * 1.15, MINZ, MAXZ);
    else if (k === "-" || k === "_") zoom = clamp(zoom / 1.15, MINZ, MAXZ);
    else if (k === "0") { rot = HOME.rot; tiltDeg = HOME.tilt; zoom = HOME.zoom; }
    else used = false;
    if (used) e.preventDefault();
  });

  /* on-screen controls */
  var ctl = document.getElementById("globe-ctl");
  if (ctl) ctl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("button") : null;
    if (!btn) return;
    var a = btn.getAttribute("data-g");
    if (a === "in")    zoom = clamp(zoom * 1.3, MINZ, MAXZ);
    if (a === "out")   zoom = clamp(zoom / 1.3, MINZ, MAXZ);
    if (a === "reset") { rot = HOME.rot; tiltDeg = HOME.tilt; zoom = HOME.zoom; }
    host.focus();
  });

  /* stop burning frames when off-screen or in a hidden tab */
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
    }, { threshold: 0 }).observe(host);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) visible = false;
  });

  window.addEventListener("resize", function () { resize(); });
  resize();
  requestAnimationFrame(frame);
})();