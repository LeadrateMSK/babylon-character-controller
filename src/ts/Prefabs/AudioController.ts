import {
  Scene,
  Sound,
} from '@babylonjs/core';

export class AudioController {
  scene: Scene;

  success: Sound;

  constructor(scene: Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    const success = new Sound('success', '../../assets/audio/success-effect.mp3', this.scene);
    this.success = success;
  }

  public playSuccess() {
    this.success.setVolume(0.1);
    this.success.play();
  }
}
