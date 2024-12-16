import * as THREE from 'three';
import { camera } from '../core/camera.js';
import { spaceship } from '../components/spaceship.js';

const cameraOffset = new THREE.Vector3(0, 5, -15);
const cameraTarget = new THREE.Vector3();

function updateCameraPosition() {
    if (!spaceship) return;

    const desiredPosition = spaceship.position.clone().add(cameraOffset);
    camera.position.lerp(desiredPosition, 0.05);

    cameraTarget.copy(spaceship.position);
    camera.lookAt(cameraTarget);
}

export { updateCameraPosition };
