import * as THREE from 'three';

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcccccc, 10, 100);

export { scene };
