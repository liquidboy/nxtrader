define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "babylonjs", "ojs/ojcontext", "@preact/signals", "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, BABYLON, Context, signals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BabylonjsViewer = exports.babylonScene = exports.babylonEngine = void 0;
    exports.babylonEngine = (0, signals_1.signal)(undefined);
    exports.babylonScene = (0, signals_1.signal)(undefined);
    const defaultBackgroundColor = BABYLON.Color4.FromColor3(BABYLON.Color3.Black());
    let babylonCanvas = (0, signals_1.signal)(undefined);
    function BabylonjsViewerImpl() {
        (0, hooks_1.useEffect)(() => {
            initEngine();
        }, []);
        return (0, jsx_runtime_1.jsx)("div", Object.assign({ class: "renderCanvasContainer" }, { children: (0, jsx_runtime_1.jsx)("canvas", { id: "renderCanvas" }) }));
    }
    exports.BabylonjsViewer = (0, ojvcomponent_1.registerCustomElement)("dashboard-babylonjs-viewer", BabylonjsViewerImpl, "BabylonjsViewer");
    function initEngine() {
        if (babylonCanvas.value === undefined) {
            console.info("babylonjs-viewer > initEngine > started");
            const canvas = document.getElementById('renderCanvas');
            ;
            babylonCanvas.value = canvas;
            const busyContext = Context.getContext(canvas).getBusyContext();
            busyContext.whenReady().then(() => {
                exports.babylonEngine.value = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
                console.info("babylonjs-viewer > initEngine > finished");
            });
        }
    }
    (0, signals_1.effect)(() => {
        if (exports.babylonEngine.value && babylonCanvas.value) {
            console.info("babylonjs-viewer > setup default scene");
            var createScene = function (engine) {
                var scene = new BABYLON.Scene(engine);
                scene.clearColor = defaultBackgroundColor;
                var env = scene.createDefaultEnvironment({ createGround: false, createSkybox: false });
                var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
                camera.setTarget(BABYLON.Vector3.Zero());
                camera.attachControl(babylonCanvas, false);
                var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
                var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', { segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene);
                sphere.position.y = 1;
                var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2, updatable: false }, scene);
                return scene;
            };
            var scene = createScene(exports.babylonEngine.value);
            exports.babylonScene.value = scene;
            exports.babylonEngine.value.runRenderLoop(function () {
                scene.render();
            });
            window.addEventListener('resize', function () {
                var _a;
                (_a = exports.babylonEngine.value) === null || _a === void 0 ? void 0 : _a.resize();
            });
        }
    });
});
