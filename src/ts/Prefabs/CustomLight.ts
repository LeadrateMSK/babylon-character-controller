import {
  LightGizmo,
  Scene,
  Vector3,
  Light,
  GizmoManager,
  PointLight,
  Color3,
  SpotLight,
  Tools,
  ShadowGenerator,
} from '@babylonjs/core';

export class CustomLight {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  private createGizmos(customLight: Light) {
    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light = customLight;

    const gizmoManager = new GizmoManager(this.scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    // gizmoManager.usePointerToAttachGizmos = false;
    // gizmoManager.attachToMesh(lightGizmo.attachedMesh);
  }

  public createPointLight(): PointLight {
    const pointLight = new PointLight('pointLight', new Vector3(0, 1, 0), this.scene);

    pointLight.diffuse = new Color3(252 / 255, 166 / 255, 5 / 255);
    pointLight.intensity = 4;

    return pointLight;
  }

  public createSpotLight(): SpotLight {
    const spotLight = new SpotLight('spotLight', new Vector3(-13, 2, 14.4), new Vector3(3, -0.5, -3), Tools.ToRadians(120), 10, this.scene);
    spotLight.intensity = 100;
    spotLight.shadowEnabled = true;
    spotLight.shadowMinZ = 1;
    spotLight.shadowMaxZ = 10;

    this.createGizmos(spotLight);

    return spotLight;
  }

  public static createShadowGenerator(light: SpotLight): ShadowGenerator {
    const shadowGenerator = new ShadowGenerator(1024, light);

    return shadowGenerator;
  }
}
