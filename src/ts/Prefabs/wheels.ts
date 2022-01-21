import {
  Animation,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector4,
} from '@babylonjs/core';

const addWheels = (scene: Scene, car: Mesh) => {
  const wheelUV: Vector4[] = [];
  wheelUV[0] = new Vector4(0, 0, 1, 1);
  wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new Vector4(0, 0, 1, 1);

  const wheelMat = new StandardMaterial('wheelMat', scene);
  wheelMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/wheel.png', scene);

  const wheelRB = MeshBuilder.CreateCylinder('wheelRB', { diameter: 0.125, height: 0.05, faceUV: wheelUV }, scene);
  wheelRB.material = wheelMat;
  wheelRB.parent = car;
  wheelRB.position.z = -0.1;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  const animWheel = new Animation('wheelAnimation', 'rotation.y', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
  const wheelKeys: { frame: number, value: number }[] = [];

  wheelKeys.push({
    frame: 0,
    value: 0,
  });

  wheelKeys.push({
    frame: 30,
    value: 2 * Math.PI,
  });

  animWheel.setKeys(wheelKeys);

  wheelRB.animations = [];
  wheelRB.animations.push(animWheel);

  const wheelRF = wheelRB.clone('wheelRF');
  wheelRF.position.x = 0.1;

  const wheelLB = wheelRB.clone('wheelLB');
  wheelLB.position.y = -0.2 - 0.035;

  const wheelLF = wheelRF.clone('wheelLF');
  wheelLF.position.y = -0.2 - 0.035;

  scene.beginAnimation(wheelRB, 0, 30, true);
  scene.beginAnimation(wheelRF, 0, 30, true);
  scene.beginAnimation(wheelLB, 0, 30, true);
  scene.beginAnimation(wheelLF, 0, 30, true);
};

export default addWheels;
