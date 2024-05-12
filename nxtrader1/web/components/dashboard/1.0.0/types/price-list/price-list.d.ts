import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/price-list/price-list-styles.css";
import { Signal } from "@preact/signals";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
export declare const prices: Signal<Array<any>>;
type Props = Readonly<{
    pricesToShow?: Array<string>;
}>;
declare function PriceListImpl({ pricesToShow }: Props): h.JSX.Element;
export declare const PriceList: ComponentType<ExtendGlobalProps<ComponentProps<typeof PriceListImpl>>>;
export declare function stopPriceRefreshTimer(): void;
export declare const isAutoPriceRefreshRunning: import("@preact/signals-core").ReadonlySignal<boolean>;
export declare function startPriceRefreshTimer(): void;
export {};
export interface PriceListElement extends JetElement<PriceListElementSettableProperties>, PriceListElementSettableProperties {
    addEventListener<T extends keyof PriceListElementEventMap>(type: T, listener: (this: HTMLElement, ev: PriceListElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof PriceListElementSettableProperties>(property: T): PriceListElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof PriceListElementSettableProperties>(property: T, value: PriceListElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, PriceListElementSettableProperties>): void;
    setProperties(properties: PriceListElementSettablePropertiesLenient): void;
}
export namespace PriceListElement {
    type pricesToShowChanged = JetElementCustomEventStrict<PriceListElement['pricesToShow']>;
}
export interface PriceListElementEventMap extends HTMLElementEventMap {
    'pricesToShowChanged': JetElementCustomEventStrict<PriceListElement['pricesToShow']>;
}
export interface PriceListElementSettableProperties extends JetSettableProperties {
    pricesToShow?: Props['pricesToShow'];
}
export interface PriceListElementSettablePropertiesLenient extends Partial<PriceListElementSettableProperties> {
    [key: string]: any;
}
export interface PriceListIntrinsicProps extends Partial<Readonly<PriceListElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onpricesToShowChanged?: (value: PriceListElementEventMap['pricesToShowChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-price-list': PriceListIntrinsicProps;
        }
    }
}
