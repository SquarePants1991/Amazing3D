import * as THREE from 'three';
import { MeshBasicMaterial, Vector2, Vector3, WebGLRenderer } from 'three';
import Ammo from 'ammojs-typed';
import { Vehicle, VehicleInfo } from './vehicle'
import './global_ammo'

var AM = null;

let gl: WebGLRenderingContext = null;
let canvas: HTMLCanvasElement = null;
let fpsText: HTMLDivElement = null;
let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGL1Renderer;
var lastUpdateTime: number = 0;

var testSphere: THREE.Mesh = null;
var testSphereRigidbody: Ammo.btRigidBody = null;

// physics
var physicsWorld: Ammo.btDiscreteDynamicsWorld = null;
var car: Vehicle = null;


// 准备WebGL的绘制上下文
function prepare() {
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '' + window.innerWidth;
    canvas.style.height = '' + window.innerHeight;
    gl = canvas.getContext("webgl");

    document.body.append(canvas);

    fpsText = document.createElement("div");
    document.body.append(fpsText);
    fpsText.style.position = 'absolute';
    fpsText.style.left = '20px';
    fpsText.style.top = '20px';
    fpsText.style.color = '#ffffff';

    window.onresize = function (evt: Event) {
        console.log(evt);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '' + window.innerWidth;
        canvas.style.height = '' + window.innerHeight;
    };

    renderer = new THREE.WebGL1Renderer({
        canvas: canvas
    });

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.001, 2000);
    camera.position.x = 0;
    camera.position.y = 3;
    camera.position.z = -5;
    camera.lookAt(0, 0, 0);

    scene.background = new THREE.Color("#111111");

    // var loader = new THREE.CubeTextureLoader();
    // let cubeTexture = loader.load([
    //     "imgs/posx.jpg", 
    //     "imgs/negx.jpg",
    //     "imgs/posy.jpg",
    //     "imgs/negy.jpg",
    //     "imgs/posz.jpg", 
    //     "imgs/negz.jpg"])


    // let gem = new THREE.SphereGeometry(0.5, 40, 40);
    // let mat = new THREE.MeshPhongMaterial({
    //     color: "#ff0000",
    //     envMap: cubeTexture,
    //     reflectivity: 0.8,
    //     specular: "#ffffff",
    //     shininess: 1000
    // });
    // testSphere = new THREE.Mesh(gem, mat);
    // testSphere.position.set(0,2,0);
    // scene.add(testSphere);

    let directionLight = new THREE.DirectionalLight("#ffffff", 1);
    directionLight.position.set(2,2,2);
    scene.add(directionLight);

    let ambientLight = new THREE.AmbientLight("#555555");
    scene.add(ambientLight);

    // build physics world
    buildPhysicsWorld();
}

function render() {
    // logic code
    let now = new Date().getTime();
    let delta = now - lastUpdateTime;
    if (delta > 0) {
        lastUpdateTime = now;

        physicsWorld.stepSimulation(delta);
        car.sync();
        renderer.render(scene, camera);

        fpsText.innerHTML = "FPS: " + Math.round(1000 / delta);
    }

    requestAnimationFrame(render);
}

function buildPhysicsWorld() {
    let collisionConfiguration = new GAmmo.btDefaultCollisionConfiguration(),
        dispatcher = new GAmmo.btCollisionDispatcher(collisionConfiguration),
        overlappingPairCache = new GAmmo.btDbvtBroadphase(),
        solver = new GAmmo.btSequentialImpulseConstraintSolver();

    physicsWorld = new GAmmo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    physicsWorld.setGravity(new GAmmo.btVector3(0, -10, 0));

    // build floor
{
    let motionState = new GAmmo.btDefaultMotionState();
    let collisionShape = new GAmmo.btStaticPlaneShape(new GAmmo.btVector3(0, 1, 0), 0);
    let inertia = new GAmmo.btVector3();
    collisionShape.calculateLocalInertia(0, inertia);
    let info: Ammo.btRigidBodyConstructionInfo = new GAmmo.btRigidBodyConstructionInfo(0, motionState, collisionShape, inertia);
    let floorRigidbody = new GAmmo.btRigidBody(info);
    physicsWorld.addRigidBody(floorRigidbody);
}
}

window.onload = () => {

    Ammo().then((am) => {
        global.GAmmo = am;
        // 主流程
        prepare();


        car = new Vehicle(physicsWorld);
        let vehicleInfo = new VehicleInfo();
        vehicleInfo.fourWheelStandard();
        car.build(vehicleInfo, scene);
        
        document.onclick = () => {
        };

        lastUpdateTime = new Date().getTime();
        render();
    });
}