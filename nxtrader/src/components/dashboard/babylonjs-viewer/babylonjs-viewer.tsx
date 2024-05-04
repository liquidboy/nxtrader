import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import { useEffect} from "preact/hooks";
import componentStrings = require("ojL10n!./resources/nls/babylonjs-viewer-strings");
import "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css";
import * as BABYLON from 'babylonjs';
import * as Context from "ojs/ojcontext";
import { effect, signal, useSignal, useSignalEffect } from "@preact/signals";

export const babylonEngine = signal<BABYLON.Engine|undefined>(undefined);
export const babylonScene = signal<BABYLON.Scene|undefined>(undefined);
const defaultBackgroundColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Black());
let babylonCanvas = signal<HTMLCanvasElement|undefined>(undefined);

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function BabylonjsViewerImpl() {
  useEffect(()=>{
    initEngine();
  }, []);

  return <div class="renderCanvasContainer">
    <canvas id="renderCanvas"></canvas>
  </div>
}

export const BabylonjsViewer: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof BabylonjsViewerImpl>>
> = registerCustomElement(
    "dashboard-babylonjs-viewer",
  BabylonjsViewerImpl
);

function initEngine() {
  if(babylonCanvas.value === undefined) {
    console.info("babylonjs-viewer > initEngine > started");
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;;
    babylonCanvas.value = canvas;
    const busyContext = Context.getContext(canvas).getBusyContext();
    busyContext.whenReady().then(() => {
      babylonEngine.value = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true });
      console.info("babylonjs-viewer > initEngine > finished");
    });
  }
}

effect(()=>{
  if(babylonEngine.value && babylonCanvas.value) {
    console.info("babylonjs-viewer > setup default scene");
    // CreateScene function that creates and return the scene
    var createScene = function(engine: BABYLON.Engine){
      // Create a basic BJS Scene object
      var scene = new BABYLON.Scene(engine);
      scene.clearColor = defaultBackgroundColor;
      var env = scene.createDefaultEnvironment({createGround: false, createSkybox: false});
      //env?.setMainColor(BABYLON.Color3.White());
      // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
      var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
      // Target the camera to scene origin
      camera.setTarget(BABYLON.Vector3.Zero());
      // Attach the camera to the canvas
      camera.attachControl(babylonCanvas, false);
      // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
      var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
      // Create a built-in "sphere" shape using the SphereBuilder
      var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE}, scene);
      // Move the sphere upward 1/2 of its height
      sphere.position.y = 1;
      // Create a built-in "ground" shape;
      var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2, updatable: false }, scene);
      // Return the created scene
      return scene;
    }
    // call the createScene function
    var scene = createScene(babylonEngine.value);
    babylonScene.value = scene;
    // run the render loop
    babylonEngine.value.runRenderLoop(function(){
      scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
      babylonEngine.value?.resize();
    });
  }
});
