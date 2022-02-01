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
import { AudioController } from './Prefabs/AudioController';
import { CustomLoading } from './Prefabs/CustomLoading';
import { CustomNavigation } from './Prefabs/CustomNavigation';

class App {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.create();
  }

  canvas: HTMLCanvasElement;

  scene: Scene;

  customLoading: CustomLoading;

  async create() {
    const engine = new Engine(this.canvas);

    this.createLoading(engine);
    this.customLoading.displayLoading();

    const scene = new Scene(engine);
    this.scene = scene;
    scene.collisionsEnabled = true;

    const camera = new Camera(scene, this.canvas);

    const GUI = new CustomGUI(scene, engine);
    const audioController = new AudioController(this.scene);

    const ground = new Ground(scene, this.customLoading);
    const groundMesh = ground.getGroundMesh();
    const groundSize = ground.getGroundSize();

    const characterController = new CharacterController(
      scene,
      engine,
      groundSize,
      GUI,
      audioController,
    );
    await characterController.create();

    const character = characterController.getCharacter();
    camera.createFollowCamera(character);

    const physicsimpostor = new CustomPhysicsImpostor(scene, groundMesh);

    const light = new CustomLight(scene);
    const pointLight = light.createPointLight();
    const spotLight = light.createSpotLight();

    CustomLight.createShadowGenerator(spotLight, character);

    const skybox = new Skybox(scene);

    const customModel = new CustomModel(scene, pointLight);
    await customModel.create();
    const obstacles = customModel.getObstacleMeshes();

    const customNavigation = new CustomNavigation(this.scene, character, obstacles, groundMesh);

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

  private createLoading(engine: Engine) {
    const loader = document.getElementById('loader') as HTMLElement;

    const customLoading = new CustomLoading(engine, loader);

    this.customLoading = customLoading;
  }
}

window.onload = () => {
  const renderCanvas = <HTMLCanvasElement> document.getElementById('canvas');

  const app = new App(renderCanvas);
};
