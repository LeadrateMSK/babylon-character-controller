import {
  CannonJSPlugin,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  Vector3,
} from '@babylonjs/core';
import * as CANNON from 'cannon';

export class CustomPhysicsImpostor {
  scene: Scene;

  ground: Mesh;

  constructor(scene: Scene, ground: Mesh) {
    this.scene = scene;
    this.ground = ground;
    this.create();
  }

  private gravity = -9.81;

  create() {
    this.scene.enablePhysics(new Vector3(0, this.gravity, 0), new CannonJSPlugin(true, 10, CANNON));

    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0 },
    );

    const box1 = MeshBuilder.CreateBox('box1', { depth: 5, width: 3, height: 0.5 }, this.scene);
    box1.position = new Vector3(-4, 10, 0);
    box1.checkCollisions = true;
    box1.showBoundingBox = true;
    box1.physicsImpostor = new PhysicsImpostor(
      box1,
      PhysicsImpostor.BoxImpostor,
      { mass: 10, restitution: 1 },
    );
  }
}
