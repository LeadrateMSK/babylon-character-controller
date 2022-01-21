import {
  InstancedMesh,
  Scene,
} from '@babylonjs/core';
import buildGround from './ground';
import buildHouse from './house';

function createDwellings(scene: Scene) {
  buildGround(scene);

  const detachedHouse = buildHouse(scene, 1);
  detachedHouse.rotation.y = -Math.PI / 16;
  detachedHouse.position.x = -6.8;
  detachedHouse.position.z = 2.5;

  const semiHouse = buildHouse(scene, 2);
  semiHouse.rotation.y = -Math.PI / 16;
  semiHouse.position.x = -4.5;
  semiHouse.position.z = 3;

  const places: number[][] = [];
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
  places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
  places.push([1, (5 * Math.PI) / 4, 0, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);

  const houses: InstancedMesh[] = [];
  for (let i = 0; i < places.length; i += 1) {
    if (places[i][0] === 1) {
      houses[i] = detachedHouse.createInstance(`house${i}`);
    } else {
      houses[i] = semiHouse.createInstance(`house${i}`);
    }

    // eslint-disable-next-line prefer-destructuring
    houses[i].rotation.y = places[i][1];
    // eslint-disable-next-line prefer-destructuring
    houses[i].position.x = places[i][2];
    // eslint-disable-next-line prefer-destructuring
    houses[i].position.z = places[i][3];
  }
}

export default createDwellings;
