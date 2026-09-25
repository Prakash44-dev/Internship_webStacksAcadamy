import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const KageCulinaryCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    // Rich deep atmospheric fog - cosmic obsidian with warm luxury ember undertones
    scene.fog = new THREE.FogExp2(0x07090e, 0.014);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 300);
    camera.position.set(0, 2.2, 30);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 3. Dynamic Lighting System - Calibrated to Luxury Palette
    const ambientLight = new THREE.AmbientLight(0xfff2db, 0.45);
    scene.add(ambientLight);

    // Hero Torch light following camera (#F62440 Flame)
    const heroTorch = new THREE.PointLight(0xf62440, 4.2, 45, 1.4);
    heroTorch.position.set(0, 4, camera.position.z - 2);
    scene.add(heroTorch);

    // Champagne (#FFE5BF) backlight accent
    const moonAccent = new THREE.DirectionalLight(0xffe5bf, 0.55);
    moonAccent.position.set(-15, 30, -50);
    scene.add(moonAccent);

    // Sacred Hearth deep crimson-flame light in the distance (#F62440)
    const hearthCoreLight = new THREE.PointLight(0xf62440, 5.5, 75, 1.6);
    hearthCoreLight.position.set(0, 6, -95);
    scene.add(hearthCoreLight);

    // 4. The Celestial Vermilion Moon in the Distance (#F62440)
    const moonGeo = new THREE.SphereGeometry(7.5, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xf62440,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(16, 26, -150);
    scene.add(moon);

    // Moon Glow Corona Halo (#FFE5BF Champagne Apricot)
    const moonHaloGeo = new THREE.RingGeometry(7.6, 14.8, 32);
    const moonHaloMat = new THREE.MeshBasicMaterial({
      color: 0xffe5bf,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const moonHalo = new THREE.Mesh(moonHaloGeo, moonHaloMat);
    moonHalo.position.copy(moon.position);
    moonHalo.position.z += 0.1;
    scene.add(moonHalo);

    // 5. Procedural Architectural Colonnade & Torii Arches
    const colonnadeGroup = new THREE.Group();

    const pillarGeo = new THREE.CylinderGeometry(0.42, 0.55, 9, 16);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x0f1422,
      metalness: 0.85,
      roughness: 0.2,
    });

    const capitalGeo = new THREE.BoxGeometry(1.4, 0.4, 1.4);
    const capitalMat = new THREE.MeshStandardMaterial({
      color: 0x1b233a,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x221308,
    });

    // Golden Curved Spanning Arches (#FFE5BF Champagne Silk with #F62440 Emissive)
    const archRadius = 7.2;
    const archGeo = new THREE.TorusGeometry(archRadius, 0.16, 12, 32, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xffe5bf,
      emissive: 0xf62440,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.18,
    });

    // Grand Entrance Arch (The Torii) at z = 16 (#F62440 Crimson Flame)
    const entranceArchRadius = 8.5;
    const entranceArchGeo = new THREE.TorusGeometry(entranceArchRadius, 0.28, 16, 40, Math.PI);
    const entranceArchMat = new THREE.MeshStandardMaterial({
      color: 0xf62440,
      emissive: 0xf62440,
      emissiveIntensity: 0.75,
      metalness: 0.9,
      roughness: 0.12,
    });
    const entranceArch = new THREE.Mesh(entranceArchGeo, entranceArchMat);
    entranceArch.position.set(0, 9.2, 16);
    colonnadeGroup.add(entranceArch);

    // Horizontal Torii Beam
    const beamGeo = new THREE.BoxGeometry(entranceArchRadius * 2 + 3, 0.45, 0.6);
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x2e080d,
    });
    const entranceBeam = new THREE.Mesh(beamGeo, beamMat);
    entranceBeam.position.set(0, 9.4, 16);
    colonnadeGroup.add(entranceBeam);

    // 16 Pillars along Z corridor from 16 to -170
    const numPairs = 16;
    const zStep = 12;

    for (let i = 0; i < numPairs; i++) {
      const zPos = 16 - i * zStep;

      // Left Pillar
      const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
      leftPillar.position.set(-archRadius, 4.5, zPos);
      colonnadeGroup.add(leftPillar);

      const leftCap = new THREE.Mesh(capitalGeo, capitalMat);
      leftCap.position.set(-archRadius, 9.1, zPos);
      colonnadeGroup.add(leftCap);

      // Right Pillar
      const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      rightPillar.position.set(archRadius, 4.5, zPos);
      colonnadeGroup.add(rightPillar);

      const rightCap = new THREE.Mesh(capitalGeo, capitalMat);
      rightCap.position.set(archRadius, 9.1, zPos);
      colonnadeGroup.add(rightCap);

      // Arch spanning the pair
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 9.1, zPos);
      colonnadeGroup.add(arch);

      // Hanging Brass Spice Lanterns (#F62440 and #FFE5BF)
      const lanternGeo = new THREE.OctahedronGeometry(0.32, 0);
      const lanternMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xf62440 : 0xffe5bf,
      });

      const lanternLeft = new THREE.Mesh(lanternGeo, lanternMat);
      lanternLeft.position.set(-archRadius + 1.1, 6.2, zPos);
      colonnadeGroup.add(lanternLeft);

      const lanternRight = new THREE.Mesh(lanternGeo, lanternMat);
      lanternRight.position.set(archRadius - 1.1, 6.2, zPos);
      colonnadeGroup.add(lanternRight);

      // Warm point light per 2 arches (#FFE5BF Champagne warmth)
      if (i % 2 === 0) {
        const lanternLight = new THREE.PointLight(0xffe5bf, 1.3, 18, 1.8);
        lanternLight.position.set(0, 6.8, zPos);
        colonnadeGroup.add(lanternLight);
      }
    }
    scene.add(colonnadeGroup);

    // 6. Wet Reflective Obsidian Floor with Perspective Lines
    const floorGeo = new THREE.PlaneGeometry(48, 260, 32, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      metalness: 0.94,
      roughness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -60);
    scene.add(floor);

    // Perspective floor lines (Kage / Cyber grid)
    const gridHelper = new THREE.GridHelper(160, 60, 0xf62440, 0x182035);
    gridHelper.position.set(0, 0.03, -60);
    scene.add(gridHelper);

    // 7. 700 Floating 3D Embers, Golden Spice Dust & Saffron Sparks
    const particleCount = 700;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount);
    const pDrifts = new Float32Array(particleCount);

    const emberColors = [
      new THREE.Color(0xf62440), // Vermilion Crimson Flame
      new THREE.Color(0xffe5bf), // Golden Champagne Silk
      new THREE.Color(0xfff2db), // Warm Almond Cream
      new THREE.Color(0xfffaf3), // Pure Pearl Ivory Spark
      new THREE.Color(0xf62440), // Second Crimson Spark
    ];

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 22;
      pPositions[i * 3 + 1] = Math.random() * 11 + 0.2;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 160 - 20;

      const c = emberColors[Math.floor(Math.random() * emberColors.length)];
      pColors[i * 3] = c.r;
      pColors[i * 3 + 1] = c.g;
      pColors[i * 3 + 2] = c.b;

      pSpeeds[i] = 0.02 + Math.random() * 0.05;
      pDrifts[i] = (Math.random() - 0.5) * 0.015;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const emberCloud = new THREE.Points(pGeo, pMat);
    scene.add(emberCloud);

    // 8. Scroll & Mouse Tracking State
    const state = {
      scrollProgress: 0,
      targetCameraZ: 28,
      currentCameraZ: 28,
      mouseX: 0,
      mouseY: 0,
      targetRotY: 0,
      targetRotX: 0,
      scrollVelocity: 0,
      lastScrollY: window.scrollY || 0,
    };

    // Calculate Scroll Progress across the entire document
    const updateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const frac = Math.min(1, Math.max(0, scrollY / maxScroll));
      state.scrollProgress = frac;

      // Scroll velocity for camera acceleration tilt
      state.scrollVelocity = scrollY - state.lastScrollY;
      state.lastScrollY = scrollY;

      // Camera Z positions mapped to scroll chapters:
      // 0% -> 28 (Outside entrance, admiring the Grand Torii & Moon)
      // 25% -> 4 (Passing beneath the Imperial Arch)
      // 50% -> -35 (Walking through the lantern colonnade)
      // 75% -> -75 (Entering the Sacred Flame Hearth)
      // 100% -> -130 (Arriving at the Grand Royal Feast)
      state.targetCameraZ = 28 - frac * 158;
    };

    const onMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      state.mouseX = normX;
      state.mouseY = normY;
      state.targetRotY = -normX * 0.16;
      state.targetRotX = -normY * 0.11;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateScroll();
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);
    updateScroll();

    // 9. Continuous Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera position Z lerp
      state.currentCameraZ += (state.targetCameraZ - state.currentCameraZ) * 0.055;
      camera.position.z = state.currentCameraZ;

      // Camera breathing sway
      camera.position.y = 2.2 + Math.sin(elapsed * 1.1) * 0.09;

      // Camera rotation parallax lerp
      const velTilt = Math.max(-0.15, Math.min(0.15, state.scrollVelocity * 0.0006));
      camera.rotation.y += (state.targetRotY - camera.rotation.y) * 0.05;
      camera.rotation.x += (state.targetRotX + velTilt - camera.rotation.x) * 0.05;

      // Torch follows camera with flicker
      heroTorch.position.z = camera.position.z - 2;
      heroTorch.intensity = 3.6 + Math.sin(elapsed * 10) * 0.4;

      // Hearth Core pulse in the distance
      hearthCoreLight.intensity = 4.5 + Math.sin(elapsed * 5) * 1.2;

      // Animate floating embers
      const positions = emberCloud.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += pSpeeds[i];
        if (positions[i * 3 + 2] > camera.position.z + 10) {
          positions[i * 3 + 2] = camera.position.z - 80;
        }

        // Mouse swirl interaction
        positions[i * 3] += pDrifts[i] + Math.sin(elapsed + i) * 0.006 + state.mouseX * 0.008;
        positions[i * 3 + 1] += Math.cos(elapsed * 1.4 + i) * 0.005;
      }
      emberCloud.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pillarGeo.dispose();
      pillarMat.dispose();
      capitalGeo.dispose();
      capitalMat.dispose();
      archGeo.dispose();
      archMat.dispose();
      entranceArchGeo.dispose();
      entranceArchMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      moonHaloGeo.dispose();
      moonHaloMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="kage-full-gl-container" ref={mountRef} />;
};

export default KageCulinaryCanvas;
