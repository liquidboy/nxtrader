import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/connected-wallet-strings");
import "css!dashboard/connected-wallet/connected-wallet-styles.css";

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
function ConnectedWalletImpl(
  { message = "NEO ❤️ FLM" }: Props
) {
  return <p>{message}</p>
}

export const ConnectedWallet: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof ConnectedWalletImpl>>
> = registerCustomElement(
    "dashboard-connected-wallet",
  ConnectedWalletImpl
);