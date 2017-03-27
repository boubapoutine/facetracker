import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'geometry-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit {
  /* HELPER PROPERTIES (PRIVATE PROPERTIES) */
  private camera: THREE.PerspectiveCamera;

  private get canvas() : HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private cube: THREE.Mesh;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  /* CUBE PROPERTIES */
  @Input()
  public size: number = 150;

  @Input()
  public texture: string = './assets/textures/crate.gif';

  /* STAGE PROPERTIES */
  @Input()
  public cameraZ: number = 400;

  @Input()
  public fieldOfView: number = 70;

  @Input('nearClipping')
  public nearClippingPane: number = 1;

  @Input('farClipping')
  public farClippingPane: number = 1000;

  @Input('scale')
  public scale: any = 0;

  @Input('rotation')
  public rotation: any = 0;

  @Input('posx')
  public posx: any = 0;

  @Input('posy')
  public posy: any = 0;

  /* DEPENDENCY INJECTION (CONSTRUCTOR) */
  constructor() { }

  /* STAGING, ANIMATION, AND RENDERING */

  private animateCube() {
    this.cube.scale.set(this.scale*2,this.scale*2.5,this.scale*2);
    this.cube.position.x = ( (this.posx-200)*-1 ) - 75;
    this.cube.position.y = ( (this.posy-150)*-1 ) - 75;
    //this.cube.rotation.y = ( -2 + ( 2 - (-2) ) * (this.rotation - 0.0) / (0.1 - (-0.1) ) ) * -1;
  }

  private createCube() {
    var scena = new THREE.Scene();
    let texture = new THREE.TextureLoader().load(this.texture);
    let material = new THREE.MeshBasicMaterial({ map: texture });

    let geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);
    this.cube = new THREE.Mesh(geometry, material);

    var directionalLight = new THREE.DirectionalLight( 0xffeedd );

    // Add cube to scene
    this.scene.add(this.cube);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
   * Start the rendering loop
   */
  private startRenderingLoop() {
    /* Renderer */
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    //this.renderer.setClearColor( 0xffffff, 1);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  /* EVENTS */
  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  /* LIFECYCLE */
  public ngAfterViewInit() {
    this.createScene();
    this.createCube();
    this.startRenderingLoop();
  }
}