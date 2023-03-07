// model: https://sketchfab.com/3d-models/interior-building-scene-9c1dad0cc26a4d2fa16d59d067c8f871

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";

function App() {
  useEffect(() => {
    // add event listener for window resize handler
    window.addEventListener("resize", handleResize, false);

    // resize the renderer frame when the window gets resized
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // set up scene with beige background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e8dcca");

    // initialize camera
    const camera = new THREE.PerspectiveCamera(
      75, // fov
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );

    // initialize renderer and make it fill the viewport
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // initialize orbit controls (move camera with mouse and scroll)
    const controls = new OrbitControls(camera, renderer.domElement);

    // initialize and add directional light source (scuffed)
    // takes two arguments: color and intensity
    const directionalLight = new THREE.DirectionalLight("#ffffff", 10);
    scene.add(directionalLight);

    // add ambient light source
    const light = new THREE.AmbientLight("#404040", 5);
    scene.add(light);

    // load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      // file path for model
      "model/scene.gltf",

      // function for when loading completes
      function (gltf) {
        gltf.scene.traverse((n) => {
          if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            if (n.material.map) n.material.map.anisotropy = 16;
          }
        });
        scene.add(gltf.scene);
      },

      // function to be run as the model is loading
      // this is where you'd put some sort of loading bar
      undefined,

      // error handler function
      function (error) {
        console.error(error);
      }
    );

    // fps counter
    const stats = Stats();
    document.body.appendChild(stats.dom);

    // move camera to be somewhat inside the building on load
    camera.position.set(100, 100, 50);
    // you need to update the orbit controls every time you manually move the camera
    controls.update();

    // render function
    var render = function () {
      renderer.render(scene, camera);
    };

    // animate loop
    function animate() {
      requestAnimationFrame(animate);

      // update orbit controls
      controls.update();

      // re-render
      render();

      // update fps counter
      stats.update();
    }

    // start animate loop
    animate();
  }, []);

  return <div></div>;
}

export default App;
