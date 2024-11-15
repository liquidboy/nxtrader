import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/risk-profile-strings");
import "css!dashboard/risk-profile/risk-profile-styles.css";
import { WChartData } from "dashboard/wallet-manager/wallet-charts";
import { walletAssetTotals } from "dashboard/wallet-manager/wallet-manager";
import { useSignal, useSignalEffect } from "@preact/signals";
import { ChartItem } from "./chart-item";

type Props = Readonly<{
  low?: Array<string>;
  medium?: Array<string>;
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
  const stablesData = useSignal<Array<WChartData>>([]);
  const highRiskData = useSignal<Array<WChartData>>([]);
  const mediumRiskData = useSignal<Array<WChartData>>([]);
  const lowRiskData = useSignal<Array<WChartData>>([]);

  const chartSize = "width:257px; height:200px;";
    
  useSignalEffect(()=>{
    if(walletAssetTotals.value) {
      const assets = walletAssetTotals.value?.filter(y=>y.groupId[0]==="0");
      const stables = assets?.filter(x=>props.stables.includes(x.seriesId.toString()));
      const high = assets?.filter(x=>props.high.includes(x.seriesId.toString()));
      const medium = assets?.filter(x=>props.medium.includes(x.seriesId.toString()));
      const low = assets?.filter(x=>props.low.includes(x.seriesId.toString()));
   
      console.log("risk-profile > useSignalEffect > walletAssetTotals.value", stables.length, high, medium, low);
      //stables.forEach(x=>data.value.push(x));
      stablesData.value= stables;
      highRiskData.value = high;
      mediumRiskData.value = medium;
      lowRiskData.value = low;
    }
  })

  return (
    <div className="oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end oj-md-margin-6x-top">
      <div style={chartSize} className="oj-flex-item">
        <ChartItem id="stables"title="Stables (Near zero risk)"  data={stablesData.value} style={chartSize}></ChartItem>
      </div>
      <div style={chartSize} className="oj-flex-item">
        <ChartItem id="low" title="Low Risk" data={lowRiskData.value} style={chartSize}></ChartItem>
      </div>
      <div style={chartSize} className="oj-flex-item">
        <ChartItem id="medium" title="Medium Risk" data={mediumRiskData.value} style={chartSize}></ChartItem>
      </div>
      <div style={chartSize} className="oj-flex-item">
        <ChartItem id="high" title="High Risk" data={highRiskData.value} style={chartSize}></ChartItem>
      </div>
    </div>)
}

export const RiskProfile: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof RiskProfileImpl>>
> = registerCustomElement(
    "dashboard-risk-profile",
  RiskProfileImpl
);