import { Engine, Scene } from '@babylonjs/core';
import * as GUI from 'babylonjs-gui';

export class CustomGUI {
  scene: Scene;

  engine: Engine;

  advancedTexture: GUI.AdvancedDynamicTexture;

  constructor(scene: Scene, engine: Engine) {
    this.scene = scene;
    this.engine = engine;
    this.create();
    this.showFps();
  }

  private create() {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.scene);

    const instructions = new GUI.TextBlock();
    instructions.color = 'white';
    instructions.fontSize = 20;
    instructions.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    instructions.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    instructions.paddingBottomInPixels = 30;
    instructions.paddingRightInPixels = 30;
    instructions.text = 'Move w/ WASD keys, Space for Jump, look with the mouse';

    advancedTexture.addControl(instructions);

    this.advancedTexture = advancedTexture;
  }

  private showFps() {
    const fps = new GUI.TextBlock();
    fps.color = 'white';
    fps.fontSize = 25;
    fps.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    fps.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    fps.paddingTopInPixels = 30;
    fps.paddingRightInPixels = 30;
    fps.outlineColor = 'black';
    fps.outlineWidth = 4;

    this.advancedTexture.addControl(fps);

    this.scene.onBeforeRenderObservable.add(() => {
      const frameRate = this.engine.getFps().toFixed();
      fps.text = `${frameRate} fps`;
    });
  }
}
