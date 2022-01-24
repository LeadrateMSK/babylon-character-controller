import {
  Engine,
  Scene,
  Vector3,
  ShadowGenerator,
  DirectionalLight,
  MeshBuilder,
  ExecuteCodeAction,
  ActionManager,
  KeyboardEventTypes,
  SceneLoader,
  HemisphericLight,
} from '@babylonjs/core';

import createCamera from './camera';
import { Ground } from './Prefabs/Ground';
import { CustomLight } from './Prefabs/CustomLight';
import { PlayerController } from './Prefabs/PlayerController';
import { Skybox } from './Prefabs/Skybox';
import { CustomModel } from './Prefabs/CustomModel';
import { CustomPhysicsImpostor } from './Prefabs/CustomPhysicsImpostor';

function createScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);

  scene.collisionsEnabled = true;
  
  const camera = createCamera(scene, canvas);

  const light = new CustomLight(scene);
  const pointLight = light.createPointLight();
  const spotLight = light.createSpotLight();
  const shadowGenerator = light.createShadowGenerator(spotLight);

  const skybox = new Skybox(scene);
  const ground = new Ground(scene);
  const physicsimpostor = new CustomPhysicsImpostor(scene, ground.getGroundMesh());
  const player = new PlayerController(scene, camera, engine, shadowGenerator);
  const customModel = new CustomModel(scene, shadowGenerator, pointLight);

  engine.runRenderLoop(() => {
    scene.render();
  });
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  createScene(renderCanvas);
};
