/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/*! exports provided: ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, AxisHelper, BackSide, BasicDepthPacking, BasicShadowMap, BinaryTextureLoader, Bone, BooleanKeyframeTrack, BoundingBoxHelper, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasRenderer, CanvasTexture, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, ClosedSplineCurve3, Color, ColorKeyframeTrack, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeGeometry, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubeUVRefractionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, DataTexture, DataTexture2DArray, DataTexture3D, DataTextureLoader, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DiscreteInterpolant, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicBufferAttribute, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EdgesHelper, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, Face3, Face4, FaceColors, FileLoader, FlatShading, Float32Attribute, Float32BufferAttribute, Float64Attribute, Float64BufferAttribute, FloatType, Fog, FogExp2, Font, FontLoader, FrontSide, Frustum, GLBufferAttribute, GLSL1, GLSL3, GammaEncoding, Geometry, GeometryUtils, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, ImmediateRenderObject, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16Attribute, Int16BufferAttribute, Int32Attribute, Int32BufferAttribute, Int8Attribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, JSONLoader, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LensFlare, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, LightShadow, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LinePieces, LineSegments, LineStrip, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LogLuvEncoding, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, Math, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshFaceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiMaterial, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColors, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, ParametricBufferGeometry, ParametricGeometry, Particle, ParticleBasicMaterial, ParticleSystem, ParticleSystemMaterial, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointCloud, PointCloudMaterial, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGBDEncoding, RGBEEncoding, RGBEFormat, RGBFormat, RGBIntegerFormat, RGBM16Encoding, RGBM7Encoding, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SRGB8_ALPHA8_ASTC_10x10_Format, SRGB8_ALPHA8_ASTC_10x5_Format, SRGB8_ALPHA8_ASTC_10x6_Format, SRGB8_ALPHA8_ASTC_10x8_Format, SRGB8_ALPHA8_ASTC_12x10_Format, SRGB8_ALPHA8_ASTC_12x12_Format, SRGB8_ALPHA8_ASTC_4x4_Format, SRGB8_ALPHA8_ASTC_5x4_Format, SRGB8_ALPHA8_ASTC_5x5_Format, SRGB8_ALPHA8_ASTC_6x5_Format, SRGB8_ALPHA8_ASTC_6x6_Format, SRGB8_ALPHA8_ASTC_8x5_Format, SRGB8_ALPHA8_ASTC_8x6_Format, SRGB8_ALPHA8_ASTC_8x8_Format, Scene, SceneUtils, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, SmoothShading, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, Spline, SplineCurve, SplineCurve3, SpotLight, SpotLightHelper, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, TextBufferGeometry, TextGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, UVMapping, Uint16Attribute, Uint16BufferAttribute, Uint32Attribute, Uint32BufferAttribute, Uint8Attribute, Uint8BufferAttribute, Uint8ClampedAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShort565Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, Vertex, VertexColors, VideoTexture, WebGL1Renderer, WebGLCubeRenderTarget, WebGLMultisampleRenderTarget, WebGLRenderTarget, WebGLRenderTargetCube, WebGLRenderer, WebGLUtils, WireframeGeometry, WireframeHelper, WrapAroundEnding, XHRLoader, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, sRGBEncoding */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/***/ }),

/***/ "./src/images/earth01.jpg":
/*!********************************!*\
  !*** ./src/images/earth01.jpg ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (__webpack_require__.p + \"524d295feafb5a9972d8190c251ae508.jpg\");\n\n//# sourceURL=webpack:///./src/images/earth01.jpg?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar EarthTexture = __webpack_require__(/*! ./images/earth01.jpg */ \"./src/images/earth01.jpg\");\nvar gl = null;\nvar canvas = null;\nvar fpsText = null;\nvar scene;\nvar camera;\nvar renderer;\nvar lastUpdateTime = 0;\nvar planetObj = null;\nvar glowMaterial;\nvar elapsedTime = 0;\nfunction displayVertexShader() {\n    return \"\\n        varying vec2 frag_UV;\\n        varying vec3 frag_normal;\\n        varying vec3 frag_pos;\\n        uniform sampler2D normalMap;\\n\\n        void main() {\\n            vec4 worldPos = modelViewMatrix * vec4(position, 1.0);\\n            frag_pos = worldPos.xyz;\\n            frag_UV = uv;\\n            // frag_tangent = tangent;\\n            frag_normal = normalMatrix *  normal;\\n            gl_Position = projectionMatrix * viewMatrix * worldPos;\\n        }\\n    \";\n}\nfunction displayFragmentShader() {\n    return \"\\n    varying vec2 frag_UV;\\n    varying vec3 frag_pos;\\n    varying vec3 frag_normal;\\n    uniform sampler2D diffuse;\\n    uniform vec3 edgeColor;\\n    void main() {\\n        vec3 cameraVec = normalize(cameraPosition - frag_pos);\\n        float edgeColorFactor = 1.0 - dot(frag_normal, cameraVec);\\n        float throwRange = 0.55;\\n        edgeColorFactor = max(0.0, edgeColorFactor - throwRange) * (1.0 / (1.0 - throwRange));\\n        edgeColorFactor = pow(edgeColorFactor, 1.2);\\n        vec4 texColor = texture2D(diffuse, frag_UV);\\n        gl_FragColor = vec4(texColor.rgb + edgeColor * edgeColorFactor, 1.0);\\n    }\\n\";\n}\nfunction glowVertexShader() {\n    return \"\\n        varying vec2 frag_UV;\\n        varying vec3 frag_normal;\\n        varying vec3 frag_pos;\\n        void main() {\\n            vec4 worldPos = modelViewMatrix * vec4(position, 1.0);\\n            frag_pos = worldPos.xyz;\\n            frag_UV = uv;\\n            frag_normal = -normalMatrix *  normal;\\n            gl_Position = projectionMatrix * viewMatrix * worldPos;\\n        }\\n    \";\n}\nfunction glowFragmentShader() {\n    return \"\\n    varying vec2 frag_UV;\\n    varying vec3 frag_pos;\\n    varying vec3 frag_normal;\\n    uniform vec3 glowColor;\\n    uniform float glowFactor;\\n    void main() {\\n        vec3 cameraVec = normalize(cameraPosition - frag_pos);\\n        float edgeColorFactor = dot(frag_normal, cameraVec);\\n        edgeColorFactor = pow(edgeColorFactor, 3.0);\\n        gl_FragColor = vec4(glowColor, edgeColorFactor * 2.5 * glowFactor);\\n    }\\n\";\n}\n// 准备WebGL的绘制上下文\nfunction prepare() {\n    canvas = document.createElement(\"canvas\");\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight;\n    canvas.style.width = '' + window.innerWidth;\n    canvas.style.height = '' + window.innerHeight;\n    gl = canvas.getContext(\"webgl\");\n    document.body.append(canvas);\n    fpsText = document.createElement(\"div\");\n    document.body.append(fpsText);\n    fpsText.style.position = 'absolute';\n    fpsText.style.left = '20px';\n    fpsText.style.top = '20px';\n    fpsText.style.color = '#ffffff';\n    window.onresize = function (evt) {\n        console.log(evt);\n        canvas.width = window.innerWidth;\n        canvas.height = window.innerHeight;\n        canvas.style.width = '' + window.innerWidth;\n        canvas.style.height = '' + window.innerHeight;\n    };\n    renderer = new three__WEBPACK_IMPORTED_MODULE_0__[\"WebGL1Renderer\"]({\n        canvas: canvas\n    });\n    scene = new three__WEBPACK_IMPORTED_MODULE_0__[\"Scene\"]();\n    camera = new three__WEBPACK_IMPORTED_MODULE_0__[\"PerspectiveCamera\"](60, canvas.width / canvas.height, 0.01, 1000);\n    camera.position.x = 0;\n    camera.position.y = 0;\n    camera.position.z = 1.2;\n    camera.lookAt(0, 0, 0);\n    scene.background = new three__WEBPACK_IMPORTED_MODULE_0__[\"Color\"](\"#111111\");\n    createLight();\n    createPlanet();\n}\nfunction createPlanet() {\n    var loader = new three__WEBPACK_IMPORTED_MODULE_0__[\"TextureLoader\"]();\n    loader.load(EarthTexture, function (texture) {\n        texture.repeat.set(1, 1);\n        texture.minFilter = three__WEBPACK_IMPORTED_MODULE_0__[\"LinearFilter\"];\n        texture.magFilter = three__WEBPACK_IMPORTED_MODULE_0__[\"LinearFilter\"];\n        texture.mipmaps[0] = texture.image;\n        texture.generateMipmaps = true;\n        texture.needsUpdate = true;\n        var planetGem = new three__WEBPACK_IMPORTED_MODULE_0__[\"SphereGeometry\"](0.5, 32, 32);\n        // let planetBufferGem = new THREE.BufferGeometry();\n        // let positions = new Float32Array(planetGem.vertices.length * 3);\n        // for (let i = 0; i < planetGem.vertices.length; ++i) {\n        //     positions[i] = planetGem.vertices[i][0];\n        //     positions[i + 1] = planetGem.vertices[i][1];\n        //     positions[i + 2] = planetGem.vertices[i][2];\n        // }\n        // let uvs = new Float32Array(planetGem.faceVertexUvs.length * 2);\n        // for (let i = 0; i < planetGem.faceVertexUvs.length; ++i) {\n        //     uvs[i] = planetGem.faceVertexUvs[i][0];\n        //     uvs[i + 1] = planetGem.faceVertexUvs[i][1];\n        // }\n        // planetBufferGem.setAttribute(\"position\", new THREE.BufferAttribute(positions, 3));\n        // planetBufferGem.setAttribute(\"uv\", new THREE.BufferAttribute(uvs, 2));\n        var material = new three__WEBPACK_IMPORTED_MODULE_0__[\"ShaderMaterial\"]({\n            uniforms: {\n                diffuse: new three__WEBPACK_IMPORTED_MODULE_0__[\"Uniform\"](texture),\n                edgeColor: new three__WEBPACK_IMPORTED_MODULE_0__[\"Uniform\"](new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"](0.0, 251 / 255.0, 228 / 255.0))\n            },\n            vertexShader: displayVertexShader(),\n            fragmentShader: displayFragmentShader(),\n        });\n        material.side = three__WEBPACK_IMPORTED_MODULE_0__[\"FrontSide\"];\n        planetObj = new three__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](planetGem, material);\n        planetObj.position.set(0, 0, 0);\n        scene.add(planetObj);\n        createPlanetGlow();\n    });\n}\nfunction createPlanetGlow() {\n    var loader = new three__WEBPACK_IMPORTED_MODULE_0__[\"TextureLoader\"]();\n    var planetGem = new three__WEBPACK_IMPORTED_MODULE_0__[\"SphereGeometry\"](0.6, 32, 32);\n    glowMaterial = new three__WEBPACK_IMPORTED_MODULE_0__[\"ShaderMaterial\"]({\n        uniforms: {\n            glowColor: new three__WEBPACK_IMPORTED_MODULE_0__[\"Uniform\"](new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"](0.0, 251 / 255.0, 228 / 255.0)),\n            glowFactor: new three__WEBPACK_IMPORTED_MODULE_0__[\"Uniform\"](1.0)\n        },\n        vertexShader: glowVertexShader(),\n        fragmentShader: glowFragmentShader(),\n    });\n    glowMaterial.side = three__WEBPACK_IMPORTED_MODULE_0__[\"BackSide\"];\n    glowMaterial.blending = three__WEBPACK_IMPORTED_MODULE_0__[\"CustomBlending\"];\n    glowMaterial.blendEquation = three__WEBPACK_IMPORTED_MODULE_0__[\"AddEquation\"];\n    glowMaterial.blendSrc = three__WEBPACK_IMPORTED_MODULE_0__[\"SrcAlphaFactor\"];\n    glowMaterial.blendDst = three__WEBPACK_IMPORTED_MODULE_0__[\"OneMinusSrcAlphaFactor\"];\n    var planetObjGlow = new three__WEBPACK_IMPORTED_MODULE_0__[\"Mesh\"](planetGem, glowMaterial);\n    planetObjGlow.position.set(0, 0, 0);\n    scene.add(planetObjGlow);\n}\nfunction createLight() {\n    var dirLight = new three__WEBPACK_IMPORTED_MODULE_0__[\"DirectionalLight\"](\"#ffffff\", 10);\n    dirLight.position.set(0, 10, 0);\n    dirLight.target.position.set(-5, 0, 0);\n    var ambientLight = new three__WEBPACK_IMPORTED_MODULE_0__[\"AmbientLight\"](\"#ffffff\", 1);\n    // scene.add(dirLight);\n    scene.add(ambientLight);\n}\nfunction render() {\n    // logic code\n    var now = new Date().getTime();\n    var delta = now - lastUpdateTime;\n    if (delta > 0) {\n        elapsedTime += delta;\n        lastUpdateTime = now;\n        if (planetObj) {\n            planetObj.rotateOnAxis(new three__WEBPACK_IMPORTED_MODULE_0__[\"Vector3\"](0, 1, 0), delta / 1000);\n        }\n        if (glowMaterial) {\n            glowMaterial.uniforms.glowFactor.value = (Math.sin(elapsedTime * 0.002) + 1.0) * 0.5 * 0.7 + 0.3;\n        }\n        renderer.render(scene, camera);\n        fpsText.innerHTML = \"FPS: \" + Math.round(1000 / delta);\n    }\n    requestAnimationFrame(render);\n}\nwindow.onload = function () {\n    // 主流程\n    prepare();\n    document.onclick = function () {\n    };\n    lastUpdateTime = new Date().getTime();\n    render();\n};\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ });