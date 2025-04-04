import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!dashboard/bitrue-tools/bitrue-tools-styles.css";
import { tx } from '@cityofzion/neon-core';
type Props = Readonly<{
    message?: string;
}>;
declare function BitrueToolsImpl({ message }: Props): import("preact").JSX.Element;
export declare const BitrueTools: ComponentType<ExtendGlobalProps<ComponentProps<typeof BitrueToolsImpl>>>;
export declare function createFlamingoSwap(fromToken: string, toToken: string, quantity: number, minOutQuantity: number, accountAddress: string, accountScriptHash: string): Promise<tx.Transaction>;
export {};
export interface BitrueToolsElement extends JetElement<BitrueToolsElementSettableProperties>, BitrueToolsElementSettableProperties {
    addEventListener<T extends keyof BitrueToolsElementEventMap>(type: T, listener: (this: HTMLElement, ev: BitrueToolsElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof BitrueToolsElementSettableProperties>(property: T): BitrueToolsElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof BitrueToolsElementSettableProperties>(property: T, value: BitrueToolsElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, BitrueToolsElementSettableProperties>): void;
    setProperties(properties: BitrueToolsElementSettablePropertiesLenient): void;
}
export namespace BitrueToolsElement {
    type messageChanged = JetElementCustomEventStrict<BitrueToolsElement['message']>;
}
export interface BitrueToolsElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<BitrueToolsElement['message']>;
}
export interface BitrueToolsElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface BitrueToolsElementSettablePropertiesLenient extends Partial<BitrueToolsElementSettableProperties> {
    [key: string]: any;
}
export interface BitrueToolsIntrinsicProps extends Partial<Readonly<BitrueToolsElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: BitrueToolsElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-bitrue-tools': BitrueToolsIntrinsicProps;
        }
    }
}
