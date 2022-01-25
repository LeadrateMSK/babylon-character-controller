import {
  CannonJSPlugin,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  StandardMaterial,
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
    
    this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 });

    // const box = MeshBuilder.CreateBox('box', { depth: 5, width: 3 }, this.scene);
    // box.position = new Vector3(-4, 10, 0);
    // box.checkCollisions = true;
    // box.ellipsoid = new Vector3(1, 0, 1)
    // box.ellipsoidOffset.y = -2;
    // box.showBoundingBox = true
    // box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 4 });
  }
}