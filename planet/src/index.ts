import * as THREE from 'three';
import { MeshBasicMaterial, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from 'three';
import MercuryTexture from './images/mercury.jpg'
import MarsTexture from './images/mars.jpg'
import EarthTexture from './images/earth.jpg'
import EarthTextureNormal from './images/earth_normal.png'
import VenusTexture from './images/venus.jpg'
import JupiterTexture from './images/jupiter.jpg'
import SaturnTexture from './images/saturn.jpg'
import UranusTexture from './images/uranus.jpg'
import NeptuneTexture from './images/neptune.jpg'
import SunTexture from './images/sun.jpg'
import MoonTexture from './images/moon.jpg'
import SkyTexture from './images/sky_stars.jpg'
import Planet from './planet';
import SolarSystem from './solar_system';
import CameraController from './camera_controller';

let gl: WebGLRenderingContext = null;
let canvas: HTMLCanvasElement = null;
let fpsText: HTMLDivElement = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGL1Renderer;
var lastUpdateTime: number = 0;
var planetObj: THREE.Mesh = null;
let glowMaterial: ShaderMaterial;
let elapsedTime: number = 0;
let solarSystem: SolarSystem = new SolarSystem();
let cameraCtrl: CameraController = null;


// 准备WebGL的绘制上下文
function prepare() {
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '' + window.innerWidth;
    canvas.style.height = '' + window.innerHeight;
    gl = canvas.getContext("webgl");
    console.log(gl.getExtension("GL_OES_standard_derivatives"));

    document.body.append(canvas);

    fpsText = document.createElement("div");
    document.body.append(fpsText);
    fpsText.style.position = 'absolute';
    fpsText.style.left = '20px';
    fpsText.style.top = '20px';
    fpsText.style.color = '#ffffff';

    window.onresize = function(evt: Event) {
        console.log(evt);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '' + window.innerWidth;
        canvas.style.height = '' + window.innerHeight;
    };

    window.onmousewheel = function(evt: WheelEvent) {
        let wheelDelta = evt["wheelDelta"];
        cameraCtrl.zoom(wheelDelta / 10.0);
    }


    var lastX, lastY, isMouseDown = false;
    window.onmousedown = function(evt: MouseEvent) {
        lastX = evt.x;
        lastY = evt.y;
        isMouseDown = true;
    }

    window.onmousemove = function(evt: MouseEvent) {
        if (isMouseDown) {
            let xdelta = evt.x - lastX;
            let ydelta = evt.y - lastY;
            lastX = evt.x;
            lastY = evt.y;
            cameraCtrl.rotate(xdelta / 100, ydelta / 100);
        }
    }
    
    window.onmouseup = function() {
        isMouseDown = false;
    }

    renderer = new THREE.WebGL1Renderer({
        canvas: canvas
    });

    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(20, canvas.width / canvas.height, 0.001, 2000);
    camera.position.set(70, 70, 70);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraCtrl = new CameraController(camera);

    scene.background = new THREE.Color("#111111");
    createLight();
    createBg();

    scene.add(solarSystem.thObject());
}

function createLight() {
    let dirLight = new THREE.DirectionalLight("#ffffff", 10);
    dirLight.position.set(0, 10, 0);
    dirLight.target.position.set(-5, 0, 0);
    let ambientLight = new THREE.AmbientLight("#ffffff", 1);
    scene.add(ambientLight);
}

function createBg() {
    let loader = new THREE.TextureLoader();
    loader.load(SkyTexture, (texture) => {
        let skyGem = new THREE.SphereGeometry(1000, 16, 16);
        let mesh = new THREE.Mesh(skyGem, new MeshBasicMaterial({
            side: THREE.BackSide
        }));
        mesh.material.map = texture;
        scene.add(mesh);
    });
}

function render() {
    // logic code
    let now = new Date().getTime();
    let delta = now - lastUpdateTime;
    if (delta > 0) {
        elapsedTime += delta;
        lastUpdateTime = now;

        solarSystem.update(delta, elapsedTime);
  
        renderer.render(scene, camera);

        fpsText.innerHTML = "FPS: " + Math.round(1000/delta);
    }

    requestAnimationFrame(render);
}

window.onload = () => {

    // 主流程
    prepare();

    document.onclick = () => {
    };

    lastUpdateTime = new Date().getTime();
    render();
}