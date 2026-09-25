import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const CHAMBERS = [
  {
    id: "gate",
    name: "The Imperial Gate",
    subtitle: "Threshold to India's Heritage Flavors",
    targetZ: 24,
    lightColor: 0xff7b25,
    tag: "PORTAL I",
    desc: "Ancient carved pillars illuminated by saffron embers",
  },
  {
    id: "spices",
    name: "The Royal Spice Vault",
    subtitle: "Cardamom, Saffron & Tellicherry Pepper",
    targetZ: 4,
    lightColor: 0xf59e0b,
    tag: "PORTAL II",
    desc: "Floating aromatics curated from 14 Indian states",
  },
  {
    id: "hearth",
    name: "The Sacred Flame & Tandoor",
    subtitle: "900° Dum Pukht & Clay Oven Sanctum",
    targetZ: -16,
    lightColor: 0xef4444,
    tag: "PORTAL III",
    desc: "Live thermal roasting of ancestral marinades",
  },
  {
    id: "banquet",
    name: "The Royal Banquet Corridor",
    subtitle: "27 Living Culinary Institutions",
    targetZ: -38,
    lightColor: 0x10b981,
    tag: "PORTAL IV",
    desc: "Direct express dispatch to your coordinates",
  },
];

const CulinarySanctumWorld = ({ onExploreKitchens }) => {
  const mountRef = useRef(null);
  const [activeChamberIndex, setActiveChamberIndex] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef(null);
  const audioIntervalRef = useRef(null);

  // References for animation state
  const stateRef = useRef({
    targetZ: CHAMBERS[0].targetZ,
    currentZ: CHAMBERS[0].targetZ,
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0,
    targetRotY: 0,
  });

  // Handle Chamber Navigation
  const selectChamber = (index) => {
    setActiveChamberIndex(index);
    stateRef.current.targetZ = CHAMBERS[index].targetZ;
  };

  const advanceChamber = () => {
    const nextIdx = (activeChamberIndex + 1) % CHAMBERS.length;
    selectChamber(nextIdx);
  };

  // Ambient Hearth Sound Synthesizer via Web Audio API
  const toggleAudio = useCallback(() => {
    if (isAudioActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Create warm low hearth rumble
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(260, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        // Random subtle hearth crackle
        audioIntervalRef.current = setInterval(() => {
          if (!audioCtxRef.current) return;
          try {
            const osc = audioCtxRef.current.createOscillator();
            const crackleGain = audioCtxRef.current.createGain();
            osc.frequency.setValueAtTime(800 + Math.random() * 1200, audioCtxRef.current.currentTime);
            crackleGain.gain.setValueAtTime(0.012, audioCtxRef.current.currentTime);
            crackleGain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.04);
            osc.connect(crackleGain);
            crackleGain.connect(audioCtxRef.current.destination);
            osc.start();
            osc.stop(audioCtxRef.current.currentTime + 0.05);
          } catch (_) {}
        }, 320);

        setIsAudioActive(true);
      } catch (err) {
        console.warn("Audio Context init blocked:", err);
      }
    }
  }, [isAudioActive]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, []);

  // Three.js 3D Architectural Scene Construction
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.024);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 150);
    camera.position.set(0, 1.8, stateRef.current.currentZ);

    // 2. WebGL Renderer with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Dynamic Ambient & Colonnade Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.45);
    scene.add(ambientLight);

    const heroTorch = new THREE.PointLight(0xff6b35, 3.5, 38, 1.6);
    heroTorch.position.set(0, 3.5, camera.position.z - 2);
    scene.add(heroTorch);

    const cyanAccent = new THREE.PointLight(0xec4899, 2.0, 45, 1.8);
    cyanAccent.position.set(0, 5, -28);
    scene.add(cyanAccent);

    // 4. Grand Architectural Colonnade & Pillars
    const colonnadeGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.35, 0.45, 8, 16);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      metalness: 0.8,
      roughness: 0.25,
    });

    const capitalGeo = new THREE.BoxGeometry(1.2, 0.35, 1.2);
    const capitalMat = new THREE.MeshStandardMaterial({
      color: 0x222a3f,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x181008,
    });

    // Archway curves spanning across pillars
    const archRadius = 6.2;
    const archTube = 0.14;
    const archGeo = new THREE.TorusGeometry(archRadius, archTube, 12, 32, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xff8c3b,
      emissive: 0xff5a1f,
      emissiveIntensity: 0.45,
      metalness: 0.8,
      roughness: 0.2,
    });

    const numArches = 8;
    const archSpacing = 9;

    for (let i = 0; i < numArches; i++) {
      const zPos = 20 - i * archSpacing;

      // Left Pillar
      const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
      leftPillar.position.set(-archRadius, 4, zPos);
      colonnadeGroup.add(leftPillar);

      const leftCap = new THREE.Mesh(capitalGeo, capitalMat);
      leftCap.position.set(-archRadius, 8.1, zPos);
      colonnadeGroup.add(leftCap);

      // Right Pillar
      const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      rightPillar.position.set(archRadius, 4, zPos);
      colonnadeGroup.add(rightPillar);

      const rightCap = new THREE.Mesh(capitalGeo, capitalMat);
      rightCap.position.set(archRadius, 8.1, zPos);
      colonnadeGroup.add(rightCap);

      // Span Arch
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 8.1, zPos);
      colonnadeGroup.add(arch);

      // Warm Colonnade Lanterns
      const lanternGeo = new THREE.OctahedronGeometry(0.28, 0);
      const lanternMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffb703 : 0xfb8500,
      });
      const lanternLeft = new THREE.Mesh(lanternGeo, lanternMat);
      lanternLeft.position.set(-archRadius + 0.9, 5.5, zPos);
      colonnadeGroup.add(lanternLeft);

      const lanternRight = new THREE.Mesh(lanternGeo, lanternMat);
      lanternRight.position.set(archRadius - 0.9, 5.5, zPos);
      colonnadeGroup.add(lanternRight);

      // Lantern glow lights
      if (i % 2 === 0) {
        const pLight = new THREE.PointLight(0xffa200, 1.2, 14, 2);
        pLight.position.set(0, 6, zPos);
        colonnadeGroup.add(pLight);
      }
    }
    scene.add(colonnadeGroup);

    // 5. Glossy Reflective Obsidian Floor with Perspective Grid
    const floorGeo = new THREE.PlaneGeometry(36, 120, 24, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      metalness: 0.92,
      roughness: 0.12,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -20);
    scene.add(floor);

    // Grid wireframe over floor for high-tech Kage aesthetic
    const gridHelper = new THREE.GridHelper(90, 45, 0xff7b25, 0x1f2937);
    gridHelper.position.set(0, 0.02, -20);
    scene.add(gridHelper);

    // 6. Floating 3D Culinary Embers & Golden Spice Particles
    const particleCount = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);

    const emberPalette = [
      new THREE.Color(0xff6b35), // Saffron Fire
      new THREE.Color(0xf59e0b), // Amber Gold
      new THREE.Color(0xffd166), // Star Anise Gold
      new THREE.Color(0xef4444), // Kashmiri Chili
      new THREE.Color(0x10b981), // Fresh Curry Leaf Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 16;
      pPositions[i * 3 + 1] = Math.random() * 9 + 0.3;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

      const col = emberPalette[Math.floor(Math.random() * emberPalette.length)];
      pColors[i * 3] = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;

      pSpeeds[i] = 0.02 + Math.random() * 0.04;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const emberSystem = new THREE.Points(pGeo, pMat);
    scene.add(emberSystem);

    // 7. Mouse Gyro / Parallax Event Listeners
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      stateRef.current.mouseX = normX;
      stateRef.current.mouseY = normY;
      stateRef.current.targetRotY = -normX * 0.18;
      stateRef.current.targetRotX = -normY * 0.12;
    };

    container.addEventListener("mousemove", onMouseMove);

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 8. Animation Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Z lerp towards active chamber
      stateRef.current.currentZ +=
        (stateRef.current.targetZ - stateRef.current.currentZ) * 0.045;
      camera.position.z = stateRef.current.currentZ;

      // Mouse Parallax lerp
      camera.rotation.y += (stateRef.current.targetRotY - camera.rotation.y) * 0.05;
      camera.rotation.x += (stateRef.current.targetRotX - camera.rotation.x) * 0.05;

      // Subtle breath sway
      camera.position.y = 1.8 + Math.sin(elapsed * 1.2) * 0.08;

      // Torch flicker
      heroTorch.position.z = camera.position.z - 3;
      heroTorch.intensity = 3.2 + Math.sin(elapsed * 9.5) * 0.45;

      // Animate Embers & Spice particles
      const positions = emberSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Drift along Z
        positions[i * 3 + 2] += pSpeeds[i];
        if (positions[i * 3 + 2] > camera.position.z + 10) {
          positions[i * 3 + 2] = camera.position.z - 60;
        }

        // Slight swirl
        positions[i * 3] += Math.sin(elapsed + i) * 0.006;
        positions[i * 3 + 1] += Math.cos(elapsed * 1.5 + i) * 0.005;
      }
      emberSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      if (container) {
        container.removeEventListener("mousemove", onMouseMove);
      }
      renderer.dispose();
      pillarGeo.dispose();
      pillarMat.dispose();
      capitalGeo.dispose();
      capitalMat.dispose();
      archGeo.dispose();
      archMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentChamber = CHAMBERS[activeChamberIndex];

  return (
    <div className="kage-sanctum-wrapper" ref={mountRef}>
      {/* Glossy Telemetry Overlay Bar */}
      <div className="kage-hud-top">
        <div className="kage-live-chip">
          <span className="kage-pulse-orb" />
          <span className="font-mono text-warning font-weight-bold">{currentChamber.tag}</span>
          <span className="kage-divider">/</span>
          <span className="font-mono text-white text-uppercase">{currentChamber.name}</span>
        </div>

        <div className="kage-hud-actions">
          <button
            type="button"
            className={`kage-sound-btn ${isAudioActive ? "active" : ""}`}
            onClick={toggleAudio}
            title={isAudioActive ? "Mute Hearth Ambience" : "Enable 3D Hearth Ambience"}
          >
            {isAudioActive ? "🔊 AMBIANCE ON" : "🔈 HEARTH AUDIO"}
          </button>
        </div>
      </div>

      {/* Cinematic Center Chamber Info */}
      <div className="kage-center-card">
        <span className="kage-badge-glow">CULINARY SANCTUM • 3D ARCHITECTURAL JOURNEY</span>
        <h2 className="kage-chamber-title">{currentChamber.name}</h2>
        <p className="kage-chamber-subtitle">{currentChamber.subtitle}</p>
        <p className="kage-chamber-desc">{currentChamber.desc}</p>

        {/* Step Inside / Advance Sanctum CTA */}
        <div className="kage-cta-row">
          <button
            type="button"
            className="kage-enter-btn"
            onClick={advanceChamber}
          >
            <span>Step Deeper Into Sanctum</span>
            <span className="kage-arrow-glide">→</span>
          </button>

          {onExploreKitchens && (
            <button
              type="button"
              className="kage-discover-btn"
              onClick={onExploreKitchens}
            >
              <span>Explore 27 Iconic Kitchens</span>
              <span className="kage-btn-sparkle">✨</span>
            </button>
          )}
        </div>
      </div>

      {/* Chamber Selector Tabs Bottom Rail */}
      <div className="kage-bottom-rail">
        <div className="kage-rail-label font-mono">SANCTUM GATES:</div>
        <div className="kage-portals-scroll">
          {CHAMBERS.map((chamber, idx) => (
            <button
              key={chamber.id}
              type="button"
              className={`kage-portal-tab ${activeChamberIndex === idx ? "active" : ""}`}
              onClick={() => selectChamber(idx)}
            >
              <span className="portal-num font-mono">{idx + 1}</span>
              <span className="portal-title">{chamber.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CulinarySanctumWorld;
