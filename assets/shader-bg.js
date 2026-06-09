/* =========================================================================
   NOCTRA — animated shader background (dependency-free WebGL).
   Ported from a Three.js component to raw WebGL for Shopify performance.
   Auto-inits any <canvas data-shader>. Tinted to brand colors, pauses
   off-screen, and respects prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";

  var VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";

  var FRAG = [
    "precision highp float;",
    "uniform vec2 resolution;",
    "uniform float time;",
    "void main(void){",
    "  vec2 uv = (gl_FragCoord.xy*2.0 - resolution.xy)/min(resolution.x, resolution.y);",
    "  float t = time*0.05;",
    "  float lineWidth = 0.0016;",
    "  vec3 col = vec3(0.0);",
    "  vec3 c0 = vec3(1.0, 0.30, 0.17);", // molten
    "  vec3 c1 = vec3(1.0, 0.58, 0.0);",  // ember
    "  vec3 c2 = vec3(0.18, 0.48, 1.0);", // volt
    "  for(int j=0;j<3;j++){",
    "    float a=0.0;",
    "    for(int i=0;i<5;i++){",
    "      a += lineWidth*float(i*i)/abs(fract(t-0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y,0.2));",
    "    }",
    "    if(j==0){col+=a*c0;} else if(j==1){col+=a*c1;} else {col+=a*c2;}",
    "  }",
    "  col *= 0.75;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[noctra shader]", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function init(canvas) {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) { canvas.style.display = "none"; return; }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = "none"; return; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, "resolution");
    var uTime = gl.getUniformLocation(prog, "time");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      var w = canvas.clientWidth || canvas.parentElement.clientWidth;
      var h = canvas.clientHeight || canvas.parentElement.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    if ("ResizeObserver" in window) { new ResizeObserver(resize).observe(canvas); }
    else { window.addEventListener("resize", resize); }
    resize();

    var t = 0, raf = null, visible = true;
    function frame() {
      raf = null;
      t += 0.05;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    }
    frame();

    if (!reduce && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible && !raf) raf = requestAnimationFrame(frame);
          else if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(canvas);
    }
  }

  function boot() {
    var nodes = document.querySelectorAll("canvas[data-shader]");
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
