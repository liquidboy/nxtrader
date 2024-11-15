import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!dashboard/risk-profile/risk-profile-styles.css";
type Props = Readonly<{
    low?: Array<string>;
    medium?: Array<string>;
    high?: Array<string>;
    stables?: Array<string>;
}>;
declare function RiskProfileImpl(props: Props): import("preact").JSX.Element;
export declare const RiskProfile: ComponentType<ExtendGlobalProps<ComponentProps<typeof RiskProfileImpl>>>;
export {};
export interface RiskProfileElement extends JetElement<RiskProfileElementSettableProperties>, RiskProfileElementSettableProperties {
    addEventListener<T extends keyof RiskProfileElementEventMap>(type: T, listener: (this: HTMLElement, ev: RiskProfileElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof RiskProfileElementSettableProperties>(property: T): RiskProfileElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof RiskProfileElementSettableProperties>(property: T, value: RiskProfileElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, RiskProfileElementSettableProperties>): void;
    setProperties(properties: RiskProfileElementSettablePropertiesLenient): void;
}
export namespace RiskProfileElement {
    type highChanged = JetElementCustomEventStrict<RiskProfileElement['high']>;
    type lowChanged = JetElementCustomEventStrict<RiskProfileElement['low']>;
    type mediumChanged = JetElementCustomEventStrict<RiskProfileElement['medium']>;
    type stablesChanged = JetElementCustomEventStrict<RiskProfileElement['stables']>;
}
export interface RiskProfileElementEventMap extends HTMLElementEventMap {
    'highChanged': JetElementCustomEventStrict<RiskProfileElement['high']>;
    'lowChanged': JetElementCustomEventStrict<RiskProfileElement['low']>;
    'mediumChanged': JetElementCustomEventStrict<RiskProfileElement['medium']>;
    'stablesChanged': JetElementCustomEventStrict<RiskProfileElement['stables']>;
}
export interface RiskProfileElementSettableProperties extends JetSettableProperties {
    high?: Props['high'];
    low?: Props['low'];
    medium?: Props['medium'];
    stables?: Props['stables'];
}
export interface RiskProfileElementSettablePropertiesLenient extends Partial<RiskProfileElementSettableProperties> {
    [key: string]: any;
}
export interface RiskProfileIntrinsicProps extends Partial<Readonly<RiskProfileElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onhighChanged?: (value: RiskProfileElementEventMap['highChanged']) => void;
    onlowChanged?: (value: RiskProfileElementEventMap['lowChanged']) => void;
    onmediumChanged?: (value: RiskProfileElementEventMap['mediumChanged']) => void;
    onstablesChanged?: (value: RiskProfileElementEventMap['stablesChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-risk-profile': RiskProfileIntrinsicProps;
        }
    }
}
