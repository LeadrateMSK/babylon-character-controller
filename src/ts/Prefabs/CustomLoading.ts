import {
  Engine,
  Scene,
} from '@babylonjs/core';
import { CustomLoadingScreen } from './CustomLoadingScreen';

export class CustomLoading {
  constructor(
    engine: Engine,
    loader: HTMLElement,
  ) {
    this.engine = engine;
    this.loader = loader;
    this.loadingScreen = new CustomLoadingScreen(this.loader);
    this.engine.loadingScreen = this.loadingScreen;
  }

  engine: Engine;

  loader: HTMLElement;

  loadingScreen: CustomLoadingScreen;

  displayLoading() {
    this.engine.displayLoadingUI();
  }

  hideLoading() {
    this.engine.hideLoadingUI();
  }
}
