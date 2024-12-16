import { spaceship } from '../components/spaceship.js';
import { camera } from '../core/camera.js';

function updateSpaceshipPosition(keys, deltaTime) {

}

function updateCameraPosition() {
    if (!spaceship) return;

    const cameraOffset = new THREE.Vector3(0, 5, -15);
    const cameraTarget = new THREE.Vector3();
    const desiredPosition = spaceship.position.clone().add(cameraOffset);
    camera.position.lerp(desiredPosition, 0.05);
    cameraTarget.copy(spaceship.position);
    camera.lookAt(cameraTarget);
}

export { updateSpaceshipPosition, updateCameraPosition };
