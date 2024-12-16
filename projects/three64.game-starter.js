import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ParticleSystem from '../src/components';

// Canvas Setup
const canvas = document.querySelector('canvas.webgl');

// Scene Creation
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcccccc, 10, 100);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 5, 15);
scene.add(camera);

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(scene.fog.color);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Floor with Textures
const textureLoader = new THREE.TextureLoader();
const rockColorTexture = textureLoader.load('/assets/textures/rock/Rock020_1K_Color.jpg');
const rockNormalTexture = textureLoader.load('/assets/textures/rock/Rock020_1K_Normal.jpg');
const rockRoughnessTexture = textureLoader.load('/assets/textures/rock/Rock020_1K_Roughness.jpg');
const rockAmbientOcclusionTexture = textureLoader.load('/assets/textures/rock/Rock020_1K_AmbientOcclusion.jpg');
const rockDisplacementTexture = textureLoader.load('/assets/textures/rock/Rock020_1K_Displacement.jpg');

[rockColorTexture, rockNormalTexture, rockRoughnessTexture, rockAmbientOcclusionTexture, rockDisplacementTexture].forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100);
});

const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 256, 256);
floorGeometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floorGeometry.attributes.uv.array, 2));

const floorMaterial = new THREE.MeshStandardMaterial({
    map: rockColorTexture,
    displacementMap: rockDisplacementTexture,
    displacementScale: 2,
    normalMap: rockNormalTexture,
    roughnessMap: rockRoughnessTexture,
    aoMap: rockAmbientOcclusionTexture,
    aoMapIntensity: 1.5,
    metalness: 0.2,
    roughness: 0.7,
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Spaceship Loading
const gltfLoader = new GLTFLoader();
let spaceship = null;

let thrusterParticleSystem = null; // Declare a global variable for the particle system

gltfLoader.load(
    '/assets/models/spaceship.glb', // Replace with your spaceship model path
    (gltf) => {
        spaceship = gltf.scene;
        spaceship.position.set(0, 5, 0); // Initial position set higher
        spaceship.rotation.y = Math.PI * 2; // Face away from the camera
        spaceship.scale.set(0.5, 0.5, 0.5); // Adjust scale if needed
        spaceship.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(spaceship);

        // Initialize ParticleSystem for the thruster
        thrusterParticleSystem = new ParticleSystem({
            parent: scene,
            camera: camera,
        });
    },
    undefined,
    (error) => {
        console.error('Error loading spaceship:', error);
    }
);

// Movement Variables
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
};

const acceleration = 0.01;
let currentSpeed = 0;
const maxSpeed = 1.5;
const rotationSpeed = 0.03;
const verticalSpeed = 0.1;
const minHeight = 4;
const maxHeight = 20;

// Keyboard Controls
window.addEventListener('keydown', (event) => {
    if (event.code in keys) keys[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    if (event.code in keys) keys[event.code] = false;
});

// Update Spaceship Movement
const updateSpaceshipPosition = (deltaTime) => {
    if (!spaceship) return;

    // Accelerate forward movement
    if (keys.ArrowUp) {
        currentSpeed = Math.min(currentSpeed + acceleration, maxSpeed);
    } else {
        currentSpeed = Math.max(currentSpeed - acceleration * 2, 0); // Decelerate
    }

    if (keys.ArrowDown) {
        currentSpeed = Math.max(currentSpeed - acceleration, -maxSpeed / 2); // Reverse
    }

    // Forward/Reverse movement
    const direction = new THREE.Vector3();
    spaceship.getWorldDirection(direction);
    spaceship.position.add(direction.multiplyScalar(currentSpeed));

    // Steering (Y-axis rotation)
    if (keys.ArrowLeft) spaceship.rotation.y += rotationSpeed;
    if (keys.ArrowRight) spaceship.rotation.y -= rotationSpeed;

    // Vertical movement
    if (keys.KeyW) spaceship.position.y += verticalSpeed; // Move up
    if (keys.KeyS) spaceship.position.y -= verticalSpeed; // Move down

    // Constrain vertical movement
    spaceship.position.y = Math.max(minHeight, Math.min(maxHeight, spaceship.position.y));

    // Position and orient the particle system (thruster)
    if (thrusterParticleSystem) {
        // Adjust the position of the particle system based on the spaceship's thruster
        const thrusterPosition = new THREE.Vector3(8, 0, -10); // Thruster's local position
        spaceship.localToWorld(thrusterPosition); // Convert local position to world position
        thrusterParticleSystem._points.position.copy(thrusterPosition);

        // Rotate the thruster flames to be horizontal
        const thrusterRotation = new THREE.Quaternion();
        spaceship.getWorldQuaternion(thrusterRotation); // Align with the spaceship's orientation
        thrusterRotation.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))); // Rotate flames horizontally
        thrusterParticleSystem._points.quaternion.copy(thrusterRotation);

        // Update particle system (simulate thrusters firing)
        thrusterParticleSystem.Step(deltaTime);
    }
};



// Follow Spaceship with Camera
const cameraOffset = new THREE.Vector3(0, 5, -15);
const cameraTarget = new THREE.Vector3();

const updateCameraPosition = () => {
    if (!spaceship) return;

    const desiredPosition = spaceship.position.clone().add(cameraOffset);
    camera.position.lerp(desiredPosition, 0.05); // Smooth follow effect

    cameraTarget.copy(spaceship.position);
    camera.lookAt(cameraTarget);
};

// Resize Handling
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
let previousTime = 0;

const tick = (currentTime) => {
    const deltaTime = (currentTime - previousTime) * 0.001; // Calculate delta time in seconds
    previousTime = currentTime;

    // Update spaceship movement
    updateSpaceshipPosition(deltaTime);

    // Update camera to follow the spaceship
    updateCameraPosition();

    // Render the scene
    renderer.render(scene, camera);

    // Request next frame
    window.requestAnimationFrame(tick);
};

tick(0); // Start the loop with initial time



