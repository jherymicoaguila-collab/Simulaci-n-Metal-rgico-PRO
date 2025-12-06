import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SimulationParams } from '../types';

interface ParticleReactorProps {
  params: SimulationParams;
}

const ParticleReactor: React.FC<ParticleReactorProps> = ({ params }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Ref to hold latest params for the animation loop without triggering re-renders
  const paramsRef = useRef<SimulationParams>(params);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020408'); // Deep metallic blue/black
    scene.fog = new THREE.FogExp2(0x020408, 0.035);

    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0088ff, 5, 50);
    blueLight.position.set(10, 10, 10);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xffaa00, 3, 50);
    goldLight.position.set(-10, -5, 5);
    scene.add(goldLight);

    // --- TANK (FLOTATION CELL) ---
    const tankGeometry = new THREE.CylinderGeometry(6, 6, 14, 32, 1, true);
    const tankMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9, // Glass-like
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const tank = new THREE.Mesh(tankGeometry, tankMaterial);
    scene.add(tank);

    // Tank wireframe for "Tech" look
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(tankGeometry),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, opacity: 0.1, transparent: true })
    );
    tank.add(wireframe);

    // --- IMPELLER / AGITATOR ---
    const impellerGroup = new THREE.Group();
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 12, 8);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = -1; // Center bottom relative to tank center
    impellerGroup.add(shaft);

    const bladeGeo = new THREE.BoxGeometry(4, 0.5, 0.2);
    const blade1 = new THREE.Mesh(bladeGeo, shaftMat);
    blade1.position.y = -6;
    const blade2 = new THREE.Mesh(bladeGeo, shaftMat);
    blade2.position.y = -6;
    blade2.rotation.y = Math.PI / 2;
    impellerGroup.add(blade1);
    impellerGroup.add(blade2);

    scene.add(impellerGroup);

    // --- PARTICLES INIT ---
    const dummy = new THREE.Object3D();

    // 1. Bubbles (Instanced)
    const bubbleCount = 300;
    const bubbleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const bubbleMat = new THREE.MeshPhysicalMaterial({ color: 0xaaddff, transmission: 0.6, transparent: true, opacity: 0.6 });
    const bubblesMesh = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    scene.add(bubblesMesh);
    
    // 2. Gold (Instanced)
    const goldCount = 100;
    const goldGeo = new THREE.IcosahedronGeometry(0.12, 0);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2, emissive: 0xffa500, emissiveIntensity: 0.2 });
    const goldMesh = new THREE.InstancedMesh(goldGeo, goldMat, goldCount);
    scene.add(goldMesh);

    // 3. Silver (Instanced)
    const silverCount = 80;
    const silverGeo = new THREE.IcosahedronGeometry(0.12, 0);
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.2 });
    const silverMesh = new THREE.InstancedMesh(silverGeo, silverMat, silverCount);
    scene.add(silverMesh);

    // 4. Rock/Gangue (Instanced)
    const rockCount = 150;
    const rockGeo = new THREE.DodecahedronGeometry(0.2, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x555555, flatShading: true });
    const rockMesh = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    scene.add(rockMesh);

    // Initialize positions
    const initParticleData = (count: number, yRange: [number, number], rRange: number) => {
      const data = [];
      for(let i=0; i<count; i++) {
        const r = Math.random() * rRange;
        const theta = Math.random() * Math.PI * 2;
        data.push({
          position: new THREE.Vector3(r * Math.cos(theta), Math.random() * (yRange[1]-yRange[0]) + yRange[0], r * Math.sin(theta)),
          velocity: new THREE.Vector3(0, 0, 0),
          angularVelocity: (Math.random() - 0.5) * 0.1
        });
      }
      return data;
    };

    const bubblesData = initParticleData(bubbleCount, [-7, 7], 5.5);
    const goldData = initParticleData(goldCount, [-6, 6], 5);
    const silverData = initParticleData(silverCount, [-6, 6], 5);
    const rockData = initParticleData(rockCount, [-6, 6], 5);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      
      const currentParams = paramsRef.current; // Use Ref to get latest without re-init

      // Rotate Impeller
      impellerGroup.rotation.y -= 5 * delta;

      // Camera gentle float
      camera.position.x = Math.sin(time * 0.1) * 20;
      camera.position.z = Math.cos(time * 0.1) * 20;
      camera.lookAt(0, 2, 0);

      // --- PHYSICS UPDATE ---
      
      // 1. Bubbles Update
      // H2O2 affects bubble speed and density visual
      const h2o2Speed = 1 + (currentParams.h2o2Concentration / 5);
      const activeBubbles = Math.min(bubbleCount, Math.floor(20 + currentParams.h2o2Concentration * 28));
      
      bubblesData.forEach((p, i) => {
        if (i >= activeBubbles) {
          dummy.position.set(0, -100, 0); // Hide
          dummy.updateMatrix();
          bubblesMesh.setMatrixAt(i, dummy.matrix);
          return;
        }

        // Rise
        p.position.y += (1.5 + Math.random()) * delta * h2o2Speed;
        // Spiral
        const angle = time * 0.5 + i;
        p.position.x += Math.cos(angle) * 0.02;
        p.position.z += Math.sin(angle) * 0.02;

        // Reset
        if (p.position.y > 7) {
          p.position.y = -7;
          p.position.x = (Math.random() - 0.5) * 10;
          p.position.z = (Math.random() - 0.5) * 10;
          // Constrain to cylinder
          if (Math.sqrt(p.position.x**2 + p.position.z**2) > 5.5) {
             p.position.multiplyScalar(0.8);
          }
        }

        dummy.position.copy(p.position);
        const scale = 1 + Math.sin(time * 5 + i) * 0.1;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        bubblesMesh.setMatrixAt(i, dummy.matrix);
      });
      bubblesMesh.instanceMatrix.needsUpdate = true;

      // 2. Gold & Silver Update (Flotation Logic)
      // Collector Dosage > 100 starts flotation effect
      const flotationForce = Math.max(0, (currentParams.collectorDosage - 80) / 100); // 0 to ~2.2
      
      [
        { data: goldData, mesh: goldMesh, type: 'gold' },
        { data: silverData, mesh: silverMesh, type: 'silver' }
      ].forEach(({ data, mesh, type }) => {
        data.forEach((p, i) => {
          // Default gravity/sinking
          let vy = -0.5 * delta;

          // Flotation uplift
          if (flotationForce > 0.1) {
            // Chance to attach to bubble based on collector strength
            if (Math.random() < flotationForce * 0.1) {
               p.velocity.y = 2.0; // Shoot up
            }
          }

          // If velocity is high (attached), rise. Else sink.
          if (p.velocity.y > 0) {
            p.position.y += p.velocity.y * delta;
            // Decay upward velocity slightly or keep rising till top
            if(p.position.y > 6.5) {
              // Froth layer behavior: stick at top for a bit
              p.position.y = 6.5; 
              p.velocity.y = 0;
            }
          } else {
             // Sinking / Agitation logic
             p.position.y += vy;
             // Swirl from impeller
             if (p.position.y < -4) {
                const dist = Math.sqrt(p.position.x**2 + p.position.z**2);
                const swirl = 2 / (dist + 0.1);
                const theta = Math.atan2(p.position.z, p.position.x) + swirl * delta;
                p.position.x = dist * Math.cos(theta);
                p.position.z = dist * Math.sin(theta);
                // Push up slightly from turbulence
                p.position.y += Math.random() * 2 * delta;
             }
          }

          // Reset if too low
          if (p.position.y < -6.5) {
             p.position.y = -6.5;
             // Re-eject upwards from impeller
             p.velocity.y = Math.random() * 2;
             p.position.x = (Math.random() - 0.5) * 4;
             p.position.z = (Math.random() - 0.5) * 4;
          }

          // Reset if floating too long (recycle)
          if (p.position.y >= 6.5 && Math.random() < 0.01) {
            p.position.y = -5;
            p.velocity.y = 0;
          }

          dummy.position.copy(p.position);
          dummy.rotation.x += delta;
          dummy.rotation.y += delta;
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });

      // 3. Rock Update (Sinking)
      // Granulometry: Higher % passing 200 mesh = finer particles = smaller size visually
      const rockScale = 1.5 - (currentParams.granulometry / 100); // 0.5 to 1.1 approx
      
      rockData.forEach((p, i) => {
        // Rocks generally sink
        p.position.y -= (0.5 + Math.random() * 0.5) * delta;
        
        // Impeller turbulence at bottom
        if (p.position.y < -5) {
           p.position.y = -5 + Math.random();
           const dist = Math.sqrt(p.position.x**2 + p.position.z**2);
           const theta = Math.atan2(p.position.z, p.position.x) + 2 * delta;
           p.position.x = dist * Math.cos(theta);
           p.position.z = dist * Math.sin(theta);
        }
        
        // Recycle
        if (Math.random() < 0.01 && p.position.y < -4) {
          p.position.y = 6; // Add new feed from top
          p.position.x = (Math.random() - 0.5) * 8;
          p.position.z = (Math.random() - 0.5) * 8;
        }

        dummy.position.copy(p.position);
        dummy.rotation.x += delta;
        dummy.scale.set(rockScale, rockScale, rockScale);
        dummy.updateMatrix();
        rockMesh.setMatrixAt(i, dummy.matrix);
      });
      rockMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (mountRef.current && camera && renderer) {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      tankGeometry.dispose();
      tankMaterial.dispose();
      goldGeo.dispose();
      goldMat.dispose();
    };
  }, []); // Only run once on mount

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full bg-black rounded-3xl overflow-hidden cursor-move"
      title="Arrastra para rotar la vista"
    />
  );
};

export default ParticleReactor;