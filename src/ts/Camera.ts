import {
  AbstractMesh,
  FollowCamera,
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

    camera.radius = -10;
    camera.upperRadiusLimit = -10;
    camera.lowerRadiusLimit = -5;
    camera.rotationOffset = 0;

    camera.heightOffset = 4;
    camera.lowerHeightOffsetLimit = 3;
    camera.upperHeightOffsetLimit = 7;

    camera.lockedTarget = target;

    this.camera = camera;
  }

  public getCamera() {
    return this.camera;
  }
}
