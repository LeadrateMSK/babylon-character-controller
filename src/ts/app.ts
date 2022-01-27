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

  async init() {
    const engine = new Engine(this.canvas);
    const scene = new Scene(engine);
    this.scene = scene;
    scene.collisionsEnabled = true;

    const GUI = new CustomGUI(scene, engine);

    const ground = new Ground(scene);
    const groundMesh = ground.getGroundMesh();
    const groundSize = ground.getGroundSize();

    const characterController = new CharacterController(
      scene,
      engine,
      groundSize,
      GUI,
    );
    await characterController.create();

    const character = characterController.getCharacter();

    const physicsimpostor = new CustomPhysicsImpostor(scene, groundMesh);

    const camera = new Camera(scene, this.canvas);

    camera.createFollowCamera(character);

    const light = new CustomLight(scene);
    const pointLight = light.createPointLight();
    const spotLight = light.createSpotLight();

    CustomLight.createShadowGenerator(spotLight, character);

    const skybox = new Skybox(scene);

    const customModel = new CustomModel(scene, pointLight);

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
    this.scene.animationPropertiesOverride.blendingSpeed = 0.2;
    this.scene.animationPropertiesOverride.loopMode = 1;
  }
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  const app = new App(renderCanvas);
};
