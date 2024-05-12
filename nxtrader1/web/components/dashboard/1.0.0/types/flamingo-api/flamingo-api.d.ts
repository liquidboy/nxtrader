import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/flamingo-api/flamingo-api-styles.css";
type Props = Readonly<{
    message?: string;
}>;
declare function FlamingoApiImpl({ message }: Props): h.JSX.Element;
export declare const FlamingoApi: ComponentType<ExtendGlobalProps<ComponentProps<typeof FlamingoApiImpl>>>;
export {};
export interface FlamingoApiElement extends JetElement<FlamingoApiElementSettableProperties>, FlamingoApiElementSettableProperties {
    addEventListener<T extends keyof FlamingoApiElementEventMap>(type: T, listener: (this: HTMLElement, ev: FlamingoApiElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof FlamingoApiElementSettableProperties>(property: T): FlamingoApiElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof FlamingoApiElementSettableProperties>(property: T, value: FlamingoApiElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, FlamingoApiElementSettableProperties>): void;
    setProperties(properties: FlamingoApiElementSettablePropertiesLenient): void;
}
export namespace FlamingoApiElement {
    type messageChanged = JetElementCustomEventStrict<FlamingoApiElement['message']>;
}
export interface FlamingoApiElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<FlamingoApiElement['message']>;
}
export interface FlamingoApiElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface FlamingoApiElementSettablePropertiesLenient extends Partial<FlamingoApiElementSettableProperties> {
    [key: string]: any;
}
export interface FlamingoApiIntrinsicProps extends Partial<Readonly<FlamingoApiElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: FlamingoApiElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-flamingo-api': FlamingoApiIntrinsicProps;
        }
    }
}
