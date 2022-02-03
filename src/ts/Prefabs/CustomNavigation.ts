import {
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Recast from 'recast-detour';

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

  private async create() {
    await this.createNavMesh();
    // this.showNavMesh();
    this.createBot().then(() => this.createCrowd());
  }

  private async createNavMesh() {
    const recast = await Recast();
    const navigationPlugin = new RecastJSPlugin(recast);

    // navmesh params
    const parameters = {
      cs: 0.2,
      ch: 0.1,
      walkableSlopeAngle: 0,
      walkableHeight: 0,
      walkableClimb: 0,
      walkableRadius: 1.5,
      maxEdgeLen: 12,
      maxSimplificationError: 1.3,
      minRegionArea: 3,
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

  // create visible area of navmesh
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
      // bot.position.y = -0.15;
      // change animations' names so they dont match character's animations
      result.animationGroups.forEach((anim) => {
        // eslint-disable-next-line no-param-reassign
        anim.name += '_bot';
      });

      this.bot = bot as Mesh;
    });
  }

  private createCrowd() {
    const crowd = this.navigationPlugin.createCrowd(1, 2, this.scene);

    const agentParams = {
      radius: 2,
      height: 1.5,
      maxAcceleration: 1000000000000,
      maxSpeed: 1,
      collisionQueryRange: 2,
      pathOptimizationRange: 1,
      separationWeight: 1,
    };

    const transform = new TransformNode('bot');

    this.bot.parent = transform;

    const startPos = this.navigationPlugin.getRandomPointAround(new Vector3(-15, 0, 0), 0.5);
    const agentIndex = crowd.addAgent(startPos, agentParams, transform);

    let pathLine;
    // bot state
    let isFollowing = true;
    let isWalkingAnimated = false;
    let isIdleAnimated = false;
    let isTargetClose = false;
    let isSlowingDown = false;
    // bot animations
    const walkAnim = this.scene.getAnimationGroupByName('Walk_bot');
    const idleAnim = this.scene.getAnimationGroupByName('Idle_bot');

    this.scene.onBeforeRenderObservable.add(() => {
      // const [agentIndex] = crowd.getAgents();
      crowd.agentGoto(agentIndex, this.navigationPlugin.getClosestPoint(
        new Vector3(this.character.position.x + 1, 0, this.character.position.z + 1),
      ));

      // rotate mesh's front to target
      const vel = crowd.getAgentVelocity(agentIndex);
      if (vel.length() > 0.2) {
        vel.normalize();
        const desiredRotation = Math.atan2(vel.x, vel.z);
        // interpolate the rotation on Y to get a smoother orientation change
        transform.rotation.y += (desiredRotation - transform.rotation.y) * 0.05;
      }

      if (vel.length() <= 0.06) {
        isFollowing = false;
      } else if (vel.length() <= 0.85) {
        isTargetClose = true;
      } else {
        isTargetClose = false;
        isFollowing = true;
      }

      if (isFollowing) {
        if (!isWalkingAnimated && !isTargetClose) {
          idleAnim.stop();
          walkAnim.start(true, 1, walkAnim.from, walkAnim.to, false);
          isWalkingAnimated = true;
          isIdleAnimated = false;
        } else if (isTargetClose && !isSlowingDown) {
          idleAnim.stop();
          walkAnim.stop();
          walkAnim.start(true, 0.6, walkAnim.from, walkAnim.to, false);
          isWalkingAnimated = false;
          isIdleAnimated = false;
          isSlowingDown = true;
        }
      } else if (!isFollowing) {
        if (!isIdleAnimated) {
          walkAnim.stop();
          idleAnim.start(true, 1.2, idleAnim.from, idleAnim.to, false);
          isWalkingAnimated = false;
          isIdleAnimated = true;
          isTargetClose = false;
          isSlowingDown = false;
        }
      }

      const pathPoints = this.navigationPlugin.computePath(
        crowd.getAgentPosition(agentIndex),
        this.navigationPlugin.getClosestPoint(this.character.position),
      );

      pathLine = MeshBuilder.CreateDashedLines('ribbon', { points: pathPoints, updatable: true, instance: pathLine }, this.scene);
    });
  }
}
