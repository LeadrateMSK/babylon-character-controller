import {
  ILoadingScreen,
} from '@babylonjs/core';

export class CustomLoadingScreen implements ILoadingScreen {
  constructor(loader: HTMLElement) {
    this.loader = loader;
  }

  loader: HTMLElement;

  loadingUIBackgroundColor: string;

  loadingUIText: string;

  displayLoadingUI() {
    this.loader.style.display = 'flex';
  }

  hideLoadingUI() {
    this.loader.className = 'content__loaded';

    setTimeout(() => {
      this.loader.style.display = 'none';
    }, 1000);
  }
}
