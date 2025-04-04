import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!dashboard/connected-wallet/connected-wallet-styles.css";
type Props = Readonly<{
    message?: string;
}>;
declare function ConnectedWalletImpl({ message }: Props): import("preact").JSX.Element;
export declare const ConnectedWallet: ComponentType<ExtendGlobalProps<ComponentProps<typeof ConnectedWalletImpl>>>;
export {};
export interface ConnectedWalletElement extends JetElement<ConnectedWalletElementSettableProperties>, ConnectedWalletElementSettableProperties {
    addEventListener<T extends keyof ConnectedWalletElementEventMap>(type: T, listener: (this: HTMLElement, ev: ConnectedWalletElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ConnectedWalletElementSettableProperties>(property: T): ConnectedWalletElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ConnectedWalletElementSettableProperties>(property: T, value: ConnectedWalletElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ConnectedWalletElementSettableProperties>): void;
    setProperties(properties: ConnectedWalletElementSettablePropertiesLenient): void;
}
export namespace ConnectedWalletElement {
    type messageChanged = JetElementCustomEventStrict<ConnectedWalletElement['message']>;
}
export interface ConnectedWalletElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<ConnectedWalletElement['message']>;
}
export interface ConnectedWalletElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface ConnectedWalletElementSettablePropertiesLenient extends Partial<ConnectedWalletElementSettableProperties> {
    [key: string]: any;
}
export interface ConnectedWalletIntrinsicProps extends Partial<Readonly<ConnectedWalletElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: ConnectedWalletElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-connected-wallet': ConnectedWalletIntrinsicProps;
        }
    }
}
