// https://stackoverflow.com/questions/41248287/how-to-connect-threejs-to-react
// https://stackoverflow.com/questions/53464595/how-to-use-componentwillmount-in-react-hooks
import React from 'react';
import './App.css';
import * as THREE from 'three';

const Vis = () => {
  const {useRef, useEffect, useState} = React;
  const mount = useRef(null);
  const [isAnimating, setAnimating] = useState(true);
  const controls = useRef(null);

  useEffect(() => { // componentDidMount()
    let width  = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    let frameId;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, width/height, .1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x1133ff });
    const cube     = new THREE.Mesh(geometry, material);

    camera.position.z = 4;
    scene.add(cube);
    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      width  = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    }

    const animate = () => {
      cube.rotation.x += .01;
      cube.rotation.y += .01;

      renderScene();
      frameId = window.requestAnimationFrame(animate);
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    mount.current.appendChild(renderer.domElement);
    window.addEventListener('resize', handleResize);
    start();

    controls.current = { start, stop };

    return () => { // componetWillUnmount()
      stop();
      window.removeEventListener('resize', handleResize);
      mount.current.removeChild(renderer.domElement);

      scene.remove(cube);
      geometry.dispose();
      material.dispose();
    }
  }, []);  // With the second parameter, the useEffect will run only once.

  useEffect(() => {
    if (isAnimating) {
      controls.current.start();
    } else {
      controls.current.stop();
    }
  }, [isAnimating]);

  return <div className="vis" 
          style={{ width: '400px', height: '400px' }}
          ref={mount} onClick={() => setAnimating(!isAnimating)} />
}

const App = () => {
  return (
    <div className="App">
      <Vis />
    </div>
  );
}

export default App;
