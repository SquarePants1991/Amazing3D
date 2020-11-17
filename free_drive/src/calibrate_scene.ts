import Ammo from 'ammojs-typed';
import './global_ammo'
import * as THREE from 'three';

export default class CalibrateScene {
    physicsWorld: Ammo.btDiscreteDynamicsWorld;
    thRootNode: THREE.Object3D;

    mapLoader = new THREE.TextureLoader();

    constructor(physicsWorld: Ammo.btDiscreteDynamicsWorld, thRootNode: THREE.Object3D) {
        this.physicsWorld = physicsWorld;
        this.thRootNode = thRootNode;

        this.build();
    }

    build() {
        let texture = this.mapLoader.load("https://tse1-mm.cn.bing.net/th/id/OIP.KALjQRDcSHmlxDDBQVm_awHaHa?pid=Api&rs=1");
        let floorGem = new THREE.BoxGeometry(2000, 0.01, 2000, 20, 20, 20);
        let floorMesh = new THREE.Mesh(floorGem, new THREE.MeshBasicMaterial(
            {
                map: texture
            }
        ));
        this.thRootNode.add(floorMesh);

        let motionState = new GAmmo.btDefaultMotionState();
        let collisionShape = new GAmmo.btStaticPlaneShape(new GAmmo.btVector3(0, 1, 0), 0);
        let inertia = new GAmmo.btVector3();
        collisionShape.calculateLocalInertia(0, inertia);
        let info: Ammo.btRigidBodyConstructionInfo = new GAmmo.btRigidBodyConstructionInfo(0, motionState, collisionShape, inertia);
        let floorRigidbody = new GAmmo.btRigidBody(info);
        this.physicsWorld.addRigidBody(floorRigidbody);
    }

    update(deltaInSecs: number) {

    }
}