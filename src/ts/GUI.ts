import { Engine, Scene } from '@babylonjs/core';
import * as GUI from 'babylonjs-gui';

export class CustomGUI {
  constructor(scene: Scene, engine: Engine) {
    // eslint-disable-next-line no-constructor-return
    if (this.isExists) return this;
    this.scene = scene;
    this.engine = engine;
    this.create();
    this.showFps();
    this.showScore();
  }

  scene: Scene;

  engine: Engine;

  advancedTexture: GUI.AdvancedDynamicTexture;

  isExists = false;

  scoreText: GUI.TextBlock;

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

  private showScore() {
    const scoreText = new GUI.TextBlock();
    scoreText.color = 'white';
    scoreText.fontSize = 20;
    scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    scoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    scoreText.paddingTopInPixels = 30;
    scoreText.paddingLeftInPixels = 50;
    scoreText.outlineColor = 'black';
    scoreText.outlineWidth = 4;
    this.advancedTexture.addControl(scoreText);

    scoreText.text = 'Collected treasures: 0';

    this.scoreText = scoreText;
  }

  public showVictory() {
    const scoreText = new GUI.TextBlock();
    scoreText.color = 'white';
    scoreText.fontSize = 40;
    scoreText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    scoreText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    scoreText.outlineColor = 'black';
    scoreText.outlineWidth = 15;
    this.advancedTexture.addControl(scoreText);

    scoreText.text = 'Congrats! You have all treasures!';

    this.scoreText = scoreText;
  }

  public updateScore(score: number) {
    this.scoreText.text = `Collected treasures: ${score}`;
  }
}
