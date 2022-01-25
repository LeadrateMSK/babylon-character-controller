import { Scene } from '@babylonjs/core';
import * as GUI from 'babylonjs-gui';

export class CustomGUI {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.scene);

    const instructions = new GUI.TextBlock();
    instructions.text = 'Move w/ WASD keys, Space for Jump, look with the mouse';
    instructions.color = 'white';
    instructions.fontSize = 20;
    instructions.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    instructions.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    instructions.paddingBottomInPixels = 30;
    instructions.paddingRight = 30;

    advancedTexture.addControl(instructions);
  }
}