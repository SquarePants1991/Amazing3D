
import * as THREE from 'three';

export default class FluidSimulatorGPU {
    PARTICLE_COUNT = 3000;

    indices: number[];
    unitData: Float32Array;
    firstPassTexture: THREE.WebGLRenderTarget;
    secondPassTexture: THREE.WebGLRenderTarget;


    gl: WebGLRenderingContext;
    renderer: THREE.WebGL1Renderer;
    computeGeometry: THREE.BufferGeometry;
    computePhase1Obj: THREE.Points;
    computePhase1Mat: THREE.RawShaderMaterial;
    computePhase1Scene: THREE.Scene;
    computePhase2Obj: THREE.Points;
    computePhase2Mat: THREE.RawShaderMaterial;
    computePhase2Scene: THREE.Scene;
    camera: THREE.Camera;
    canvasWidth: number;
    canvasHeight: number;


    constructor(gl: WebGLRenderingContext, renderer: THREE.WebGL1Renderer, canvasWidth: number, canvasHeight: number ) {
        this.gl = gl;
        this.renderer = renderer;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.unitData = new Float32Array(this.PARTICLE_COUNT * 4);
        this.firstPassTexture = new THREE.WebGLRenderTarget(this.PARTICLE_COUNT, 1, { type: THREE.FloatType});
        this.secondPassTexture = new THREE.WebGLRenderTarget(this.PARTICLE_COUNT, 1, { type: THREE.FloatType});

        this.fillTestData();

        this.computeGeometry = new THREE.BufferGeometry();
        this.computeGeometry.setAttribute("unit", new THREE.BufferAttribute(this.unitData, 4));
        this.computeGeometry.setIndex(this.getIndices());

        this.computePhase1Mat = new THREE.RawShaderMaterial({
            vertexShader: this.computePhase1VertexShader(),
            fragmentShader: this.computeFragmentShader(),
            uniforms: {
                count: new THREE.Uniform(this.PARTICLE_COUNT),
                deltaTime: new THREE.Uniform(0),
                gravity: new THREE.Uniform(-60)
            }
        });
        this.computePhase1Obj = new THREE.Points( this.computeGeometry, this.computePhase1Mat);
        this.computePhase1Scene = new THREE.Scene();
        this.computePhase1Scene.add(this.computePhase1Obj);


        this.computePhase2Mat = new THREE.RawShaderMaterial({
            vertexShader: this.computePhase2VertexShader(),
            fragmentShader: this.computeFragmentShader(),
            uniforms: {
                count: new THREE.Uniform(this.PARTICLE_COUNT),
                deltaTime: new THREE.Uniform(0),
                gravity: new THREE.Uniform(-60),
                refImage: new THREE.Uniform(this.firstPassTexture.texture)
            }
        });
        this.computePhase2Obj = new THREE.Points( this.computeGeometry, this.computePhase2Mat);
        this.computePhase2Scene = new THREE.Scene();
        this.computePhase2Scene.add(this.computePhase2Obj);

        this.camera = new THREE.Camera();
    }

    fillUnitData(index: number, xLoc: number, yLoc: number, velocityX: number, velocityY: number) {
        this.unitData[index * 4] = Math.floor(xLoc) * 10000 + Math.floor(yLoc);
        this.unitData[index * 4 + 1] = Math.floor(index);
        this.unitData[index * 4 + 2] = velocityX;
        this.unitData[index * 4 + 3] = velocityY;
    }

    getUnitDataFromTexture(texture: THREE.WebGLRenderTarget) {
        this.gl.readPixels(0, 0, 1, 1, this.gl.RGBA, this.gl.FLOAT, this.unitData);
    }

    getIndices() {
        return this.indices;
    }

    step(delta: number) {
        this.computePhase1Mat.uniforms.deltaTime.value = delta / 1000.0;
        this.renderer.setRenderTarget(this.firstPassTexture);
        this.renderer.render(this.computePhase1Scene, this.camera);
        this.gl.readPixels(0, 0, this.PARTICLE_COUNT, 1, this.gl.RGBA, this.gl.FLOAT, this.unitData);
        this.computeGeometry.setAttribute("unit", new THREE.BufferAttribute(this.unitData, 4));
        this.computeGeometry.attributes.unit.needsUpdate = true;

        this.computePhase2Mat.uniforms.deltaTime.value = delta / 1000.0;
        this.computePhase2Mat.uniforms.refImage.value = this.firstPassTexture.texture;
        this.renderer.setRenderTarget(this.secondPassTexture);
        this.renderer.render(this.computePhase2Scene, this.camera);
        this.gl.readPixels(0, 0, this.PARTICLE_COUNT, 1, this.gl.RGBA, this.gl.FLOAT, this.unitData);
        this.computeGeometry.setAttribute("unit", new THREE.BufferAttribute(this.unitData, 4));
        this.computeGeometry.attributes.unit.needsUpdate = true;

        this.renderer.setRenderTarget(null);
    }

    computePhase1VertexShader() {
        return `
            attribute vec4 unit;
            uniform float count;
            uniform float deltaTime;
            uniform float gravity;
            varying vec4 newData;
    
            void main() {
                float x = float(floor(unit.x / 10000.0));
                float y = unit.x - x * 10000.0;
                float vx = unit.z;
                float vy = unit.w;
                y += vy * deltaTime * 0.4;
                vy += gravity * deltaTime;
                if (y < 0.0) {
                    y = 0.0;
                    vy = -vy * 0.7;
                }

                gl_PointSize = 20.0;
                gl_Position = vec4(unit.y / count, 0, 0.0, 1.0);
                newData.x = x * 10000.0 + y;
                newData.y = unit.y;
                newData.z = vx;
                newData.w = vy;
            }
        `
    }

    computePhase2VertexShader() {
        return `
            attribute vec4 unit;
            uniform float count;
            uniform float deltaTime;
            uniform float gravity;
            uniform sampler2D refImage;
            varying vec4 newData;
    
            void main() {
                float x = float(floor(unit.x / 10000.0));
                float y = unit.x - x * 10000.0;
                float vx = unit.z;
                float vy = unit.w;

                const float icot = 4000.0;
                for (float i = 0.0; i < icot; i+=1.0) {
                    if (i > count - 1.0) {
                        break;
                    }
                    vec4 unitInfo = texture2D(refImage, vec2(i / count, 0.0));
                    float ox = float(floor(unitInfo.x / 10000.0));
                    float oy = unitInfo.x - x * 10000.0;
                    float distance = distance(vec2(x, y), vec2(ox, oy));
                    
                }

                gl_PointSize = 20.0;
                gl_Position = vec4(unit.y / count, 0, 0.0, 1.0);
                newData.x = x * 10000.0 + y;
                newData.y = unit.y;
                newData.z = vx;
                newData.w = vy;
            }
        `
    }
    
    computeFragmentShader() {
    return `
        precision highp float;
        varying vec4 newData;
        void main() {
            gl_FragColor = vec4(newData.x, newData.y, newData.z, newData.w);
        }
    `
    }

    // for test
    fillTestData() {
        this.indices = [];
        for (let i = 0; i < this.PARTICLE_COUNT; ++i) {
            this.fillUnitData(i, this.canvasWidth * Math.random(), Math.floor(this.canvasHeight * 0.3 * Math.random() + this.canvasHeight * 0.6) , 0, Math.random() * -2);
            this.indices.push(i);
        }
    }
}