import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'


// Debug UI
const gui = new dat.GUI();


// Scene setup
const scene = new THREE.Scene();


// Cursor for interactivity
const cursor = { x: 0, y: 0 };


// Window sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };


// Texture loading with loading manager
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);


// Load textures
const colorTexture = textureLoader.load('assets/textures/door/color.jpg');
const alphaTexture = textureLoader.load('assets/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('assets/textures/door/height.jpg');
const normalTexture = textureLoader.load('assets/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('assets/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('assets/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('assets/textures/door/roughness.jpg');


// Texture filtering and mipmaps for performance
colorTexture.generateMipmaps = false;
colorTexture.magFilter = THREE.NearestFilter;


// Environment map for realistic reflections
const environmentMapTexture = cubeTextureLoader.load([
    'assets/textures/environmentMaps/3/px.jpg',
    'assets/textures/environmentMaps/3/nx.jpg',
    'assets/textures/environmentMaps/3/py.jpg',
    'assets/textures/environmentMaps/3/ny.jpg',
    'assets/textures/environmentMaps/3/pz.jpg',
    'assets/textures/environmentMaps/3/nz.jpg',
]);


// Update cursor position
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
});

// Resize handling
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera and renderer
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Fullscreen toggle on double-click
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitRequestFullscreen();
    } else {
        document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
    }
});

// Camera setup
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// Grouping 3D objects
const group = new THREE.Group();
scene.add(group);


// Fonts
const loader = new FontLoader();
loader.load('assets/fonts/helvetiker_regular.typeface.json', (font) => {

    const textGeometry = new TextGeometry('three646464', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 1,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });

    textGeometry.center();
    textGeometry.computeBoundingBox();

    const textMaterial = new THREE.MeshStandardMaterial({ envMap: environmentMapTexture });

    textMaterial.metalness = 0.7;
    textMaterial.roughness = 0.0;

    gui.add(textMaterial, 'metalness').min(0).max(1).step(0.01).name('Metalness');
    gui.add(textMaterial, 'roughness').min(0).max(1).step(0.01).name('Roughness');

    const spin = () => {
        gsap.to(text.rotation, { duration: 1, y: text.rotation.y + Math.PI * 2 });
    };

    gui.add({ spin }, 'spin').name('Spin Text');

    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.y = 1.7;

    // Add text to group inside the loader's callback
    group.add(text);
});



// Create torus geometry
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 32, 100);
torusGeometry.setAttribute('uv2', new THREE.BufferAttribute(torusGeometry.attributes.uv.array, 2));

// Material setup with realistic PBR textures
const material = new THREE.MeshStandardMaterial({
    // map: colorTexture,
    // aoMap: ambientOcclusionTexture,
    // aoMapIntensity: 1,
    // metalnessMap: metalnessTexture,
    // roughnessMap: roughnessTexture,
    // normalMap: normalTexture,
    // normalScale: new THREE.Vector2(0.5, 0.5),  // Balance the normal intensity
    // alphaMap: alphaTexture,
    // transparent: true,
    // displacementMap: heightTexture,
    // displacementScale: 0.1,  // Adjust height map effect
    envMap: environmentMapTexture,
});

material.metalness = 0.9;
material.roughness = 0.2;



// GUI controls for material properties
gui.add(material, 'displacementScale').min(0).max(1).step(0.01).name('Displacement Scale');
gui.add(material, 'aoMapIntensity').min(0).max(2).step(0.01).name('AO Intensity');
gui.add(material, 'metalness').min(0).max(1).step(0.01).name('Metalness');
gui.add(material, 'roughness').min(0).max(1).step(0.01).name('Roughness');

// Mesh creation
const torusMesh = new THREE.Mesh(torusGeometry, material);
group.add(torusMesh);

// Plane geometry
const planeGeometry = new THREE.PlaneGeometry(5, 5, 100, 100);
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));

// Plane material
const planeMaterial = new THREE.MeshStandardMaterial({
    // map: colorTexture,
    // aoMap: ambientOcclusionTexture,
    aoMapIntensity: 1,
    // metalnessMap: metalnessTexture,
    // roughnessMap: roughnessTexture,
    normalMap: normalTexture,
    // normalScale: new THREE.Vector2(0.5, 0.5),  // Balance the normal intensity
    envMap: environmentMapTexture,
});

planeMaterial.metalness = 0.9;
planeMaterial.roughness = 0;

// GUI controls for plane material
gui.add(planeMaterial, 'displacementScale').min(0).max(1).step(0.01).name('Displacement Scale');
gui.add(planeMaterial, 'aoMapIntensity').min(0).max(2).step(0.01).name('AO Intensity');
gui.add(planeMaterial, 'metalness').min(0).max(1).step(0.01).name('Metalness');
gui.add(planeMaterial, 'roughness').min(0).max(1).step(0.01).name('Roughness');

// Plane mesh
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI * 0.5;
planeMesh.position.y = -2;

group.add(planeMesh);




// Lights
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color("0xffffff");
ambientLight.intensity = 1;
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight();
directionalLight.color = new THREE.Color(0x00fffc);
directionalLight.position.set(1, 0.25, 0);
directionalLight.intensity = 2;
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight();
hemisphereLight.color = new THREE.Color(0xff0000);
hemisphereLight.groundColor = new THREE.Color(0x0000ff);
hemisphereLight.position.set(2, 1, 0)
hemisphereLight.intensity = 9;
scene.add(hemisphereLight);

// const pointLight = new THREE.PointLight();
// pointLight.color = new THREE.Color(0xff9000);
// pointLight.position.set(1 - 1, 0.1, 1);
// pointLight.intensity = 5;
// scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight();
rectAreaLight.color = new THREE.Color(0x4e00ff);
rectAreaLight.position.set(-5, 1, 1);
rectAreaLight.intensity = 1;
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.2, 0.25, 1);

// spotLight.intensity = 9;
// spotLight.angle = 45 * Math.PI / 180;
// spotLight.penumbra = 0.5;
// spotLight.decay = 2;
// spotLight.distance = 10;
scene.add(spotLight);

spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -1.5;
scene.add(spotLight.target);



// Helpers

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.7)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.7)
scene.add(directionalLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)


hemisphereLightHelper.visible = false
directionalLightHelper.visible = false
spotLightHelper.visible = false
rectAreaLightHelper.visible = false


gui.add(hemisphereLightHelper, 'visible').name('Hemisphere Light Helper')
gui.add(directionalLightHelper, 'visible').name('Directional Light Helper')
gui.add(spotLightHelper, 'visible').name('Spot Light Helper')
gui.add(rectAreaLightHelper, 'visible').name('Rect Area Light Helper')



window.requestAnimationFrame(() => {
    // spotLightHelper.update()
    rectAreaLightHelper.position.copy(rectAreaLight.position)
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
    rectAreaLightHelper.update()
})



// Spin animation using GSAP
const parameters = {
    spin: () => {
        gsap.to(group.rotation, { duration: 1, y: group.rotation.y + Math.PI * 2 });
    },
};
gui.add(parameters, 'spin').name('Spin');

// Renderer setup
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

// Camera controls (OrbitControls)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;  // Smooth camera movement

// Animation loop
const tick = () => {
    // Update controls
    controls.update();

    // Spin
    group.rotation.y += 0.001;




    // Render the scene
    renderer.render(scene, camera);

    // Request the next frame
    window.requestAnimationFrame(tick);
};

tick();
