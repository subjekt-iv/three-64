import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';


// Debug
const gui = new dat.GUI();

// Create a scene
const scene = new THREE.Scene();

// Cursor
const cursor = {
    x: 0,
    y: 0
};

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Load a texture
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onStart = () => {
    console.log('Loading started');
};
loadingManager.onLoad = () => {
    console.log('Loading finished');
};

loadingManager.onError = () => { console.log('Loading error') };


const colorTexture = textureLoader.load('assets/textures/door/color.jpg');
const alphaTexture = textureLoader.load('assets/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('assets/textures/door/height.jpg');
const normalTexture = textureLoader.load('assets/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('assets/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('assets/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('assets/textures/door/roughness.jpg');


colorTexture.minFilter = THREE.NearestFilter;




window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
});

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Toggle Fullscreen
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else if (document.exitFullscreen || document.webkitExitFullscreen) {
        document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
    }
});

// Create a camera
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 7;

// Create groups
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ map: colorTexture })
);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ map: colorTexture })
);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ map: colorTexture })
);



gui.add(cube1.position, 'x', -3, 3, 0.01).name('Cube 1 X');
gui.add(cube2.position, 'x', -3, 3, 0.01).name('Cube 2 X');
gui.add(cube3.position, 'x', -3, 3, 0.01).name('Cube 3 X');
gui.add(cube1.material, 'wireframe').name('Wireframe');
gui.add(cube3.material, 'wireframe').name('Wireframe');
gui.add(cube2.material, 'wireframe').name('Wireframe');



const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(group.rotation, { duration: 1, y: group.rotation.y + Math.PI * 2 });
    }
};

// Add a button for activating the spin function
gui.add(parameters, 'spin').name('Spin');




// Function to change cube color
const updateCubeColor = (cube, color) => {
    cube.material.color.set(color);
};

// Add color controls to the GUI
gui.addColor({ color: '#FF0000' }, 'color').name('Cube 1 Color').onChange(value => updateCubeColor(cube1, value));
gui.addColor({ color: '#0000FF' }, 'color').name('Cube 2 Color').onChange(value => updateCubeColor(cube2, value));
gui.addColor({ color: '#FFFF00' }, 'color').name('Cube 3 Color').onChange(value => updateCubeColor(cube3, value));

cube1.position.x = -2;
cube2.position.x = 2;
cube3.position.x = 0;

group.add(cube1);
group.add(cube2);
group.add(cube3);

camera.lookAt(group.position);

// Create a renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Initialize OrbitControls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Smooth the camera movement

// Time
const clock = new THREE.Clock();


const tick = () => {
    // Update controls
    controls.update();

    // Render the scene with the camera
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
