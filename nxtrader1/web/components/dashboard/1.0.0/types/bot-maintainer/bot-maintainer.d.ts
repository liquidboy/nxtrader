import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/bot-maintainer/bot-maintainer-styles.css";
type Props = Readonly<{
    message?: string;
}>;
declare function BotMaintainerImpl({ message }: Props): h.JSX.Element;
export declare const BotMaintainer: ComponentType<ExtendGlobalProps<ComponentProps<typeof BotMaintainerImpl>>>;
export {};
export interface BotMaintainerElement extends JetElement<BotMaintainerElementSettableProperties>, BotMaintainerElementSettableProperties {
    addEventListener<T extends keyof BotMaintainerElementEventMap>(type: T, listener: (this: HTMLElement, ev: BotMaintainerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof BotMaintainerElementSettableProperties>(property: T): BotMaintainerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof BotMaintainerElementSettableProperties>(property: T, value: BotMaintainerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, BotMaintainerElementSettableProperties>): void;
    setProperties(properties: BotMaintainerElementSettablePropertiesLenient): void;
}
export namespace BotMaintainerElement {
    type messageChanged = JetElementCustomEventStrict<BotMaintainerElement['message']>;
}
export interface BotMaintainerElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<BotMaintainerElement['message']>;
}
export interface BotMaintainerElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface BotMaintainerElementSettablePropertiesLenient extends Partial<BotMaintainerElementSettableProperties> {
    [key: string]: any;
}
export interface BotMaintainerIntrinsicProps extends Partial<Readonly<BotMaintainerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: BotMaintainerElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-bot-maintainer': BotMaintainerIntrinsicProps;
        }
    }
}
