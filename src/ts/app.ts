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
} from '@babylonjs/core';

import createCamera from './camera';
import { Ground } from './Prefabs/Ground';
import { Player } from './Prefabs/Player';
import { Skybox } from './Prefabs/Skybox';

function createScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  const light = new DirectionalLight('light', new Vector3(-0.5, -3, -1), scene);
  light.position = new Vector3(-80, 80, -40);
  light.intensity = 0.8;

  const shadowGenerator = new ShadowGenerator(1024, light);

  
  const skybox = new Skybox(scene);
  skybox.create();
  
  const ground = new Ground(scene);
  ground.create();
  
  const camera = createCamera(scene, canvas);
  const player = new Player(scene, camera, engine, shadowGenerator);
  player.create();
  
  engine.runRenderLoop(() => {
    scene.render();
  });
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  createScene(renderCanvas);
};
