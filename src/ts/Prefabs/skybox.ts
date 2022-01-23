import {
  Color3,
  CubeTexture,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';

export class Skybox {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }

  create() {
    // const skybox = MeshBuilder.CreateBox('skyBox', { size: 150 }, this.scene);
    // const skyboxMaterial = new StandardMaterial('skyBox', this.scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = new CubeTexture('../../img/textures/sh', this.scene);
    // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new Color3(0, 0, 0);
    // skybox.material = skyboxMaterial;

    const envTexture = CubeTexture.CreateFromPrefilteredData('../../img/textures/skyboxes/sky.env', this.scene);
    this.scene.environmentTexture = envTexture;
    this.scene.createDefaultSkybox(envTexture, true);
  }
  
};

