import {
  AbstractMesh,
  Mesh,
  MeshBuilder,
  PointLight,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Tools,
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

    SceneLoader.ImportMesh('', '../../img/models/', 'tree.glb', this.scene, (meshes) => {
      const tree = meshes[0];
      meshes.forEach(mesh => mesh.checkCollisions = true);
      tree.position = new Vector3(-1, 0, 13);
      tree.receiveShadows = true;
      tree.checkCollisions = true;
      tree.showBoundingBox = true;
      this.shadowGenerator.addShadowCaster(tree);

      const treesPos = [
        new Vector3(-1, 0, 0.5),
        new Vector3(-5, 0, 2),
      ];

      const treesScale = [
        new Vector3(0.8, 0.8, 0.8),
        new Vector3(0.9, 0.9, 0.9)
      ];

      for (let i = 0; i < treesPos.length; i++) {
        let clone = tree.clone(`clone${i}`, tree);
        clone.position = treesPos[i];
        clone.scaling = treesScale[i];
      }
    });

    SceneLoader.ImportMesh('', '../../img/models/', 'blacksmith.glb', this.scene, (meshes) => {
      const blacksmith = meshes[0];
      meshes.forEach(mesh => mesh.checkCollisions = true);
      blacksmith.scaling = new Vector3(3.8, 3.8, 3.8);
      blacksmith.position = new Vector3(-17, 0, 16);
      blacksmith.rotation = new Vector3(0, Tools.ToRadians(-140), 0);

    });

    SceneLoader.ImportMesh('', '../../img/models/', 'house.glb', this.scene, (meshes) => {
      const blacksmith = meshes[0];
      meshes.forEach(mesh => mesh.checkCollisions = true);
      blacksmith.scaling = new Vector3(0.1, 0.1, 0.1);
      blacksmith.position = new Vector3(-22, 0, 11);
      blacksmith.rotation = new Vector3(0, Tools.ToRadians(130), 0);

    })
  }
}
