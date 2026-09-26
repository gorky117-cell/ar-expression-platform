/**
 * WearWave 3D Holographic Models A-Frame Component
 * 
 * Implements 4 Dedicated Holographic 3D Models in WebAR:
 * 1. 🦋 Cosmic Butterfly (Flapping wings & glowing neon veins)
 * 2. ⛵ Cyber Sailboat (Gently rocking on virtual waves)
 * 3. 🐉 Low-Poly Dragon (Gliding 3D flight loop)
 * 4. 🦅 Spirit Birds (Circling above the shirt)
 */

(function () {
  if (typeof AFRAME === 'undefined') return;

  const THREE = AFRAME.THREE || window.THREE;

  function build3DModel(modelId, moodColor, THREE) {
    const root = new THREE.Group();
    const materialsToUpdate = [];
    const primaryColor = new THREE.Color(moodColor || '#00f0ff');

    function registerEmissive(mat) {
      materialsToUpdate.push(mat);
      return mat;
    }

    // 1. 🦋 3D COSMIC BUTTERFLY
    if (modelId === 'butterfly') {
      const bfGroup = new THREE.Group();
      bfGroup.position.set(0, 0, 0.08);

      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x121420,
        metalness: 0.85,
        roughness: 0.25,
        flatShading: true,
      });

      const thorax = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.16, 12), bodyMat);
      thorax.rotation.x = Math.PI / 2;
      bfGroup.add(thorax);

      const abdomen = new THREE.ConeGeometry(0.042, 0.32, 12);
      const abMesh = new THREE.Mesh(abdomen, bodyMat);
      abMesh.position.set(0, -0.22, 0);
      abMesh.rotation.z = Math.PI;
      bfGroup.add(abMesh);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), bodyMat);
      head.position.set(0, 0.11, 0.01);
      bfGroup.add(head);

      const eyeMat = registerEmissive(new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: primaryColor,
        emissiveIntensity: 1.6,
        roughness: 0.1,
      }));
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeMat);
      eyeL.position.set(-0.022, 0.13, 0.025);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeMat);
      eyeR.position.set(0.022, 0.13, 0.025);
      bfGroup.add(eyeL, eyeR);

      const antMat = registerEmissive(new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: primaryColor,
        emissiveIntensity: 1.0,
      }));
      const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.14, 6), antMat);
      antL.position.set(-0.035, 0.21, 0.04);
      antL.rotation.z = 0.35;
      antL.rotation.x = 0.2;
      const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.14, 6), antMat);
      antR.position.set(0.035, 0.21, 0.04);
      antR.rotation.z = -0.35;
      antR.rotation.x = 0.2;
      bfGroup.add(antL, antR);

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

      const wingMat = registerEmissive(new THREE.MeshStandardMaterial({
        color: 0x050814,
        emissive: primaryColor,
        emissiveIntensity: 0.65,
        roughness: 0.15,
        metalness: 0.9,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
      }));

      const veinMat = registerEmissive(new THREE.LineBasicMaterial({
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

      const leftWingPivot = new THREE.Group();
      leftWingPivot.position.set(-0.035, 0, 0.01);
      const foreL = new THREE.Mesh(new THREE.ShapeGeometry(createWingShape(true)), wingMat);
      foreL.rotation.y = Math.PI;
      foreL.add(createWingVeins(true));
      const hindL = new THREE.Mesh(new THREE.ShapeGeometry(createWingShape(false)), wingMat);
      hindL.rotation.y = Math.PI;
      hindL.add(createWingVeins(false));
      leftWingPivot.add(foreL, hindL);

      const rightWingPivot = new THREE.Group();
      rightWingPivot.position.set(0.035, 0, 0.01);
      const foreR = new THREE.Mesh(new THREE.ShapeGeometry(createWingShape(true)), wingMat);
      foreR.add(createWingVeins(true));
      const hindR = new THREE.Mesh(new THREE.ShapeGeometry(createWingShape(false)), wingMat);
      hindR.add(createWingVeins(false));
      rightWingPivot.add(foreR, hindR);

      bfGroup.add(leftWingPivot, rightWingPivot);
      root.add(bfGroup);

      return {
        root,
        update: (t) => {
          const flap = Math.sin(t * 7.5) * 0.75;
          leftWingPivot.rotation.y = flap;
          rightWingPivot.rotation.y = -flap;
          bfGroup.position.z = 0.08 + Math.sin(t * 3.5) * 0.02;
          bfGroup.rotation.z = Math.sin(t * 2.0) * 0.04;
        },
        setColor: (hex) => {
          const col = new THREE.Color(hex);
          materialsToUpdate.forEach(m => {
            if (m.emissive) m.emissive.copy(col);
            if (m.isLineBasicMaterial) m.color.copy(col);
          });
        }
      };
    }

    // 2. ⛵ 3D CYBER SAILBOAT
    if (modelId === 'sailboat') {
      const boatGroup = new THREE.Group();
      boatGroup.position.set(0, -0.05, 0.09);

      const hullGeom = new THREE.BufferGeometry();
      const hullVerts = new Float32Array([
        0, 0.04, 0.45,   -0.14, 0.06, 0.0,   0.14, 0.06, 0.0,
        -0.14, 0.06, 0.0,  -0.12, 0.05, -0.35,  0.12, 0.05, -0.35,
        -0.14, 0.06, 0.0,   0.12, 0.05, -0.35,  0.14, 0.06, 0.0,
        0, 0.04, 0.45,    0, -0.08, 0.1,    -0.14, 0.06, 0.0,
        0, 0.04, 0.45,    0.14, 0.06, 0.0,    0, -0.08, 0.1,
        -0.14, 0.06, 0.0,   0, -0.08, 0.1,   -0.12, 0.05, -0.35,
        0.14, 0.06, 0.0,   0.12, 0.05, -0.35,   0, -0.08, 0.1,
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
      boatGroup.add(new THREE.Mesh(hullGeom, hullMat));

      const trimMat = registerEmissive(new THREE.LineBasicMaterial({ color: primaryColor, linewidth: 3 }));
      const trimGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.042, 0.46),
        new THREE.Vector3(-0.145, 0.062, 0.0),
        new THREE.Vector3(-0.125, 0.052, -0.36),
        new THREE.Vector3(0.125, 0.052, -0.36),
        new THREE.Vector3(0.145, 0.062, 0.0),
        new THREE.Vector3(0, 0.042, 0.46),
      ]);
      boatGroup.add(new THREE.Line(trimGeom, trimMat));

      const mastMat = new THREE.MeshStandardMaterial({ color: 0x181a24, metalness: 0.8, roughness: 0.3 });
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.012, 0.72, 8), mastMat);
      mast.position.set(0, 0.40, 0.05);
      boatGroup.add(mast);

      const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.40, 8), mastMat);
      boom.position.set(0, 0.12, -0.15);
      boom.rotation.x = Math.PI / 2;
      boatGroup.add(boom);

      const sailMat = registerEmissive(new THREE.MeshStandardMaterial({
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
      mainSailGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0.12, 0.05,   0, 0.70, 0.05,   0, 0.12, -0.34
      ]), 3));
      mainSailGeom.computeVertexNormals();
      boatGroup.add(new THREE.Mesh(mainSailGeom, sailMat));

      const jibGeom = new THREE.BufferGeometry();
      jibGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0.10, 0.10,   0, 0.58, 0.05,   0, 0.05, 0.40
      ]), 3));
      jibGeom.computeVertexNormals();
      boatGroup.add(new THREE.Mesh(jibGeom, sailMat));

      const waveMat = registerEmissive(new THREE.MeshBasicMaterial({ color: primaryColor, wireframe: true, transparent: true, opacity: 0.5 }));
      const wave1 = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.28, 32), waveMat);
      wave1.rotation.x = -Math.PI / 2;
      wave1.position.set(0, -0.06, 0);
      const wave2 = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.48, 32), waveMat);
      wave2.rotation.x = -Math.PI / 2;
      wave2.position.set(0, -0.06, 0);
      boatGroup.add(wave1, wave2);

      root.add(boatGroup);

      return {
        root,
        update: (t) => {
          boatGroup.rotation.x = Math.sin(t * 2.2) * 0.09;
          boatGroup.rotation.z = Math.cos(t * 1.7) * 0.12;
          boatGroup.position.y = -0.05 + Math.sin(t * 2.5) * 0.025;
          const s1 = 1.0 + (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.35;
          wave1.scale.set(s1, s1, 1);
          const s2 = 1.0 + (Math.sin(t * 2.5 + 1.2) * 0.5 + 0.5) * 0.35;
          wave2.scale.set(s2, s2, 1);
        },
        setColor: (hex) => {
          const col = new THREE.Color(hex);
          materialsToUpdate.forEach(m => {
            if (m.emissive) m.emissive.copy(col);
            if (m.isLineBasicMaterial) m.color.copy(col);
          });
        }
      };
    }

    // 3. 🐉 3D LOW-POLY DRAGON
    if (modelId === 'dragon') {
      const dgGroup = new THREE.Group();
      dgGroup.position.set(0, 0, 0.09);

      const skinMat = new THREE.MeshStandardMaterial({
        color: 0x140e24,
        metalness: 0.85,
        roughness: 0.3,
        flatShading: true,
      });

      const glowMat = registerEmissive(new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: primaryColor,
        emissiveIntensity: 1.6,
        roughness: 0.1,
      }));

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.18, 0.05);

      const snout = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 5), skinMat);
      snout.rotation.x = -Math.PI / 2;
      headGroup.add(snout);

      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.18, 4), glowMat);
      hornL.position.set(-0.035, 0.05, -0.06);
      hornL.rotation.x = -0.5;
      hornL.rotation.z = -0.3;
      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.18, 4), glowMat);
      hornR.position.set(0.035, 0.05, -0.06);
      hornR.rotation.x = -0.5;
      hornR.rotation.z = 0.3;
      headGroup.add(hornL, hornR);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), glowMat);
      eyeL.position.set(-0.026, 0.03, 0.02);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), glowMat);
      eyeR.position.set(0.026, 0.03, 0.02);
      headGroup.add(eyeL, eyeR);
      dgGroup.add(headGroup);

      const segments = [];
      for (let i = 0; i < 6; i++) {
        const segScale = 1.0 - (i / 6) * 0.65;
        const segMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.045 * segScale, 0), skinMat);
        segMesh.position.set(0, 0.10 - i * 0.075, 0);

        const crest = new THREE.Mesh(new THREE.ConeGeometry(0.012 * segScale, 0.05 * segScale, 4), glowMat);
        crest.position.set(0, 0, 0.045 * segScale);
        crest.rotation.x = Math.PI / 2;
        segMesh.add(crest);
        dgGroup.add(segMesh);
        segments.push(segMesh);
      }

      const wingMat = registerEmissive(new THREE.MeshStandardMaterial({
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
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
          0, 0, 0,   0.35, 0.25, 0.04,   0.28, 0.02, 0.01,
          0, 0, 0,   0.28, 0.02, 0.01,   0.42, -0.15, -0.02,
          0, 0, 0,   0.42, -0.15, -0.02, 0.20, -0.22, -0.02,
        ]), 3));
        geom.computeVertexNormals();
        return geom;
      }

      const wingPivotL = new THREE.Group();
      wingPivotL.position.set(-0.04, 0.08, 0.02);
      const wingL = new THREE.Mesh(createDragonWingGeom(), wingMat);
      wingL.rotation.y = Math.PI;
      wingPivotL.add(wingL);

      const wingPivotR = new THREE.Group();
      wingPivotR.position.set(0.04, 0.08, 0.02);
      const wingR = new THREE.Mesh(createDragonWingGeom(), wingMat);
      wingPivotR.add(wingR);
      dgGroup.add(wingPivotL, wingPivotR);

      root.add(dgGroup);

      return {
        root,
        update: (t) => {
          const flap = Math.sin(t * 5.5) * 0.65;
          wingPivotL.rotation.z = -flap;
          wingPivotR.rotation.z = flap;
          segments.forEach((seg, idx) => {
            seg.position.x = Math.sin(t * 4.0 - idx * 0.6) * 0.035;
            seg.rotation.z = Math.cos(t * 4.0 - idx * 0.6) * 0.15;
          });
          headGroup.rotation.z = Math.sin(t * 3.5) * 0.12;
          dgGroup.position.x = Math.sin(t * 1.5) * 0.05;
          dgGroup.position.y = Math.cos(t * 1.8) * 0.03;
          dgGroup.rotation.y = Math.sin(t * 1.5) * 0.15;
        },
        setColor: (hex) => {
          const col = new THREE.Color(hex);
          materialsToUpdate.forEach(m => {
            if (m.emissive) m.emissive.copy(col);
          });
        }
      };
    }

    // 4. 🦅 3D SPIRIT BIRDS
    if (modelId === 'birds') {
      const flock = new THREE.Group();
      flock.position.set(0, 0, 0.10);

      const birdMat = registerEmissive(new THREE.MeshStandardMaterial({
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
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 5), birdMat);
        body.rotation.x = -Math.PI / 2;
        bGroup.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), birdMat);
        head.position.set(0, 0.015, 0.09);
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.01, 0.04, 4), birdMat);
        beak.position.set(0, 0.01, 0.13);
        beak.rotation.x = Math.PI / 2;
        bGroup.add(head, beak);

        const tailGeom = new THREE.BufferGeometry();
        tailGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
          0, 0, -0.09,   -0.05, 0.01, -0.17,   0.05, 0.01, -0.17
        ]), 3));
        tailGeom.computeVertexNormals();
        bGroup.add(new THREE.Mesh(tailGeom, birdMat));

        const wingL = new THREE.Group();
        wingL.position.set(-0.02, 0.01, 0.02);
        const wingGeomL = new THREE.BufferGeometry();
        wingGeomL.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
          0, 0, 0,   -0.22, 0.02, 0.04,   -0.18, 0, -0.06
        ]), 3));
        wingGeomL.computeVertexNormals();
        wingL.add(new THREE.Mesh(wingGeomL, birdMat));

        const wingR = new THREE.Group();
        wingR.position.set(0.02, 0.01, 0.02);
        const wingGeomR = new THREE.BufferGeometry();
        wingGeomR.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
          0, 0, 0,   0.18, 0, -0.06,   0.22, 0.02, 0.04
        ]), 3));
        wingGeomR.computeVertexNormals();
        wingR.add(new THREE.Mesh(wingGeomR, birdMat));

        bGroup.add(wingL, wingR);
        return { bGroup, wingL, wingR };
      }

      const b1 = createSingleBird();
      const b2 = createSingleBird();
      b2.bGroup.scale.set(0.75, 0.75, 0.75);
      const b3 = createSingleBird();
      b3.bGroup.scale.set(0.70, 0.70, 0.70);

      flock.add(b1.bGroup, b2.bGroup, b3.bGroup);
      root.add(flock);

      return {
        root,
        update: (t) => {
          b1.wingL.rotation.z = Math.sin(t * 9.0) * 0.7;
          b1.wingR.rotation.z = -Math.sin(t * 9.0) * 0.7;
          b2.wingL.rotation.z = Math.sin(t * 9.5 + 0.8) * 0.7;
          b2.wingR.rotation.z = -Math.sin(t * 9.5 + 0.8) * 0.7;
          b3.wingL.rotation.z = Math.sin(t * 9.2 + 1.6) * 0.7;
          b3.wingR.rotation.z = -Math.sin(t * 9.2 + 1.6) * 0.7;

          const speed = 1.6;
          b1.bGroup.position.set(Math.cos(t * speed) * 0.32, Math.sin(t * speed) * 0.24, Math.sin(t * 2.5) * 0.04);
          b1.bGroup.rotation.z = t * speed + Math.PI / 2;
          b1.bGroup.rotation.y = 0.25;

          const a2 = t * speed - 0.7;
          b2.bGroup.position.set(Math.cos(a2) * 0.42, Math.sin(a2) * 0.31, 0.04 + Math.sin(t * 2.2) * 0.03);
          b2.bGroup.rotation.z = a2 + Math.PI / 2;
          b2.bGroup.rotation.y = 0.28;

          const a3 = t * speed - 1.3;
          b3.bGroup.position.set(Math.cos(a3) * 0.38, Math.sin(a3) * 0.28, -0.03 + Math.sin(t * 2.8) * 0.03);
          b3.bGroup.rotation.z = a3 + Math.PI / 2;
          b3.bGroup.rotation.y = 0.22;
        },
        setColor: (hex) => {
          const col = new THREE.Color(hex);
          materialsToUpdate.forEach(m => {
            if (m.emissive) m.emissive.copy(col);
          });
        }
      };
    }

    return { root, update: () => {}, setColor: () => {} };
  }

  // Register master A-Frame Component
  AFRAME.registerComponent('wearwave-3d-model', {
    schema: {
      type: { type: 'string', default: 'butterfly' }, // 'butterfly' | 'sailboat' | 'dragon' | 'birds'
      color: { type: 'string', default: '#00f0ff' },
      scale: { type: 'number', default: 1.0 },
    },
    init: function () {
      this.currentModelType = null;
      this.modelInstance = null;
      this.mountModel();
    },
    update: function (oldData) {
      if (oldData.type !== this.data.type || !this.modelInstance) {
        this.mountModel();
      } else if (oldData.color !== this.data.color && this.modelInstance) {
        this.modelInstance.setColor(this.data.color);
      }
      if (this.data.scale) {
        this.el.object3D.scale.setScalar(this.data.scale);
      }
    },
    mountModel: function () {
      if (this.modelInstance && this.modelInstance.root) {
        this.el.object3D.remove(this.modelInstance.root);
      }
      this.modelInstance = build3DModel(this.data.type, this.data.color, THREE);
      this.el.object3D.add(this.modelInstance.root);
      this.currentModelType = this.data.type;
    },
    tick: function (time) {
      if (this.modelInstance && typeof this.modelInstance.update === 'function') {
        this.modelInstance.update(time / 1000);
      }
    },
    setMoodColor: function (hex) {
      if (this.modelInstance && typeof this.modelInstance.setColor === 'function') {
        this.modelInstance.setColor(hex);
      }
    }
  });

  window.wearwaveBuild3DModel = build3DModel;
})();
