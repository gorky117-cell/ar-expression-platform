/**
 * WearWave 3D AR Models Engine (Three.js)
 * 
 * 4 Dedicated 3D Holographic Models:
 * 1. 🦋 3D Cosmic Butterfly (Flapping wings & glowing neon veins)
 * 2. ⛵ 3D Cyber Sailboat (Gently rocking on virtual waves)
 * 3. 🐉 3D Low-Poly Dragon (Gliding 3D flight loop)
 * 4. 🦅 3D Spirit Birds (Circling above the shirt)
 */

export const MODELS_3D = [
  {
    id: 'butterfly',
    name: '3D Cosmic Butterfly',
    emoji: '🦋',
    tagline: 'Flapping wings & glowing neon veins',
    desc: 'Dual articulated wings with glowing neon cyan/magenta veins and stardust particles.',
    defaultMood: 'inspired',
    defaultColor: '#00f0ff',
  },
  {
    id: 'sailboat',
    name: '3D Cyber Sailboat',
    emoji: '⛵',
    tagline: 'Gently rocking on virtual waves',
    desc: 'Futuristic yacht with glowing holographic sails cruising over pulsing neon wave rings.',
    defaultMood: 'calm',
    defaultColor: '#10b981',
  },
  {
    id: 'dragon',
    name: '3D Low-Poly Dragon',
    emoji: '🐉',
    tagline: 'Gliding 3D flight loop',
    desc: 'Faceted serpentine cyber dragon with glowing horns, eyes, and undulating flight motion.',
    defaultMood: 'happy',
    defaultColor: '#f59e0b',
  },
  {
    id: 'birds',
    name: '3D Spirit Birds',
    emoji: '🦅',
    tagline: 'Circling above the shirt',
    desc: 'Flock of luminous spirit birds banking and soaring in an orbital flight path.',
    defaultMood: 'peaceful',
    defaultColor: '#6366f1',
  },
];

/**
 * Creates and returns a dynamic 3D Model Group with real-time update() hook.
 * @param {string} modelId - 'butterfly' | 'sailboat' | 'dragon' | 'birds'
 * @param {string} moodColor - Hex color (e.g. '#00f0ff')
 * @param {object} THREE - Three.js namespace
 */
export function create3DModelGroup(modelId, moodColor = '#00f0ff', THREE) {
  const root = new THREE.Group();
  root.name = `model_root_${modelId}`;

  const materialsToUpdate = [];
  const primaryColor = new THREE.Color(moodColor);

  function registerEmissiveMat(mat) {
    materialsToUpdate.push(mat);
    return mat;
  }

  // -------------------------------------------------------------
  // 1. 🦋 3D COSMIC BUTTERFLY
  // -------------------------------------------------------------
  if (modelId === 'butterfly') {
    const butterflyGroup = new THREE.Group();
    butterflyGroup.position.set(0, 0, 0.05);

    // Body (Thorax & Abdomen)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x121420,
      metalness: 0.85,
      roughness: 0.25,
      flatShading: true,
    });
    
    // Thorax
    const thorax = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.16, 12), bodyMat);
    thorax.rotation.x = Math.PI / 2;
    butterflyGroup.add(thorax);

    // Abdomen (Tapered segments)
    const abdomen = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.32, 12), bodyMat);
    abdomen.position.set(0, -0.22, 0);
    abdomen.rotation.z = Math.PI;
    butterflyGroup.add(abdomen);

    // Head & Glowing Eyes
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), bodyMat);
    head.position.set(0, 0.11, 0.01);
    butterflyGroup.add(head);

    const eyeMat = registerEmissiveMat(new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    }));
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeMat);
    eyeL.position.set(-0.022, 0.13, 0.025);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeMat);
    eyeR.position.set(0.022, 0.13, 0.025);
    butterflyGroup.add(eyeL, eyeR);

    // Antennae
    const antMat = registerEmissiveMat(new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 0.9,
    }));
    const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.14, 6), antMat);
    antL.position.set(-0.035, 0.21, 0.04);
    antL.rotation.z = 0.35;
    antL.rotation.x = 0.2;
    const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.14, 6), antMat);
    antR.position.set(0.035, 0.21, 0.04);
    antR.rotation.z = -0.35;
    antR.rotation.x = 0.2;
    butterflyGroup.add(antL, antR);

    // Wing Helper - Custom 3D Wing Shape
    function createWingShape(isForewing) {
      const shape = new THREE.Shape();
      if (isForewing) {
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.1, 0.2, 0.35, 0.45, 0.48, 0.4);
        shape.bezierCurveTo(0.55, 0.25, 0.45, 0.05, 0.3, -0.05);
        shape.bezierCurveTo(0.15, -0.1, 0.05, -0.05, 0, 0);
      } else {
        shape.moveTo(0, 0);
        shape.bezierCurveTo(0.08, -0.05, 0.28, -0.12, 0.32, -0.25);
        shape.bezierCurveTo(0.25, -0.38, 0.1, -0.35, 0.05, -0.2);
        shape.bezierCurveTo(0.02, -0.1, 0.01, -0.05, 0, 0);
      }
      return shape;
    }

    const wingMat = registerEmissiveMat(new THREE.MeshPhysicalMaterial({
      color: 0x050814,
      emissive: primaryColor,
      emissiveIntensity: 0.65,
      roughness: 0.15,
      metalness: 0.9,
      transmission: 0.3,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    }));

    // Neon Veins Line Overlay
    const veinMat = registerEmissiveMat(new THREE.LineBasicMaterial({
      color: primaryColor,
      linewidth: 2,
    }));

    function createWingVeins(isForewing) {
      const points = [];
      if (isForewing) {
        points.push(new THREE.Vector3(0, 0, 0.002), new THREE.Vector3(0.42, 0.32, 0.002));
        points.push(new THREE.Vector3(0, 0, 0.002), new THREE.Vector3(0.32, 0.18, 0.002));
        points.push(new THREE.Vector3(0, 0, 0.002), new THREE.Vector3(0.22, 0.38, 0.002));
        points.push(new THREE.Vector3(0.2, 0.15, 0.002), new THREE.Vector3(0.48, 0.12, 0.002));
      } else {
        points.push(new THREE.Vector3(0, 0, 0.002), new THREE.Vector3(0.25, -0.22, 0.002));
        points.push(new THREE.Vector3(0, 0, 0.002), new THREE.Vector3(0.12, -0.28, 0.002));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.LineSegments(geom, veinMat);
    }

    // Left Wing Pivot (Hinged at x = -0.03)
    const leftWingPivot = new THREE.Group();
    leftWingPivot.position.set(-0.035, 0, 0.01);

    const forewingGeomL = new THREE.ShapeGeometry(createWingShape(true));
    const forewingL = new THREE.Mesh(forewingGeomL, wingMat);
    forewingL.rotation.y = Math.PI; // Face outwards to the left
    forewingL.add(createWingVeins(true));

    const hindwingGeomL = new THREE.ShapeGeometry(createWingShape(false));
    const hindwingL = new THREE.Mesh(hindwingGeomL, wingMat);
    hindwingL.rotation.y = Math.PI;
    hindwingL.add(createWingVeins(false));

    leftWingPivot.add(forewingL, hindwingL);

    // Right Wing Pivot (Hinged at x = +0.03)
    const rightWingPivot = new THREE.Group();
    rightWingPivot.position.set(0.035, 0, 0.01);

    const forewingGeomR = new THREE.ShapeGeometry(createWingShape(true));
    const forewingR = new THREE.Mesh(forewingGeomR, wingMat);
    forewingR.add(createWingVeins(true));

    const hindwingGeomR = new THREE.ShapeGeometry(createWingShape(false));
    const hindwingR = new THREE.Mesh(hindwingGeomR, wingMat);
    hindwingR.add(createWingVeins(false));

    rightWingPivot.add(forewingR, hindwingR);

    butterflyGroup.add(leftWingPivot, rightWingPivot);

    // Floating Stardust Particles
    const starCount = 24;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 1.1;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3 + 0.05;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = registerEmissiveMat(new THREE.PointsMaterial({
      color: primaryColor,
      size: 0.025,
      transparent: true,
      opacity: 0.75,
    }));
    const stardust = new THREE.Points(starGeom, starMat);
    butterflyGroup.add(stardust);

    root.add(butterflyGroup);

    return {
      group: root,
      update: (time) => {
        // Wing Flap Oscillation (8 rad/s)
        const flap = Math.sin(time * 7.5) * 0.75;
        leftWingPivot.rotation.y = flap;
        rightWingPivot.rotation.y = -flap;

        // Subtle Hover & Bobbing
        butterflyGroup.position.z = 0.05 + Math.sin(time * 3.5) * 0.02;
        butterflyGroup.rotation.z = Math.sin(time * 2.0) * 0.04;
        stardust.rotation.z = time * 0.15;
      },
      setMoodColor: (hex) => {
        const col = new THREE.Color(hex);
        materialsToUpdate.forEach(m => {
          if (m.emissive) m.emissive.copy(col);
          if (m.color && m.isPointsMaterial) m.color.copy(col);
          if (m.isLineBasicMaterial) m.color.copy(col);
        });
      },
    };
  }

  // -------------------------------------------------------------
  // 2. ⛵ 3D CYBER SAILBOAT
  // -------------------------------------------------------------
  if (modelId === 'sailboat') {
    const sailboatGroup = new THREE.Group();
    sailboatGroup.position.set(0, -0.05, 0.06);

    // Sleek Faceted Cyber Hull
    const hullGeom = new THREE.BufferGeometry();
    const hullVerts = new Float32Array([
      // Bow Deck
      0, 0.04, 0.45,   -0.14, 0.06, 0.0,   0.14, 0.06, 0.0,
      // Mid Deck
      -0.14, 0.06, 0.0,  -0.12, 0.05, -0.35,  0.12, 0.05, -0.35,
      -0.14, 0.06, 0.0,   0.12, 0.05, -0.35,  0.14, 0.06, 0.0,
      // Port Side Bow
      0, 0.04, 0.45,    0, -0.08, 0.1,    -0.14, 0.06, 0.0,
      // Starboard Side Bow
      0, 0.04, 0.45,    0.14, 0.06, 0.0,    0, -0.08, 0.1,
      // Port Keel
      -0.14, 0.06, 0.0,   0, -0.08, 0.1,   -0.12, 0.05, -0.35,
      // Starboard Keel
      0.14, 0.06, 0.0,   0.12, 0.05, -0.35,   0, -0.08, 0.1,
      // Transom (Stern)
      -0.12, 0.05, -0.35,  0, -0.06, -0.35,   0.12, 0.05, -0.35,
    ]);
    hullGeom.setAttribute('position', new THREE.BufferAttribute(hullVerts, 3));
    hullGeom.computeVertexNormals();

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1c,
      metalness: 0.9,
      roughness: 0.2,
      flatShading: true,
    });
    const hull = new THREE.Mesh(hullGeom, hullMat);
    sailboatGroup.add(hull);

    // Glowing Cyber Waterline Trim
    const trimMat = registerEmissiveMat(new THREE.LineBasicMaterial({
      color: primaryColor,
      linewidth: 3,
    }));
    const trimPoints = [
      new THREE.Vector3(0, 0.042, 0.46),
      new THREE.Vector3(-0.145, 0.062, 0.0),
      new THREE.Vector3(-0.125, 0.052, -0.36),
      new THREE.Vector3(0.125, 0.052, -0.36),
      new THREE.Vector3(0.145, 0.062, 0.0),
      new THREE.Vector3(0, 0.042, 0.46),
    ];
    const trimGeom = new THREE.BufferGeometry().setFromPoints(trimPoints);
    sailboatGroup.add(new THREE.Line(trimGeom, trimMat));

    // Carbon Fiber Mast
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x181a24, metalness: 0.8, roughness: 0.3 });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.012, 0.72, 8), mastMat);
    mast.position.set(0, 0.40, 0.05);
    sailboatGroup.add(mast);

    // Boom
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.40, 8), mastMat);
    boom.position.set(0, 0.12, -0.15);
    boom.rotation.x = Math.PI / 2;
    sailboatGroup.add(boom);

    // Glowing Luminous Cyber Mainsail
    const sailMat = registerEmissiveMat(new THREE.MeshStandardMaterial({
      color: 0x050e18,
      emissive: primaryColor,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide,
    }));

    const mainSailGeom = new THREE.BufferGeometry();
    const mainSailVerts = new Float32Array([
      0, 0.12, 0.05,
      0, 0.70, 0.05,
      0, 0.12, -0.34,
    ]);
    mainSailGeom.setAttribute('position', new THREE.BufferAttribute(mainSailVerts, 3));
    mainSailGeom.computeVertexNormals();
    const mainSail = new THREE.Mesh(mainSailGeom, sailMat);
    sailboatGroup.add(mainSail);

    // Jib (Forward Sail)
    const jibGeom = new THREE.BufferGeometry();
    const jibVerts = new Float32Array([
      0, 0.10, 0.10,
      0, 0.58, 0.05,
      0, 0.05, 0.40,
    ]);
    jibGeom.setAttribute('position', new THREE.BufferAttribute(jibVerts, 3));
    jibGeom.computeVertexNormals();
    const jib = new THREE.Mesh(jibGeom, sailMat);
    sailboatGroup.add(jib);

    // Virtual Neon Wave Rings (Expanding on water plane)
    const waveMat = registerEmissiveMat(new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    }));
    const waveRing1 = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.28, 32), waveMat);
    waveRing1.rotation.x = -Math.PI / 2;
    waveRing1.position.set(0, -0.06, 0);

    const waveRing2 = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.48, 32), waveMat);
    waveRing2.rotation.x = -Math.PI / 2;
    waveRing2.position.set(0, -0.06, 0);

    sailboatGroup.add(waveRing1, waveRing2);
    root.add(sailboatGroup);

    return {
      group: root,
      update: (time) => {
        // Hydrodynamic Pitch (Bow dipping into waves)
        sailboatGroup.rotation.x = Math.sin(time * 2.2) * 0.09;
        // Maritime Roll / Heel (Leaning with the wind)
        sailboatGroup.rotation.z = Math.cos(time * 1.7) * 0.12;
        // Vertical Wave Heave
        sailboatGroup.position.y = -0.05 + Math.sin(time * 2.5) * 0.025;

        // Wave Rings Pulsing Expansion
        const s1 = 1.0 + (Math.sin(time * 2.5) * 0.5 + 0.5) * 0.35;
        waveRing1.scale.set(s1, s1, 1);
        const s2 = 1.0 + (Math.sin(time * 2.5 + 1.2) * 0.5 + 0.5) * 0.35;
        waveRing2.scale.set(s2, s2, 1);
      },
      setMoodColor: (hex) => {
        const col = new THREE.Color(hex);
        materialsToUpdate.forEach(m => {
          if (m.emissive) m.emissive.copy(col);
          if (m.color && !m.emissive) m.color.copy(col);
        });
      },
    };
  }

  // -------------------------------------------------------------
  // 3. 🐉 3D LOW-POLY CYBER DRAGON
  // -------------------------------------------------------------
  if (modelId === 'dragon') {
    const dragonGroup = new THREE.Group();
    dragonGroup.position.set(0, 0, 0.06);

    const dragonSkinMat = new THREE.MeshStandardMaterial({
      color: 0x140e24,
      metalness: 0.85,
      roughness: 0.3,
      flatShading: true,
    });

    const glowMat = registerEmissiveMat(new THREE.MeshStandardMaterial({
      color: primaryColor,
      emissive: primaryColor,
      emissiveIntensity: 1.6,
      roughness: 0.1,
    }));

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.18, 0.05);

    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 5), dragonSkinMat);
    snout.rotation.x = -Math.PI / 2;
    headGroup.add(snout);

    // Glowing Horns
    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.18, 4), glowMat);
    hornL.position.set(-0.035, 0.05, -0.06);
    hornL.rotation.x = -0.5;
    hornL.rotation.z = -0.3;

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.18, 4), glowMat);
    hornR.position.set(0.035, 0.05, -0.06);
    hornR.rotation.x = -0.5;
    hornR.rotation.z = 0.3;
    headGroup.add(hornL, hornR);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), glowMat);
    eyeL.position.set(-0.026, 0.03, 0.02);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), glowMat);
    eyeR.position.set(0.026, 0.03, 0.02);
    headGroup.add(eyeL, eyeR);

    dragonGroup.add(headGroup);

    // Serpentine Spine Segments
    const segments = [];
    const segCount = 6;
    for (let i = 0; i < segCount; i++) {
      const segScale = 1.0 - (i / segCount) * 0.65;
      const segMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.045 * segScale, 0), dragonSkinMat);
      segMesh.position.set(0, 0.10 - i * 0.075, 0);

      // Dorsal glowing spine crest
      const crest = new THREE.Mesh(new THREE.ConeGeometry(0.012 * segScale, 0.05 * segScale, 4), glowMat);
      crest.position.set(0, 0, 0.045 * segScale);
      crest.rotation.x = Math.PI / 2;
      segMesh.add(crest);

      dragonGroup.add(segMesh);
      segments.push(segMesh);
    }

    // Wings
    const wingMat = registerEmissiveMat(new THREE.MeshStandardMaterial({
      color: 0x120822,
      emissive: primaryColor,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      flatShading: true,
    }));

    function createDragonWingGeom() {
      const geom = new THREE.BufferGeometry();
      const verts = new Float32Array([
        0, 0, 0,
        0.35, 0.25, 0.04,
        0.28, 0.02, 0.01,
        0, 0, 0,
        0.28, 0.02, 0.01,
        0.42, -0.15, -0.02,
        0, 0, 0,
        0.42, -0.15, -0.02,
        0.20, -0.22, -0.02,
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      geom.computeVertexNormals();
      return geom;
    }

    const wingPivotL = new THREE.Group();
    wingPivotL.position.set(-0.04, 0.08, 0.02);
    const wingL = new THREE.Mesh(createDragonWingGeom(), wingMat);
    wingL.rotation.y = Math.PI; // Extends left
    wingPivotL.add(wingL);

    const wingPivotR = new THREE.Group();
    wingPivotR.position.set(0.04, 0.08, 0.02);
    const wingR = new THREE.Mesh(createDragonWingGeom(), wingMat);
    wingPivotR.add(wingR);

    dragonGroup.add(wingPivotL, wingPivotR);
    root.add(dragonGroup);

    return {
      group: root,
      update: (time) => {
        // Wing Flap
        const flap = Math.sin(time * 5.5) * 0.65;
        wingPivotL.rotation.z = -flap;
        wingPivotR.rotation.z = flap;

        // Undulating Spine Waves
        segments.forEach((seg, idx) => {
          seg.position.x = Math.sin(time * 4.0 - idx * 0.6) * 0.035;
          seg.rotation.z = Math.cos(time * 4.0 - idx * 0.6) * 0.15;
        });

        // Head tracking
        headGroup.rotation.z = Math.sin(time * 3.5) * 0.12;

        // Hover Gliding Loop
        dragonGroup.position.x = Math.sin(time * 1.5) * 0.05;
        dragonGroup.position.y = Math.cos(time * 1.8) * 0.03;
        dragonGroup.rotation.y = Math.sin(time * 1.5) * 0.15;
      },
      setMoodColor: (hex) => {
        const col = new THREE.Color(hex);
        materialsToUpdate.forEach(m => {
          if (m.emissive) m.emissive.copy(col);
        });
      },
    };
  }

  // -------------------------------------------------------------
  // 4. 🦅 3D SPIRIT BIRDS (Flock of 3 Soaring Birds)
  // -------------------------------------------------------------
  if (modelId === 'birds') {
    const flockGroup = new THREE.Group();
    flockGroup.position.set(0, 0, 0.08);

    const birdMat = registerEmissiveMat(new THREE.MeshStandardMaterial({
      color: 0x0a1622,
      emissive: primaryColor,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      flatShading: true,
    }));

    function createSingleBird() {
      const bGroup = new THREE.Group();

      // Fuselage / Torso
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 5), birdMat);
      body.rotation.x = -Math.PI / 2;
      bGroup.add(body);

      // Head & Beak
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), birdMat);
      head.position.set(0, 0.015, 0.09);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.01, 0.04, 4), birdMat);
      beak.position.set(0, 0.01, 0.13);
      beak.rotation.x = Math.PI / 2;
      bGroup.add(head, beak);

      // Tail
      const tailGeom = new THREE.BufferGeometry();
      const tailVerts = new Float32Array([
        0, 0, -0.09,
        -0.05, 0.01, -0.17,
        0.05, 0.01, -0.17,
      ]);
      tailGeom.setAttribute('position', new THREE.BufferAttribute(tailVerts, 3));
      tailGeom.computeVertexNormals();
      bGroup.add(new THREE.Mesh(tailGeom, birdMat));

      // Wings
      const wingL = new THREE.Group();
      wingL.position.set(-0.02, 0.01, 0.02);
      const wingGeom = new THREE.BufferGeometry();
      const wingVerts = new Float32Array([
        0, 0, 0,
        -0.22, 0.02, 0.04,
        -0.18, 0, -0.06,
      ]);
      wingGeom.setAttribute('position', new THREE.BufferAttribute(wingVerts, 3));
      wingGeom.computeVertexNormals();
      wingL.add(new THREE.Mesh(wingGeom, birdMat));

      const wingR = new THREE.Group();
      wingR.position.set(0.02, 0.01, 0.02);
      const wingGeomR = new THREE.BufferGeometry();
      const wingVertsR = new Float32Array([
        0, 0, 0,
        0.18, 0, -0.06,
        0.22, 0.02, 0.04,
      ]);
      wingGeomR.setAttribute('position', new THREE.BufferAttribute(wingVertsR, 3));
      wingGeomR.computeVertexNormals();
      wingR.add(new THREE.Mesh(wingGeomR, birdMat));

      bGroup.add(wingL, wingR);

      return { bGroup, wingL, wingR };
    }

    const bird1 = createSingleBird();
    const bird2 = createSingleBird();
    bird2.bGroup.scale.set(0.75, 0.75, 0.75);
    const bird3 = createSingleBird();
    bird3.bGroup.scale.set(0.70, 0.70, 0.70);

    flockGroup.add(bird1.bGroup, bird2.bGroup, bird3.bGroup);
    root.add(flockGroup);

    return {
      group: root,
      update: (time) => {
        // Continuous Wing Flaps
        const flap1 = Math.sin(time * 9.0) * 0.7;
        bird1.wingL.rotation.z = flap1;
        bird1.wingR.rotation.z = -flap1;

        const flap2 = Math.sin(time * 9.5 + 0.8) * 0.7;
        bird2.wingL.rotation.z = flap2;
        bird2.wingR.rotation.z = -flap2;

        const flap3 = Math.sin(time * 9.2 + 1.6) * 0.7;
        bird3.wingL.rotation.z = flap3;
        bird3.wingR.rotation.z = -flap3;

        // Orbital Flight Path Around Target Center
        const r1 = 0.32;
        const speed = 1.6;
        bird1.bGroup.position.set(
          Math.cos(time * speed) * r1,
          Math.sin(time * speed) * r1 * 0.75,
          Math.sin(time * 2.5) * 0.04
        );
        bird1.bGroup.rotation.z = time * speed + Math.PI / 2;
        bird1.bGroup.rotation.y = 0.25;

        // Wingman 2 (Behind left)
        const r2 = 0.42;
        const angle2 = time * speed - 0.7;
        bird2.bGroup.position.set(
          Math.cos(angle2) * r2,
          Math.sin(angle2) * r2 * 0.75,
          0.04 + Math.sin(time * 2.2) * 0.03
        );
        bird2.bGroup.rotation.z = angle2 + Math.PI / 2;
        bird2.bGroup.rotation.y = 0.28;

        // Wingman 3 (Behind right)
        const r3 = 0.38;
        const angle3 = time * speed - 1.3;
        bird3.bGroup.position.set(
          Math.cos(angle3) * r3,
          Math.sin(angle3) * r3 * 0.75,
          -0.03 + Math.sin(time * 2.8) * 0.03
        );
        bird3.bGroup.rotation.z = angle3 + Math.PI / 2;
        bird3.bGroup.rotation.y = 0.22;
      },
      setMoodColor: (hex) => {
        const col = new THREE.Color(hex);
        materialsToUpdate.forEach(m => {
          if (m.emissive) m.emissive.copy(col);
        });
      },
    };
  }

  return {
    group: root,
    update: () => {},
    setMoodColor: () => {},
  };
}
