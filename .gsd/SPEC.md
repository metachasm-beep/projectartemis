# SPEC: Women's Dashboard Immersive Folds

**Status: FINALIZED**

## 1. Overview
Evolve the Women's Dashboard into a dual-fold vertical architecture. Each fold must feature an immersive parallax background to establish a sense of deep sanctuary space.

## 2. Requirements

### 2.1 Fold Architecture
- **Fold 1: The Sovereign Arrival**
    - Content: `HeroSection`, Quick Actions (Aura Tokens), Verification Prompt.
    - Background: `fold_one_bg.jpg`.
    - Effect: Parallax scroll (BG moves at 0.3x speed).
- **Fold 2: The Inner Registry**
    - Content: Bento Grid (Identity, Harmony Index, Connection Arch, Records), FAQ.
    - Background: `fold_two_bg.jpg`.
    - Effect: Parallax scroll (BG moves at 0.3x speed).

### 2.2 Parallax Mechanics
- **Hardware Acceleration**: Must use `translateZ(0)` or `will-change: transform`.
- **Motion Orchestration**: Use `framer-motion` `useScroll` and `useTransform` for consistent frame-timing.
- **Visual Fidelity**: Backgrounds should be slightly dimmed/desaturated to maintain "Luxury Minimalist" legibility.

### 2.3 Transition Rituals
- **Reveal**: Content manifests within each fold using existing staggered variants as they enter the viewport.
- **Section Dividers**: Subtle mask-fades between folds to prevent harsh boundary transitions.

## 3. Implementation Checklist
- [ ] Create `src/components/dashboard/ParallaxFold.tsx` [NEW]
- [ ] Refactor `WomenDashboard.tsx` into a `FoldOrchestrator` structure.
- [ ] Clean up redundant fixed backgrounds.

## 4. Acceptance Criteria
- [ ] Both backgrounds manifest correctly with different scrolling velocities.
- [ ] Content is correctly partitioned into two distinct vertical "folds."
- [ ] Parallax is hardware accelerated without frame jitter (60fps).
- [ ] Legibility is preserved across all content items through intelligent glassmorphism.
