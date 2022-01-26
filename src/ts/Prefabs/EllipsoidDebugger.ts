import {
  AbstractMesh,
  Color3,
  MeshBuilder,
  Scene,
  StandardMaterial,
} from '@babylonjs/core';

export class EllipsoidDebugger {
  scene: Scene;

  mesh?: AbstractMesh;

  constructor(scene: Scene, mesh?: AbstractMesh) {
    this.scene = scene;
    this.mesh = mesh;
    this.create();
  }

  create() {
    const { mesh } = this;
    const ellipsoid = MeshBuilder.CreateCylinder('ellipsoidDebugger', { diameter: (mesh.ellipsoid.x), height: (mesh.ellipsoid.y), subdivisions: 24 }, this.scene);
    const debugmat = new StandardMaterial('ellipsoidDebuggerMat', this.scene);
    debugmat.diffuseColor = new Color3(0, 1, 0);
    debugmat.wireframe = true;
    ellipsoid.material = debugmat;

    this.scene.onBeforeRenderObservable.add(() => {
      ellipsoid.position.copyFrom(mesh.position);
      ellipsoid.position.addInPlace(mesh.ellipsoidOffset);
    });
  }
}
