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
    
    this.ground.physicsImpostor = new PhysicsImpostor(this.ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 });

    const box = MeshBuilder.CreateBox('box', {}, this.scene);
    box.position = new Vector3(-2, 10, 0);

    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 });
  }
}