import { scene } from '../core/scene.js';
import { camera, sizes } from '../core/camera.js';
import { renderer } from '../core/renderer.js';
import { setupLighting } from '../components/lighting.js';
import { setupFloor } from '../components/floor.js';
import { loadSpaceship } from '../components/spaceship.js';
import { handleInput } from '../systems/input.js';
import { updateSpaceshipPosition } from '../systems/movement.js';
import { updateCameraPosition } from '../systems/camera-controller.js';

setupLighting(scene);
setupFloor(scene);
loadSpaceship(scene, camera);
handleInput();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

function tick(currentTime) {
    const deltaTime = 0.016;
    updateSpaceshipPosition(deltaTime);
    updateCameraPosition();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
