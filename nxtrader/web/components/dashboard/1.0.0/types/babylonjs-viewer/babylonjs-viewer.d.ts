import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css";
import * as BABYLON from 'babylonjs';
export declare const babylonEngine: import("@preact/signals-core").Signal<BABYLON.Engine | undefined>;
export declare const babylonScene: import("@preact/signals-core").Signal<BABYLON.Scene | undefined>;
declare function BabylonjsViewerImpl(): h.JSX.Element;
export declare const BabylonjsViewer: ComponentType<ExtendGlobalProps<ComponentProps<typeof BabylonjsViewerImpl>>>;
export {};
export interface BabylonjsViewerElement extends JetElement<BabylonjsViewerElementSettableProperties>, BabylonjsViewerElementSettableProperties {
    addEventListener<T extends keyof BabylonjsViewerElementEventMap>(type: T, listener: (this: HTMLElement, ev: BabylonjsViewerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof BabylonjsViewerElementSettableProperties>(property: T): BabylonjsViewerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof BabylonjsViewerElementSettableProperties>(property: T, value: BabylonjsViewerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, BabylonjsViewerElementSettableProperties>): void;
    setProperties(properties: BabylonjsViewerElementSettablePropertiesLenient): void;
}
export interface BabylonjsViewerElementEventMap extends HTMLElementEventMap {
}
export interface BabylonjsViewerElementSettableProperties extends JetSettableProperties {
}
export interface BabylonjsViewerElementSettablePropertiesLenient extends Partial<BabylonjsViewerElementSettableProperties> {
    [key: string]: any;
}
