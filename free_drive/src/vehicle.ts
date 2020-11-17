
import * as THREE from 'three';
import Ammo from 'ammojs-typed';
import './global_ammo'

export class VehicleInfo {
    mass: number = 800;
    // 底盘
    chassisSize: Ammo.btVector3;
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
        mesh.quaternion.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI * 0.5);
        wrapper.add(mesh);
        return wrapper;
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

    constructor(physicsWorld: Ammo.btDiscreteDynamicsWorld) {
        this.physicsWorld = physicsWorld;
    }

    build(info: VehicleInfo, rootThNode: THREE.Object3D) {
        this.vehicleInfo = info;
        let initPos = new GAmmo.btVector3(0, 4, 0);
        this.buildChassis(initPos, info, rootThNode);
        this.buildWheels(this.vehicle, info, rootThNode);
    }

    // build physics & mesh
    buildChassis(initPos: Ammo.btVector3, info: VehicleInfo, rootThNode: THREE.Object3D) {
        var geometry = new GAmmo.btBoxShape(new GAmmo.btVector3(info.chassisSize.x() * .5, info.chassisSize.y() * .5, info.chassisSize.z() * .5));
        var transform = new GAmmo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new GAmmo.btVector3(initPos.x(), initPos.y(), initPos.z()));
        var motionState = new GAmmo.btDefaultMotionState(transform);
        var localInertia = new GAmmo.btVector3(0, 0, 0);
        geometry.calculateLocalInertia(info.mass, localInertia);
        var body = new GAmmo.btRigidBody(new GAmmo.btRigidBodyConstructionInfo(info.mass, motionState, geometry, localInertia));
        body.setActivationState(this.DISABLE_DEACTIVATION);
        this.physicsWorld.addRigidBody(body);
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

        for (var i = 0; i < 4; ++i) {
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
        console.log(">>>>>>>>> applyEngineForce 2000");
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