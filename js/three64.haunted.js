// import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')



// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog('#262837', 1, 20)
scene.fog = fog

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

// Load all door textures
const doorColorTexture = textureLoader.load('/assets/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/assets/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/assets/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/assets/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/assets/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/assets/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/assets/textures/door/roughness.jpg')

// Load all wall textures
const wallColorTexture = textureLoader.load('/assets/textures/bricks/color.jpg')
const wallAmbientOcclusionTexture = textureLoader.load('/assets/textures/bricks/ambientOcclusion.jpg')
const wallNormalTexture = textureLoader.load('/assets/textures/bricks/normal.jpg')
const wallRoughnessTexture = textureLoader.load('/assets/textures/bricks/roughness.jpg')

// Load all grass textures
const grassColorTexture = textureLoader.load('/assets/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/assets/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/assets/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/assets/textures/grass/roughness.jpg')

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping




/**
 * House Group
 */

const house = new THREE.Group()
scene.add(house)

// Walls
const brikTexture = textureLoader.load('/assets/textures/bricks/color.jpg')
console.log(brikTexture);

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ map: wallColorTexture, aoMap: wallAmbientOcclusionTexture, normalMap: wallNormalTexture, roughnessMap: wallRoughnessTexture })
)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
walls.position.y = 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.rotation.y = Math.PI * 0.25 // 45 degrees
roof.position.y = 2.5 + 0.5
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({ map: doorColorTexture, transparent: true, alphaMap: doorAlphaTexture, aoMap: doorAmbientOcclusionTexture, displacementMap: doorHeightTexture, displacementScale: 0.1, metalnessMap: doorMetalnessTexture, normalMap: doorNormalTexture, roughnessMap: doorRoughnessTexture })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.z = 2 + 0.01
door.position.y = 1
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

/**
 * Graves Group
 */

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 50; i++) {

    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}



// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ map: grassColorTexture, aoMap: grassAmbientOcclusionTexture, normalMap: grassNormalTexture, roughnessMap: grassRoughnessTexture })
)
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)


/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.03)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.07)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)


/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = 10
camera.position.z = 20
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap



/**
 * Lights - Enable shadows
 */

// Directional light (Moonlight) to cast shadows
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 256 // Lower resolution to optimize performance
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// Door light to cast shadows
doorLight.castShadow = true
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

// Ghosts casting shadows
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

/**
 * House and related objects - Enable shadows
 */

// Walls
walls.castShadow = true
walls.receiveShadow = true

// Roof
roof.castShadow = true
roof.receiveShadow = true

// Door
door.castShadow = true
door.receiveShadow = true

// Bushes
bush1.castShadow = true
bush1.receiveShadow = true
bush2.castShadow = true
bush2.receiveShadow = true
bush3.castShadow = true
bush3.receiveShadow = true
bush4.castShadow = true
bush4.receiveShadow = true

// Graves casting and receiving shadows
graves.children.forEach(grave => {
    grave.castShadow = true
    grave.receiveShadow = true
})

/**
 * Floor - Receive shadows
 */

floor.receiveShadow = true

const clock = new THREE.Clock()

/**
 * Animate and Render Scene
 */

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()