import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/watch-list/watch-list-styles.css";
import 'ojs/ojgauge';
export declare function tryLoadTransactionsInWatchlist(): void;
declare function WatchListImpl(): h.JSX.Element;
export declare const WatchList: ComponentType<ExtendGlobalProps<ComponentProps<typeof WatchListImpl>>>;
export {};
export interface WatchListElement extends JetElement<WatchListElementSettableProperties>, WatchListElementSettableProperties {
    addEventListener<T extends keyof WatchListElementEventMap>(type: T, listener: (this: HTMLElement, ev: WatchListElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof WatchListElementSettableProperties>(property: T): WatchListElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof WatchListElementSettableProperties>(property: T, value: WatchListElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, WatchListElementSettableProperties>): void;
    setProperties(properties: WatchListElementSettablePropertiesLenient): void;
}
export interface WatchListElementEventMap extends HTMLElementEventMap {
}
export interface WatchListElementSettableProperties extends JetSettableProperties {
}
export interface WatchListElementSettablePropertiesLenient extends Partial<WatchListElementSettableProperties> {
    [key: string]: any;
}
