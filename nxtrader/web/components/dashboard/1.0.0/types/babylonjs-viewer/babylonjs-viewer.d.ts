import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/babylonjs-viewer/babylonjs-viewer-styles.css";
type Props = Readonly<{
    message?: string;
}>;
declare function BabylonjsViewerImpl({ message }: Props): h.JSX.Element;
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
export namespace BabylonjsViewerElement {
    type messageChanged = JetElementCustomEventStrict<BabylonjsViewerElement['message']>;
}
export interface BabylonjsViewerElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<BabylonjsViewerElement['message']>;
}
export interface BabylonjsViewerElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface BabylonjsViewerElementSettablePropertiesLenient extends Partial<BabylonjsViewerElementSettableProperties> {
    [key: string]: any;
}
export interface BabylonjsViewerIntrinsicProps extends Partial<Readonly<BabylonjsViewerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: BabylonjsViewerElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-babylonjs-viewer': BabylonjsViewerIntrinsicProps;
        }
    }
}
