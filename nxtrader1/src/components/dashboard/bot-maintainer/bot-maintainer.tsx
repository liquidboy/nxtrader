import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/bot-maintainer-strings");
import "css!dashboard/bot-maintainer/bot-maintainer-styles.css";

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
function BotMaintainerImpl(
  { message = "Hello from  dashboard-bot-maintainer" }: Props
) {
  console.log("bot-maintainer > render")



  return <div class="oj-sm-margin-7x-start oj-sm-margin-7x-end oj-sm-margin-5x-top">{message}</div>
}

export const BotMaintainer: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof BotMaintainerImpl>>
> = registerCustomElement(
    "dashboard-bot-maintainer",
  BotMaintainerImpl
);