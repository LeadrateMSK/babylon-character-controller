import {
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scene,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';

export class Ground {
  scene: Scene;
  ground: Mesh;
  constructor(scene: Scene) {
    this.scene = scene;
    this.ground = this.create();
  }

  public create() {
    const groundMat = this.createGroundMaterialPBR();

    const ground = MeshBuilder.CreateGround('ground', { width: 60, height: 60});
    ground.material = groundMat;
    ground.receiveShadows = true;

    return ground;
  }

  public getGroundMesh() {
    return this.ground;
  }

  private createGroundMaterial(): StandardMaterial {
    const groundMat = new StandardMaterial('groundMat', this.scene);
    const uvScale = 4;
    const textureArr: Texture[] = [];

    const diffuseTexture = new Texture('../../img/textures/rocks/aerial_rocks_diff.jpg', this.scene);
    groundMat.diffuseTexture = diffuseTexture;
    textureArr.push(diffuseTexture);

    const normalTexture = new Texture('../../img/textures/rocks/aerial_rocks_norm.jpg', this.scene);
    groundMat.bumpTexture = normalTexture;
    textureArr.push(normalTexture);

    const aoTexture = new Texture('../../img/textures/rocks/aerial_rocks_ao.jpg', this.scene);
    groundMat.ambientTexture = aoTexture;
    textureArr.push(aoTexture);

    // const specTexture = new Texture('../../img/textures/stone/cobblestone_spec.jpg', this.scene);
    // groundMat.specularTexture = specTexture;
    // textureArr.push(specTexture);
    groundMat.specularPower = 10;

    textureArr.forEach(texture => {
      texture.uScale = uvScale;
      texture.vScale = uvScale;
    });

    return groundMat;
  }

  private createGroundMaterialPBR(): PBRMaterial {
    const pbr = new PBRMaterial('pbr', this.scene);
    const uvScale = 2.5;
    const textureArr: Texture[] = [];

    const albedoTexture = new Texture('../../img/textures/rocks/aerial_rocks_diff.jpg', this.scene);
    pbr.albedoTexture = albedoTexture;
    textureArr.push(albedoTexture);

    const normalTexture = new Texture('../../img/textures/rocks/aerial_rocks_norm.jpg', this.scene);
    pbr.bumpTexture = normalTexture;
    textureArr.push(normalTexture);

    const aoTexture = new Texture('../../img/textures/rocks/aerial_rocks_ao.jpg', this.scene);
    pbr.ambientTexture = aoTexture;
    textureArr.push(aoTexture);

    textureArr.forEach(texture => {
      texture.uScale = uvScale;
      texture.vScale = uvScale;
    });

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.roughness = 1;
    pbr.specularIntensity = 5;

    return pbr;
  }
  
};
