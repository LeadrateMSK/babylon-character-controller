import {
  ArcRotateCamera,
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
    this.create();
  }

  private create() {
    // eslint-disable-next-line max-len
    // const camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 5, -10), scene);
    // eslint-disable-next-line max-len
    const camera = new FollowCamera('camera', new Vector3(0, 0, -50), this.scene);
    // camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl();
    camera.radius = 10;
    camera.upperRadiusLimit = 10;
    camera.lowerRadiusLimit = 5;
    camera.rotationOffset = 0;

    camera.heightOffset = 4;
    camera.lowerHeightOffsetLimit = 3;
    camera.upperHeightOffsetLimit = 7;

    this.camera = camera;
    // camera.cameraDirection = new Vector3(-20, 0, -20);
    // camera.maxCameraSpeed = 2;
  }

  public getCamera() {
    return this.camera;
  }
}
