import { ArcRotateCamera, FollowCamera, Scene, Vector3 } from '@babylonjs/core';

const createCamera = (scene: Scene, canvas: HTMLCanvasElement) => {
  // eslint-disable-next-line max-len
  // const camera = new ArcRotateCamera('camera1', -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 5, -10), scene);
  // eslint-disable-next-line max-len
  const camera = new FollowCamera('camera', new Vector3(-6, 0, -50), scene);
  // camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl();
  camera.radius = -10;
  camera.upperRadiusLimit = 0;
  camera.lowerRadiusLimit =  -10;
  camera.rotationOffset = 0;

  camera.heightOffset = 4;
  camera.lowerHeightOffsetLimit = 1;
  camera.upperHeightOffsetLimit = 5;

  // camera.cameraDirection = new Vector3(-20, 0, -20);
  // camera.maxCameraSpeed = 2;

  return camera;
};

export default createCamera;
