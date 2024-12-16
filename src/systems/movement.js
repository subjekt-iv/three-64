import * as THREE from 'three';
import { spaceship, thrusterParticleSystem } from '../components/spaceship.js';
import { keys } from './input.js';

const acceleration = 0.01;
let currentSpeed = 0;
const maxSpeed = 1.5;
const rotationSpeed = 0.03;
const verticalSpeed = 0.1;
const minHeight = 10;
const maxHeight = 28;

function updateSpaceshipPosition(deltaTime) {
    if (!spaceship) return;

    // Accelerate forward
    if (keys.ArrowUp) {
        currentSpeed = Math.min(currentSpeed + acceleration, maxSpeed);
    } else {
        currentSpeed = Math.max(currentSpeed - acceleration * 2, 0); // Decelerate
    }

    // Reverse
    if (keys.ArrowDown) {
        currentSpeed = Math.max(currentSpeed - acceleration, -maxSpeed / 2);
    }

    // Move in the direction the spaceship is facing
    const direction = new THREE.Vector3();
    spaceship.getWorldDirection(direction);
    spaceship.position.add(direction.multiplyScalar(currentSpeed));

    // Rotation
    if (keys.ArrowLeft) spaceship.rotation.y += rotationSpeed;
    if (keys.ArrowRight) spaceship.rotation.y -= rotationSpeed;

    // Vertical movement
    if (keys.KeyW) spaceship.position.y += verticalSpeed; // Move up
    if (keys.KeyS) spaceship.position.y -= verticalSpeed; // Move down


    spaceship.position.y = Math.max(minHeight, Math.min(maxHeight, spaceship.position.y));


    if (thrusterParticleSystem) {
        const thrusterPosition = new THREE.Vector3(8, -0.3, -9);
        spaceship.localToWorld(thrusterPosition);
        thrusterParticleSystem._points.position.copy(thrusterPosition);

        const thrusterRotation = new THREE.Quaternion();
        spaceship.getWorldQuaternion(thrusterRotation);
        thrusterRotation.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)));
        thrusterParticleSystem._points.quaternion.copy(thrusterRotation);





        const normalizedSpeed = Math.max(currentSpeed / maxSpeed, 0.1);
        thrusterParticleSystem.Step(deltaTime, normalizedSpeed);
    }

}

export { updateSpaceshipPosition };
