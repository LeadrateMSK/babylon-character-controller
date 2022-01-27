import {
  AbstractMesh,
  Matrix,
  Mesh,
  NodeMaterial,
  PointLight,
  Scalar,
  Scene,
  SceneLoader,
  Tools,
  Vector3,
} from '@babylonjs/core';

export class CustomModel {
  scene: Scene;

  models: { [index: string]: AbstractMesh[] } = {};

  pointLight: PointLight;

  constructor(scene: Scene, pointLight: PointLight) {
    this.scene = scene;
    this.pointLight = pointLight;
    this.create();
  }

  create() {
    this.createSceneModels();
    this.createTreasures();
  }

  createSceneModels() {
    SceneLoader.ImportMesh('', '../../assets/models/', 'barrel.glb', this.scene, (meshes) => {
      const barrel = meshes[0];

      meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
      });

      barrel.position = new Vector3(-6, 0, 14);
      barrel.receiveShadows = true;
    });

    SceneLoader.ImportMesh('', '../../assets/models/', 'campfire.glb', this.scene, (meshes) => {
      const campfire = meshes[0];

      meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
      });

      campfire.position = new Vector3(-3, 0, 14);
      this.pointLight.parent = campfire;
      this.pointLight.position.y = 0.3;
      campfire.receiveShadows = true;
      campfire.checkCollisions = true;
      campfire.showBoundingBox = true;
    });

    SceneLoader.ImportMesh('', '../../assets/models/', 'tree.glb', this.scene, (meshes) => {
      const tree = meshes[0];

      meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
      });

      tree.position = new Vector3(-8, 0, 13);
      tree.receiveShadows = true;
      tree.checkCollisions = true;
      tree.showBoundingBox = true;

      const treesPos = [
        new Vector3(-1, 0, 0.5),
        new Vector3(0, 0, 1),
        new Vector3(0, 0, 4.5),
        new Vector3(14, 0, -7),
      ];

      const treesScale = [
        new Vector3(0.8, 0.8, 0.8),
        new Vector3(0.9, 0.9, 0.9),
        new Vector3(1, 1, 1),
        new Vector3(1.2, 1.2, 1.2),
      ];

      for (let i = 0; i < treesPos.length; i += 1) {
        const clone = tree.clone(`clone${i}`, tree);
        clone.position = treesPos[i];
        clone.scaling = treesScale[i];
      }
    });

    SceneLoader.ImportMesh('', '../../assets/models/', 'blacksmith.glb', this.scene, (meshes) => {
      const blacksmith = meshes[0];

      meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
      });

      blacksmith.scaling = new Vector3(3.8, 3.8, 3.8);
      blacksmith.position = new Vector3(-17, 0, 16);
      blacksmith.rotation = new Vector3(0, Tools.ToRadians(-140), 0);
    });

    SceneLoader.ImportMesh('', '../../assets/models/', 'house.glb', this.scene, (meshes) => {
      const blacksmith = meshes[0];
      meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
      });

      blacksmith.scaling = new Vector3(0.1, 0.1, 0.1);
      blacksmith.position = new Vector3(-22, 0, 11);
      blacksmith.rotation = new Vector3(0, Tools.ToRadians(130), 0);
    });
  }

  private createTreasures() {
    const treasureCounter = 20;

    SceneLoader.ImportMesh('', '../../assets/models/', 'treasure.glb', this.scene, (meshes) => {
      const treasure = meshes[0];
      meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
      });

      treasure.scaling = new Vector3(1.5, 1.5, 1.5);
      treasure.position = new Vector3(-1, 0, 5);

      for (let i = 0; i < treasureCounter; i += 1) {
        const newTreasure = (treasure as Mesh).clone(`${treasure.name}${i}`);

        newTreasure.position.x = Scalar.RandomRange(-10, 20);
        newTreasure.position.z = Scalar.RandomRange(-20, 10);
      }
    });
  }
}
