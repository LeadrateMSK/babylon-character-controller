import {
  CannonJSPlugin,
  Mesh,
  MeshBuilder,
  PhysicsImpostor,
  Scene,
  SceneLoader,
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

  async createRocket(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'rocket.glb', this.scene);

    const rocketCollider = MeshBuilder.CreateBox('rocketCollider', { width: 1, height: 1.7, depth: 1 });
    rocketCollider.visibility = 0.05;
    rocketCollider.position.y = 0.85;
    rocketCollider.physicsImpostor = new PhysicsImpostor(
      rocketCollider,
      PhysicsImpostor.BoxImpostor,
      { mass: 1 },
    );

    meshes[0].setParent(rocketCollider);
    rocketCollider.position = new Vector3(2, 0, 20);

    // const rocketPhysics = () => {
    //   rocketCollider.physicsImpostor.setLinearVelocity(new Vector3(0, 1, 0));
    //   rocketCollider.physicsImpostor.setAngularVelocity(new Vector3(0, 1, 0));
    // };

    // this.scene.registerBeforeRender(rocketPhysics);
  }
}
