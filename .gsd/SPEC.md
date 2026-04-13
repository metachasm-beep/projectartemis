# SPEC: Women's Dashboard Immersive Reveal

**Status: FINALIZED**

## 1. Overview
Implement a high-fidelity "Immersive Reveal" sequence for the Women's Dashboard Hero section to establish a "Luxury Minimalist" first impression. The experience must feel living and reactive.

## 2. Requirements

### 2.1 Aesthetic & Visuals
- **Style**: Luxury Minimalist.
- **Tokens**: Deep wine (#7B2D42), luxury cream (#FDFBF7), rose accents.
- **Effects**: `backdrop-blur-xl`, `bg-white/5` (glassmorphism), `shadow-mat-premium`.

### 2.2 Hero Reveal Sequence
- **Hero Image (hero_woman.jpg)**: 
    - Soft "Scale-In" (from 1.1 to 1.0).
    - Subtle "Breathe" effect (infinite loop: scale [1, 1.02, 1]).
- **Profile Headlines**:
    - "Mask-Reveal" effect: Text slides up from `overflow-hidden` containers.
    - Title: "Welcome to the Inner Sanctuary."

### 2.3 Interaction Elements
- **Bento Cards**: Staggered arrival from the bottom with a spring-heavy transition.
- **Sovereign Identity Card (parallax_woman.jpg)**: 
    - **Hover-Parallax**: Interactive tilt/shift responding to mouse/touch coordinates.
    - Transform: 3D perspective with `translateZ` on child elements.

### 2.4 Performance (PWA)
- **Acceleration**: Use `transform-gpu` and `layout` props in Framer Motion.
- **Optimization**: Avoid paint-triggering properties (e.g., animate `opacity` and `transform` only where possible).

## 3. Implementation Checklist
- [ ] Create/Update `src/utils/animations.ts` with GSD-compliant variants.
- [ ] Refactor `WomenDashboard.tsx` to modularize the `HeroSection`.
- [ ] Implement `ImmersiveReveal` component shell.
- [ ] Implement `HoverParallaxCard` component.

## 4. Acceptance Criteria
- [ ] Hero image scales and breathes smoothly without frame drops.
- [ ] Headlines reveal with mask effect on load.
- [ ] All grid cards stagger-in with spring physics.
- [ ] Identity card responds to mouse movement with 3D depth.
- [ ] Passes 60fps audit on mobile PWA simulation.
