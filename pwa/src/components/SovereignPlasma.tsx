import React, { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

const vertex = /* glsl */ `
attribute vec2 position;
void main(){
  gl_Position=vec4(position,0.,1.);
}
`;

const fragment = /* glsl */ `
precision mediump float;
uniform float iTime;
uniform vec2  iResolution;
uniform float focalLength;
uniform float uOpacity;

const float lt   = 0.3;
const float pi   = 3.14159;
const float pi2  = 6.28318;
const float pi_2 = 1.5708;
#define MAX_STEPS 16

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi * 0.5;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;

  vec3 o = vec3(0.0, 0.0, -8.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, focalLength));
  vec2 k = vec2(0.0);
  vec3 p;

  float bend1 = 1.2;
  float bend2 = 0.8;

  for (int i = 0; i < MAX_STEPS; ++i) {
    p = o + u * d;
    p.x -= 12.0;

    float px = p.x;
    float wob1 = bend1 + sin(t * 0.7 + px * 0.8) * 0.15;
    float wob2 = bend2 + cos(t * 0.9 + px * 1.1) * 0.15;

    float px2 = px + pi_2;
    vec2 sinOffset = sin(vec2(px, px2) + t * 0.2) * wob1;
    vec2 cosOffset = cos(vec2(px, px2) + t * 0.3) * wob2;

    vec2 yz = p.yz;
    float pxLt = px + lt;
    k.x = max(pxLt, length(yz - sinOffset) - lt);
    k.y = max(pxLt, length(yz - cosOffset) - lt);

    float current = min(k.x, k.y);
    s = min(s, current);
    if (s < 0.001 || d > 300.0) break;
    d += s * 0.75;
  }

  // Sovereign Color Palette: Plum and Gold
  vec3 plum = vec3(0.416, 0.106, 0.604); // #6A1B9A
  vec3 gold = vec3(1.0, 0.843, 0.0);    // #FFD700
  
  float pattern = cos(d * pi2 * 0.5);
  vec3 c = mix(plum, gold, pattern * 0.5 + 0.5);
  
  // High-fidelity glow
  c += pow(clamp(1.0 - s * 2.0, 0.0, 1.0), 4.0) * gold * 0.5;
  
  float maxC = max(c.r, max(c.g, c.b));
  if (maxC < 0.05) discard;
  
  C = vec4(c, uOpacity * (1.0 - d / 50.0));
}

void main() {
  vec2 coord = gl_FragCoord.xy;
  vec4 color;
  mainImage(color, coord);
  gl_FragColor = color;
}
`;

const SovereignPlasma: React.FC<{ opacity?: number }> = ({ opacity = 0.4 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ alpha: true, dpr: window.devicePixelRatio || 1 });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);
    rendererRef.current = renderer;

    const camera = new Camera(gl);
    const scene = new Transform();
    const geometry = new Geometry(gl, { position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) } });
    
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([window.innerWidth, window.innerHeight]) },
        focalLength: { value: 0.8 },
        uOpacity: { value: opacity }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.iResolution.value[0] = window.innerWidth;
      program.uniforms.iResolution.value[1] = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const loop = (now: number) => {
      program.uniforms.iTime.value = now * 0.001;
      renderer.render({ scene, camera });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      gl.canvas.remove();
    };
  }, [opacity]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: -1, 
        pointerEvents: 'none',
        background: '#060010' // Deep Sovereign background base
      }} 
    />
  );
};

export default SovereignPlasma;
