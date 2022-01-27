import {
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scalar,
  Scene,
  Sprite,
  SpriteManager,
  StandardMaterial,
  Texture,
  Tools,
  Vector3,
} from '@babylonjs/core';

export class Ground {
  scene: Scene;

  ground: Mesh;

  constructor(scene: Scene) {
    this.scene = scene;
    this.ground = this.create();
    this.createBorders();
  }

  private groundSize = {
    width: 56,
    height: 56,
  };

  public create() {
    const groundMat = this.createGroundMaterialPBR();

    const ground = MeshBuilder.CreateGround('ground', { width: this.groundSize.width, height: this.groundSize.height });
    ground.material = groundMat;
    ground.receiveShadows = true;
    this.addGrass();
    return ground;
  }

  public getGroundMesh() {
    return this.ground;
  }

  public getGroundSize() {
    return this.groundSize;
  }

  private createGroundMaterial(): StandardMaterial {
    const groundMat = new StandardMaterial('groundMat', this.scene);
    const uvScale = 4;
    const textureArr: Texture[] = [];

    const diffuseTexture = new Texture('../../assets/textures/rocks/aerial_rocks_diff.jpg', this.scene);
    groundMat.diffuseTexture = diffuseTexture;
    textureArr.push(diffuseTexture);

    const normalTexture = new Texture('../../assets/textures/rocks/aerial_rocks_norm.jpg', this.scene);
    groundMat.bumpTexture = normalTexture;
    textureArr.push(normalTexture);

    const aoTexture = new Texture('../../assets/textures/rocks/aerial_rocks_ao.jpg', this.scene);
    groundMat.ambientTexture = aoTexture;
    textureArr.push(aoTexture);

    // const specTexture = new Texture('../../img/textures/stone/cobblestone_spec.jpg', this.scene);
    // groundMat.specularTexture = specTexture;
    // textureArr.push(specTexture);
    groundMat.specularPower = 10;

    // textureArr.forEach((texture) => {
    //   texture.uScale = uvScale;
    //   texture.vScale = uvScale;
    // });

    return groundMat;
  }

  private createGroundMaterialPBR(): PBRMaterial {
    const pbr = new PBRMaterial('pbr', this.scene);
    const uvScale = 2.5;
    const textureArr: Texture[] = [];

    const albedoTexture = new Texture('../../assets/textures/rocks/aerial_rocks_diff.jpg', this.scene);
    pbr.albedoTexture = albedoTexture;
    textureArr.push(albedoTexture);

    const normalTexture = new Texture('../../assets/textures/rocks/aerial_rocks_norm.jpg', this.scene);
    pbr.bumpTexture = normalTexture;
    textureArr.push(normalTexture);

    const aoTexture = new Texture('../../assets/textures/rocks/aerial_rocks_ao.jpg', this.scene);
    pbr.ambientTexture = aoTexture;
    textureArr.push(aoTexture);

    textureArr.forEach((texture) => {
      // eslint-disable-next-line no-param-reassign
      texture.uScale = uvScale;
      // eslint-disable-next-line no-param-reassign
      texture.vScale = uvScale;
    });

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.roughness = 0.8;
    pbr.specularIntensity = 5;

    return pbr;
  }

  private createBorders() {
    const bordersPos = [
      new Vector3(this.groundSize.width / 2, 0, 0),
      new Vector3(-(this.groundSize.width / 2), 0, 0),
      new Vector3(0, 0, this.groundSize.height / 2),
      new Vector3(0, 0, -(this.groundSize.height / 2)),
    ];

    const borderSizes = [
      { width: 0.5, depth: this.groundSize.height, height: 3 },
      { width: 0.5, depth: this.groundSize.height, height: 3 },
      { width: this.groundSize.width, depth: 0.5, height: 3 },
      { width: this.groundSize.width, depth: 0.5, height: 3 },
    ];

    for (let i = 0; i < bordersPos.length; i += 1) {
      const { width, depth, height } = borderSizes[i];
      const border = MeshBuilder.CreateBox(`border${i}`, { width, depth, height });
      border.position = bordersPos[i];
      border.checkCollisions = true;

      const pbr = new PBRMaterial('borderPbr', this.scene);

      const uvScale = 25;
      const textureArr: Texture[] = [];

      const albedoTexture = new Texture('../../assets/textures/stone/cobblestone.jpg', this.scene);
      pbr.albedoTexture = albedoTexture;
      textureArr.push(albedoTexture);

      const normalTexture = new Texture('../../assets/textures/stone/cobblestone_normal.jpg', this.scene);
      pbr.bumpTexture = normalTexture;
      textureArr.push(normalTexture);

      const aoTexture = new Texture('../../assets/textures/stone/cobblestone_ao.jpg', this.scene);
      pbr.ambientTexture = aoTexture;
      textureArr.push(aoTexture);

      const specTexture = new Texture('../../assets/textures/stone/cobblestone_spec.jpg', this.scene);
      pbr.reflectivityTexture = specTexture;
      textureArr.push(specTexture);

      textureArr.forEach((texture) => {
        if (i <= 1) {
          // eslint-disable-next-line no-param-reassign
          texture.uScale = 2;
          // eslint-disable-next-line no-param-reassign
          texture.vScale = uvScale;
        } else {
          // eslint-disable-next-line no-param-reassign
          texture.uScale = uvScale;
          // eslint-disable-next-line no-param-reassign
          texture.vScale = 2;
        }
      });

      pbr.useAmbientOcclusionFromMetallicTextureRed = true;
      pbr.useRoughnessFromMetallicTextureGreen = true;
      pbr.useMetallnessFromMetallicTextureBlue = true;

      pbr.roughness = 0.3;
      pbr.specularIntensity = 12;

      border.material = pbr;
    }
  }

  private addGrass() {
    const spriteManagerGrass = new SpriteManager('grassManager', '../../assets/textures/grass.png', 200, { width: 640, height: 583 }, this.scene);

    for (let i = 0; i < 200; i += 1) {
      const grass = new Sprite('grass', spriteManagerGrass);
      grass.width = 1.5;
      grass.height = 1.2;
      grass.position.x = Scalar.RandomRange(
        -(this.groundSize.width / 2),
        this.groundSize.width / 2,
      );
      grass.position.z = Scalar.RandomRange(
        -(this.groundSize.height / 2),
        this.groundSize.height / 2,
      );
    }
  }
}
