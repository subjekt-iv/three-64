import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ParticleSystem from './particle-system';

let spaceship = null;
let thrusterParticleSystem = null;

function loadSpaceship(scene, camera) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        '/assets/models/spaceship.glb',
        (gltf) => {
            spaceship = gltf.scene;
            spaceship.position.set(0, 5, 0);
            spaceship.rotation.y = Math.PI * 2;
            spaceship.scale.set(0.5, 0.5, 0.5);

            spaceship.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(spaceship);

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
}

export { loadSpaceship, spaceship, thrusterParticleSystem };
