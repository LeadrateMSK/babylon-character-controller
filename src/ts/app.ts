import {
  Engine,
  Scene,
} from '@babylonjs/core';

import { Camera } from './Camera';
import { Ground } from './Prefabs/Ground';
import { CustomLight } from './Prefabs/CustomLight';
import { PlayerController } from './Prefabs/PlayerController';
import { Skybox } from './Prefabs/Skybox';
import { CustomModel } from './Prefabs/CustomModel';
import { CustomPhysicsImpostor } from './Prefabs/CustomPhysicsImpostor';
import { CustomGUI } from './GUI';

function createScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  scene.collisionsEnabled = true;

  const camera = new Camera(scene, canvas);
  const followCamera = camera.getCamera();

  const light = new CustomLight(scene);
  const pointLight = light.createPointLight();
  const spotLight = light.createSpotLight();
  const shadowGenerator = light.createShadowGenerator(spotLight);

  const skybox = new Skybox(scene);

  const ground = new Ground(scene);
  const groundMesh = ground.getGroundMesh();
  const groundSize = ground.getGroundSize();

  const physicsimpostor = new CustomPhysicsImpostor(scene, groundMesh);

  const player = new PlayerController(scene, followCamera, engine, shadowGenerator, groundSize);

  const customModel = new CustomModel(scene, shadowGenerator, pointLight);

  new CustomGUI(scene);

  engine.runRenderLoop(() => {
    scene.render();
  });
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  createScene(renderCanvas);
};
