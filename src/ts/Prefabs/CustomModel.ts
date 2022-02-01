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
  constructor(scene: Scene, pointLight: PointLight) {
    this.scene = scene;
    this.pointLight = pointLight;
  }

  scene: Scene;

  models: { [index: string]: AbstractMesh[] } = {};

  pointLight: PointLight;

  bot: Mesh;

  envObstacles: Mesh[] = [];

  async create() {
    await this.createSceneModels();
    this.createTreasures();
  }

  private async createSceneModels() {
    await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'barrel.glb', this.scene).then((result) => {
      const barrel = result.meshes[0];

      result.meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
        this.envObstacles.push(mesh as Mesh);
      });

      barrel.position = new Vector3(-6, 0, 14);
      barrel.receiveShadows = true;
    });

    await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'campfire.glb', this.scene).then((result) => {
      const campfire = result.meshes[0];

      result.meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
        this.envObstacles.push(mesh as Mesh);
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

    await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'blacksmith.glb', this.scene).then((result) => {
      const blacksmith = result.meshes[0];

      result.meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
        this.envObstacles.push(mesh as Mesh);
      });

      blacksmith.scaling = new Vector3(3.8, 3.8, 3.8);
      blacksmith.position = new Vector3(-17, 0, 16);
      blacksmith.rotation = new Vector3(0, Tools.ToRadians(-140), 0);
    });

    await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'house.glb', this.scene).then((result) => {
      const house = result.meshes[0];
      result.meshes.forEach((mesh) => {
        mesh.checkCollisions = true;
        this.envObstacles.push(mesh as Mesh);
      });

      house.scaling = new Vector3(0.1, 0.1, 0.1);
      house.position = new Vector3(-22, 0, 11);
      house.rotation = new Vector3(0, Tools.ToRadians(130), 0);
    });
  }

  private createTreasures() {
    const treasureCounter = 19;

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

  // private async createBot() {
  //   await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'bot.glb', this.scene).then((result) => {
  //     const [bot] = result.meshes;

  //     // result.meshes.forEach((mesh) => {
  //     //   mesh.checkCollisions = true;
  //     // });
  //     this.bot = bot as Mesh;
  //   });
  // }

  public getObstacleMeshes() {
    return this.envObstacles;
  }
}
