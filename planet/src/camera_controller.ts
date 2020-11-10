
import * as THREE from "three";
import { Vector3, Vector4 } from "three";

export default class CameraController {
    camera: THREE.Camera;

    _xOldAngle: number = -0.1;
    _yOldAngle: number = -0.0;
    _xAngle: number = 0;
    _yAngle: number = 0;
    _offset: number = 100;
    constructor(camera: THREE.Camera) {
        this.camera = camera;
        this._sync();
    }

    _positionWithAngleOffset(xAngle: number, yAngle: number, offset: number): Vector3 {
        let xRot = new THREE.Matrix4();
        xRot.makeRotationY(xAngle);
        let yRot = new THREE.Matrix4();
        yRot.makeRotationX(yAngle);
        let translate = new THREE.Matrix4();
        translate.makeTranslation(0, 0, offset);
        let finalMatrix = xRot.multiply(yRot).multiply(translate);
        
        let pos = new Vector4(0,0,0,1);
        pos.applyMatrix4(finalMatrix);
        return new Vector3(pos.x, pos.y, pos.z);
    }

    _sync() {
        let pos = this._positionWithAngleOffset(this._xAngle, this._yAngle, this._offset);
        let keepPos = new Vector3(pos.x, pos.y, pos.z);
        let fakeNextPos = this._positionWithAngleOffset(this._xAngle, this._yAngle + 0.01, this._offset);
        let vec2 = fakeNextPos.sub(pos).normalize();
        let vec1 = pos.normalize().negate();
        let keepVec1 = new Vector3(vec1.x, vec1.y, vec1.z);
        let leftVec = vec1.cross(vec2).normalize();
        let upVec = leftVec.cross(keepVec1).normalize();
        this.camera.position.set(keepPos.x, keepPos.y, keepPos.z);
        this.camera.up.set(upVec.x, upVec.y, upVec.z);
        this.camera.lookAt(0, 0, 0);
    }

    zoom(delta: number) {
        this._offset += delta;
        this._offset = Math.max(5, Math.min(400, this._offset));
        this._sync();
    }

    rotate(xDelta, yDelta) {
        this._xAngle += xDelta;
        this._yAngle += yDelta;
        this._sync();
    }
}