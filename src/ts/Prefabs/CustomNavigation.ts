import {
  AbstractMesh,
  Color3,
  Mesh,
  MeshBuilder,
  RecastJSPlugin,
  Scene,
  SceneLoader,
  StandardMaterial,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import * as Recast from 'recast-detour';

export class CustomNavigation {
  constructor(scene: Scene, character: Mesh, obstacles: Mesh[], ground: Mesh) {
    this.scene = scene;
    this.character = character;
    this.obstacles = obstacles;
    this.ground = ground;
    this.create();
  }

  scene: Scene;

  character: Mesh;

  obstacles: Mesh[];

  ground: Mesh;

  navigationPlugin: RecastJSPlugin;

  bot: Mesh;

  private create() {
    this.createNavMesh();
    this.showNavMesh();
    this.createBot().then(() => this.createCrowd());
  }

  private createNavMesh() {
    const navigationPlugin = new RecastJSPlugin(Recast);

    // navmesh params
    const parameters = {
      cs: 0.2,
      ch: 0.2,
      walkableSlopeAngle: 0,
      walkableHeight: 0.6,
      walkableClimb: 0,
      walkableRadius: 1.5,
      maxEdgeLen: 12,
      maxSimplificationError: 1.3,
      minRegionArea: 8,
      mergeRegionArea: 10,
      maxVertsPerPoly: 6,
      detailSampleDist: 6,
      detailSampleMaxError: 1,
      borderSize: 1,
      tileSize: 10,
    };

    const box1 = MeshBuilder.CreateBox('box1', { depth: 5, width: 3, height: 0.5 }, this.scene);
    box1.position = new Vector3(-4, 0.25, 0);
    box1.checkCollisions = true;
    box1.showBoundingBox = true;

    navigationPlugin.createNavMesh([this.ground, ...this.obstacles, box1], parameters);

    this.navigationPlugin = navigationPlugin;
  }

  // Create visible area of navmesh
  private showNavMesh() {
    const navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
    navmeshdebug.position.y = 0.05;
    const matdebug = new StandardMaterial('matdebug', this.scene);
    matdebug.diffuseColor = new Color3(0, 0, 1);
    matdebug.alpha = 0.5;
    navmeshdebug.material = matdebug;
  }

  private async createBot() {
    await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'bot.glb', this.scene).then((result) => {
      const [bot] = result.meshes;

      // result.meshes.forEach((mesh) => {
      //   mesh.checkCollisions = true;
      // });
      this.bot = bot as Mesh;
    });
  }

  private createCrowd() {
    const crowd = this.navigationPlugin.createCrowd(1, 1, this.scene);

    const agentParams = {
      radius: 1,
      height: 1,
      maxAcceleration: 4.0,
      maxSpeed: 1.0,
      collisionQueryRange: 0.5,
      pathOptimizationRange: 0,
      separationWeight: 1,
    };

    const transform = new TransformNode('bot');

    this.bot.parent = transform;

    const botPos = this.navigationPlugin.getRandomPointAround(new Vector3(0, 0, 15), 0.5);
    const agentIndex = crowd.addAgent(botPos, agentParams, transform);

    let pathLine;
    // #todo bot animations
    let isChasing = true;

    this.scene.onBeforeRenderObservable.add(() => {
      const [botIndex] = crowd.getAgents();
      crowd.agentGoto(botIndex, this.navigationPlugin.getClosestPoint(this.character.position));

      // Rotate mesh's front to target
      const vel = crowd.getAgentVelocity(botIndex);
      if (vel.length() > 0.2) {
        vel.normalize();
        const desiredRotation = Math.atan2(vel.x, vel.z);
        // interpolate the rotation on Y to get a smoother orientation change
        transform.rotation.y += (desiredRotation - transform.rotation.y) * 0.05;
      }

      const pathPoints = this.navigationPlugin.computePath(
        crowd.getAgentPosition(agentIndex),
        this.navigationPlugin.getClosestPoint(this.character.position),
      );

      pathLine = MeshBuilder.CreateDashedLines('ribbon', { points: pathPoints, updatable: true, instance: pathLine }, this.scene);
    });
  }
}
