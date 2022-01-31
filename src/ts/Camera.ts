import {
  AbstractMesh,
  FollowCamera,
  FollowCameraMouseWheelInput,
  Scene,
  Vector3,
} from '@babylonjs/core';

export class Camera {
  scene: Scene;

  canvas: HTMLCanvasElement;

  camera: FollowCamera;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.canvas = canvas;
  }

  public createFollowCamera(target: AbstractMesh) {
    const camera = new FollowCamera('camera', new Vector3(0, 0, 0), this.scene);
    camera.attachControl();

    camera.radius = -8;
    camera.upperRadiusLimit = -3;
    camera.lowerRadiusLimit = -11;
    camera.rotationOffset = 0;

    camera.heightOffset = 2;
    camera.lowerHeightOffsetLimit = 1;
    camera.upperHeightOffsetLimit = 5;

    camera.invertRotation = true;
    camera.lockedTarget = target;
    const inputManager = camera.inputs;
    inputManager.add(new FollowCameraMouseWheelInput());

    this.camera = camera;
  }

  public getCamera() {
    return this.camera;
  }
}
