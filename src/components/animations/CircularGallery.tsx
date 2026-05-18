import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: any, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  subText: string = '',
  font: string = '900 64px "Roboto Condensed", sans-serif',
  textColor: string = 'white',
  onUpdate?: (width: number, height: number) => void
): { texture: Texture; width: number; height: number; update: () => void } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  const texture = new Texture(gl, { generateMipmaps: false });

  const update = () => {
    // Aesthetic multiline rendering - Magazine feel
    const subFont = '400 16px "Roboto Condensed", sans-serif';
    
    context.font = font;
    const textWidth = Math.ceil(context.measureText(text).width);
    context.font = subFont;
    const subTextWidth = Math.ceil(context.measureText(subText).width);
    
    const maxWidth = Math.max(textWidth, subTextWidth);
    const fontSize = getFontSize(font);
    const subFontSize = getFontSize(subFont);
    
    // Padding and line height
    const paddingX = 80;
    const paddingY = 40;
    const lineHeight = 1.1;
    const canvasWidth = maxWidth + paddingX;
    const canvasHeight = (fontSize + subFontSize) * lineHeight + paddingY;

    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    // Render Premium High-Contrast Interface
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Legacy-Safe Pill Shape (Standard Path)
    const r = 24;
    context.fillStyle = 'rgba(0, 0, 0, 1.0)'; // SOLID BLACK for maximum contrast
    context.beginPath();
    context.moveTo(r, 0);
    context.lineTo(canvasWidth - r, 0);
    context.quadraticCurveTo(canvasWidth, 0, canvasWidth, r);
    context.lineTo(canvasWidth, canvasHeight - r);
    context.quadraticCurveTo(canvasWidth, canvasHeight, canvasWidth - r, canvasHeight);
    context.lineTo(r, canvasHeight);
    context.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - r);
    context.lineTo(0, r);
    context.quadraticCurveTo(0, 0, r, 0);
    context.closePath();
    context.fill();

    const gradient = context.createLinearGradient(0, canvasHeight, 0, 0);
    context.fillStyle = gradient;
    context.fill(); // Re-apply fill with gradient

    // Render Text with "Sanctuary Glow"
    context.font = font;
    context.textBaseline = 'top';
    context.textAlign = 'left';
    
    // Outer Glow Shadow
    context.shadowColor = 'rgba(0,0,0,1)';
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 2;

    // Bold Stroke for absolute legibility
    context.strokeStyle = 'rgba(0,0,0,0.9)';
    context.lineWidth = 6;
    context.strokeText(text, paddingX / 4, paddingY / 4);
    
    context.fillStyle = textColor;
    context.fillText(text, paddingX / 4, paddingY / 4);

    if (subText) {
      context.font = subFont;
      context.fillStyle = 'rgba(255, 255, 255, 1.0)';
      // Removed letterSpacing for legacy compatibility
      context.shadowBlur = 10;
      context.fillText(subText.toUpperCase(), paddingX / 4, paddingY / 4 + fontSize * 1.1);
    }
    texture.image = canvas;
    if (onUpdate) onUpdate(canvasWidth, canvasHeight);
  };

  // Absolute Font Ready Synchronization
  if ('fonts' in document) {
    (document as any).fonts.ready.then(() => {
       // Short delay to ensure browser layout sync and consistent measurement
       setTimeout(() => {
         update();
       }, 250);
    });
  }

  return { texture, width: canvas.width, height: canvas.height, update };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  subText?: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  subText: string;
  textColor: string;
  font: string;
  mesh!: Mesh;
  aspect: number = 1;
  updateTexture!: () => void;

  constructor({ gl, plane, renderer, text, subText = '', textColor = '#ffffff', font = '700 48px "Playfair Display", serif' }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.subText = subText;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height, update } = createTextTexture(
      this.gl, 
      this.text, 
      this.subText, 
      this.font, 
      this.textColor,
      (w, h) => {
        this.aspect = w / h;
        this.reposition();
      }
    );
    this.updateTexture = update;
    this.aspect = width / height;
    
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.05) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    
    this.mesh = new Mesh(this.gl, { geometry, program });
    this.mesh.renderOrder = 9999; // Absolute front-most layer
    this.reposition();
    this.mesh.setParent(this.plane);
  }

  reposition() {
    if (!this.mesh) return;
    const textHeightScaled = this.plane.scale.y * 0.15;
    const textWidthScaled = textHeightScaled * this.aspect;
    this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
    
    this.mesh.position.set(
      -this.plane.scale.x * 0.5 + textWidthScaled * 0.5 + 0.15,
      -this.plane.scale.y * 0.5 + textHeightScaled * 0.5 + 0.15,
      0.8 // Definitive holographic depth offset
    );
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  subText: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  subText: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    subText = '',
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.subText = subText;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: false, // Fix black screen for NPOT Unsplash images
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
      wrapS: this.gl.CLAMP_TO_EDGE,
      wrapT: this.gl.CLAMP_TO_EDGE
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = 0.0; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uTime;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          // --- Sanctuary Holographic Glint ---
          float shine = step(0.98, sin(vUv.x * 2.0 + vUv.y * 1.5 + uTime * 0.5));
          shine *= step(0.5, vUv.y); // Only top half shimmer
          color.rgb += shine * 0.15;
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [1, 1] }, // Prevent initial NaN division
        uImageSizes: { value: [1, 1] }, // Prevent WebGL NaN division before load
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      texture.needsUpdate = true;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
    img.onerror = () => {
      console.warn('Retrying image load without crossOrigin for sanctuary gaze:', this.image);
      const fallbackImg = new Image();
      fallbackImg.src = this.image;
      fallbackImg.onload = () => {
        texture.image = fallbackImg;
        texture.needsUpdate = true;
        this.program.uniforms.uImageSizes.value = [fallbackImg.naturalWidth, fallbackImg.naturalHeight];
      };
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      subText: this.subText,
      textColor: this.textColor,
      font: this.font
    });
  }

  update(scroll: { current: number; last: number }, direction: 'right' | 'left') {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.position.z = this.index * 0.001; // Tiny offset to prevent Z-fighting
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      this.plane.position.z = this.index * 0.001; // Tiny offset to prevent Z-fighting
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    
    // Mobile optimization logic: relative to viewport size
    const isMobile = this.screen.width < 768;
    
    if (isMobile) {
      this.plane.scale.x = this.viewport.width * 0.7; // Thinner
      this.plane.scale.y = this.viewport.height * 0.65; // Taller
      this.padding = 0.8;
      this.scale = 1;
    } else {
      this.scale = this.screen.height / 1400; // Adjusted scale for breathing room
      this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
      this.plane.scale.x = this.plane.scale.y / 1.5; // Strictly 2:3 Card Ratio
      this.padding = 2;
    }
    
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;

    if (this.title) {
      this.title.reposition();
    }
  }
}

interface AppConfig {
  items?: { image: string; text: string; subText?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  onSelect?: (index: number) => void;
  onCenterUpdate?: (index: number) => void;
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  autoScroll: boolean;
  autoScrollSpeed: number;
  onCheckDebounce: (...args: any[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string; subText?: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: (e: MouseEvent | TouchEvent) => void;

  isDown: boolean = false;
  start: number = 0;
  onSelect?: (index: number) => void;
  onCenterUpdate?: (index: number) => void;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = '#ffffff',
      borderRadius = 0,
      font = '700 48px "Playfair Display", serif',
      scrollSpeed = 3,
      scrollEase = 0.2,
      autoScroll = false,
      autoScrollSpeed = 1,
      onSelect,
      onCenterUpdate
    }: AppConfig
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.onSelect = onSelect;
    this.onCenterUpdate = onCenterUpdate;
    this.scrollSpeed = scrollSpeed;
    this.autoScroll = autoScroll;
    this.autoScrollSpeed = autoScrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  // 🥂 Live Link: Update callbacks without heart-surgery on the WebGL instance
  updateCallbacks(onSelect?: (index: number) => void, onCenterUpdate?: (index: number) => void) {
    this.onSelect = onSelect;
    this.onCenterUpdate = onCenterUpdate;
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.canvas.style.width = '100%';
    this.gl.canvas.style.height = '100%';
    this.gl.canvas.style.display = 'block';
    this.gl.canvas.style.outline = 'none';
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }

  createMedias(
    items: { image: string; text: string; subText?: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const defaultItems = [
      {
        image: `https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&h=600&auto=format&fit=crop`,
        text: 'Sovereign'
      }
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    // Purity Fix: We must store the original length so modulo math works universally.
    (this as any).originalLength = galleryItems.length;
    this.mediasImages = galleryItems.length < 24 ? galleryItems.concat(galleryItems) : galleryItems;
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        subText: data.subText || '',
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    
    // 🏹 Unidirectional Stream: Block swiping back (negative distance)
    const newTarget = (this.scroll.position ?? 0) + distance;
    if (newTarget > this.scroll.target) {
      this.scroll.target = newTarget;
    }
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    this.isDown = false;
    
    // Weighted inertia calculation
    const vel = this.scroll.target - (this.scroll.position ?? 0);
    this.scroll.target += vel * 0.5; // Continue the motion

    this.onCheck();
    
    if (this.onSelect && e) {
      const x = 'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
      if (Math.abs(this.start - x) < 5) {
         if (this.medias && this.medias.length > 0) {
            const width = this.medias[0].width;
            
            // 🥂 Selection Alignment: Map click coordinate to specific card index
            const canvasWidth = this.gl.canvas.clientWidth;
            const viewportWidth = this.viewport.width;
            const centerX = canvasWidth / 2;
            const dx = x - centerX;
            const glDx = (dx / canvasWidth) * viewportWidth;
            
            const itemIndex = Math.round((this.scroll.target + glDx) / width);
            const originalLength = (this as any).originalLength || this.mediasImages.length;
            
            // Normalize index for infinite scroll parity
            const normalizedIndex = ((itemIndex % originalLength) + originalLength) % originalLength;
            this.onSelect(normalizedIndex);
         }
      }
    }
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    const delta = wheelEvent.deltaY || (wheelEvent as any).wheelDelta || (wheelEvent as any).detail;
    
    // 🏹 Unidirectional Stream: Only allow forward motion (delta > 0)
    // Moving content right-to-left increases the target index.
    if (delta > 0) {
      this.scroll.target += this.scrollSpeed * 0.15;
    }
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth || window.innerWidth,
      height: (this.container.clientHeight > 300) ? this.container.clientHeight : window.innerHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    if (this.autoScroll && !this.isDown) {
      this.scroll.target += this.autoScrollSpeed;
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    
    // Broadcast Center Tracking for Hybrid DOM
    if (this.onCenterUpdate && this.medias.length > 0) {
      const width = this.medias[0].width;
      const centeredIndex = Math.round(Math.abs(this.scroll.current) / width);
      const originalLength = (this as any).originalLength || this.mediasImages.length;
      this.onCenterUpdate(centeredIndex % originalLength);
    }
    
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    
    // Optimized Listener: Attach to window for proper resize detection
    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('mousewheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: true });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('mousemove', this.boundOnTouchMove);
    this.container.addEventListener('mouseup', this.boundOnTouchUp);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: true });
    this.container.addEventListener('touchend', this.boundOnTouchUp, { passive: true });
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    this.container.removeEventListener('mousewheel', this.boundOnWheel);
    this.container.removeEventListener('wheel', this.boundOnWheel);
    this.container.removeEventListener('mousedown', this.boundOnTouchDown);
    this.container.removeEventListener('mousemove', this.boundOnTouchMove);
    this.container.removeEventListener('mouseup', this.boundOnTouchUp);
    this.container.removeEventListener('touchstart', this.boundOnTouchDown);
    this.container.removeEventListener('touchmove', this.boundOnTouchMove);
    this.container.removeEventListener('touchend', this.boundOnTouchUp);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas as HTMLCanvasElement);
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string; subText?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  onSelect?: (index: number) => void;
  onCenterUpdate?: (index: number) => void;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = '900 40px "Roboto Condensed"',
  scrollSpeed = 3,
  scrollEase = 0.23,
  autoScroll = false,
  autoScrollSpeed = 1,
  onSelect,
  onCenterUpdate
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  // 🛡️ Callback Hardening: Ensure callbacks are always fresh without resetting the engine
  useEffect(() => {
    if (appRef.current) {
       appRef.current.updateCallbacks(onSelect, onCenterUpdate);
    }
  }, [onSelect, onCenterUpdate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      autoScroll,
      autoScrollSpeed,
      onSelect,
      onCenterUpdate
    });
    appRef.current = app;

    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [items ? JSON.stringify(items) : null, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return <div className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing touch-none" ref={containerRef} />;
}
