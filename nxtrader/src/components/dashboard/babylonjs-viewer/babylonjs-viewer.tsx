import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import { useEffect} from "preact/hooks";
import componentStrings = require("ojL10n!./resources/nls/babylonjs-viewer-strings");
import "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css";
import * as BABYLON from 'babylonjs';
import * as Context from "ojs/ojcontext";
//import { Scene, Engine } from 'babylonjs';

type Props = Readonly<{
  message?: string;
}>;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function BabylonjsViewerImpl(
  { message = "Hello from  dashboard-babylonjs-viewer" }: Props
) {

  function initBabs() {
    
    var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    const busyContext = Context.getContext(canvas).getBusyContext();
    busyContext.whenReady().then(() => {
      var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true });

      console.log("babylonjs-viewer > initBabs", canvas, engine);

      // CreateScene function that creates and return the scene
      var createScene = function(){
        // Create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        // Target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        // Attach the camera to the canvas
        camera.attachControl(canvas, false);
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
      var scene = createScene();
      // run the render loop
      engine.runRenderLoop(function(){
          scene.render();
      });
      // the canvas/window resize event handler
      window.addEventListener('resize', function(){
        engine.resize();
      });
    });
  }

  useEffect(()=>{
    initBabs();
  }, []);

  return <div>
    <canvas id="renderCanvas"></canvas>
  </div>
}

export const BabylonjsViewer: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof BabylonjsViewerImpl>>
> = registerCustomElement(
    "dashboard-babylonjs-viewer",
  BabylonjsViewerImpl
);