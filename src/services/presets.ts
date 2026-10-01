import type { SvgPreset } from '../types/svg';

export const SVG_PRESETS: SvgPreset[] = [
  {
    id: 'cyber-hex',
    name: 'Cyberpunk Neon Hexagon',
    description: 'Pulsing cybernetic rings with rotating core, glowing laser gradients, and particle sparks.',
    category: 'cyberpunk',
    recommendedDuration: 4,
    recommendedFps: 60,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <radialGradient id="cyberGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#7000ff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#050510" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff"/>
      <stop offset="100%" stop-color="#ff007f"/>
    </linearGradient>
    <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    @keyframes spinClockwise {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spinCounter {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes pulseScale {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 25px #00f0ff); }
    }
    @keyframes dashMove {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 1200; }
    }

    .core-pulse {
      transform-origin: 500px 500px;
      animation: pulseScale 3s ease-in-out infinite;
    }
    .ring-clockwise {
      transform-origin: 500px 500px;
      animation: spinClockwise 8s linear infinite;
    }
    .ring-counter {
      transform-origin: 500px 500px;
      animation: spinCounter 12s linear infinite;
    }
    .dash-animated {
      stroke-dasharray: 40 20;
      animation: dashMove 6s linear infinite;
    }
  </style>

  <!-- Dark cyber background aura -->
  <circle cx="500" cy="500" r="450" fill="url(#cyberGlow)"/>

  <!-- Outer Hexagon Frame -->
  <polygon points="500,80 864,290 864,710 500,920 136,710 136,290" 
           fill="none" stroke="#22263d" stroke-width="4"/>

  <!-- Rotating Dashed Ring -->
  <g class="ring-clockwise">
    <circle cx="500" cy="500" r="360" fill="none" stroke="#00f0ff" stroke-width="3" 
            class="dash-animated" filter="url(#neonBlur)" opacity="0.85"/>
  </g>

  <!-- Counter-Rotating Tech Ring -->
  <g class="ring-counter">
    <circle cx="500" cy="500" r="280" fill="none" stroke="#ff007f" stroke-width="2.5" 
            stroke-dasharray="15 35" filter="url(#neonBlur)"/>
    <polygon points="500,240 520,270 480,270" fill="#ff007f"/>
    <polygon points="500,760 520,730 480,730" fill="#ff007f"/>
    <polygon points="240,500 270,520 270,480" fill="#ff007f"/>
    <polygon points="760,500 730,520 730,480" fill="#ff007f"/>
  </g>

  <!-- Pulsing Center Core Hexagon -->
  <g class="core-pulse">
    <polygon points="500,320 655,410 655,590 500,680 345,590 345,410" 
             fill="none" stroke="url(#neonCyan)" stroke-width="8" filter="url(#neonBlur)"/>
    <circle cx="500" cy="500" r="50" fill="#00f0ff" filter="url(#neonBlur)"/>
    <circle cx="500" cy="500" r="20" fill="#ffffff"/>
  </g>

  <!-- Crosshair Reticles -->
  <line x1="500" y1="120" x2="500" y2="200" stroke="#00f0ff" stroke-width="2"/>
  <line x1="500" y1="800" x2="500" y2="880" stroke="#00f0ff" stroke-width="2"/>
  <line x1="120" y1="500" x2="200" y2="500" stroke="#00f0ff" stroke-width="2"/>
  <line x1="800" y1="500" x2="880" y2="500" stroke="#00f0ff" stroke-width="2"/>
</svg>`,
  },
  {
    id: 'cyber-monday-hud',
    name: 'Cyber Monday HUD Motion Graphic (4K/60fps)',
    description: 'High-tech Cyber Monday promotional HUD with rotating reticles, glitch typography, and animated neon laser badges.',
    category: 'hud',
    recommendedDuration: 6,
    recommendedFps: 60,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#04020a" />
      <stop offset="50%" stop-color="#0a051d" />
      <stop offset="100%" stop-color="#020108" />
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff0055" />
      <stop offset="100%" stop-color="#7928ca" />
    </linearGradient>
    <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur1" />
      <feGaussianBlur stdDeviation="25" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <style>
      @keyframes rotateClockwise { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes rotateCounter { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes glitchPulse {
        0%, 100% { filter: drop-shadow(0 0 10px #00f3ff) drop-shadow(0 0 25px #00f3ff); transform: translate(0, 0); }
        25% { transform: translate(-3px, 1px); }
        50% { filter: drop-shadow(0 0 18px #ff0055) drop-shadow(0 0 40px #ff0055); transform: translate(3px, -2px); }
        75% { transform: translate(-2px, -1px); }
      }
      @keyframes floatBadge { 0% { transform: translateY(0px); } 100% { transform: translateY(-14px); } }
      @keyframes radarSweep { 0% { transform: translateY(-100px); opacity: 0; } 50% { opacity: 0.7; } 100% { transform: translateY(1180px); opacity: 0; } }
      @keyframes glitchLineAnim { 0% { transform: scaleX(0.2) translateX(-200px); opacity: 0.2; } 50% { transform: scaleX(1) translateX(0px); opacity: 0.9; } 100% { transform: scaleX(0.3) translateX(200px); opacity: 0.2; } }
      .hud-ring-1 { transform-origin: 960px 540px; animation: rotateClockwise 12s linear infinite; }
      .hud-ring-2 { transform-origin: 960px 540px; animation: rotateCounter 8s linear infinite; }
      .main-title { font-family: 'Montserrat', 'Arial Black', sans-serif; font-size: 110px; font-weight: 900; fill: #ffffff; letter-spacing: 14px; text-anchor: middle; animation: glitchPulse 1.2s ease-in-out infinite alternate; }
      .badge-container { animation: floatBadge 1.4s ease-in-out infinite alternate; }
      .glitch-bar { animation: glitchLineAnim 2s ease-in-out infinite alternate; }
      .scan-beam { animation: radarSweep 3.5s linear infinite; }
      .hud-label { font-family: 'Courier New', monospace; font-size: 14px; letter-spacing: 4px; fill: #00f3ff; opacity: 0.7; }
    </style>
  </defs>
  <rect width="1920" height="1080" fill="url(#bgGrad)" />
  <g stroke="rgba(0, 243, 255, 0.08)" stroke-width="1">
    <line x1="0" y1="270" x2="1920" y2="270" /><line x1="0" y1="540" x2="1920" y2="540" /><line x1="0" y1="810" x2="1920" y2="810" />
    <line x1="384" y1="0" x2="384" y2="1080" /><line x1="768" y1="0" x2="768" y2="1080" /><line x1="1152" y1="0" x2="1152" y2="1080" /><line x1="1536" y1="0" x2="1536" y2="1080" />
  </g>
  <circle cx="960" cy="520" r="320" fill="none" stroke="#00f3ff" stroke-width="2" stroke-dasharray="25 15" opacity="0.3" class="hud-ring-1" />
  <circle cx="960" cy="520" r="280" fill="none" stroke="#ff0055" stroke-width="2.5" stroke-dasharray="40 30 10 30" opacity="0.4" class="hud-ring-2" />
  <circle cx="960" cy="520" r="350" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" stroke-dasharray="6 12" />
  <g stroke="#00f3ff" stroke-width="2" fill="none" opacity="0.6">
    <path d="M 60 120 L 60 60 L 120 60" /><path d="M 1860 120 L 1860 60 L 1800 60" /><path d="M 60 960 L 60 1020 L 120 1020" /><path d="M 1860 960 L 1860 1020 L 1800 1020" />
  </g>
  <text x="80" y="90" class="hud-label">SYS.STATUS // ONLINE</text>
  <text x="1600" y="90" class="hud-label">RES // 3840x2160 UHD</text>
  <text x="80" y="1000" class="hud-label">EVENT // BLACKOUT</text>
  <text x="1680" y="1000" class="hud-label">CODE // CM-2026</text>
  <rect x="760" y="415" width="400" height="3" fill="#ff0055" opacity="0.8" class="glitch-bar" />
  <rect x="680" y="555" width="560" height="2" fill="#00f3ff" opacity="0.7" class="glitch-bar" />
  <text x="960" y="405" font-family="'Courier New', monospace" font-size="24" font-weight="700" fill="#00f3ff" letter-spacing="10" text-anchor="middle">[ LIMITED TIME DEALS EVENT ]</text>
  <text x="960" y="515" class="main-title">CYBER MONDAY</text>
  <g class="badge-container">
    <rect x="700" y="590" width="520" height="84" rx="42" fill="url(#badgeGrad)" filter="url(#neonGlow)" />
    <text x="960" y="646" font-family="'Arial Black', sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="4" text-anchor="middle">SAVE UP TO 80% OFF</text>
  </g>
  <rect x="0" y="0" width="1920" height="3" fill="#00f3ff" opacity="0.6" class="scan-beam" />
</svg>`,
  },
  {
    id: 'morphing-waves',
    name: 'Morphing Quantum Waves',
    description: 'Multi-layer undulating Sine waves with dynamic neon gradient shifts and harmonic motion.',
    category: 'abstract',
    recommendedDuration: 6,
    recommendedFps: 60,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4facfe"/>
      <stop offset="100%" stop-color="#00f2fe"/>
    </linearGradient>
    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff0844"/>
      <stop offset="100%" stop-color="#ffb199"/>
    </linearGradient>
    <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6a11cb"/>
      <stop offset="100%" stop-color="#2575fc"/>
    </linearGradient>
    <filter id="waveGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    @keyframes floatY1 {
      0%, 100% { transform: translateY(0px) scaleY(1); }
      50% { transform: translateY(-40px) scaleY(1.15); }
    }
    @keyframes floatY2 {
      0%, 100% { transform: translateY(0px) scaleY(1); }
      50% { transform: translateY(50px) scaleY(0.9); }
    }
    @keyframes floatY3 {
      0%, 100% { transform: translateY(-20px) scaleY(1); }
      50% { transform: translateY(30px) scaleY(1.2); }
    }

    .wave1 {
      transform-origin: 600px 400px;
      animation: floatY1 5s ease-in-out infinite;
    }
    .wave2 {
      transform-origin: 600px 450px;
      animation: floatY2 7s ease-in-out infinite;
    }
    .wave3 {
      transform-origin: 600px 350px;
      animation: floatY3 6s ease-in-out infinite;
    }
  </style>

  <!-- Background Wave 3 -->
  <path class="wave3" d="M0,350 C300,200 450,500 750,350 C950,250 1050,450 1200,350 L1200,800 L0,800 Z" 
        fill="url(#waveGrad3)" opacity="0.35" filter="url(#waveGlow)"/>

  <!-- Middle Wave 2 -->
  <path class="wave2" d="M0,420 C250,550 500,300 800,450 C1000,550 1100,320 1200,420 L1200,800 L0,800 Z" 
        fill="url(#waveGrad2)" opacity="0.45" filter="url(#waveGlow)"/>

  <!-- Foreground Wave 1 -->
  <path class="wave1" d="M0,480 C200,380 400,600 650,480 C900,360 1050,580 1200,480 L1200,800 L0,800 Z" 
        fill="url(#waveGrad1)" opacity="0.65" filter="url(#waveGlow)"/>
</svg>`,
  },
  {
    id: 'hud-radar',
    name: 'Futuristic HUD Radar Target',
    description: 'Rotating radar scanner sweep with pulsing targeting reticles and telemetry dials.',
    category: 'hud',
    recommendedDuration: 5,
    recommendedFps: 60,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ff66" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="#00ff66" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#00ff66" stop-opacity="0"/>
    </linearGradient>
    <filter id="radarGlow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    @keyframes radarSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pingTarget {
      0% { r: 10px; opacity: 1; }
      100% { r: 60px; opacity: 0; }
    }
    @keyframes blinkText {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 0.3; }
    }

    .radar-sweep {
      transform-origin: 500px 500px;
      animation: radarSpin 4s linear infinite;
    }
    .target-ping {
      animation: pingTarget 2s ease-out infinite;
    }
    .hud-text {
      font-family: monospace;
      font-size: 16px;
      fill: #00ff66;
      animation: blinkText 2s ease-in-out infinite;
    }
  </style>

  <!-- Range concentric circles -->
  <circle cx="500" cy="500" r="420" fill="none" stroke="#00ff66" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.3"/>
  <circle cx="500" cy="500" r="320" fill="none" stroke="#00ff66" stroke-width="2" opacity="0.5"/>
  <circle cx="500" cy="500" r="220" fill="none" stroke="#00ff66" stroke-width="1.5" stroke-dasharray="10 5" opacity="0.4"/>
  <circle cx="500" cy="500" r="100" fill="none" stroke="#00ff66" stroke-width="2" opacity="0.7"/>

  <!-- Cross lines -->
  <line x1="80" y1="500" x2="920" y2="500" stroke="#00ff66" stroke-width="1.5" opacity="0.4"/>
  <line x1="500" y1="800" x2="500" y2="200" stroke="#00ff66" stroke-width="1.5" opacity="0.4"/>

  <!-- Rotating Sweep Cone -->
  <g class="radar-sweep">
    <path d="M500,500 L500,80 A420,420 0 0,1 820,260 Z" fill="url(#sweepGrad)"/>
    <line x1="500" y1="500" x2="820" y2="260" stroke="#00ff66" stroke-width="3" filter="url(#radarGlow)"/>
  </g>

  <!-- Tracked Target Blip -->
  <circle cx="680" cy="380" r="8" fill="#ff3333"/>
  <circle cx="680" cy="380" class="target-ping" fill="none" stroke="#ff3333" stroke-width="2"/>
  <text x="700" y="385" font-family="monospace" font-size="14" fill="#ff3333" font-weight="bold">TARGET_01 [LOCK]</text>

  <!-- Telemetry readout -->
  <text x="100" y="120" class="hud-text">SYS.STATUS: OPERATIONAL</text>
  <text x="100" y="150" class="hud-text">FREQ: 9.42 GHz // SCAN_RATE: 60FPS</text>
  <text x="100" y="180" class="hud-text">RESOLUTION: 3840x2160 UHD</text>
</svg>`,
  },
  {
    id: 'solar-orbit',
    name: 'Solar System Planetary Orbit',
    description: 'Accurate SMIL & CSS synchronized multi-body orbital mechanics around a radiant star.',
    category: 'abstract',
    recommendedDuration: 8,
    recommendedFps: 60,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#ffb703"/>
      <stop offset="70%" stop-color="#fb8500"/>
      <stop offset="100%" stop-color="#fb8500" stop-opacity="0"/>
    </radialGradient>
    <filter id="starGlow">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <style>
    @keyframes orbit1 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes orbit2 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes orbit3 {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .orbit-track-1 {
      transform-origin: 500px 500px;
      animation: orbit1 3s linear infinite;
    }
    .orbit-track-2 {
      transform-origin: 500px 500px;
      animation: orbit2 6s linear infinite;
    }
    .orbit-track-3 {
      transform-origin: 500px 500px;
      animation: orbit3 10s linear infinite;
    }
  </style>

  <!-- Orbital Ellipses -->
  <circle cx="500" cy="500" r="160" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="500" cy="500" r="280" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 4"/>
  <circle cx="500" cy="500" r="410" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="8 6"/>

  <!-- Sun Core -->
  <circle cx="500" cy="500" r="90" fill="url(#sunGrad)" filter="url(#starGlow)"/>
  <circle cx="500" cy="500" r="50" fill="#ffd166"/>

  <!-- Planet 1 (Inner Swift) -->
  <g class="orbit-track-1">
    <circle cx="660" cy="500" r="14" fill="#06d6a0"/>
    <circle cx="660" cy="500" r="18" fill="none" stroke="#06d6a0" stroke-width="1" opacity="0.6"/>
  </g>

  <!-- Planet 2 (Sapphire with Moon) -->
  <g class="orbit-track-2">
    <circle cx="500" cy="220" r="22" fill="#118ab2"/>
    <circle cx="500" cy="190" r="6" fill="#e2e8f0"/>
  </g>

  <!-- Planet 3 (Outer Gas Giant with Ring) -->
  <g class="orbit-track-3">
    <ellipse cx="140" cy="500" rx="36" ry="12" fill="none" stroke="#f72585" stroke-width="3" transform="rotate(-25 140 500)"/>
    <circle cx="140" cy="500" r="28" fill="#7209b7"/>
  </g>
</svg>`,
  },
  {
    id: 'static-emblem',
    name: 'Static Vector Masterpiece',
    description: 'High-precision geometric vector crest with intricate facets, testing instant static 4K MP4 export.',
    category: 'static',
    recommendedDuration: 3,
    recommendedFps: 30,
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd700"/>
      <stop offset="50%" stop-color="#ffae00"/>
      <stop offset="100%" stop-color="#d47a00"/>
    </linearGradient>
    <linearGradient id="platinumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <filter id="shadow4k" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Shield -->
  <g filter="url(#shadow4k)">
    <polygon points="500,100 850,250 850,600 500,900 150,600 150,250" 
             fill="#0f172a" stroke="url(#goldGrad)" stroke-width="12"/>

    <!-- Inner Geometrical Facets -->
    <polygon points="500,160 800,280 800,580 500,840 200,580 200,280" 
             fill="#1e293b" stroke="url(#platinumGrad)" stroke-width="4"/>

    <!-- Sacred Geometry Star -->
    <g transform="translate(500, 480)">
      <polygon points="0,-180 127,-127 180,0 127,127 0,180 -127,127 -180,0 -127,-127" 
               fill="none" stroke="url(#goldGrad)" stroke-width="6"/>
      <polygon points="0,-180 155,-90 155,90 0,180 -155,90 -155,-90" 
               fill="none" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="0" cy="0" r="70" fill="url(#goldGrad)"/>
      <circle cx="0" cy="0" r="30" fill="#0f172a"/>
    </g>

    <text x="500" y="780" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" 
          font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="8">
      TRUE 4K RESOLUTION
    </text>
  </g>
</svg>`,
  },
];
