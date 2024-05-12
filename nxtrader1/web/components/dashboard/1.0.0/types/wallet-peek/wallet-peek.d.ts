import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/wallet-peek/wallet-peek-styles.css";
export declare const seletedAddress: import("@preact/signals-core").Signal<string>;
type Props = Readonly<{
    hiddenRoot: boolean;
    message?: string;
    navigateBack: () => void;
}>;
declare function WalletPeekImpl({ hiddenRoot, navigateBack }: Props): h.JSX.Element;
export declare const WalletPeek: ComponentType<ExtendGlobalProps<ComponentProps<typeof WalletPeekImpl>>>;
export {};
export interface WalletPeekElement extends JetElement<WalletPeekElementSettableProperties>, WalletPeekElementSettableProperties {
    addEventListener<T extends keyof WalletPeekElementEventMap>(type: T, listener: (this: HTMLElement, ev: WalletPeekElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof WalletPeekElementSettableProperties>(property: T): WalletPeekElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof WalletPeekElementSettableProperties>(property: T, value: WalletPeekElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, WalletPeekElementSettableProperties>): void;
    setProperties(properties: WalletPeekElementSettablePropertiesLenient): void;
}
export namespace WalletPeekElement {
    type hiddenRootChanged = JetElementCustomEventStrict<WalletPeekElement['hiddenRoot']>;
    type messageChanged = JetElementCustomEventStrict<WalletPeekElement['message']>;
    type navigateBackChanged = JetElementCustomEventStrict<WalletPeekElement['navigateBack']>;
}
export interface WalletPeekElementEventMap extends HTMLElementEventMap {
    'hiddenRootChanged': JetElementCustomEventStrict<WalletPeekElement['hiddenRoot']>;
    'messageChanged': JetElementCustomEventStrict<WalletPeekElement['message']>;
    'navigateBackChanged': JetElementCustomEventStrict<WalletPeekElement['navigateBack']>;
}
export interface WalletPeekElementSettableProperties extends JetSettableProperties {
    hiddenRoot: Props['hiddenRoot'];
    message?: Props['message'];
    navigateBack: Props['navigateBack'];
}
export interface WalletPeekElementSettablePropertiesLenient extends Partial<WalletPeekElementSettableProperties> {
    [key: string]: any;
}
export interface WalletPeekIntrinsicProps extends Partial<Readonly<WalletPeekElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onhiddenRootChanged?: (value: WalletPeekElementEventMap['hiddenRootChanged']) => void;
    onmessageChanged?: (value: WalletPeekElementEventMap['messageChanged']) => void;
    onnavigateBackChanged?: (value: WalletPeekElementEventMap['navigateBackChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-wallet-peek': WalletPeekIntrinsicProps;
        }
    }
}
