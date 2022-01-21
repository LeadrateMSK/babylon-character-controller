import {
  Scene,
  Sprite,
  SpriteManager,
} from '@babylonjs/core';

const createTrees = (scene: Scene) => {
  const spriteManagerTrees = new SpriteManager('treesManager', '../../img/textures/palmtree.png', 2000, { width: 512, height: 1024 }, scene);

  for (let i = 0; i < 500; i += 1) {
    const tree = new Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * (-30);
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 1000; i += 1) {
    const tree = new Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * (25) + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }

  const spriteManagerUfo = new SpriteManager('ufoManager', '../../img/textures/ufo.png', 1, { width: 128, height: 76 }, scene);
  const ufo = new Sprite('ufo', spriteManagerUfo);
  ufo.playAnimation(0, 16, true, 125);
  ufo.position.y = 5;
  ufo.position.z = 0;
  ufo.width = 2;
  ufo.height = 1;
};

export default createTrees;
