import * as THREE from 'three';

export default class FollowCamera {
    _target: THREE.Object3D = null;
    _height: number = 3;
    _distance: number = 6;
    _camera: THREE.Camera;
    _forwardVec: THREE.Vector3 = new THREE.Vector3(0, 0, 1);

    constructor(camera: THREE.Camera) {
        this._camera = camera;
    }

    setTarget(target: THREE.Object3D) {
        this._target = target;
    }

    setForwardVector(vector: THREE.Vector3) {
        this._forwardVec = vector;
    }

    update(deltaInSecs: number) {
        if (this._target == null) {
            return;
        }
        let targetPos = new THREE.Vector3();
        this._target.getWorldPosition(targetPos);
        let cameraPos = this._forwardVec.clone().negate().multiplyScalar(this._distance).add(targetPos);
        cameraPos.y += this._height;
        this._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        this._camera.lookAt(targetPos);
    }
}