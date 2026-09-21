/* Animated Swiss grid — WebGL2 port of a React/GLSL background component,
   recolored black-and-white for the SCHRIFT palette. Runs behind the hero
   text; if WebGL2 is missing or reduced motion is on, the static CSS grid
   pattern underneath simply shows through. */
(() => {
	"use strict";

	const canvas = document.querySelector(".hero__shader");
	if (!canvas) return;

	const gl = canvas.getContext("webgl2", { premultipliedAlpha: false });
	if (!gl) return;

	const VERT_SRC = `#version 300 es
	precision highp float;
	layout(location=0) in vec2 a_pos;
	void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
	`;

	const FRAG_SRC = `#version 300 es
	precision highp float;
	out vec4 fragColor;
	uniform vec3  iResolution;
	uniform float iTime;

	const float GRID_SCALE   = 18.0;
	const float MAJOR_STEP   = 4.0;
	const float THIN_WIDTH   = 0.010;
	const float MAJOR_WIDTH  = 0.018;
	const float SCROLL_SPEED = 0.02;

	const float VIGNETTE_AMT = 0.06;
	const float MESH_AMT     = 0.85;
	const float NOISE_AMT    = 0.015;
	const float DITHER_AMT   = 0.006;

	const float ASCII_AMT    = 0.30;
	const float ASCII_SCALE  = 26.0;
	const float ASCII_EVERY  = 2.0;

	float bayer4(vec2 p){
		ivec2 ip = ivec2(int(mod(p.x,4.0)), int(mod(p.y,4.0)));
		int idx = ip.y*4 + ip.x;
		int m[16]; m[0]=0;m[1]=8;m[2]=2;m[3]=10;m[4]=12;m[5]=4;m[6]=14;m[7]=6;
		m[8]=3;m[9]=11;m[10]=1;m[11]=9;m[12]=15;m[13]=7;m[14]=13;m[15]=5;
		return float(m[idx]) / 15.0;
	}

	float hash21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
	float vnoise(vec2 p){
		vec2 i=floor(p), f=fract(p);
		float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));
		vec2 u=f*f*(3.0-2.0*f);
		return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
	}

	float gridLineAA(vec2 uv, float scale, float width){
		vec2 g = abs(fract(uv*scale) - 0.5);
		float d = min(g.x, g.y);
		float aa = fwidth(d);
		return 1.0 - smoothstep(width, width + aa, d);
	}
	float majorGridAA(vec2 uv, float scale, float stepN, float width){
		float sMajor = max(1.0, scale/stepN);
		return gridLineAA(uv, sMajor, width);
	}

	/* mesh gradient in paper grays — a faint unevenness, like stock */
	vec3 meshGradient(vec2 uv){
		vec2 p0=vec2(-0.70,-0.45), p1=vec2(0.75,-0.35), p2=vec2(-0.65,0.65), p3=vec2(0.80,0.55);
		vec3 c0=vec3(0.985);
		vec3 c1=vec3(0.955);
		vec3 c2=vec3(0.995);
		vec3 c3=vec3(0.945);
		float e=2.0;
		float w0=pow(1.0/(0.2+distance(uv,p0)),e);
		float w1=pow(1.0/(0.2+distance(uv,p1)),e);
		float w2=pow(1.0/(0.2+distance(uv,p2)),e);
		float w3=pow(1.0/(0.2+distance(uv,p3)),e);
		float ws=w0+w1+w2+w3;
		return (c0*w0+c1*w1+c2*w2+c3*w3)/ws;
	}

	float sdLineX(vec2 p, float w){ return 1.0 - smoothstep(w, w+fwidth(p.y), abs(p.y)); }
	float sdLineY(vec2 p, float w){ return 1.0 - smoothstep(w, w+fwidth(p.x), abs(p.x)); }
	float sdDiag1(vec2 p, float w){ float d=abs(p.x+p.y)/sqrt(2.0); return 1.0 - smoothstep(w, w+fwidth(d), d); }
	float sdDiag2(vec2 p, float w){ float d=abs(p.x-p.y)/sqrt(2.0); return 1.0 - smoothstep(w, w+fwidth(d), d); }
	float sdDot (vec2 p, float r){ float d=length(p); return 1.0 - smoothstep(r, r+fwidth(d), d); }

	float asciiGlyph(vec2 cellUV, float level){
		vec2 p=cellUV; float w=0.11, r=0.10;
		float g0=sdDot(p,r), g1=sdLineX(p,w), g2=sdLineY(p,w),
		      g3=max(sdLineX(p,w),sdLineY(p,w)),
		      g4=sdDiag1(p,w), g5=sdDiag2(p,w),
		      g6=max(sdDiag1(p,w),sdDiag2(p,w)),
		      g7=max(sdLineX(p,w), max(sdLineY(p,w), g6));
		float m=0.;
		m=mix(m,g0, smoothstep(0.00,0.12,level)*(1.0-step(level,0.12)));
		m=mix(m,g1, smoothstep(0.12,0.28,level)*(1.0-step(level,0.28)));
		m=mix(m,g2, smoothstep(0.28,0.44,level)*(1.0-step(level,0.44)));
		m=mix(m,g3, smoothstep(0.44,0.60,level)*(1.0-step(level,0.60)));
		m=mix(m,g4, smoothstep(0.60,0.72,level)*(1.0-step(level,0.72)));
		m=mix(m,g5, smoothstep(0.72,0.84,level)*(1.0-step(level,0.84)));
		m=mix(m,g6, smoothstep(0.84,0.94,level)*(1.0-step(level,0.94)));
		m=mix(m,g7, smoothstep(0.94,1.00,level));
		return clamp(m,0.0,1.0);
	}

	void main(){
		vec2  R = iResolution.xy;
		float t = iTime;
		vec2 uv = (gl_FragCoord.xy - 0.5*R) / max(R.y, 1.0);

		/* white paper base with faint gray mesh and edge vignette */
		vec3 bg = mix(vec3(1.0), meshGradient(uv), MESH_AMT);
		float rad = length(uv);
		bg *= 1.0 - VIGNETTE_AMT * rad * rad;

		vec2 scrollDir = normalize(vec2(1.0, -0.55));
		vec2 uvAnim    = uv + SCROLL_SPEED * t * scrollDir;

		float thin  = gridLineAA (uvAnim, GRID_SCALE, THIN_WIDTH);
		float major = majorGridAA(uvAnim, GRID_SCALE, MAJOR_STEP, MAJOR_WIDTH);

		/* black ink lines, subtracted from the paper */
		vec3 col = bg - vec3(thin) * 0.055 - vec3(major) * 0.10;

		/* glyphs live only on the major grid lines, level animated by noise */
		vec2 uMajor = uvAnim * (GRID_SCALE / MAJOR_STEP);
		vec2 idx    = floor(uMajor + 0.5);
		float selX = 1.0 - step(0.001, abs(fract(idx.x / ASCII_EVERY)));
		float selY = 1.0 - step(0.001, abs(fract(idx.y / ASCII_EVERY)));
		float asciiLineSel = max(selX, selY);

		vec2 aUV   = uv * ASCII_SCALE;
		vec2 cellF = fract(aUV) - 0.5;
		float lvl  = vnoise(floor(aUV) * 0.35 + vec2(t*0.25, -t*0.18));
		float glyph = asciiGlyph(cellF, lvl);
		col -= vec3(glyph) * 0.12 * ASCII_AMT * asciiLineSel * major;

		/* film grain + ordered dither, both tiny */
		float n = vnoise(gl_FragCoord.xy*0.6 + vec2(t*12.0, -t*9.0));
		col += (n - 0.5) * NOISE_AMT;
		col += (bayer4(gl_FragCoord.xy) - 0.5) * DITHER_AMT;

		fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
	}
	`;

	function compile(type, src) {
		const sh = gl.createShader(type);
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			console.error("shader:", gl.getShaderInfoLog(sh));
			return null;
		}
		return sh;
	}

	const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
	const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
	if (!vs || !fs) return;

	const program = gl.createProgram();
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("shader link:", gl.getProgramInfoLog(program));
		return;
	}
	gl.deleteShader(vs);
	gl.deleteShader(fs);

	const vao = gl.createVertexArray();
	const vbo = gl.createBuffer();
	gl.bindVertexArray(vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

	const uResolution = gl.getUniformLocation(program, "iResolution");
	const uTime = gl.getUniformLocation(program, "iTime");

	const dpr = () => Math.max(1, Math.min(1.5, window.devicePixelRatio || 1));

	function resize() {
		const d = dpr();
		const w = Math.max(1, Math.floor(canvas.clientWidth * d));
		const h = Math.max(1, Math.floor(canvas.clientHeight * d));
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
			gl.viewport(0, 0, w, h);
		}
	}
	new ResizeObserver(resize).observe(canvas);
	resize();

	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const start = performance.now();
	let raf = null;

	function frame(now) {
		resize();
		gl.useProgram(program);
		gl.uniform3f(uResolution, canvas.width, canvas.height, dpr());
		gl.uniform1f(uTime, (now - start) / 1000);
		gl.bindVertexArray(vao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		if (!reduced) raf = requestAnimationFrame(frame);
	}
	raf = requestAnimationFrame(frame);

	/* don't burn GPU while the tab is hidden */
	document.addEventListener("visibilitychange", () => {
		if (reduced) return;
		if (document.hidden) {
			if (raf) cancelAnimationFrame(raf);
			raf = null;
		} else if (!raf) {
			raf = requestAnimationFrame(frame);
		}
	});
})();
