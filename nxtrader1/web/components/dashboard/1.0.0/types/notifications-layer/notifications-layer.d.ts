import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import "css!dashboard/notifications-layer/notifications-layer-styles.css";
import "ojs/ojmessages";
type Props = {};
declare function NotificationsLayerImpl({}: Props): h.JSX.Element;
export declare const NotificationsLayer: ComponentType<ExtendGlobalProps<ComponentProps<typeof NotificationsLayerImpl>>>;
export declare function createNotification(message: any): void;
export {};
export interface NotificationsLayerElement extends JetElement<NotificationsLayerElementSettableProperties>, NotificationsLayerElementSettableProperties {
    addEventListener<T extends keyof NotificationsLayerElementEventMap>(type: T, listener: (this: HTMLElement, ev: NotificationsLayerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof NotificationsLayerElementSettableProperties>(property: T): NotificationsLayerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof NotificationsLayerElementSettableProperties>(property: T, value: NotificationsLayerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, NotificationsLayerElementSettableProperties>): void;
    setProperties(properties: NotificationsLayerElementSettablePropertiesLenient): void;
}
export interface NotificationsLayerElementEventMap extends HTMLElementEventMap {
}
export interface NotificationsLayerElementSettableProperties extends JetSettableProperties {
}
export interface NotificationsLayerElementSettablePropertiesLenient extends Partial<NotificationsLayerElementSettableProperties> {
    [key: string]: any;
}
export interface NotificationsLayerIntrinsicProps extends Partial<Readonly<NotificationsLayerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'dashboard-notifications-layer': NotificationsLayerIntrinsicProps;
        }
    }
}
