import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/notifications-layer-strings");
import "css!dashboard/notifications-layer/notifications-layer-styles.css";
import "ojs/ojmessages";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { Signal, signal } from "@preact/signals";

type Props = {
};

const notifications: Signal<Array<any>> = signal([]);;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function NotificationsLayerImpl(
  {  }: Props
) {
  const dataProvider = new ArrayDataProvider(notifications.value, {
    keyAttributes: "id",
  });
  return <div>
     <oj-messages
        class="oj-color-invert"
        messages={dataProvider}
        display={"notification"}
        position={
          {
            my: { vertical: 'top', horizontal: 'end' },
            at: { vertical: 'top', horizontal: 'end' },
            of: 'window'
          }
        }
      ></oj-messages>
  </div>
}

export const NotificationsLayer: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof NotificationsLayerImpl>>
> = registerCustomElement(
    "dashboard-notifications-layer",
  NotificationsLayerImpl
);

export function createNotification(message: any) {
  notifications.value = [message];
}