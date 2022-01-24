import {
  AbstractMesh,
  Mesh,
  MeshBuilder,
  PointLight,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Vector3
} from '@babylonjs/core';

export class CustomModel {
  scene: Scene;
  models: AbstractMesh[] = [];
  shadowGenerator: ShadowGenerator;
  pointLight: PointLight;

  constructor(scene: Scene, shadowGenerator: ShadowGenerator, pointLight: PointLight) {
    this.scene = scene;
    this.shadowGenerator = shadowGenerator;
    this.pointLight = pointLight;
    this.create();
  }

  create() {
    this.createSceneModels();
  }

  createSceneModels() {
    SceneLoader.ImportMesh('', '../../img/models/', 'barrel.glb', this.scene, (meshes) => {
      const barrel = meshes[0];
      meshes.forEach(mesh => mesh.checkCollisions = true);
      barrel.position.x = 1;
      barrel.receiveShadows = true;
      this.shadowGenerator.addShadowCaster(barrel);
    });
      
  
    SceneLoader.ImportMesh('', '../../img/models/', 'campfire.glb', this.scene, (meshes) => {
      const campfire = meshes[0];
      meshes.forEach(mesh => mesh.checkCollisions = true);
      campfire.position = new Vector3(-3, 0, 14);
      this.pointLight.parent = campfire;
      this.pointLight.position.y = 0.3;
      campfire.receiveShadows = true;
      campfire.checkCollisions = true;
      campfire.showBoundingBox = true;
      this.shadowGenerator.addShadowCaster(campfire);
    });

  }
}
