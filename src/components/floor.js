import * as THREE from 'three';

function setupFloor(scene) {
    const textureLoader = new THREE.TextureLoader();

    const textures = {
        map: textureLoader.load('/assets/textures/rock/Rock020_1K_Color.jpg'),
        normalMap: textureLoader.load('/assets/textures/rock/Rock020_1K_Normal.jpg'),
        roughnessMap: textureLoader.load('/assets/textures/rock/Rock020_1K_Roughness.jpg'),
        aoMap: textureLoader.load('/assets/textures/rock/Rock020_1K_AmbientOcclusion.jpg'),
        displacementMap: textureLoader.load('/assets/textures/rock/Rock020_1K_Displacement.jpg'),
    };

    Object.values(textures).forEach((texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 100);
    });

    const geometry = new THREE.PlaneGeometry(1000, 1000, 256, 256);
    geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(geometry.attributes.uv.array, 2));

    const material = new THREE.MeshStandardMaterial({
        map: textures.map,
        displacementMap: textures.displacementMap,
        displacementScale: 2,
        normalMap: textures.normalMap,
        roughnessMap: textures.roughnessMap,
        aoMap: textures.aoMap,
        aoMapIntensity: 1.5,
        metalness: 0.2,
        roughness: 0.7,
    });

    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    scene.add(floor);
}

export { setupFloor };
