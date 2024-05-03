import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/babylonjs-viewer-strings");
import "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css";

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
  return <p>{message}</p>
}

export const BabylonjsViewer: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof BabylonjsViewerImpl>>
> = registerCustomElement(
    "dashboard-babylonjs-viewer",
  BabylonjsViewerImpl
);