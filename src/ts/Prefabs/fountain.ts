import {
  AbstractMesh,
  Color4,
  Mesh,
  MeshBuilder,
  ParticleSystem,
  PointerEventTypes,
  Scene,
  Texture,
  Vector3,
} from '@babylonjs/core';

const createFountain = (scene: Scene): Mesh => {
  let switched = false;

  const fountainProfile = [
    new Vector3(0, 0, 0),
    new Vector3(0.5, 0, 0),
    new Vector3(0.5, 0.2, 0),
    new Vector3(0.4, 0.2, 0),
    new Vector3(0.4, 0.05, 0),
    new Vector3(0.05, 0.1, 0),
    new Vector3(0.05, 0.8, 0),
    new Vector3(0.15, 0.9, 0),
  ];

  const fountain = MeshBuilder.CreateLathe('fountain', { shape: fountainProfile, sideOrientation: Mesh.DOUBLESIDE }, scene);
  fountain.position = new Vector3(1.5, 0, 1);

  const particleSystem = new ParticleSystem('particles', 5000, scene);
  particleSystem.particleTexture = new Texture('../../img/textures/flare.png', scene);

  particleSystem.emitter = new Vector3(1.5, 0.75, 1);
  particleSystem.minEmitBox = new Vector3(-0.01, 0, -0.01);
  particleSystem.maxEmitBox = new Vector3(0.01, 0, 0.01);

  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

  particleSystem.minSize = 0.01;
  particleSystem.maxSize = 0.05;

  particleSystem.minLifeTime = 0.3;
  particleSystem.maxLifeTime = 1.5;

  particleSystem.emitRate = 1500;

  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

  particleSystem.gravity = new Vector3(0, -9.81, 0);

  particleSystem.direction1 = new Vector3(-2, 8, 2);
  particleSystem.direction2 = new Vector3(2, 8, -2);

  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;

  particleSystem.minEmitPower = 0.2;
  particleSystem.maxEmitPower = 0.6;
  particleSystem.updateSpeed = 0.01;

  const pointerDown = (mesh: AbstractMesh) => {
    if (mesh === fountain) {
      switched = !switched;

      if (switched) {
        particleSystem.start();
      } else {
        particleSystem.stop();
      }
    }
  };

  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN:
        if (pointerInfo.pickInfo.hit) {
          pointerDown(pointerInfo.pickInfo.pickedMesh);
        }
        break;
      default:
        break;
    }
  });

  return fountain;
};

export default createFountain;
