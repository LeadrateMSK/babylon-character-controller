import {
  AbstractMesh,
  AnimationGroup,
  Engine,
  FollowCamera,
  KeyboardEventTypes,
  Ray,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Vector3,
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";

export class PlayerController {
  scene: Scene;
  camera: FollowCamera;
  engine: Engine;
  shadowGenerator: ShadowGenerator;
  groundSize: { width: number, height: number }
  
  constructor(scene: Scene, camera: FollowCamera, engine: Engine, shadowGenerator: ShadowGenerator, groundSize: { width: number, height: number }) {
    this.scene = scene;
    this.camera = camera;
    this.engine = engine;
    this.shadowGenerator = shadowGenerator;
    this.groundSize = groundSize;
    this.create();
  }

  private readonly jumpHeight: number = 1.5;
  private character: AbstractMesh;
  private isGrounded: boolean;
  private isJumped: boolean = false;
  private isWalkingBackAnimated: boolean = false;
  private isWalkingAnimated: boolean = false;
  private isRunningAnimated: boolean = false;
  private inputs: { [index: string]: boolean } = {};
  private idleAnim: AnimationGroup;
  private runAnim: AnimationGroup;
  private walkAnim: AnimationGroup;
  private jumpAnim: AnimationGroup;
  private walkBackAnim: AnimationGroup;

  public create() {
    SceneLoader.ImportMeshAsync('', '../../img/models/', 'bot.glb', this.scene).then(result => {
      const character = result.meshes[0];
      character.checkCollisions = true;
      // character.physicsImpostor = new PhysicsImpostor(character, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 });

      this.idleAnim = this.scene.getAnimationGroupByName('Idle');
      this.runAnim = this.scene.getAnimationGroupByName('Run');
      this.walkAnim = this.scene.getAnimationGroupByName('Walk');
      this.jumpAnim = this.scene.getAnimationGroupByName('Jump');
      this.walkBackAnim = this.scene.getAnimationGroupByName('Walk_Back');
      this.shadowGenerator.addShadowCaster(character);
      this.camera.lockedTarget = character;
      this.character = character;

      this.idle();

      this.addInputListeners();

      this.scene.onBeforeRenderObservable.add(() => this.update());
    });
  }

  private update() {
    this.setIsGrounded();
    this.processJump();
    this.processMoving();

  }

  private addInputListeners() {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          this.inputs[kbInfo.event.code] = true;
          break;
        case KeyboardEventTypes.KEYUP:
          this.inputs[kbInfo.event.code] = false;
          break;
        default:
          break;
      }
    });
  }

  private setIsGrounded() {
    const ray = new Ray(this.character.position, new Vector3(0, 0.05, 0), 0.05);

    const pick = this.scene.pickWithRay(ray);
    if (pick) this.isGrounded = pick.hit;
  }

  private processMoving() {
    const { character, inputs } = this;
    const deltaTime = this.engine.getDeltaTime();
    const speed = 0.003 * deltaTime;
    const backwardSpeed = 0.0015 * deltaTime;
    const runningSpeed = 0.006 * deltaTime;
    const rotationSpeed = 0.0015 * deltaTime;
    let isKeyDown = false;
    let isRunning: boolean = inputs['ShiftLeft'];

    // Return character in ground center if he tries to leave the ground
    if (character.position.z > this.groundSize.height / 2 || character.position.z < -(this.groundSize.height / 2)) character.position = Vector3.Zero();
    if (character.position.x > this.groundSize.width / 2 || character.position.x < -(this.groundSize.width / 2)) character.position = Vector3.Zero();

    if (inputs['KeyW']) {
      isKeyDown = true;
      if (isRunning) {
        character.moveWithCollisions(character.forward.scaleInPlace(runningSpeed));
      } else {
        character.moveWithCollisions(character.forward.scaleInPlace(speed));
      }
    } else if (inputs['KeyS'] && !this.isWalkingAnimated) {
      isKeyDown = true;
      character.moveWithCollisions(character.forward.scaleInPlace(-backwardSpeed));
    }

    if (inputs['Space']) {
      isKeyDown = true;
    }

    if (inputs['KeyA']) {
      isKeyDown = true;
      character.rotate(Vector3.Up(), -rotationSpeed);
    } else if (this.inputs['KeyD']) {
      isKeyDown = true;
      character.rotate(Vector3.Up(), rotationSpeed);
    }

    if (this.isGrounded) {
      if (isKeyDown) {
        if (inputs['Space']) {
          this.jump();
          this.isJumped = true;
          this.isRunningAnimated = false;
          this.isWalkingAnimated = false;

        } else if (inputs['KeyW'] && isRunning) {
          if(!this.isRunningAnimated) {
            this.run();
            this.isRunningAnimated = true;
            this.isWalkingAnimated = false;
          }

        } else if (inputs['KeyW'] && this.isWalkingBackAnimated) {
          // on W key press with pressed key S (W key has priority)
          this.walkForward();
          this.isWalkingBackAnimated = false;
          this.isRunningAnimated = false;
          this.isWalkingAnimated = true;

        } else if (inputs['KeyS'] && !this.isWalkingBackAnimated && !this.isWalkingAnimated) {
          this.walkBackward();
          this.isRunningAnimated = false;
          this.isWalkingBackAnimated = true;

        } else if (!this.isWalkingAnimated && !this.isWalkingBackAnimated) {
          // case to animate rotations
          this.walkForward();
          this.isRunningAnimated = false;
          this.isWalkingAnimated = true;

        }
      } else {
        if (this.isWalkingAnimated || this.isRunningAnimated || this.isWalkingBackAnimated) {
          this.idle();
          this.isWalkingAnimated = false;
          this.isRunningAnimated = false;
          this.isWalkingBackAnimated = false;

        }
      }

    }
  }

  private processJump() {
    const deltaTime = this.engine.getDeltaTime();
    const jumpForce = 0.007 * deltaTime;
    const fallingForce = 0.008 * deltaTime;

    if (this.isJumped) {
      if (this.character.position.y < this.jumpHeight) {
        this.character.moveWithCollisions(this.character.up.scaleInPlace(jumpForce));
      } else {
        this.isJumped = false;
      }
    } else if (!this.isGrounded) {
      this.character.moveWithCollisions(this.character.up.scaleInPlace(-fallingForce));
      if(this.character.position.y < 0) this.character.position.y = 0; 
    }
  }

  public run() {
    this.stopAnims();
    this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
  }

  public idle() {
    this.stopAnims();
    this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
  }

  public walkForward() {
    this.stopAnims();
    this.walkAnim.start(true, 1.0, this.walkAnim.from, this.walkAnim.to, false);
  }

  public jump() {
    this.stopAnims();
    // Variable to hide animtaion jump delay
    const jumpAnimFrom = 0.75 ;
    this.jumpAnim.start(false, 1.0, jumpAnimFrom, this.jumpAnim.to, false);
  }

  public walkBackward() {
    this.stopAnims();
    this.walkBackAnim.start(true, 1.0, this.walkBackAnim.from, this.walkBackAnim.to, false);
  }

  private stopAnims() {
		this.idleAnim.stop();
		this.runAnim.stop();
		this.walkAnim.stop();
		this.jumpAnim.stop();
		this.walkBackAnim.stop();
	}

}
