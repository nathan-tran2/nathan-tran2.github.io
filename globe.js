/* ===============================================================
   Travel globe - about page only.
   A dot-matrix Earth on a canvas, in the same point style as the
   opening screen. Flight arcs run from Raleigh to every place on
   the list; picking a place (on the globe or in the list below)
   flies the globe there. No libraries.
   Land outline: Natural Earth 110m, simplified and delta-encoded.
   =============================================================== */
(function () {
  var host = document.getElementById("globe");
  if (!host || !host.getContext) return;

  var LAND = "-254,-320;-6,-a;-3d,7;43,3|-638,-31b;-2d,9;19,2;14,-b|-1c4,-30c;13,-14;-6d,-6;37,1a;23,0|-3de,-2cf;1c,-6;-3d,6;21,0|-2ad,-2c6;-3,-c;-17,-3;-27,8;1d,5;4,11;e,6;12,-15|-708,-34f;64,8;77,-f;96,4;-69,d;7,11;-27,9;3e,-2;2a,a;-59,c;-1c,b;-3,b;47,-5;34,9;-1,b;d,2;136,f;3f,-f;4b,3;-18,8;-c,f;4a,-a;47,a;82,-e;49,a;12,a;-e,17;c,1c;5f,24;-2a,-f;-1,-e;-24,-12;27,-1b;a,-1e;-62,-1d;-42,-1;23,-c;-2a,-5;-1,-8;c6,-28;54,f;46,-4;8e,12;-b,a;-3b,-2;-2,c;b7,20;12,6;-8,6;b,8;55,16;43,-7;4f,11;1f,-9;1a,8;89,-5;44,14;2f,-d;9f,28;45,-16;4b,1;8,-d;-13,-b;d,-4;-c,-c;14,-4;28,18;8d,25;11,-9;3d,-3;27,2;1f,10;22,-d;4a,a;3e,-e;96,b;3,9;18,-11;50,1;21,-f;e0,-21;-13,-14;-20,-7;-19,-12;b,-14;17,-6;-34,-4;-14,-11;60,-1d;59,-7;-dff,-2|-2a6,-21a;1b,-9;-29,-8;-37,1b;24,-d;12,10;f,-d|-249,-1ff;5,-8;-20,1;1b,7|5ae,-198;1d,-1;-4,-17;-13,-3;-d,17;7,4|6c2,-199;c,-4;-b,-1a;-10,-3;-16,-18;-1a,4;3f,35|6d2,-16a;16,-11;11,2;-21,-28;-3,12;-b,4;9,15;-15,1d;14,-11|1f5,-88;3,-15;-7,0;-1a,-5c;-1f,-1;-7,1d;b,14;0,27;21,10;f,1a;9,-10|59c,-8a;12,-c;a,-28;18,-e;2b,-39;0,-30;-1f,-41;-25,-10;-d,b;-e,-9;-1e,8;-19,18;1,c;-e,-9;a,18;-12,-14;-11,17;-1e,b;-85,-24;-1e,9;7,1a;-18,37;9,-2;-8,13;7,1a;1,-7;19,12;2a,a;30,37;e,4;19,-c;a,19;14,4;-2,a;29,-8;-a,-1f;2f,-1b;17,46;b,-1f|4dc,-65;-9,-1;10,f;16,3;-1d,-11|43e,-44;16,3;31,-13;-67,f;7,a;19,-9|5f0,-37;-12,-8;-13,6;19,2;7,d;8,-1;-3,-c|53d,-c;e,-16;1c,11;3f,-16;1e,-16;-4,-d;23,-20;-1c,5;-20,19;-15,-11;-32,9;b,b;-8,13;-2a,13;-7,-6;-a,d;11,6;-20,d;13,5;11,-8|4e4,e;-f,-c;-23,0;7,-10;18,8;-12,-d;11,-22;-11,7;-5,14;-6,-1d;-a,1;-6,1a;c,22;34,8|507,b;-6,-14;-2,1f;8,-b|422,-3b;-20,11;-49,61;16,-3;3f,-33;-4,-8;1b,-18;-3,-1c|49b,12;b,-9;-c,-1;-11,-30;-3b,b;-b,18;6,19;21,b;25,26;19,-f;-13,-16;6,-e|4f0,54;-a,-1c;-12,16;-11,-6;24,12;-1,8;a,-e|32c,3e;-d,6;2,1e;11,-17;-6,-d|4d8,67;-a,-d;-6,7;11,f;-1,-9|4e7,7a;-7,-15;-5,19;c,-4|4bd,b9;9,0;3,-e;-8,-1c;17,-5;1,-d;-23,e;-5,b;c,23|-2d6,c7;2b,-d;-1f,-a;-1f,7;16,4;-b,9;8,3|44f,bb;-10,-2;-1,9;16,7;-5,-e|-31d,e4;37,-19;-24,-4;7,5;-10,c;-1f,a;-20,-7;1b,d;1a,-4|4bc,e4;-5,-8;-6,10;e,11;-3,-19|542,155;-16,-b;5,b;11,0|9b,17e;-4,-10;-1b,a;1f,6|5c,19c;5,-14;-9,-3;-6,15;a,2|582,173;-7,-14;-2d,-10;-7,b;-29,-7;a,-8;-7,-10;-b,-1;-8,13;20,15;1f,1;a,12;7,-5;14,e;5,18;f,8;5,-16;-9,-15|59f,1ba;e,2;2,-b;-37,-11;14,28;13,-e|-4d3,1e5;-31,17;1a,-5;17,-12|-231,1fb;-7,-9;21,-6;4,-19;-b,b;-c,-9;-27,7;13,1f;14,9;-7,-9|59c,1fb;b,-11;-f,3;-6,-e;9,-12;-8,6;-6,-7;1,52;e,-23|-44,20b;-20,-5;8,b;-5,a;1e,d;a,-6;-b,-17|-5fa,23b;-11,4;1a,1;-9,-5|-1e,24a;-b,-a;15,1;-b,-11;30,-21;-3,-e;-42,-d;12,e;-13,6;b,3;-4,c;11,5;-15,12;-6,-5;-6,f;c,12;14,0|-354,291;33,-14;-47,-2;14,16|-91,299;9,-e;-33,-10;-29,5;a,4;-16,5;12,5;-15,2;62,9|-2f7,29f;-d,5;15,4;-8,-9|-708,2b2;39,-1b;-3,8;1b,-2;14,-9;-1a,-6;-5,-b;-45,10;-1,-9;e10,0;-1a,-4;12,-17;-37,-6;-22,-12;-e,7;-36,-7;-f,-11;c,-6;-b,-1b;-35,-27;-e,2c;5,e;4e,2b;8,f;-2c,-15;-8,d;-1a,-4;-19,-10;8,-7;-80,-1;-47,-2b;30,-5;f,-14;-20,-3b;-21,-1d;-1a,-1;-30,-23;14,-1e;-4,-11;-1a,-7;-4,17;8,2;-16,c;6,f;-2a,-7;b,f;-6,5;-24,-11;-5,-5;e,-d;23,1;-20,-1a;1b,-20;-2,-23;-3a,-36;-33,-e;-4,-b;-13,e;-1a,-13;22,-40;-1,-11;-28,-1f;-1,d;-32,23;-9,-2a;26,-25;c,-2a;-1c,f;-d,25;-12,d;5,24;-10,37;-1e,-9;1,16;-1d,2e;-2c,-d;-5,-d;-3e,-2b;-4,-37;-18,-18;-28,50;-9,36;-15,-5;-29,2d;-5a,3;-9,e;-12,-6;-20,e;-e,16;-15,-1;1c,-34;8,a;2,-12;16,1;18,17;4,-16;1e,-13;-15,-22;-18,-11;-76,-2e;-8,2a;-51,71;3,e;-a,-13;-f,17;2d,-4f;6,-22;3a,-3e;-6,-7;13,-d;41,10;-1,-e;-21,-40;-4a,-44;-b,-15;-4,-12;14,-52;-d,-14;-2f,-1f;7,-2b;-1d,-10;-4,-1f;-28,-28;-56,-14;-e,9;0,16;-1e,2e;-9,32;-19,28;13,4a;-12,39;-1f,27;6,30;-9,b;-1a,-5;-10,14;-3f,-10;-46,1;-4c,4a;-a,19;f,22;-9,26;1a,2c;30,24;3,1b;22,20;25,-6;25,e;50,8;10,-5;-8,-1f;58,-23;18,19;4a,-13;31,1;18,39;-56,0;-e,1c;49,19;30,-b;22,b;-32,20;18,15;-29,-a;d,-c;-18,-7;-e,9;8,8;-1a,5;-1e,-28;b,-f;-3e,-8;e,-1a;-9,2;-6,-f;-1f,27;1,e;-40,28;-8,-3;3,-d;3b,-27;-10,2;-8,-18;-7,14;-41,2c;-18,-d;-22,0;-1,-c;-16,-9;-7,-17;-16,-14;-21,-8;-b,a;-18,0;-5,3d;50,a;2,14;-22,1b;1e,-1;-3,c;20,3;22,1e;22,4;4,24;15,6;3,-c;-d,-a;d,-f;58,4;10,8;3,16;19,-4;3,e;-b,8;3a,8;-3e,-2;-10,9;2,19;27,13;-20,6;-2c,-1e;-7,-e;11,-c;-14,-e;-9,-1a;-1e,-7;-19,29;-14,-c;-1b,3;-7,22;9,6;85,48;35,c;25,2;1f,-7;-d,-3;b,-6;64,-15;-1b,-f;-34,6;10,-7;1,-f;15,-5;2,c;18,-6;8,3;-6,7;17,a;13,-4;5,7;-a,12;1c,-4;5,-5;-c,-7;7,-3;4a,16;8,-1;-a,-6;40,1;c,6;-5,a;4f,-12;7,5;-17,9;-2,f;19,12;22,0;-8,-e;13,-1e;-18,-15;b,-1;1b,10;-2,c;-d,6;8,a;-d,8;12,7;-2,7;11,-10;-5,7;11,4;27,-6;-a,13;3f,3;-8,6;c,6;88,d;24,d;1c,-c;45,-7;-2f,-10;8a,-c;1,7;25,-1;2b,-1c;a,a;4c,-3;-8,9;e,4;5a,-6;23,-e;3c,1;13,-f;45,2;12,-9;c,3;-3,b;51,-7;-e02,-4|1eb,19d;d,-a;-f,-f;3,-c;2e,-6;1,14;-c,a;2,9;12,1;-a,b;-9,-a;-3,11;-16,12;1b,7;0,10;-27,-5;-18,-12;18,-21|-3bc,2b3;-2a,3;10,7;1a,-a|-389,2b7;0,-a;d,8;13,-15;12,1b;1d,-2;d,-5;-7,-b;7,-5;-14,-c;-19,2;-f,-12;-3b,-1c;-f,-1f;f,-1;9,-11;64,-14;2,-12;16,-15;d,e;-c,15;21,12;-14,17;c,b;-8,18;2b,1;2a,-d;3,-15;10,-8;1f,15;20,-21;-4,-7;2d,-11;10,-19;-2b,-13;-40,0;-2f,-22;3c,18;9,-5;-9,-6;6,-13;1e,-3;a,b;7,-b;-38,-18;-8,a;12,8;-1b,-2;-24,-15;7,-e;-25,-7;12,0;-15,-1;-9,-13;-6,6;4,-b;-8,-c;-5,13;-6,-9;d,-1a;-38,-2a;9,-3e;-d,7;-18,2a;-33,2;-a,-c;-24,6;-1c,-e;-d,-3b;10,-1f;13,-c;18,6;c,6;5,11;20,5;-12,-38;37,-6;-4,-2a;18,-17;12,8;1c,-a;13,19;1f,d;1,-21;3,13;f,c;11,-10;3f,1;-5,-8;35,-27;1f,-2;1b,-10;d,-19;-4,-12;12,-1;0,-a;8,6;1d,-a;3,-b;2e,-2;2c,-16;9,-16;-28,-3a;-16,-58;-43,-1e;-d,-26;-31,-39;-18,-5;-16,a;10,-1e;-18,-12;-1f,-1;-4,-16;-18,-1;10,-f;-11,-9;-4,-f;-11,-6;-3,-7;14,-9;-4,-9;-1f,-1a;9,-11;-1a,-5;-2,-9;-27,f;-7,24;f,12;-f,3;c,19;c,-4;5,15;-10,-8;7,3c;16,30;c,7e;-d,18;-2d,1c;-26,4a;-f,b;-1,e;10,14;-c,5;1,b;26,31;-b,2d;-e,6;-d,-11;-30,1b;-12,22;-a0,32;-14,10;-5,1d;-3e,3e;-9,16;-11,6;1,-10;35,-46;-1c,f;-1,d;-1c,11;9,9;-1f,2c;-21,10;-26,39;5,34;-8,1b;15,-b;-2,13;-2e,12;-4,f;-3f,3a;-82,1c;-2e,-11;b,15;-4e,-35;-40,-10;47,20;7,d;-32,-2;1,9;-2a,13;f,10;26,7;-7,6;7,4;-2a,-4;-1f,d;24,9;1c,-5;-33,17;66,1e;c9,-19;54,10;c0,-1f;b,5;-a,4;6,4;15,1;2e,-c;26,a;10,-4;0,-9;13,12;-17,a;d,12;25,-11;-9,-5;13,-2|-476,2db;-5,-4;30,3;11,-d;-2,e;13,0;14,-15;23,-a;-11,-5;3,-7;-6d,-3;-28,f;31,4;-37,1;12,8;-21,3;f,b;25,4|-362,2dc;8,-7;23,d;f,-11;1e,7;38,-c;34,-18;-12,-5;45,-12;-14,-13;-29,d;21,-1d;-3,-7;-26,a;1a,-12;-56,1c;-1d,-5;-9,4;7,7;27,2;b,16;-3d,19;-3b,-2;-32,c;5,13;24,7;-8,-6|-3ec,2e2;1e,0;-7,-8;10,-4;-2,-9;-1a,-3;-20,b;15,2;-b,7;b,4|-3a4,2d8;-16,-7;-6,d;37,5;-1b,-b|-4b5,2ca;-1a,-5;-1c,a;14,12;-a,6;5e,-8;-32,-15|-3a8,2ee;-20,-1;13,7;d,-6|5ab,2f4;-3d,-a;-14,7;12,8;3f,-5|-3d9,2ff;8,-4;-5,-d;-2b,6;-1,7;29,4|-43a,2fa;19,-7;-41,-b;-11,3;15,5;-3b,0;17,d;3f,-a;-e,9;17,-2|23f,2c3;-26,1;-16,c;29,1f;85,e;-68,-16;-1f,-13;15,-11|-3b3,303;37,-f;51,1;d,-8;-64,-4;-49,17;18,3|-48a,308;-9,-b;-3a,-4;43,f|f7,30b;-28,-2;16,8;12,-6|-3e9,30f;-33,1;a,3;-d,6;36,-a|41b,30f;-39,-4;1b,e;1e,-a|b7,31d;20,-7;-38,-16;-37,1d;4f,0|fe,324;14,-3;-2c,-7;-38,9;50,1|3e7,315;-31,1;-26,d;2f,a;2b,-f;-3,-9|-366,31d;c,-4;-32,-b;-3b,14;2b,b;36,-10|-2ad,33f;42,-5;-5d,-1c;-39,-5;f,-8;-34,-17;-59,3;11,7;-5,7;21,-4;-1e,9;1d,9;-12,a;33,2;-3a,0;-28,e;e7,c|-10f,343;3f,-8;-6f,-5;c5,-9;-4e,-b;17,-1;-14,-d;c,-12;-20,-4;13,-5;2,-9;-b,0;d,-9;-2a,-a;d,-b;-19,1;1e,-10;-25,7;3,-6;-c,-6;29,-1;-af,-2e;-1e,-1c;-6,-1a;-31,8;-21,1b;-18,24;1f,1b;-26,-3;3,c;1e,-2;-2c,b;b,9;-27,1d;-63,6;-1d,9;2e,4;-41,6;4c,e;-17,7;36,11;7a,6;3b,-7;-17,9;c5,9";
  var PINS = [["Saigon",10.8,106.6],["Đà Nẵng",16.1,108.2],["Huế",16.5,107.6],["Quảng Bình",17.5,106.6],["Quảng Ngãi",15.1,108.8],["Phan Thiết",10.9,108.1],["Mỹ Tho",10.4,106.4],["Cần Thơ",10.0,105.8],["Tokyo",35.7,139.7],["Kyoto",35.0,135.8],["Nara",34.7,135.8],["Hiroshima",34.4,132.5],["Taipei",25.0,121.6],["New Taipei City",25.0,121.5],["Jiufen",25.1,121.8],["Shifen",25.0,121.8],["Beitou",25.1,121.5],["Yangmingshan",25.2,121.6],["Icheon, South Korea",37.3,127.4],["Singapore",1.4,103.8],["Cancún",21.2,-86.9],["Cozumel",20.4,-86.9],["Nassau, Bahamas",25.1,-77.3],["Cayman Islands",19.3,-81.4],["Jamaica",18.0,-76.8],["Puerto Rico",18.5,-66.1],["Costa Rica",9.9,-84.1],["Toronto",43.7,-79.4],["Montréal",45.5,-73.6],["Quebec",46.8,-71.2],["California",34.1,-118.2],["Colorado",39.7,-105.0],["Florida",28.5,-81.4],["Georgia",33.7,-84.4],["Massachusetts",42.4,-71.1],["Minnesota",45.0,-93.3],["Montana",45.7,-111.0],["Nevada",36.2,-115.1],["New Orleans",30.0,-90.1],["New York",40.7,-74.0],["North Carolina",35.8,-78.6],["Oregon",45.5,-122.7],["Pennsylvania",40.0,-75.2],["Rhode Island",41.8,-71.4],["South Carolina",32.8,-79.9],["Tennessee",36.2,-86.8],["Ohio",40.0,-83.0],["West Virginia",38.3,-81.6],["Kentucky",38.3,-85.8],["Texas",32.8,-96.8],["Virginia",37.5,-77.4],["Washington",47.6,-122.3],["Yellowstone",44.6,-110.5]];
  var HOME_LL = [35.78, -78.64];          // Raleigh, where the arcs start
  var D2R = Math.PI / 180;

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
  var boxes = rings.map(function (r) {
    var b = [999, 999, -999, -999];
    r.forEach(function (p) {
      if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1];
      if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1];
    });
    return b;
  });

  function onLand(lon, lat) {
    var inside = false;
    for (var k = 0; k < rings.length; k++) {
      var b = boxes[k];
      if (lon < b[0] || lon > b[2] || lat < b[1] || lat > b[3]) continue;
      var r = rings[k], hit = false;
      for (var i = 0, j = r.length - 1; i < r.length; j = i++) {
        var xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
        if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) hit = !hit;
      }
      if (hit) inside = !inside;
    }
    return inside;
  }

  /* ---- sample the land into evenly spaced points ----------------- */
  var dots = [];
  (function () {
    var STEP = 1.5;
    for (var lat = -84; lat <= 84; lat += STEP) {
      var n = Math.max(1, Math.round(360 * Math.cos(lat * D2R) / STEP));
      for (var k = 0; k < n; k++) {
        var lon = -180 + (k + 0.5) * 360 / n;
        if (onLand(lon, lat)) {
          var ct = Math.cos(lat * D2R);
          dots.push(ct * Math.sin(lon * D2R), Math.sin(lat * D2R), ct * Math.cos(lon * D2R));
        }
      }
    }
    dots = new Float32Array(dots);
  })();

  function vec(lat, lon) {
    var ct = Math.cos(lat * D2R);
    return [ct * Math.sin(lon * D2R), Math.sin(lat * D2R), ct * Math.cos(lon * D2R)];
  }

  /* ---- flight arcs: great circles lifted off the surface ---------- */
  var home = vec(HOME_LL[0], HOME_LL[1]);
  var arcs = PINS.map(function (p) {
    var b = vec(p[1], p[2]);
    var dot = home[0] * b[0] + home[1] * b[1] + home[2] * b[2];
    var ang = Math.acos(Math.max(-1, Math.min(1, dot)));
    if (ang < 4 * D2R) return null;                 // North Carolina itself
    var N = Math.max(12, Math.round(ang / D2R / 2.5));
    var lift = 0.06 + 0.3 * ang / Math.PI;
    var pts = [], s = Math.sin(ang);
    for (var i = 0; i <= N; i++) {
      var t = i / N, a = Math.sin((1 - t) * ang) / s, c = Math.sin(t * ang) / s;
      var h = 1 + lift * Math.sin(Math.PI * t);
      pts.push([(a * home[0] + c * b[0]) * h, (a * home[1] + c * b[1]) * h, (a * home[2] + c * b[2]) * h]);
    }
    return pts;
  });
  var arcIdx = arcs.map(function (a, i) { return a ? i : -1; }).filter(function (i) { return i >= 0; });

  var ctx    = host.getContext("2d");
  var tip    = document.getElementById("globe-tip");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HOME = { rot: 78, tilt: 22, zoom: 1 };       // opens over the Americas
  var rot = HOME.rot, tiltDeg = HOME.tilt, zoom = HOME.zoom;
  var sinR, cosR, sinT, cosT;
  var MINZ = 0.9, MAXZ = 4.5;
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  var W = 0, H = 0, R = 0, baseR = 0, cx = 0, cy = 0, dpr = 1;
  var dragging = false, hovering = false, visible = true;
  var hoverIdx = -1, selIdx = -1, vel = 0, lastMove = 0;
  var fly = null, comet = { i: 0, t0: 0 };

  function hexA(h, a) {
    h = (h || "#A77BFF").replace("#", "");
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    var n = parseInt(h, 16);
    return "rgba(" + ((n>>16)&255) + "," + ((n>>8)&255) + "," + (n&255) + "," + a + ")";
  }
  var C = null;
  function theme() {
    var s = getComputedStyle(document.documentElement);
    C = {
      light:  document.documentElement.getAttribute("data-theme") === "light",
      ink:    s.getPropertyValue("--ink").trim()    || "#F1EDF8",
      accent: s.getPropertyValue("--accent").trim() || "#A77BFF",
      fill:   s.getPropertyValue("--fill").trim()   || "#7C3AED",
      page:   s.getPropertyValue("--page").trim()   || "#0B0910",
      card:   s.getPropertyValue("--card").trim()   || "#120F19"
    };
  }
  theme();
  new MutationObserver(theme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function resize() {
    var box = host.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(box.width));
    H = Math.max(1, Math.round(box.height));
    host.width = W * dpr; host.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    baseR = Math.min(W, H) / 2 * 0.8;
    cx = W / 2; cy = H / 2;
  }

  /* globe space -> screen. Returns [x, y, depth, onDisc] */
  function proj(v) {
    var x = v[0] * cosR + v[2] * sinR;
    var z = v[2] * cosR - v[0] * sinR;
    var y2 = v[1] * cosT - z * sinT;
    var z2 = v[1] * sinT + z * cosT;
    return [cx + x * R, cy - y2 * R, z2, x * x + y2 * y2 < 1];
  }
  function visibleP(p) { return p[2] > 0 || !p[3]; }   // behind the disc = hidden

  function draw(now) {
    R = baseR * zoom;
    sinR = Math.sin(rot * D2R); cosR = Math.cos(rot * D2R);
    sinT = Math.sin(tiltDeg * D2R); cosT = Math.cos(tiltDeg * D2R);
    ctx.clearRect(0, 0, W, H);

    /* atmosphere */
    var g = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28);
    g.addColorStop(0, hexA(C.fill, C.light ? .1 : .16));
    g.addColorStop(1, hexA(C.fill, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, 6.2832); ctx.fill();

    /* sphere body, lit from the top left */
    var b = ctx.createRadialGradient(cx - R * .4, cy - R * .45, R * .05, cx, cy, R);
    if (C.light) { b.addColorStop(0, "#FFFFFF"); b.addColorStop(1, hexA(C.accent, .14)); }
    else { b.addColorStop(0, hexA(C.fill, .26)); b.addColorStop(.6, hexA(C.card, 1)); b.addColorStop(1, C.page); }
    ctx.fillStyle = b; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = hexA(C.accent, .45); ctx.lineWidth = 1; ctx.stroke();

    /* land as points */
    var s = clamp(R / 150, .9, 3.2), i, x, y, z, zz, yy;
    ctx.fillStyle = C.accent;
    for (i = 0; i < dots.length; i += 3) {
      x = dots[i] * cosR + dots[i + 2] * sinR;
      z = dots[i + 2] * cosR - dots[i] * sinR;
      yy = dots[i + 1] * cosT - z * sinT;
      zz = dots[i + 1] * sinT + z * cosT;
      if (zz <= 0.02) continue;
      var sz = s * (0.55 + 0.6 * zz);
      ctx.globalAlpha = (C.light ? .35 : .22) + .7 * zz;
      ctx.fillRect(cx + x * R - sz / 2, cy - yy * R - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;

    /* faint arcs to every place */
    ctx.lineWidth = 1;
    var focus = selIdx >= 0 ? selIdx : hoverIdx;
    for (var a = 0; a < arcIdx.length; a++) {
      var k = arcIdx[a], pts = arcs[k], on = k === focus;
      ctx.strokeStyle = on ? C.ink : C.accent;
      ctx.globalAlpha = on ? .95 : (C.light ? .3 : .2);
      ctx.lineWidth = on ? 1.6 : 1;
      ctx.beginPath();
      var pen = false;
      for (var j = 0; j < pts.length; j++) {
        var p = proj(pts[j]);
        if (!visibleP(p)) { pen = false; continue; }
        if (!pen) { ctx.moveTo(p[0], p[1]); pen = true; } else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 1;

    /* a light travels one arc at a time */
    if (!reduce && arcIdx.length) {
      var DUR = 1700, ct = (now - comet.t0) / DUR;
      if (ct >= 1) { comet.i = (comet.i + 1) % arcIdx.length; comet.t0 = now; ct = 0; }
      var cp = arcs[focus >= 0 && arcs[focus] ? focus : arcIdx[comet.i]];
      var head = ct * (cp.length - 1);
      for (var q = 0; q < 10; q++) {
        var f = head - q * 0.7;
        if (f < 0) break;
        var i0 = Math.floor(f), fr = f - i0, A = cp[i0], B = cp[Math.min(i0 + 1, cp.length - 1)];
        var pp = proj([A[0] + (B[0] - A[0]) * fr, A[1] + (B[1] - A[1]) * fr, A[2] + (B[2] - A[2]) * fr]);
        if (!visibleP(pp)) continue;
        ctx.globalAlpha = (1 - q / 10) * .95;
        ctx.fillStyle = q === 0 ? C.ink : C.accent;
        var rr = (q === 0 ? 2.6 : 1.8) * (1 - q / 14);
        ctx.beginPath(); ctx.arc(pp[0], pp[1], rr, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    /* places */
    var zs = Math.min(1 + (zoom - 1) * .3, 1.8);
    for (i = 0; i < PINS.length; i++) {
      var pv = proj(vec(PINS[i][1], PINS[i][2]));
      if (pv[2] <= 0) continue;
      var near = .55 + .45 * pv[2], hot = i === hoverIdx || i === selIdx;
      var rad = (hot ? 4.6 : 2.6) * near * zs;
      ctx.globalAlpha = .45 + .55 * pv[2];
      ctx.beginPath(); ctx.arc(pv[0], pv[1], rad, 0, 6.2832);
      ctx.fillStyle = hot ? C.ink : C.accent;
      ctx.shadowBlur = 0;
      ctx.fill(); ctx.shadowBlur = 0;
      if (hot && !reduce) {                       /* sonar ring */
        var ph = ((now / 1300) % 1);
        ctx.globalAlpha = (1 - ph) * .8;
        ctx.strokeStyle = C.accent; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(pv[0], pv[1], rad + ph * 18 * zs, 0, 6.2832); ctx.stroke();
        ctx.lineWidth = 1;
      }
    }
    ctx.globalAlpha = 1;

    /* home: Raleigh */
    var hp = proj(home);
    if (hp[2] > 0) {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(hp[0], hp[1], 5 * zs, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(hp[0], hp[1], 1.8 * zs, 0, 6.2832); ctx.fill();
      ctx.lineWidth = 1;
    }

    /* the name follows its pin */
    var show = hoverIdx >= 0 ? hoverIdx : selIdx;
    if (show >= 0 && tip) {
      var tp = proj(vec(PINS[show][1], PINS[show][2]));
      if (tp[2] > 0) {
        tip.textContent = PINS[show][0];
        tip.style.left = tp[0] + "px"; tip.style.top = (tp[1] - 14) + "px";
        tip.classList.add("on");
      } else tip.classList.remove("on");
    } else if (tip) tip.classList.remove("on");
  }

  /* ---- motion ---------------------------------------------------- */
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function wrap(d) { while (d > 180) d -= 360; while (d < -180) d += 360; return d; }

  function frame(now) {
    if (visible) {
      if (fly) {
        var t = Math.min(1, (now - fly.t0) / fly.dur), e = ease(t);
        rot = fly.r0 + fly.dr * e; tiltDeg = fly.t0d + fly.dt * e; zoom = fly.z0 + fly.dz * e;
        if (t >= 1) fly = null;
      } else if (!dragging) {
        if (Math.abs(vel) > .01) { rot += vel; vel *= .94; }
        else if (!hovering && selIdx < 0 && !reduce) rot += .1;
      }
      draw(now);
    }
    requestAnimationFrame(frame);
  }

  function flyTo(lat, lon, z) {
    vel = 0;
    fly = { t0: performance.now(), dur: reduce ? 1 : 1200,
            r0: rot, dr: wrap(-lon - rot),
            t0d: tiltDeg, dt: clamp(lat, -60, 70) - tiltDeg,
            z0: zoom, dz: (z || zoom) - zoom };
  }

  /* ---- readout above the globe ----------------------------------- */
  var wrapEl = host.parentNode;
  var hud = document.createElement("div");
  hud.className = "globe-hud";
  hud.setAttribute("aria-live", "polite");
  wrapEl.appendChild(hud);
  function fmt(v, p, n) { return Math.abs(v).toFixed(1) + "°" + (v >= 0 ? p : n); }
  function setHud(i) {
    if (i < 0) {
      hud.innerHTML = '<span class="k">Places</span><b>' + PINS.length + '</b><span class="c">Drag to explore</span>';
    } else {
      hud.innerHTML = '<span class="k">Now viewing</span><b>' + PINS[i][0] + '</b><span class="c">' +
        fmt(PINS[i][1], "N", "S") + " · " + fmt(PINS[i][2], "E", "W") + '</span>';
    }
  }
  setHud(-1);

  /* ---- the list below the globe becomes clickable ----------------- */
  var chips = [];
  var note = document.querySelector(".globe-note");
  var listBox = note && note.nextElementSibling;
  if (listBox) {
    [].forEach.call(listBox.querySelectorAll(".chip"), function (el) {
      var name = el.textContent.trim().toLowerCase(), idx = -1;
      for (var i = 0; i < PINS.length; i++) {
        var pn = PINS[i][0].toLowerCase();
        if (name === pn || name.indexOf(pn) === 0 || pn.indexOf(name) === 0) { idx = i; break; }
      }
      if (idx < 0) return;
      el.classList.add("place");
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", "Show " + el.textContent.trim() + " on the globe");
      el._pin = idx;
      chips.push(el);
      el.addEventListener("click", function () { select(idx, true); });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(idx, true); }
      });
    });
  }
  function markChips() {
    chips.forEach(function (c) { c.classList.toggle("on", c._pin === selIdx || c._pin === hoverIdx); });
  }

  function select(i, scroll) {
    selIdx = i;
    setHud(i); markChips();
    if (i >= 0) {
      flyTo(PINS[i][1], PINS[i][2], Math.max(zoom, 1.9));
      comet.t0 = performance.now();
      if (scroll) {
        var r = host.getBoundingClientRect();
        if (r.top < 60 || r.bottom > window.innerHeight) host.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    }
  }

  /* ---- pointer: drag with momentum, pinch, tap ------------------- */
  function pick(mx, my) {
    var best = -1, bd = 16;
    for (var i = 0; i < PINS.length; i++) {
      var p = proj(vec(PINS[i][1], PINS[i][2]));
      if (p[2] <= 0) continue;
      var d = Math.hypot(p[0] - mx, p[1] - my);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  var pts = {}, pinchDist = 0, pinchZoom = 1, moved = 0;
  function count() { var n = 0; for (var k in pts) n++; return n; }
  function two() { var a = null, b = null; for (var k in pts) { if (!a) a = pts[k]; else if (!b) b = pts[k]; } return [a, b]; }

  host.addEventListener("pointerdown", function (e) {
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    moved = 0; vel = 0; fly = null;
    host.setPointerCapture(e.pointerId);
    if (count() === 2) { var pr = two(); pinchDist = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y); pinchZoom = zoom; }
    dragging = true;
  });

  host.addEventListener("pointermove", function (e) {
    var bx = host.getBoundingClientRect();
    if (pts[e.pointerId]) {
      var prev = pts[e.pointerId], dx = e.clientX - prev.x, dy = e.clientY - prev.y;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      moved += Math.abs(dx) + Math.abs(dy);
      if (count() >= 2) {
        var pr = two(), d = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y);
        if (pinchDist > 0) zoom = clamp(pinchZoom * d / pinchDist, MINZ, MAXZ);
      } else {
        var step = dx * 0.4 / Math.max(zoom, 1);
        rot += step; vel = step;
        tiltDeg = clamp(tiltDeg + dy * 0.35, -85, 85);
        lastMove = performance.now();
      }
      return;
    }
    var h = pick(e.clientX - bx.left, e.clientY - bx.top);
    if (h !== hoverIdx) { hoverIdx = h; markChips(); }
    host.style.cursor = hoverIdx >= 0 ? "pointer" : "grab";
  });

  function release(e) {
    var tapped = moved < 8 && count() === 1;
    if (e.type === "pointerup" && tapped) {
      var bx = host.getBoundingClientRect();
      var i = pick(e.clientX - bx.left, e.clientY - bx.top);
      select(i, false);
      if (i < 0) setHud(-1);
    } else if (moved >= 8 && selIdx >= 0) { selIdx = -1; setHud(-1); markChips(); }
    if (performance.now() - lastMove > 80) vel = 0;       // held still before letting go
    delete pts[e.pointerId];
    try { host.releasePointerCapture(e.pointerId); } catch (err) {}
    if (count() === 0) dragging = false;
    if (count() < 2) pinchDist = 0;
  }
  host.addEventListener("pointerup", release);
  host.addEventListener("pointercancel", release);
  host.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") hovering = true; });
  host.addEventListener("pointerleave", function (e) {
    if (e.pointerType !== "mouse") return;
    hovering = false; hoverIdx = -1; markChips();
  });

  host.addEventListener("wheel", function (e) {
    var next = clamp(zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12), MINZ, MAXZ);
    if (next === zoom) return;
    zoom = next; fly = null; e.preventDefault();
  }, { passive: false });

  host.addEventListener("keydown", function (e) {
    var k = e.key, used = true;
    if      (k === "ArrowLeft")  rot -= 6;
    else if (k === "ArrowRight") rot += 6;
    else if (k === "ArrowUp")    tiltDeg = clamp(tiltDeg + 5, -85, 85);
    else if (k === "ArrowDown")  tiltDeg = clamp(tiltDeg - 5, -85, 85);
    else if (k === "+" || k === "=") zoom = clamp(zoom * 1.15, MINZ, MAXZ);
    else if (k === "-" || k === "_") zoom = clamp(zoom / 1.15, MINZ, MAXZ);
    else if (k === "0") reset();
    else used = false;
    if (used) e.preventDefault();
  });

  function reset() {
    selIdx = -1; hoverIdx = -1; setHud(-1); markChips();
    fly = { t0: performance.now(), dur: reduce ? 1 : 1000, r0: rot, dr: wrap(HOME.rot - rot),
            t0d: tiltDeg, dt: HOME.tilt - tiltDeg, z0: zoom, dz: HOME.zoom - zoom };
  }

  var ctl = document.getElementById("globe-ctl");
  if (ctl) ctl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("button") : null;
    if (!btn) return;
    var a = btn.getAttribute("data-g");
    if (a === "in")  { fly = null; zoom = clamp(zoom * 1.3, MINZ, MAXZ); }
    if (a === "out") { fly = null; zoom = clamp(zoom / 1.3, MINZ, MAXZ); }
    if (a === "reset") reset();
  });

  if (window.IntersectionObserver) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(host);
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) visible = false; else visible = true; });

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
