import { HemisphericLight, LightGizmo, Scene, Vector3, Light, GizmoManager, DirectionalLight, PointLight, Color3, SpotLight, Tools, ShadowGenerator } from '@babylonjs/core';

export class CustomLight {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    // const hemiLight = new HemisphericLight('heimLight', new Vector3(0, 1, 0), this.scene);
    // hemiLight.intensity = 0.7;

    // const directionalLight = new DirectionalLight('directionalLight', new Vector3(0, -1, 0), this.scene);

  }

  private createGizmos(customLight: Light) {
    const lightGizmo = new LightGizmo();
    lightGizmo.scaleRatio = 2;
    lightGizmo.light = customLight;

    const gizmoManager = new GizmoManager(this.scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(lightGizmo.attachedMesh);

  }

  public createPointLight(): PointLight {
    const pointLight = new PointLight('pointLight', new Vector3(0, 1, 0), this.scene);

    pointLight.diffuse = new Color3(252 / 255, 166 / 255, 5 / 255);
    pointLight.intensity = 4;

    return pointLight;
  }

  public createSpotLight(): SpotLight {
    const spotLight = new SpotLight('spotLight', new Vector3(5, 2, 0), new Vector3(-3, -0.5, 0), Tools.ToRadians(90), 10, this.scene);
    spotLight.intensity = 100;
    spotLight.shadowEnabled = true;
    spotLight.shadowMinZ = 1;
    spotLight.shadowMaxZ = 10;

    this.createGizmos(spotLight)

    return spotLight;
  }

  public createShadowGenerator(light: SpotLight): ShadowGenerator {
    const shadowGenerator = new ShadowGenerator(1024, light);

    return shadowGenerator;
  }
}