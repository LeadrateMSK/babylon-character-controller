import {
  CubeTexture,
  Scene,
} from '@babylonjs/core';

export class Skybox {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    const envTexture = CubeTexture.CreateFromPrefilteredData('../../assets/textures/skyboxes/sky.env', this.scene);
    this.scene.environmentTexture = envTexture;
    this.scene.createDefaultSkybox(envTexture, true);
    this.scene.environmentIntensity = 0.5;
  }
}
