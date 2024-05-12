import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/ratio-list/ratio-list-styles.css";
type Props = Readonly<{
    ratiosToShow?: Array<string>;
}>;
declare function RatioListImpl({ ratiosToShow }: Props): h.JSX.Element;
export declare const RatioList: ComponentType<ExtendGlobalProps<ComponentProps<typeof RatioListImpl>>>;
export {};
export interface RatioListElement extends JetElement<RatioListElementSettableProperties>, RatioListElementSettableProperties {
    addEventListener<T extends keyof RatioListElementEventMap>(type: T, listener: (this: HTMLElement, ev: RatioListElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof RatioListElementSettableProperties>(property: T): RatioListElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof RatioListElementSettableProperties>(property: T, value: RatioListElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, RatioListElementSettableProperties>): void;
    setProperties(properties: RatioListElementSettablePropertiesLenient): void;
}
export namespace RatioListElement {
    type ratiosToShowChanged = JetElementCustomEventStrict<RatioListElement['ratiosToShow']>;
}
export interface RatioListElementEventMap extends HTMLElementEventMap {
    'ratiosToShowChanged': JetElementCustomEventStrict<RatioListElement['ratiosToShow']>;
}
export interface RatioListElementSettableProperties extends JetSettableProperties {
    ratiosToShow?: Props['ratiosToShow'];
}
export interface RatioListElementSettablePropertiesLenient extends Partial<RatioListElementSettableProperties> {
    [key: string]: any;
}
export interface RatioListIntrinsicProps extends Partial<Readonly<RatioListElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onratiosToShowChanged?: (value: RatioListElementEventMap['ratiosToShowChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-ratio-list': RatioListIntrinsicProps;
        }
    }
}
