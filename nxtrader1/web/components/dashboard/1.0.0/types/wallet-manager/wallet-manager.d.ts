import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import { Signal } from "@preact/signals";
import "ojs/ojchart";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
import "ojs/ojpopup";
import "ojs/ojdrawerpopup";
import { CWallet } from "./wallet-lib";
import { WChartData } from "./wallet-charts";
export declare const tags: Signal<Set<string>>;
export declare const tagsAsArray: import("@preact/signals-core").ReadonlySignal<{
    name: string;
    value: string;
}[]>;
export declare const selectedTags: Signal<string[]>;
export declare const walletsRaw: Signal<CWallet[]>;
export declare const wallets: import("@preact/signals-core").ReadonlySignal<CWallet[]>;
export declare const walletsMetadata: Signal<Map<string, {}>>;
export declare const walletAssetTotals: Signal<WChartData[]>;
export declare function refreshCurrentSelectedAssetTransactions(): Promise<void>;
declare function WalletManagerImpl(): h.JSX.Element;
export declare const WalletManager: ComponentType<ExtendGlobalProps<ComponentProps<typeof WalletManagerImpl>>>;
export declare function getWallet(address: string): CWallet;
export {};
export interface WalletManagerElement extends JetElement<WalletManagerElementSettableProperties>, WalletManagerElementSettableProperties {
    addEventListener<T extends keyof WalletManagerElementEventMap>(type: T, listener: (this: HTMLElement, ev: WalletManagerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof WalletManagerElementSettableProperties>(property: T): WalletManagerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof WalletManagerElementSettableProperties>(property: T, value: WalletManagerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, WalletManagerElementSettableProperties>): void;
    setProperties(properties: WalletManagerElementSettablePropertiesLenient): void;
}
export interface WalletManagerElementEventMap extends HTMLElementEventMap {
}
export interface WalletManagerElementSettableProperties extends JetSettableProperties {
}
export interface WalletManagerElementSettablePropertiesLenient extends Partial<WalletManagerElementSettableProperties> {
    [key: string]: any;
}
