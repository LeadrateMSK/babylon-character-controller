import {
  Animation,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Tools,
  Vector3,
  Vector4,
} from '@babylonjs/core';
import earcut from 'earcut';
import addWheels from './wheels';

const createCarBody = (scene: Scene): Mesh => {
  const outline = [
    new Vector3(-0.3, 0, -0.1),
    new Vector3(0.2, 0, -0.1),
  ];

  for (let i = 0; i < 20; i += 1) {
    // eslint-disable-next-line max-len
    outline.push(new Vector3(0.2 * Math.cos((i * Math.PI) / 40), 0, 0.2 * Math.sin((i * Math.PI) / 40) - 0.1));
  }

  outline.push(new Vector3(0, 0, 0.1));
  outline.push(new Vector3(-0.3, 0, 0.1));

  const faceUV: Vector4[] = [];

  faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new Vector4(0, 0, 1, 0.5);
  faceUV[2] = new Vector4(0.38, 1, 0, 0.5);

  const carMat = new StandardMaterial('carMat', scene);
  carMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/car.png', scene);

  const car = MeshBuilder.ExtrudePolygon('car', {
    shape: outline, depth: 0.2, faceUV, wrap: true,
  }, scene, earcut);
  car.material = carMat;

  car.rotation = new Vector3(Tools.ToRadians(-90), Tools.ToRadians(90), 0);
  car.position.y = 0.16;
  car.position.x = 3;
  car.position.z = 8;

  const animCar = new Animation('carAnimation', 'position.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

  const carKeys: { frame: number, value: number }[] = [];

  carKeys.push({
    frame: 0,
    value: 8,
  });

  carKeys.push({
    frame: 150,
    value: -7,
  });

  carKeys.push({
    frame: 200,
    value: -7,
  });

  animCar.setKeys(carKeys);

  car.animations = [];
  car.animations.push(animCar);

  scene.beginAnimation(car, 0, 200, true);

  return car;
};

const createCar = (scene: Scene) => {
  addWheels(scene, createCarBody(scene));
};

export default createCar;
