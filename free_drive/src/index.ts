import * as THREE from 'three';
import { MeshBasicMaterial, Vector2, Vector3, WebGLRenderer } from 'three';
import Ammo from 'ammojs-typed';
import { Vehicle, VehicleInfo } from './vehicle'
import './global_ammo'
import FollowCamera from './follow_camera';
import CalibrateScene from './calibrate_scene';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

var AM = null;

let gl: WebGLRenderingContext = null;
let canvas: HTMLCanvasElement = null;
let fpsText: HTMLDivElement = null;
let speedText: HTMLDivElement = null;

let followCamera: FollowCamera;
let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGL1Renderer;
var lastUpdateTime: number = 0;

// physics
var physicsWorld: Ammo.btDiscreteDynamicsWorld = null;
var car: Vehicle = null;

var calibrateScene: CalibrateScene;


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

    speedText = document.createElement("div");
    document.body.append(speedText);
    speedText.style.position = 'absolute';
    speedText.style.left = '20px';
    speedText.style.top = '50px';
    speedText.style.color = '#ffffff';

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
    camera.position.y = 10;
    camera.position.z = -10;
    camera.lookAt(0, 0, 0);

    followCamera = new FollowCamera(camera);

    scene.background = new THREE.Color("#111111");

    let directionLight = new THREE.DirectionalLight("#ffffff", 1);
    directionLight.position.set(2, 2, 2);
    scene.add(directionLight);

    let ambientLight = new THREE.AmbientLight("#555555");
    scene.add(ambientLight);

    // build physics world
    buildPhysicsWorld();

    calibrateScene = new CalibrateScene(physicsWorld, scene);
}

function render() {
    // logic code
    let now = new Date().getTime();
    let deltaInSecs = (now - lastUpdateTime) / 1000.0;
    if (deltaInSecs > 0) {
        lastUpdateTime = now;

        physicsWorld.stepSimulation(deltaInSecs);
        if (car) {
            car.sync();
            speedText.innerHTML = "Speed: " + Math.ceil(car.getSpeed()) + "km/h";
        }
        followCamera.update(deltaInSecs);
        renderer.render(scene, camera);

        fpsText.innerHTML = "FPS: " + Math.round(1 / deltaInSecs);
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
        car.buildWithConfigFile("./vehicles/cartoon_01.json", scene, (res) => {
            if (res) {
                followCamera.setTarget(car.thChassisNode());
            }
        });

        document.onclick = () => {
        };

        document.onkeydown = (evt: KeyboardEvent) => {
            if (evt.key == 'w') {
                car.enableDrive();
            } else if (evt.key == 's') {
                car.enableBrake();
            } else if (evt.key == 'a') {
                car.turnLeft();
            } else if (evt.key == 'd') {
                car.turnRight();
            }
        };
        document.onkeyup = (evt: KeyboardEvent) => {
            if (evt.key == 'w') {
                car.disableDrive();
            } else if (evt.key == 's') {
                car.disableBrake();
            } else if (evt.key == 'a') {
                car.turnClose();
            } else if (evt.key == 'd') {
                car.turnClose();
            }
        };

        lastUpdateTime = new Date().getTime();
        render();
    });
}