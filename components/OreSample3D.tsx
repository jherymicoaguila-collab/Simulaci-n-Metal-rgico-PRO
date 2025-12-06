
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const OreSample3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene Setup
    const scene = new THREE.Scene();
    // Transparent background
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0x3b82f6, 5);
    spotLight.position.set(5, 5, 5);
    spotLight.angle = 0.5;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    const goldLight = new THREE.PointLight(0xffd700, 2, 10);
    goldLight.position.set(-2, -2, 2);
    scene.add(goldLight);

    // Ore Group
    const oreGroup = new THREE.Group();
    scene.add(oreGroup);

    // 1. Main Rock Matrix (Arsenopyrite/Quartz)
    const geometry = new THREE.DodecahedronGeometry(1.2, 0);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x1e293b, 
        roughness: 0.7,
        metalness: 0.2,
        flatShading: true
    });
    const rock = new THREE.Mesh(geometry, material);
    oreGroup.add(rock);

    // 2. Wireframe Overlay (Tech look)
    const wireGeo = new THREE.WireframeGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.15 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    oreGroup.add(wireframe);

    // 3. Gold Inclusions
    const goldGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const goldMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        metalness: 1, 
        roughness: 0.1,
        emissive: 0xffa500,
        emissiveIntensity: 0.2
    });

    for (let i = 0; i < 6; i++) {
        const mesh = new THREE.Mesh(goldGeo, goldMat);
        // Position on surface roughly
        const phi = Math.acos(-1 + (2 * i) / 6);
        const theta = Math.sqrt(6 * Math.PI) * phi;
        const r = 1.1;
        mesh.position.setFromSphericalCoords(r, phi, theta);
        mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        oreGroup.add(mesh);
    }

    // Animation Loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      oreGroup.rotation.y += 0.005;
      oreGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if(!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
    };

  }, []);

  return <div ref={mountRef} className="w-full h-full pointer-events-none" />;
};

export default OreSample3D;
