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
import createGround from './Prefabs/ground';
import Character from './Prefabs/player';

function createScene(canvas: HTMLCanvasElement) {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);
  const light = new DirectionalLight('light', new Vector3(1, -1, 2), scene);
  light.position = new Vector3(0, 40, 5);
  light.intensity = 0.9;

  const shadowGenerator = new ShadowGenerator(1024, light);
  createGround(scene);

  const camera = createCamera(scene, canvas);

  const box = MeshBuilder.CreateBox('box', {});
  box.position.x = 2;

  const character = new Character(scene, camera, engine, shadowGenerator);
  character.create();

  engine.runRenderLoop(() => {
    scene.render();
  });
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  createScene(renderCanvas);
};
