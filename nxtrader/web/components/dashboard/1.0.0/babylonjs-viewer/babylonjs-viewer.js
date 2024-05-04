define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "babylonjs", "ojs/ojcontext", "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, BABYLON, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BabylonjsViewer = void 0;
    function BabylonjsViewerImpl({ message = "Hello from  dashboard-babylonjs-viewer" }) {
        function initBabs() {
            var canvas = document.getElementById('renderCanvas');
            const busyContext = Context.getContext(canvas).getBusyContext();
            busyContext.whenReady().then(() => {
                var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
                console.log("babylonjs-viewer > initBabs", canvas, engine);
                var createScene = function () {
                    var scene = new BABYLON.Scene(engine);
                    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
                    camera.setTarget(BABYLON.Vector3.Zero());
                    camera.attachControl(canvas, false);
                    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
                    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene);
                    sphere.position.y = 1;
                    var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2, updatable: false }, scene);
                    return scene;
                };
                var scene = createScene();
                engine.runRenderLoop(function () {
                    scene.render();
                });
                window.addEventListener('resize', function () {
                    engine.resize();
                });
            });
        }
        (0, hooks_1.useEffect)(() => {
            initBabs();
        }, []);
        return (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("canvas", { id: "renderCanvas" }) });
    }
    exports.BabylonjsViewer = (0, ojvcomponent_1.registerCustomElement)("dashboard-babylonjs-viewer", BabylonjsViewerImpl, "BabylonjsViewer", { "properties": { "message": { "type": "string" } } }, { "message": "Hello from  dashboard-babylonjs-viewer" });
});
