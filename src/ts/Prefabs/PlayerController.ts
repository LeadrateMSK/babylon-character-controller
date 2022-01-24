import {
  ActionManager,
  AssetsManager,
  Axis,
  Color3,
  Engine,
  ExecuteCodeAction,
  FollowCamera,
  KeyboardEventTypes,
  MeshBuilder,
  PhysicsImpostor,
  Ray,
  RayHelper,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Skeleton,
  Space,
  StandardMaterial,
  Texture,
  Tools,
  Vector3,
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";

export class PlayerController {
  scene: Scene;
  camera: FollowCamera;
  engine: Engine;
  shadowGenerator: ShadowGenerator;

  constructor(scene: Scene, camera: FollowCamera, engine: Engine, shadowGenerator: ShadowGenerator) {
    this.scene = scene;
    this.camera = camera;
    this.engine = engine;
    this.shadowGenerator = shadowGenerator;
    this.create();
  }

  private skeleton: Skeleton;
  private isGrounded: boolean;
  private readonly jumpHeight = 2;
  private isJumped = false;

  public create() {
    SceneLoader.ImportMeshAsync('mixamorig:Skin', '../../img/textures/', 'dude.babylon', this.scene).then(result => {
      const character = result.meshes[0];
      character.checkCollisions = true;
      // character.physicsImpostor = new PhysicsImpostor(character, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 });

      this.shadowGenerator.addShadowCaster(character);
      this.camera.lockedTarget = character;
      this.skeleton = result.skeletons[0];

      this.idle();

      const inputs = {};
      let isWalkingAnimated = false;
      let isRunningAnimated = false;

      this.scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case KeyboardEventTypes.KEYDOWN:
            inputs[kbInfo.event.code] = true;
            break;
          case KeyboardEventTypes.KEYUP:
            inputs[kbInfo.event.code] = false;
            break;
        }
      });

      this.scene.registerBeforeRender(() => {

        const ray = new Ray(character.position, new Vector3(0, 0.01, 0), 0.01);
        const rayHelper = new RayHelper(ray);
        rayHelper.show(this.scene, new Color3(1, 0, 0));

        const pick = this.scene.pickWithRay(ray);
        if (pick) this.isGrounded = pick.hit;

        if (inputs['Space'] && this.isGrounded) {
          if (character.position.y < this.jumpHeight) {
            character.moveWithCollisions(character.up.scaleInPlace(0.5))
          } else {
            this.isJumped = true;
            
          }
          
        }

        if (this.isJumped) {
          
          character.moveWithCollisions(character.up.scaleInPlace(-0.1))
          if (character.position.y <= 0.01) {
            this.isJumped = false;
          }
        }
      })

      this.scene.onBeforeRenderObservable.add(() => {
        const deltaTime = this.engine.getDeltaTime();
        const speed = 0.003 * deltaTime;
        const runningSpeed = 0.006 * deltaTime;
        const rotationSpeed = 0.001 * deltaTime;
        let isKeyDown = false;
        let isRunning: boolean = inputs['ShiftLeft'];
        this.isGrounded = character.getAbsolutePosition().y < 1;

        if (inputs['KeyW']) {
          isKeyDown = true;
          // console.log(inputs)
          if (inputs['KeyW'] && isRunning) {
            character.moveWithCollisions(character.forward.scaleInPlace(runningSpeed));
          } else {
            character.moveWithCollisions(character.forward.scaleInPlace(speed));
          }
        } else if(inputs['KeyS']) {
          isKeyDown = true;
          character.moveWithCollisions(character.forward.scaleInPlace(-speed));
        }

        if (inputs['KeyA']) {
          isKeyDown = true;
          character.rotate(Vector3.Up(), -rotationSpeed);
        } else if (inputs['KeyD']) {
          isKeyDown = true;
          character.rotate(Vector3.Up(), rotationSpeed);
        }
               
        if (isKeyDown) {

          if (inputs['KeyW'] && isRunning) {
            if(!isRunningAnimated) {               
              this.run();
              isRunningAnimated = true;
              isWalkingAnimated = false;
            }
          } else if (!isWalkingAnimated) {
            this.walk();
            isRunningAnimated = false;
            isWalkingAnimated = true;
          }

        } else {
          if (isWalkingAnimated || isRunningAnimated) {
            isWalkingAnimated = false;
            isRunningAnimated = false;
            this.idle();
          }
        }

      });

      return character;
    });
  }

  public run() {
    this.scene.beginAnimation(this.skeleton, 127, 148, true, 1.0, () => this.idle());
  }

  public idle() {
    this.scene.beginAnimation(this.skeleton, 0, 90, true, 1.0);
  }

  public walk() {
    this.scene.beginAnimation(this.skeleton, 91, 126, true, 1.0, () => this.idle());
  }

}
