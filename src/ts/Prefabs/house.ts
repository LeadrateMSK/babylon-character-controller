import {
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector4,
} from '@babylonjs/core';

const buildBox = (scene: Scene, width: number): Mesh => {
  const boxMat = new StandardMaterial('boxMat', scene);
  if (width === 2) {
    boxMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/semihouse.png', scene);
  } else {
    boxMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/cubehouse.png', scene);
  }

  const faceUV: Vector4[] = [];

  if (width === 2) {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0);
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0);
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0);
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0);
  } else {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); // rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); // front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); // right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); // left side
    // top 4 and bottom 5 not seen so not set
  }

  const box = MeshBuilder.CreateBox('box', { width, faceUV, wrap: true });
  box.material = boxMat;
  box.position.y = 0.5;

  return box;
};

const buildRoof = (scene: Scene, width: number): Mesh => {
  const roofMat = new StandardMaterial('roofMat', scene);
  roofMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/roof.jpg', scene);

  const roof = MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 });
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
};

const buildHouse = (scene: Scene, width: number): Mesh => {
  const box = buildBox(scene, width);
  const roof = buildRoof(scene, width);

  return Mesh.MergeMeshes([box, roof], true, false, null, false, true);
};

export default buildHouse;
