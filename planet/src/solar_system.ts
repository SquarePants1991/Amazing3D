import * as THREE from 'three';

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
import Planet from './planet'



export default class SolarSystem {
    // 假设一秒是一个小时，长度单位全部缩放1000倍，假设1AU是10，实际上要远远大于它，后期可以调整
    AU_LEN = 16;

    // 真实距离
    // planetInfo = {
    //     sun: {
    //         texture: SunTexture,
    //         color: new THREE.Vector3(176/255.0, 58/255.0, 29/255.0),
    //         radius: 69.6,
    //         selfRotSpeed: 360 / (25.38 * 24),
    //         revolutionSpeed: 0,
    //         revolutionRadius: 0,
    //         parent: null
    //     },
    //     mercury: {
    //         texture: MercuryTexture,
    //         color: new THREE.Vector3(100.0/255.0, 100/255.0, 100/255.0),
    //         radius: 0.244,
    //         selfRotSpeed: 360 / (59 * 24.0),
    //         revolutionSpeed: 360 / (87.97 * 24),
    //         revolutionRadius: this.AU_LEN * 0.3871,
    //         parent: "sun"
    //     },
    //     venus: {
    //         texture: VenusTexture,
    //         color: new THREE.Vector3(244.0/255.0, 205/255.0, 105/255.0),
    //         radius: 0.6052,
    //         selfRotSpeed: 360 / (243 * 24.0),
    //         revolutionSpeed: 360 / (225 * 24),
    //         revolutionRadius: this.AU_LEN * 0.7233,
    //         parent: "sun"
    //     },
    //     earth: {
    //         texture: EarthTexture,
    //         color: new THREE.Vector3(0.0, 251/255.0, 228/255.0),
    //         radius: 0.6378,
    //         selfRotSpeed: 360 / 24.0,
    //         revolutionSpeed: 360 / (365 * 24),
    //         revolutionRadius: this.AU_LEN,
    //         parent: "sun"
    //     },
    //     moon: {
    //         texture: MoonTexture,
    //         color: new THREE.Vector3(10/255.0, 10/255.0, 10/255.0),
    //         radius: 0.1738,
    //         selfRotSpeed: 360 / (27.32 * 24.0),
    //         revolutionSpeed: 360 / (27.32 * 24.0),
    //         revolutionRadius: this.AU_LEN * 0.1,
    //         parent: "earth"
    //     },
    //     mars: {
    //         texture: MarsTexture,
    //         color: new THREE.Vector3(208.0/255.0, 117/255.0, 79/255.0),
    //         radius: 0.3397,
    //         selfRotSpeed: 360 / 24.5,
    //         revolutionSpeed: 360 / (687 * 24),
    //         revolutionRadius: this.AU_LEN * 1.5237,
    //         parent: "sun"
    //     },
    //     jupiter: {
    //         texture: JupiterTexture,
    //         color: new THREE.Vector3(190/255.0, 172/255.0, 150/255.0),
    //         radius: 7.1492,
    //         selfRotSpeed: 360 / 9.8,
    //         revolutionSpeed: 360 / (11.86 * 365 * 24),
    //         revolutionRadius: this.AU_LEN * 5.2026,
    //         parent: "sun"
    //     },
    //     saturn: {
    //         texture: SaturnTexture,
    //         color: new THREE.Vector3(189/255.0, 172/255.0, 143/255.0),
    //         radius: 6.0268,
    //         selfRotSpeed: 360 / 10.7,
    //         revolutionSpeed: 360 / (29.46 * 365 * 24),
    //         revolutionRadius: this.AU_LEN * 9.5549,
    //         parent: "sun"
    //     },
    //     uranus: {
    //         texture: UranusTexture,
    //         color: new THREE.Vector3(182/255.0, 221/255.0, 228/255.0),
    //         radius: 2.5559,
    //         selfRotSpeed: 360 / 17.1,
    //         revolutionSpeed: 360 / (84 * 365 * 24),
    //         revolutionRadius: this.AU_LEN * 19.2184,
    //         parent: "sun"
    //     },
    //     neptune: {
    //         texture: NeptuneTexture,
    //         color: new THREE.Vector3(63/255.0, 86/255.0, 178/255.0),
    //         radius: 2.4764,
    //         selfRotSpeed: 360 / 16.1,
    //         revolutionSpeed: 360 / (164.82 * 365 * 24),
    //         revolutionRadius: this.AU_LEN * 30.1104,
    //         parent: "sun"
    //     },
    // };

    // 为了展示
    planetInfo = {
        sun: {
            texture: SunTexture,
            color: new THREE.Vector3(176/255.0, 58/255.0, 29/255.0),
            radius: 3,
            selfRotSpeed: 360 / (25.38 * 24),
            revolutionSpeed: 0,
            revolutionRadius: 0,
            parent: null
        },
        mercury: {
            texture: MercuryTexture,
            color: new THREE.Vector3(100.0/255.0, 100/255.0, 100/255.0),
            radius: 0.383,//0.244,
            selfRotSpeed: 360 / (59 * 24.0),
            revolutionSpeed: 360 / (87.97 * 24),
            revolutionRadius: this.AU_LEN * 0.3871,
            parent: "sun"
        },
        venus: {
            texture: VenusTexture,
            color: new THREE.Vector3(244.0/255.0, 205/255.0, 105/255.0),
            radius: 0.95,//0.6052,
            selfRotSpeed: 360 / (243 * 24.0),
            revolutionSpeed: 360 / (225 * 24),
            revolutionRadius: this.AU_LEN * 0.7233,
            parent: "sun"
        },
        earth: {
            texture: EarthTexture,
            color: new THREE.Vector3(0.0, 251/255.0, 228/255.0),
            radius: 1,//0.6378,
            selfRotSpeed: 360 / 24.0,
            revolutionSpeed: 360 / (365 * 24),
            revolutionRadius: this.AU_LEN,
            parent: "sun"
        },
        moon: {
            texture: MoonTexture,
            color: new THREE.Vector3(10/255.0, 10/255.0, 10/255.0),
            radius: 0.272,
            selfRotSpeed: 360 / (27.32 * 24.0),
            revolutionSpeed: 360 / (27.32 * 24.0),
            revolutionRadius: this.AU_LEN * 0.1,
            parent: "earth"
        },
        mars: {
            texture: MarsTexture,
            color: new THREE.Vector3(208.0/255.0, 117/255.0, 79/255.0),
            radius: 0.532,
            selfRotSpeed: 360 / 24.5,
            revolutionSpeed: 360 / (687 * 24),
            revolutionRadius: this.AU_LEN * 1.5237,
            parent: "sun"
        },
        jupiter: {
            texture: JupiterTexture,
            color: new THREE.Vector3(190/255.0, 172/255.0, 150/255.0),
            radius: 2.1,
            selfRotSpeed: 360 / 9.8,
            revolutionSpeed: 360 / (11.86 * 365 * 24),
            revolutionRadius: this.AU_LEN * 2.2026,
            parent: "sun"
        },
        saturn: {
            texture: SaturnTexture,
            color: new THREE.Vector3(189/255.0, 172/255.0, 143/255.0),
            radius: 1.8,
            selfRotSpeed: 360 / 10.7,
            revolutionSpeed: 360 / (29.46 * 365 * 24),
            revolutionRadius: this.AU_LEN * 2.5549,
            parent: "sun"
        },
        uranus: {
            texture: UranusTexture,
            color: new THREE.Vector3(182/255.0, 221/255.0, 228/255.0),
            radius: 1.6,
            selfRotSpeed: 360 / 17.1,
            revolutionSpeed: 360 / (84 * 365 * 24),
            revolutionRadius: this.AU_LEN * 3.2184,
            parent: "sun"
        },
        neptune: {
            texture: NeptuneTexture,
            color: new THREE.Vector3(63/255.0, 86/255.0, 178/255.0),
            radius: 1.2,
            selfRotSpeed: 360 / 16.1,
            revolutionSpeed: 360 / (164.82 * 365 * 24),
            revolutionRadius: this.AU_LEN * 4.1104,
            parent: "sun"
        },
    };


    planets = {}

    _thObject: THREE.Object3D = null;

    constructor() {
        this._thObject = new THREE.Object3D();
        this.buildPlants();
    }
    
    thObject() {
        return this._thObject;
    }

    buildPlants() {
        for (let name in this.planetInfo) {
            let info = this.planetInfo[name];
            let planet = new Planet(info.radius, info.color, info.texture);
            this._thObject.add(planet.thObject());
            this.planets[name] = planet;
        }

        for (let name in this.planetInfo) {
            let info = this.planetInfo[name];
            let planet: Planet = this.planets[name];
            planet.setMoveInfo(info.selfRotSpeed, info.revolutionSpeed, info.revolutionRadius, info.parent ? this.planets[info.parent] : null);
            this._thObject.add(planet.trackThObject());
        }
    }

    update(delta, elapsedTime) {
        let timeSpeedUp = 2000;
        for (let planetKey in this.planets) {
            this.planets[planetKey].update(delta * timeSpeedUp, elapsedTime * timeSpeedUp);
        }
    }
} 