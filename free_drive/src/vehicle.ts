
import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import './global_ammo'
import { FileLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class VehicleInfo {
    mass: number = 800;
    // 底盘
    chassisSize: Ammo.btVector3;
    chassisCenterOffset: Ammo.btVector3;
    chassisMesh: THREE.Object3D;

    // 轮胎
    wheelPositions: Ammo.btVector3[] = [];
    wheelRadius: number[] = [];
    wheelMeshes: THREE.Object3D[] = [];
    wheelCanDrive: boolean[] = [];

    // 悬挂和摩擦系数
    friction: number = 1000;
    suspensionStiffness: number = 20.0;
    suspensionDamping: number = 2.3;
    suspensionCompression: number = 4.4;
    suspensionRestLength: number = 0.6;
    rollInfluence: number = 0.2;

    // 操控
    steeringIncrement = .04;
    steeringClamp = .5;
    maxEngineForce = 2000;
    maxBreakingForce = 100;

    // helpers
    useCalibrateMesh = true;

    // helpers
    fourWheelStandard() {
        this.chassisSize = new GAmmo.btVector3(1.8, 0.6, 4);
        this.chassisCenterOffset = new GAmmo.btVector3(0, 0, 0);
        this.chassisMesh = this.calibrateChassisMesh(this.chassisSize);

        // four wheel
        const frontWheelRadius = 0.35;
        const frontWheelWidth = 0.2;
        const backWheelRadius = 0.4;
        const backWheelWidth = 0.3;
        // front left
        this.wheelPositions.push(new GAmmo.btVector3(1, 0.0, 1.7));
        this.wheelRadius.push(frontWheelRadius);
        this.wheelMeshes.push(this.calibrateWheelMesh(frontWheelRadius, frontWheelWidth));
        this.wheelCanDrive.push(true);
        // front right
        this.wheelPositions.push(new GAmmo.btVector3(-1, 0.0, 1.7));
        this.wheelRadius.push(frontWheelRadius);
        this.wheelMeshes.push(this.calibrateWheelMesh(frontWheelRadius, frontWheelWidth));
        this.wheelCanDrive.push(true);
        // back left
        this.wheelPositions.push(new GAmmo.btVector3(1, 0.0, -1));
        this.wheelRadius.push(backWheelRadius);
        this.wheelMeshes.push(this.calibrateWheelMesh(backWheelRadius, backWheelWidth));
        this.wheelCanDrive.push(false);
        // back right
        this.wheelPositions.push(new GAmmo.btVector3(-1, 0.0, -1));
        this.wheelRadius.push(backWheelRadius);
        this.wheelMeshes.push(this.calibrateWheelMesh(backWheelRadius, backWheelWidth));
        this.wheelCanDrive.push(false);
    }

    calibrateChassisMesh(size: Ammo.btVector3) {
        let gem = new THREE.BoxGeometry(size.x(), size.y(), size.z());
        let mat = new THREE.MeshPhongMaterial({
            color: "#ff0000",
            reflectivity: 0.8,
            specular: "#ffffff",
            shininess: 1000
        });
        let mesh = new THREE.Mesh(gem, mat);
        return mesh;
    }

    calibrateWheelMesh(radius: number, width: number) {
        let gem = new THREE.CylinderGeometry(radius, radius, width);
        let mat = new THREE.MeshPhongMaterial({
            color: "#ff0000",
            reflectivity: 0.8,
            specular: "#ffffff",
            shininess: 1000
        });
        let mesh = new THREE.Mesh(gem, mat);
        let wrapper = new THREE.Object3D();
        mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 0.5);
        wrapper.add(mesh);
        return wrapper;
    }

    async loadFromConfig(configFileUrl, completed) {
        let fileLoader = new FileLoader();
        const objLoader = new GLTFLoader();
        let data = await fileLoader.loadAsync(configFileUrl);
        let jsonObj = null;
        try {
            jsonObj = JSON.parse(data);
        } catch (e) { }
        if (jsonObj == null) {
            return completed(false, null);
        }
        console.log(data);
        // 1. find files & load
        var files = [];
        let filesPath = jsonObj["files"];
        if (!filesPath) {
            return completed(false, null);
        }
        for (let filePath of filesPath) {
            let file = await objLoader.loadAsync(filePath);
            files.push(file);
        }
        // 2. load body
        {
            let body = jsonObj["body"];
            let mesh = files[body["mesh"]["file"]].scene.getObjectByName(body["mesh"]["name"]);
            if (body["mesh"]["translate"]) {
                mesh.position.set(body["mesh"]["translate"][0], body["mesh"]["translate"][1], body["mesh"]["translate"][2]);
            }
            if (body["mesh"]["scale"]) {
                mesh.scale.set(body["mesh"]["scale"][0], body["mesh"]["scale"][1], body["mesh"]["scale"][2]);
            }
            if (body["mesh"]["rotate"]) {
                mesh.rotateX(body["mesh"]["rotate"][0]);
                mesh.rotateY(body["mesh"]["rotate"][1]);
                mesh.rotateZ(body["mesh"]["rotate"][2]);
            }
            let bodyObject3D = new THREE.Object3D();
            let bodyBox = new THREE.Box3().setFromObject(mesh);
            this.chassisSize = new GAmmo.btVector3(bodyBox.max.x - bodyBox.min.x, bodyBox.max.y - bodyBox.min.y, bodyBox.max.z - bodyBox.min.z);
            this.chassisCenterOffset = new GAmmo.btVector3((bodyBox.max.x + bodyBox.min.x) * 0.5, (bodyBox.max.y + bodyBox.min.y) * 0.5, (bodyBox.max.z + bodyBox.min.z) * 0.5);
            if (this.useCalibrateMesh) {
                this.chassisMesh = this.calibrateChassisMesh(this.chassisSize);
            } else {
                this.chassisMesh = bodyObject3D;
            }
            bodyObject3D.add(this.chassisMesh);

            let configParams = body["config"];
            this.mass = configParams["mass"];
            this.friction = configParams["frictionSlip"];
            this.suspensionStiffness = configParams["suspensionStiffness"];
            this.suspensionDamping = configParams["suspensionDamping"];
            this.suspensionCompression = configParams["suspensionCompression"];
            this.suspensionRestLength = configParams["suspensionRestLength"];
            this.rollInfluence = configParams["rollInfluence"];
        }
        // 3. load wheel
        {
            let wheel = jsonObj["wheel"];
            let mesh = files[wheel["mesh"]["file"]].scene.getObjectByName(wheel["mesh"]["name"]);
            if (wheel["mesh"]["translate"]) {
                mesh.position.set(wheel["mesh"]["translate"][0], wheel["mesh"]["translate"][1], wheel["mesh"]["translate"][2]);
            }
            if (wheel["mesh"]["scale"]) {
                mesh.scale.set(wheel["mesh"]["scale"][0], wheel["mesh"]["scale"][1], wheel["mesh"]["scale"][2]);
            }
            if (wheel["mesh"]["rotate"]) {
                mesh.rotateX(wheel["mesh"]["rotate"][0]);
                mesh.rotateY(wheel["mesh"]["rotate"][1]);
                mesh.rotateZ(wheel["mesh"]["rotate"][2]);
            }

            let wheelBox = new THREE.Box3().setFromObject(mesh);
            this.wheelPositions = [];
            this.wheelRadius = [];
            this.wheelMeshes = [];
            this.wheelCanDrive = [];

            let wheelConfigs = wheel["configs"];
            for (let wheelConfig of wheelConfigs) {
                let radius = (wheelBox.max.y - wheelBox.min.y) * 0.5;
                let width = wheelBox.max.x - wheelBox.min.x;
                let wheelMesh = null;
                if (this.useCalibrateMesh) {
                    wheelMesh = this.calibrateWheelMesh(radius, width);
                } else {
                    wheelMesh = mesh.clone();
                }
                
                let pos = wheelConfig["position"];
                let drive = wheelConfig["drive"];
                this.wheelPositions.push(new GAmmo.btVector3(pos[0], pos[1], pos[2]));
                this.wheelRadius.push(radius);
                this.wheelMeshes.push(wheelMesh);
                this.wheelCanDrive.push(drive);
            }
        }
        completed(true, this);
        return this;
    }
}

export class Vehicle {
    DISABLE_DEACTIVATION = 4;

    physicsWorld: Ammo.btDiscreteDynamicsWorld;
    vehicle: Ammo.btRaycastVehicle;
    tuning: Ammo.btVehicleTuning;
    vehicleInfo: VehicleInfo;
    speedLimit: number = 130;
    engineForce: number = 0;
    rootThNode: THREE.Object3D;
    chassisRigidbody: Ammo.btRigidBody;

    constructor(physicsWorld: Ammo.btDiscreteDynamicsWorld) {
        this.physicsWorld = physicsWorld;
    }

    dispose() {
        if (this.vehicle) {
            this.physicsWorld.removeRigidBody(this.chassisRigidbody);
            this.physicsWorld.removeAction(this.vehicle);
        }
        if (this.rootThNode && this.vehicleInfo) {
            this.rootThNode.remove(this.vehicleInfo.chassisMesh);
            for (let wheelMesh of this.vehicleInfo.wheelMeshes) {
                this.rootThNode.remove(wheelMesh);
            }
            this.rootThNode = null;
        }
    }

    buildWithConfigFile(fileUrl: string, rootThNode: THREE.Object3D, completed: Function) {
        this.vehicleInfo = new VehicleInfo();
        this.vehicleInfo.loadFromConfig(fileUrl, (suc, info) => {
            if (suc) {
                this.build(info, rootThNode);
            }
            if (completed) {
                completed(suc);
            }
        });
    }

    build(info: VehicleInfo, rootThNode: THREE.Object3D) {
        this.rootThNode = rootThNode;
        this.vehicleInfo = info;
        let initPos = new GAmmo.btVector3(0, 4, 0);
        this.buildChassis(initPos, info, rootThNode);
        this.buildWheels(this.vehicle, info, rootThNode);
    }

    // build physics & mesh
    buildChassis(initPos: Ammo.btVector3, info: VehicleInfo, rootThNode: THREE.Object3D) {
        var baseShape = new GAmmo.btCompoundShape(true);
        var boxShape = new GAmmo.btBoxShape(new GAmmo.btVector3(info.chassisSize.x() * .5, info.chassisSize.y() * .5, info.chassisSize.z() * .5));
        var boxShapeTransform = new GAmmo.btTransform();
        boxShapeTransform.setIdentity();
        boxShapeTransform.setOrigin(this.vehicleInfo.chassisCenterOffset);
        
        baseShape.addChildShape(boxShapeTransform, boxShape);

        var transform = new GAmmo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new GAmmo.btVector3(initPos.x(), initPos.y(), initPos.z()));
        var motionState = new GAmmo.btDefaultMotionState(transform);
        var localInertia = new GAmmo.btVector3(0, 0, 0);
        baseShape.calculateLocalInertia(info.mass, localInertia);
        var body = new GAmmo.btRigidBody(new GAmmo.btRigidBodyConstructionInfo(info.mass, motionState, baseShape, localInertia));
        body.setActivationState(this.DISABLE_DEACTIVATION);
        this.physicsWorld.addRigidBody(body);
        this.chassisRigidbody = body;
        rootThNode.add(info.chassisMesh);

        var engineForce = 0;
        var vehicleSteering = 0;
        var breakingForce = 0;
        this.tuning = new GAmmo.btVehicleTuning();
        var rayCaster = new GAmmo.btDefaultVehicleRaycaster(this.physicsWorld);
        this.vehicle = new GAmmo.btRaycastVehicle(this.tuning, body, rayCaster);
        this.vehicle.setCoordinateSystem(0, 1, 2);
        this.physicsWorld.addAction(this.vehicle);
    }

    buildWheels(vehicle: Ammo.btRaycastVehicle, info: VehicleInfo, rootThNode: THREE.Object3D) {
        var FRONT_LEFT = 0;
        var FRONT_RIGHT = 1;
        var BACK_LEFT = 2;
        var BACK_RIGHT = 3;
        var wheelMeshes = [];
        var wheelDirectionCS0 = new GAmmo.btVector3(0, -1, 0);
        var wheelAxleCS = new GAmmo.btVector3(-1, 0, 0);

        for (var i = 0; i < info.wheelPositions.length; ++i) {
            var wheelInfo = vehicle.addWheel(
                info.wheelPositions[i],
                wheelDirectionCS0,
                wheelAxleCS,
                info.suspensionRestLength,
                info.wheelRadius[i],
                this.tuning,
                info.wheelCanDrive[i]);

            wheelInfo.set_m_suspensionStiffness(info.suspensionStiffness);
            wheelInfo.set_m_wheelsDampingRelaxation(info.suspensionDamping);
            wheelInfo.set_m_wheelsDampingCompression(info.suspensionCompression);
            wheelInfo.set_m_frictionSlip(info.friction);
            wheelInfo.set_m_rollInfluence(info.rollInfluence);

            rootThNode.add(info.wheelMeshes[i]);
        }
    }

    sync() {
        {
            let tm = this.vehicle.getChassisWorldTransform();
            let p = tm.getOrigin();
            let q = tm.getRotation();
            this.vehicleInfo.chassisMesh.position.set(p.x(), p.y(), p.z());
            this.vehicleInfo.chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        let wheelNum = this.vehicle.getNumWheels();
        for (var i = 0; i < wheelNum; i++) {
            this.vehicle.updateWheelTransform(i, true);
            let tm = this.vehicle.getWheelTransformWS(i);
            let p = tm.getOrigin();
            let q = tm.getRotation();
            this.vehicleInfo.wheelMeshes[i].position.set(p.x(), p.y(), p.z());
            this.vehicleInfo.wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
        }

        if (this.getSpeed() > this.speedLimit + 5) {
            this.vehicle.applyEngineForce(0, 0);
            this.vehicle.applyEngineForce(0, 1);
        } else if (this.getSpeed() < this.speedLimit - 10) {
            this.vehicle.applyEngineForce(this.engineForce, 0);
            this.vehicle.applyEngineForce(this.engineForce, 1);
        }
    }

    thChassisNode() {
        return this.vehicleInfo.chassisMesh;
    }

    // control behaviors
    enableDrive() {
        if (this.engineForce > 0) {
            return;
        }
        this.vehicle.applyEngineForce(2000, 0);
        this.vehicle.applyEngineForce(2000, 1);
        this.engineForce = 2000;
    }

    disableDrive() {
        if (this.engineForce == 0) {
            return;
        }
        this.vehicle.applyEngineForce(0, 0);
        this.vehicle.applyEngineForce(0, 1);
        this.vehicle.setBrake(60, 0);
        this.vehicle.setBrake(60, 1);
        this.engineForce = 0;
    }

    enableBrake() {
        this.vehicle.setBrake(1000, 0);
        this.vehicle.setBrake(1000, 1);
        this.vehicle.setBrake(1000, 2);
        this.vehicle.setBrake(1000, 3);
    }
    disableBrake() {
        this.vehicle.setBrake(0, 0);
        this.vehicle.setBrake(0, 1);
        this.vehicle.setBrake(0, 2);
        this.vehicle.setBrake(0, 3);
    }

    turnLeft() {
        this.vehicle.setSteeringValue(0.8, 0);
        this.vehicle.setSteeringValue(0.8, 1);
    }

    turnRight() {
        this.vehicle.setSteeringValue(-0.8, 0);
        this.vehicle.setSteeringValue(-0.8, 1);
    }

    turnClose() {
        this.vehicle.setSteeringValue(0, 0);
        this.vehicle.setSteeringValue(0, 1);
    }

    // km/hour
    setSpeedLimit(limit) {
        this.speedLimit = limit;
    }

    getSpeed() {
        return this.vehicle.getCurrentSpeedKmHour();
    }

    // camera control
    avaliableCameraSlotsNum() {
        return 1;
    }

    getCameraTransform() {

    }

}