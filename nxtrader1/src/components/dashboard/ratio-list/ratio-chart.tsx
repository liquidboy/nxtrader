import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
//import componentStrings = require("ojL10n!./resources/nls/ratio-list-strings");
import "css!dashboard/ratio-list/ratio-list-styles.css";
//import ArrayListDataProvider = require("ojs/ojarraydataprovider");
import { addToRatiosInStorage, loadRatiosFromStorage } from "./ratios-lib";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { Signal, computed, effect, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
type Props = Readonly<{
  data: Array<WChartData>;
}>;

export interface WChartData {
  id: number,
  seriesId: string,
  groupId: string,
  value: number
}

export function RatioChart(
  { data }: Props
) {
  const ratiosHistory = useSignal<Array<WChartData>>(data);
  const chartDataProvider = new ArrayDataProvider(ratiosHistory.value, {
    keyAttributes: "id",
  });

  return <div class="">
    <oj-spark-chart
      type="lineWithArea"
      data={chartDataProvider}
      lineType="curved"
      title="">
      <template slot="itemTemplate" data-oj-as="item" render={(item)=>{
        return(<oj-spark-chart-item value={item.data.value}></oj-spark-chart-item>);
      }} />
    </oj-spark-chart>
  </div>
}