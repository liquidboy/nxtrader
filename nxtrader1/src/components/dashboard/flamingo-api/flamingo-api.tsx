import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/flamingo-api-strings");
import "css!dashboard/flamingo-api/flamingo-api-styles.css";

type Props = Readonly<{
  message?: string;
}>;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function FlamingoApiImpl(
  { message = "Hello from  dashboard-flamingo-api" }: Props
) {
  return <p>{message}</p>
}

export const FlamingoApi: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof FlamingoApiImpl>>
> = registerCustomElement(
    "dashboard-flamingo-api",
  FlamingoApiImpl
);