import * as THREE from "three";

const planetVertexShader =
    `
varying vec2 frag_UV;
varying vec3 frag_normal;
varying vec3 frag_pos;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    frag_pos = worldPos.xyz;
    frag_UV = uv;
    frag_normal = normal;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

const planetFragmentShader =
    `
varying vec2 frag_UV;
varying vec3 frag_pos;
varying vec3 frag_normal;
uniform sampler2D normalMap;
uniform sampler2D diffuseMap;
uniform vec3 edgeColor;
uniform vec3 ambientColor;
uniform float smoothness;
uniform mat3 normalMatrix;
uniform float specularFactor;
uniform int validNormalMap;

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};
uniform DirectionalLight directionalLights[1];

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN ) {
    vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
    vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
    vec2 st0 = dFdx( frag_UV.st );
    vec2 st1 = dFdy( frag_UV.st );
    float scale = sign( st1.t * st0.s - st0.t * st1.s );
    vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
    vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
    vec3 N = normalize( surf_norm );
    mat3 tsn = mat3( S, T, N );
    mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );
    return normalize( tsn * mapN );
}

void main() {
    vec3 transformedNormal;
    vec3 cameraVec = normalize(-(viewMatrix * vec4(frag_pos, 1.0)).xyz);

    // 根据normalmap重新计算normal
    if (validNormalMap > 0) {
        vec3 mapN = normalize(texture2D(normalMap, frag_UV).xyz * 2.0 - 1.0);
        vec3 eye_pos = (viewMatrix * vec4(frag_pos, 1.0)).xyz;
        transformedNormal = normalize(normalMatrix * perturbNormal2Arb(eye_pos , frag_normal, mapN));
    } else {
        transformedNormal = normalize(normalMatrix * frag_normal);
    }
    
    // 光照pass
    // 漫反射
    float diffuseStrength = max(0.0, dot(-directionalLights[0].direction, transformedNormal));

    // 高光
    vec3 halfVector = normalize(-directionalLights[0].direction + cameraVec);
    float specularStrength = max(0.0, dot(halfVector, transformedNormal));
    specularStrength = pow(specularStrength, smoothness);
    vec3 specularAdditionColor = directionalLights[0].color * specularStrength * specularFactor;

    // 边缘着色pass
    float edgeColorFactor = 1.0 - dot(transformedNormal, cameraVec);
    float throwRange = 0.55;
    edgeColorFactor = max(0.0, edgeColorFactor - throwRange) * (1.0 / (1.0 - throwRange));
    edgeColorFactor = pow(edgeColorFactor, 1.2);

    vec4 texColor = texture2D(diffuseMap, frag_UV);
    vec3 composeColor = texColor.rgb * diffuseStrength + specularAdditionColor + ambientColor * (1.0 - diffuseStrength);
    gl_FragColor = vec4(composeColor + edgeColor * edgeColorFactor, 1.0);
}
`
const glowVertexShader =
    `
varying vec2 frag_UV;
varying vec3 frag_normal;
varying vec3 frag_pos;
void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    frag_pos = worldPos.xyz;
    frag_UV = uv;
    frag_normal = normal;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

const glowFragmentShader =
    `
varying vec2 frag_UV;
varying vec3 frag_pos;
varying vec3 frag_normal;
uniform vec3 glowColor;
uniform float glowFactor;
uniform mat3 normalMatrix;
void main() {
    vec3 trans_normal = -normalMatrix * frag_normal;
    vec3 cameraVec = normalize(-(viewMatrix * vec4(frag_pos, 1.0)).xyz);
    float edgeColorFactor = dot(trans_normal, cameraVec);
    edgeColorFactor = pow(edgeColorFactor, 3.0);
    gl_FragColor = vec4(glowColor, edgeColorFactor * 2.5 * glowFactor);
}
`

export default class Planet {
    radius: number = 1.0;
    edgeColor: THREE.Vector3 = new THREE.Vector3(1.0, 1.0, 1.0);
    colorMap: string = null;
    rotateSpeed: number = 10;

    // private
    _threeMeshObject: THREE.Object3D = null;
    _threeTrackMeshObject: THREE.Object3D = null;
    _textureLoader = new THREE.TextureLoader();
    _planetMaterial: THREE.ShaderMaterial = null;
    _planetGlowMaterial: THREE.ShaderMaterial = null;

    // move info
    _selfRotSpeed: number = 0; // 自转速度，degree / s
    _revolutionSpeed: number = 0; // 公转速度，degree / s
    _revolutionRadius: number = 0;
    _parentPlanet: Planet = null;
    _currentRevolutionDegree: number = Math.random() * 360;

    constructor(radius: number, edgeColor: THREE.Vector3, colorMap: string, rotateSpeed: number = 10/* n degree per sec */) {
        this.radius = radius;
        this.edgeColor = edgeColor;
        this.colorMap = colorMap;
        this.rotateSpeed = rotateSpeed;

        this._buildObject();
    }

    thObject(): THREE.Object3D {
        return this._threeMeshObject;
    }

    trackThObject(): THREE.Object3D {
        return this._threeTrackMeshObject;
    }

    update(delta, elapsedTime) {
        if (this._selfRotSpeed > 0 && this._threeMeshObject) {
            let rotateRad = this._selfRotSpeed * delta / 1000.0 / 180.0 * Math.PI;
            this._threeMeshObject.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateRad);
        }
        if (this._parentPlanet) {
            this._currentRevolutionDegree += this._revolutionSpeed * delta / 1000.0;
            let rad = this._currentRevolutionDegree / 180.0 * Math.PI;
            let offsetX = Math.cos(rad) * this._revolutionRadius;
            let offsetZ = Math.sin(rad) * this._revolutionRadius;
            let parentPos = this._parentPlanet.thObject().position;
            this._threeMeshObject.position.set(parentPos.x + offsetX, parentPos.y, parentPos.z + offsetZ);
        }
    }

    setNormalMap(normalMap: string) {
        this._textureLoader.load(normalMap, (texture) => {
            texture.repeat.set(1, 1);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.mipmaps[0] = texture.image;
            texture.generateMipmaps = true;
            texture.needsUpdate = true;
            this._planetMaterial.uniforms.normalMap.value = texture;
            this._planetMaterial.uniforms.validNormalMap.value = 1;
        });
    }

    setMoveInfo(selfRotSpeed: number, revolutionSpeed: number, revolutionRadius: number, parentPlanet: Planet) {
        this._selfRotSpeed = selfRotSpeed;
        this._revolutionSpeed = revolutionSpeed;
        this._revolutionRadius = revolutionRadius;
        this._parentPlanet = parentPlanet;

        // build track
        if (!this._threeTrackMeshObject) {
            let circleGem = new THREE.CircleGeometry(this._revolutionRadius, 64, 0, Math.PI * 2);
            circleGem.vertices.shift();
            let circleMesh = new THREE.Line(circleGem, new THREE.LineBasicMaterial({
                color: 0x444444
            }));
            this._threeTrackMeshObject = circleMesh;
            this._threeTrackMeshObject.rotateX(Math.PI * 0.5);
        }
    }

    // private method
    _buildObject() {
        this._threeMeshObject = new THREE.Object3D();

        let planetGem = new THREE.SphereGeometry(this.radius, 35, 35);
        this._planetMaterial = new THREE.ShaderMaterial({
            uniforms: {
                diffuseMap: new THREE.Uniform(null),
                normalMap: new THREE.Uniform(null),
                validNormalMap: new THREE.Uniform(0),
                directionalLights: new THREE.Uniform([{
                    direction: (new THREE.Vector3(-0.2, -1, -1)).normalize(),
                    color: new THREE.Vector3(1, 1, 1)
                }]),
                edgeColor: new THREE.Uniform(this.edgeColor),
                ambientColor: new THREE.Uniform(new THREE.Vector3(0.1, 0.1, 0.1)),
                smoothness: new THREE.Uniform(500.0),
                specularFactor: new THREE.Uniform(0.7) 
            },
            vertexShader: planetVertexShader,
            fragmentShader: planetFragmentShader,
            flatShading: false
        });
        this._planetMaterial.extensions.derivatives = true;
        this._planetMaterial.side = THREE.FrontSide;
        let planetMesh = new THREE.Mesh(planetGem, this._planetMaterial);
        planetMesh.position.set(0, 0, 0);
        this._threeMeshObject.add(planetMesh);

        if (this.colorMap) {
            this._textureLoader.load(this.colorMap, (texture) => {
                texture.repeat.set(1, 1);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.mipmaps[0] = texture.image;
                texture.generateMipmaps = true;
                texture.needsUpdate = true;
                this._planetMaterial.uniforms.diffuseMap.value = texture;
            });
        }

        // create glow sphere
        let planetGlowGem = new THREE.SphereGeometry(this.radius * 1.16, 32, 32);
        this._planetGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: new THREE.Uniform(this.edgeColor),
                glowFactor: new THREE.Uniform(1.0)
            },
            vertexShader: glowVertexShader,
            fragmentShader: glowFragmentShader,
        });
        this._planetGlowMaterial.side = THREE.BackSide;
        this._planetGlowMaterial.blending = THREE.CustomBlending;
        this._planetGlowMaterial.blendEquation = THREE.AddEquation;
        this._planetGlowMaterial.blendSrc = THREE.SrcAlphaFactor;
        this._planetGlowMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;
        let planetObjGlow = new THREE.Mesh(planetGlowGem, this._planetGlowMaterial);
        planetObjGlow.position.set(0, 0, 0);
        this._threeMeshObject.add(planetObjGlow);
    }
}