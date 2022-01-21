import {
  ActionManager,
  AssetsManager,
  Axis,
  Engine,
  ExecuteCodeAction,
  FollowCamera,
  KeyboardEventTypes,
  Scene,
  SceneLoader,
  ShadowGenerator,
  Skeleton,
  Space,
  StandardMaterial,
  Texture,
  Tools,
  Vector3
} from '@babylonjs/core';
import "@babylonjs/loaders/glTF";

interface Player {
  scene: Scene;
  camera: FollowCamera;
  engine: Engine;
  shadowGenerator: ShadowGenerator;
}

class Player {

  constructor(scene: Scene, camera: FollowCamera, engine: Engine, shadowGenerator: ShadowGenerator) {
    this.scene = scene;
    this.camera = camera;
    this.engine = engine;
    this.shadowGenerator = shadowGenerator;
  }

  private skeleton: Skeleton;

  public create() {
    SceneLoader.ImportMeshAsync('mixamorig:Skin', '../../img/textures/', 'dude.babylon', this.scene).then((result) => {
      const character = result.meshes[0];
      this.shadowGenerator.addShadowCaster(character, true);
      // character.rotate(Axis.Y, Tools.ToRadians(180), Space.LOCAL);
      this.camera.lockedTarget = character;
      // character.scaling = new Vector3(0.75, 0.75, 0.75);

      this.skeleton = result.skeletons[0];
      

      this.idle();

      const inputs = {};
      let isAnimating = false;
      console.log(this.scene.animations)
      this.scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case KeyboardEventTypes.KEYDOWN:
            inputs[kbInfo.event.key] = true;
            console.log(kbInfo.event.key)
            break;
          case KeyboardEventTypes.KEYUP:
            inputs[kbInfo.event.key] = false;
            console.log(kbInfo.event.key)
            break;
        }
      });

      this.scene.onBeforeRenderObservable.add(() => {
        const deltaTime = this.engine.getDeltaTime();
        const speed = 0.003 * deltaTime;
        const dashingSpeed = 0.006 * deltaTime;
        const rotationSpeed = 0.0005 * deltaTime;
        let isKeyDown = false;
        let isRunning = false;
        
        if (inputs['Shift']) {
          isRunning = true;
        } else {
          isRunning = false;
        }

        if (inputs['w']) {
          isKeyDown = true;
          if (inputs['w'] && isRunning) {
            character.moveWithCollisions(character.forward.scaleInPlace(dashingSpeed));
          } else {
            character.moveWithCollisions(character.forward.scaleInPlace(speed));
          }
        } else if(inputs['s']) {
          isKeyDown = true;
          character.moveWithCollisions(character.forward.scaleInPlace(-speed));
        }

        if (inputs['a']) {
          isKeyDown = true;
          character.rotate(Vector3.Up(), -rotationSpeed);
        } else if (inputs['d']) {
          isKeyDown = true;
          character.rotate(Vector3.Up(), rotationSpeed);
        }

        if (isKeyDown) {
          if (!isAnimating) {
            // console.log('anim', isDashing)
            
            console.log('anim', isRunning)

              if(inputs['w'] && isRunning) {               
                console.log('run')
                this.run();
              } else {
                this.walk();
              }

              isAnimating = true;
          }
               
        } else {
          if (isAnimating) {
            isAnimating = false;
            this.idle();
          }
        }

      });

      return character;
    });
  }

  public run() {
    this.stopAnimations();
    this.scene.beginAnimation(this.skeleton, 127, 148, true, 1.0, () => this.idle());
  }

  public idle() {
    this.stopAnimations();
    this.scene.beginAnimation(this.skeleton, 0, 90, true, 1.0);
  }

  public walk() {
    this.stopAnimations();
    this.scene.beginAnimation(this.skeleton, 91, 126, true, 1.0, () => this.idle());
  }

  private stopAnimations() {
    // this.scene.stopAnimation(this.skeleton);
  }

}

export default Player;