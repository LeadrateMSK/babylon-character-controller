/* eslint-disable max-len */
import {
  AbstractMesh,
  AnimationGroup,
  Engine,
  KeyboardEventTypes,
  KeyboardInfo,
  Mesh,
  Observer,
  Ray,
  Scene,
  SceneLoader,
  Tools,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { CustomGUI } from '../GUI';
import { AudioController } from './AudioController';

export class CharacterController {
  constructor(
    scene: Scene,
    engine: Engine,
    groundSize: { width: number, height: number },
    GUI: CustomGUI,
    audioController: AudioController,
  ) {
    this.scene = scene;
    this.engine = engine;
    this.groundSize = groundSize;
    this.GUI = GUI;
    this.audioController = audioController;
  }

  scene: Scene;

  engine: Engine;

  GUI: CustomGUI;

  audioController: AudioController;

  private groundSize: { width: number, height: number };

  private maxJumpHeight = 2.2;

  private jumpHeight = 0;

  private character: Mesh;

  private isGrounded: boolean;

  private isJumped = false;

  private jumpDelayFrames = 0;

  private isWalkingBackAnimated = false;

  private isWalkingAnimated = false;

  private isRunningAnimated = false;

  private inputs: { [index: string]: boolean } = {};

  private idleAnim: AnimationGroup;

  private runAnim: AnimationGroup;

  private walkAnim: AnimationGroup;

  private jumpAnim: AnimationGroup;

  private walkBackAnim: AnimationGroup;

  private score = 0;

  private inputObserver: Observer<KeyboardInfo>;

  public async create() {
    await SceneLoader.ImportMeshAsync('', '../../assets/models/', 'character.glb', this.scene).then((result) => {
      const character = result.meshes[0];
      character.rotationQuaternion = null;
      character.rotation = new Vector3(0, Tools.ToRadians(-30), 0);
      character.scaling = new Vector3(0.5, 0.5, 0.5);
      character.checkCollisions = true;
      character.ellipsoid = new Vector3(0.5, 1, 0.5);
      character.ellipsoidOffset = new Vector3(0, 1, 0);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      character.onCollide = (mesh: AbstractMesh) => {
        if (mesh.name.includes('brass_vase_01')) {
          mesh.dispose();
          this.score += 1;
          this.GUI.updateScore(this.score);
          this.audioController.playSuccess();

          if (this.score >= 20) { // depends on vases
            this.GUI.showVictory();
            this.removeInputListeners();
          }
        }
      };

      this.character = character as Mesh;

      this.idleAnim = this.scene.getAnimationGroupByName('Idle');
      this.runAnim = this.scene.getAnimationGroupByName('Run');
      this.walkAnim = this.scene.getAnimationGroupByName('Walk');
      this.jumpAnim = this.scene.getAnimationGroupByName('Jump');
      this.walkBackAnim = this.scene.getAnimationGroupByName('Walk_Back');

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
    this.inputObserver = this.scene.onKeyboardObservable.add((kbInfo) => this.handleCharacterInputs(kbInfo));
  }

  private removeInputListeners() {
    this.inputs = {};
    this.scene.onKeyboardObservable.remove(this.inputObserver);
  }

  private handleCharacterInputs(kbInfo: KeyboardInfo) {
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
  }

  private setIsGrounded() {
    const ray = new Ray(this.character.position, new Vector3(0, -0.15, 0), 0.15);

    const pick = this.scene.pickWithRay(ray);
    // const rayHelper = new RayHelper(ray);
    // rayHelper.show(this.scene);

    if (pick) this.isGrounded = pick.hit;
  }

  private processMoving() {
    const { character, inputs } = this;
    const deltaTime = this.engine.getDeltaTime();
    const speed = 0.0018 * deltaTime;
    const backwardSpeed = 0.0008 * deltaTime;
    const runningSpeed = 0.0055 * deltaTime;
    const rotationSpeed = 0.0015 * deltaTime;
    const isRunning: boolean = inputs.ShiftLeft;
    let isKeyDown = false;

    // Return character in ground center if he tries to leave the ground
    if (character.position.z > this.groundSize.height / 2 || character.position.z < -(this.groundSize.height / 2)) character.position = Vector3.Zero();
    if (character.position.x > this.groundSize.width / 2 || character.position.x < -(this.groundSize.width / 2)) character.position = Vector3.Zero();

    if (inputs.KeyW) {
      isKeyDown = true;
      if (isRunning) {
        character.moveWithCollisions(character.forward.scaleInPlace(runningSpeed));
      } else {
        character.moveWithCollisions(character.forward.scaleInPlace(speed));
      }
    } else if (inputs.KeyS && !this.isWalkingAnimated) {
      isKeyDown = true;
      character.moveWithCollisions(character.forward.scaleInPlace(-backwardSpeed));
    }

    if (inputs.Space && this.jumpDelayFrames <= 0) {
      isKeyDown = true;
    }

    if (inputs.KeyA) {
      isKeyDown = true;

      // if S pressed rotate in opposite direction
      if (inputs.KeyS && !inputs.KeyW) {
        character.rotate(Vector3.Up(), rotationSpeed);
      } else {
        character.rotate(Vector3.Up(), -rotationSpeed);
      }

      // if only one keyA pressed
      if (!inputs.KeyW && !inputs.KeyS) {
        if (isRunning) {
          character.moveWithCollisions(character.forward.scaleInPlace(runningSpeed));
        } else {
          character.moveWithCollisions(character.forward.scaleInPlace(speed));
        }
      } else if (inputs.KeyS) {
        character.moveWithCollisions(character.forward.scaleInPlace(-backwardSpeed));
      }
    } else if (inputs.KeyD) {
      isKeyDown = true;
      // if S pressed rotate in opposite direction
      if (inputs.KeyS && !inputs.KeyW) {
        character.rotate(Vector3.Up(), -rotationSpeed);
      } else {
        character.rotate(Vector3.Up(), rotationSpeed);
      }

      // if only one keyD pressed
      if (!inputs.KeyW && !inputs.KeyS) {
        if (isRunning) {
          character.moveWithCollisions(character.forward.scaleInPlace(runningSpeed));
        } else {
          character.moveWithCollisions(character.forward.scaleInPlace(speed));
        }
      } else if (inputs.KeyS) {
        character.moveWithCollisions(character.forward.scaleInPlace(-backwardSpeed));
      }
    }

    if (this.isGrounded) {
      if (isKeyDown) {
        if (inputs.Space && this.jumpDelayFrames <= 0) {
          this.jump();
          this.isJumped = true;
          this.isRunningAnimated = false;
          this.isWalkingAnimated = false;
          this.isWalkingBackAnimated = false;
        } else if ((inputs.KeyW || inputs.KeyD || inputs.KeyA) && isRunning && !this.isWalkingBackAnimated) {
          // if Shift pressed with W/D/A
          if (!this.isRunningAnimated) {
            this.run();
            this.isRunningAnimated = true;
            this.isWalkingAnimated = false;
          }
        } else if (inputs.KeyW && this.isWalkingBackAnimated) {
          // on W key press with pressed key S (W key has priority)
          this.walkForward();
          this.isWalkingBackAnimated = false;
          this.isRunningAnimated = false;
          this.isWalkingAnimated = true;
        } else if (
          (inputs.KeyS && !this.isWalkingBackAnimated && !this.isWalkingAnimated && !inputs.KeyW)
          || (inputs.KeyS && (inputs.KeyA || inputs.KeyD) && !this.isWalkingBackAnimated && !inputs.KeyW)
        ) {
          // if key S or (S with A or D) pressed when we release W key
          this.walkBackward();
          this.isRunningAnimated = false;
          this.isWalkingAnimated = false;
          this.isWalkingBackAnimated = true;
        } else if (!this.isWalkingAnimated && !this.isWalkingBackAnimated) {
          // case to animate rotations
          this.walkForward();
          this.isRunningAnimated = false;
          this.isWalkingAnimated = true;
        } else if ((inputs.KeyA || inputs.KeyD) && this.isWalkingBackAnimated && !inputs.KeyS) {
          // if pressed A or D when we release the S key
          this.walkForward();
          this.isWalkingBackAnimated = false;
          this.isRunningAnimated = false;
          this.isWalkingAnimated = true;
        }
      } else if (this.isWalkingAnimated || this.isRunningAnimated || this.isWalkingBackAnimated) {
        // if no key pressed stop all animations
        this.idle();
        this.isWalkingAnimated = false;
        this.isRunningAnimated = false;
        this.isWalkingBackAnimated = false;
      }
    }
  }

  private processJump() {
    const deltaTime = this.engine.getDeltaTime();
    const jumpForce = 0.004 * deltaTime;
    const fallingForce = 0.0045 * deltaTime;

    if (this.isJumped) {
      if (this.jumpHeight < this.maxJumpHeight) {
        this.jumpHeight += jumpForce;
        this.character.moveWithCollisions(this.character.up.scaleInPlace(jumpForce));
      } else {
        this.jumpHeight = 0;
        this.isJumped = false;
        this.jumpDelayFrames = 130; // add counter to delay next jump
      }
    } else if (!this.isGrounded) {
      this.character.moveWithCollisions(this.character.up.scaleInPlace(-fallingForce));
      if (this.character.position.y < 0) this.character.position.y = 0;
    }

    if (this.jumpDelayFrames > 0) this.jumpDelayFrames -= 0.2 * deltaTime;
  }

  public run() {
    this.stopAnims();
    this.runAnim.start(true, 1.3, this.runAnim.from, this.runAnim.to, false);
  }

  public idle() {
    this.stopAnims();
    this.idleAnim.start(true, 1.2, this.idleAnim.from, this.idleAnim.to, false);
  }

  public walkForward() {
    this.stopAnims();
    this.walkAnim.start(true, 1.4, this.walkAnim.from, this.walkAnim.to, false);
  }

  public jump() {
    this.stopAnims();
    // Variable to hide animtaion jump delay
    const jumpAnimFrom = 0.45;
    this.jumpAnim.start(false, 1.0, jumpAnimFrom, this.jumpAnim.to, false);
  }

  public walkBackward() {
    this.stopAnims();
    this.walkBackAnim.start(true, 1.4, this.walkBackAnim.from, this.walkBackAnim.to, false);
  }

  private stopAnims() {
    this.idleAnim.stop();
    this.runAnim.stop();
    this.walkAnim.stop();
    this.jumpAnim.stop();
    this.walkBackAnim.stop();
  }

  public getCharacter() {
    return this.character;
  }

  public getScore() {
    return this.score;
  }
}
