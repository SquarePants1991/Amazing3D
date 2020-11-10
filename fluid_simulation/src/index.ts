import * as THREE from 'three';
import { Vector2, Vector3, WebGLRenderer } from 'three';
import FluidSimulatorGPU from './fluid_simulator_gpu'

let gl: WebGLRenderingContext = null;
let canvas: HTMLCanvasElement = null;
let fpsText: HTMLDivElement = null;
let scene: THREE.Scene;
let camera: THREE.Camera;
let renderer: THREE.WebGL1Renderer;
var lastUpdateTime: number = 0;
let fluidSim: FluidSimulatorGPU;
let fluidMesh: THREE.BufferGeometry;

function displayVertexShader() {
    return `
        attribute vec4 position;
        uniform float halfW;
        uniform float halfH;

        void main() {
            float x = float(floor(position.x / 10000.0));
            float y = position.x - x * 10000.0;
            int index = int(floor(position.y));
            gl_PointSize = 2.0;
            gl_Position = vec4(x/halfW - 1.0, y/halfH - 1.0, 0.0, 1.0);
        }
    `
}

function displayFragmentShader() {
return `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`
}

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

    fluidSim = new FluidSimulatorGPU(gl, renderer, canvas.width, canvas.height);
    fluidMesh = new THREE.BufferGeometry();
    fluidMesh.setAttribute("position", new THREE.BufferAttribute(fluidSim.unitData, 4));
    fluidMesh.setIndex(fluidSim.getIndices());

    var displayObj = new THREE.Points( fluidMesh, new THREE.RawShaderMaterial({
        vertexShader: displayVertexShader(),
        fragmentShader: displayFragmentShader(),
        uniforms: {
            halfH: new THREE.Uniform(canvas.height * 0.5),
            halfW: new THREE.Uniform(canvas.width * 0.5),
        }
    }));
    scene.add(displayObj);
}

function render() {
    // logic code
    let now = new Date().getTime();
    let delta = now - lastUpdateTime;
    if (delta > 0) {
        lastUpdateTime = now;

        fluidSim.step(delta);
        fluidMesh.setAttribute("position", new THREE.BufferAttribute(fluidSim.unitData, 4));
        fluidMesh.attributes.position.needsUpdate = true;
        // renderer.setRenderTarget(fluidSim.firstPassTexture);
        renderer.render(scene, camera);
        // renderer.setRenderTarget(null);

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