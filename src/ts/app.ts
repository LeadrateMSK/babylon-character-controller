import {
  AnimationPropertiesOverride,
  Engine,
  Scene,
} from '@babylonjs/core';

import { Camera } from './Camera';
import { Ground } from './Prefabs/Ground';
import { CustomLight } from './Prefabs/CustomLight';
import { CharacterController } from './Prefabs/CharacterController';
import { Skybox } from './Prefabs/Skybox';
import { CustomModel } from './Prefabs/CustomModel';
import { CustomPhysicsImpostor } from './Prefabs/CustomPhysicsImpostor';
import { CustomGUI } from './GUI';

class App {
  canvas: HTMLCanvasElement;

  scene: Scene;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.init();
  }

  init() {
    const engine = new Engine(this.canvas);
    const scene = new Scene(engine);
    this.scene = scene;
    scene.collisionsEnabled = true;

    const camera = new Camera(scene, this.canvas);
    const followCamera = camera.getCamera();

    const light = new CustomLight(scene);
    const pointLight = light.createPointLight();
    const spotLight = light.createSpotLight();
    const shadowGenerator = CustomLight.createShadowGenerator(spotLight);

    const skybox = new Skybox(scene);

    const ground = new Ground(scene);
    const groundMesh = ground.getGroundMesh();
    const groundSize = ground.getGroundSize();

    const physicsimpostor = new CustomPhysicsImpostor(scene, groundMesh);

    const characterController = new CharacterController(
      scene,
      followCamera,
      engine,
      shadowGenerator,
      groundSize,
    );

    const customModel = new CustomModel(scene, shadowGenerator, pointLight);

    const GUI = new CustomGUI(scene, engine);

    this.setSceneAnimationsBlending();

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });
  }

  private setSceneAnimationsBlending() {
    this.scene.animationPropertiesOverride = new AnimationPropertiesOverride();
    this.scene.animationPropertiesOverride.enableBlending = true;
    this.scene.animationPropertiesOverride.blendingSpeed = 0.1;
    this.scene.animationPropertiesOverride.loopMode = 1;
  }
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  const app = new App(renderCanvas);
};
