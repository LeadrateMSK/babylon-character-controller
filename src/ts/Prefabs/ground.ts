import {
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
} from '@babylonjs/core';

const createGround = (scene: Scene) => {
  const groundMat = new StandardMaterial('groundMat', scene);
  groundMat.diffuseTexture = new Texture('https://t4.ftcdn.net/jpg/02/75/27/03/360_F_275270350_Bui4WhKMWO8Jit1IcDZwZR0ZRhuI5Qv7.jpg', scene);
  groundMat.diffuseTexture.hasAlpha = true;

  const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100});
  ground.material = groundMat;
  ground.receiveShadows = true;

  // const largeGroundMat = new StandardMaterial('largeGroundMat', scene);
  // largeGroundMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/valleygrass.png', scene);

  // const largeGround = MeshBuilder.CreateGroundFromHeightMap('largeGround', 'https://assets.babylonjs.com/environments/villageheightmap.png', {
  //   width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10,
  // });
  // largeGround.material = largeGroundMat;
  // largeGround.position.y = -0.01;
};

export default createGround;
