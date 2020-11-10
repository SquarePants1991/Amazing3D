import * as THREE from 'three';
import { Vector2, Vector3, WebGLRenderer } from 'three';
import FluidSimulator, {FluidUnit} from './fluid_simulator'

let gl: WebGLRenderingContext = null;
let canvas: HTMLCanvasElement = null;
let fpsText: HTMLDivElement = null;
let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGL1Renderer;
var lastUpdateTime: number = 0;
let fluidSim: FluidSimulator;
let fluidMesh: THREE.Geometry;

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

    window.onresize = function(evt: Event) {
        console.log(evt);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = '' + window.innerWidth;
        canvas.style.height = '' + window.innerHeight;
    };
    
    renderer = new THREE.WebGL1Renderer({
        canvas: canvas
    });

    scene  = new THREE.Scene();
    camera = new THREE.Camera();
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3;
    camera.lookAt(0, 0, 0);

    let orthProj =  new THREE.Matrix4();
    orthProj.makeOrthographic(-canvas.width * 0.5, canvas.width * 0.5, -canvas.height * 0.5, canvas.height * 0.5, 0.01, 1000);
    camera.projectionMatrix = orthProj;

    scene.background = new THREE.Color("#111111");

    fluidSim = new FluidSimulator(canvas.width, canvas.height);
    fluidMesh = new THREE.Geometry();
    fluidMesh.vertices.push(new THREE.Vector3(100, 100, 0));

    var object = new THREE.Points( fluidMesh, new THREE.PointsMaterial({
        size: 8,
        color: "#ffff00"
    }));
    scene.add(object);

    var bufferTexture = new THREE.WebGLRenderTarget(1,1, { type: THREE.FloatType});
    renderer.setRenderTarget(bufferTexture);
    renderer.render(scene, camera);
    var pixels = new Float32Array(1 * 4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, pixels);
    renderer.setRenderTarget(null);
    console.log(pixels);
}

function render() {
    // logic code
    let now = new Date().getTime();
    let delta = now - lastUpdateTime;
    lastUpdateTime = now;

    fluidSim.step(delta / 1000.0);

    
    fluidMesh.vertices.splice(0, fluidMesh.vertices.length);
    for (let unitKey in fluidSim.units) {
        let unit: FluidUnit = fluidSim.units[unitKey];
        fluidMesh.vertices.push(new Vector3(unit.xLoc, unit.yLoc, 0));
    }
    fluidMesh.verticesNeedUpdate = true;

    renderer.render(scene, camera);

    fpsText.innerHTML = "FPS: " + Math.round(1000/delta);
    
    requestAnimationFrame(render);
}

window.onload = () => {

    // 主流程
    prepare();

    document.onclick = () => {
        console.log(">>>>>>>");
        fluidSim.GRAVITY = -fluidSim.GRAVITY;
    };

    lastUpdateTime = new Date().getTime();
    render();
}