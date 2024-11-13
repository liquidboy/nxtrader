import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/risk-profile-strings");
import "css!dashboard/risk-profile/risk-profile-styles.css";
import { WChartData } from "dashboard/wallet-manager/wallet-charts";
import { walletAssetTotals } from "dashboard/wallet-manager/wallet-manager";
import { useSignalEffect } from "@preact/signals";

type Props = Readonly<{
  low?: Array<string>;
  high?: Array<string>;
  stables?: Array<string>;
}>;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function RiskProfileImpl(
  props: Props
) {
  
  


  useSignalEffect(()=>{
    if(walletAssetTotals.value) {
      console.log("risk-profile > useSignalEffect > walletAssetTotals.value", walletAssetTotals.value, props);
    }
  })

  return <p>{props.high}</p>
}

export const RiskProfile: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof RiskProfileImpl>>
> = registerCustomElement(
    "dashboard-risk-profile",
  RiskProfileImpl
);