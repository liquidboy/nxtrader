import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
//import componentStrings = require("ojL10n!./resources/nls/ratio-list-strings");
import "css!dashboard/ratio-list/ratio-list-styles.css";
//import ArrayListDataProvider = require("ojs/ojarraydataprovider");
import { addToRatiosInStorage, loadRatiosFromStorage } from "./ratios-lib";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { Signal, computed, effect, useSignal, useSignalEffect } from "@preact/signals";
import { RatioChart } from "./ratio-chart";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { prices } from "dashboard/price-list/price-list";
type Props = Readonly<{
  ratiosToShow?: Array<string>;
}>;

interface WChartData {
  id: number,
  seriesId: string,
  groupId: string,
  value: number
}


/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function RatioListImpl(
  { ratiosToShow }: Props
) {
  //const ratiosHistory = useSignal<Array<WChartData>>([]);
  const maxHistoryNodes = 500;
  const ratiosHistory = useSignal<Map<string, Array<WChartData>>>(new Map());
  const ratios = useSignal<Array<any>>([]);
  const listDataProvider = computed(()=>new ArrayDataProvider(ratios.value, {
    keyAttributes: "key",
  })); 


  function getLatestRatios() {
    console.log("ratio-list > getLatestRatios");
    function findPrice(symbol: string) {
      const filteredPrices = prices.value.filter(function(x){
        if (symbol===x.symbol) {
          return true;
        }
        //return false;
      });
      return filteredPrices;
    }
    const newRatios: Array<any> = [];
    if(prices && prices?.value?.length > 0){
      ratiosToShow?.forEach(v=>{
        const parts = v.split("/");
        const price1 = findPrice(parts[0]);
        const price2 = findPrice(parts[1]);
        const ratio = price1[0].usd_price / price2[0].usd_price;
        const ratioInvert = price2[0].usd_price / price1[0].usd_price;
        newRatios.push({key: v, p1: parts[0], p2: parts[1], ratio, ratioInvert});
      });
    }
    if (newRatios.length > 0) {
      addToRatiosInStorage(Date.now().toString(), newRatios);
      ratios.value = newRatios;
      getChartData()
    }
  }
  
  function getChartData() {
    var ratios2 = loadRatiosFromStorage();
    var cdd = new Map<string, Array<WChartData>>();
    ratios2.forEach((v: Array<any>, k)=>{
      v.forEach(ri=>{
        if(!cdd.has(ri.key)) {
          cdd.set(ri.key, []);
        }
        cdd.get(ri.key)?.push({
          id: parseInt(k),
          seriesId: ri.key,
          groupId: k,
          value: ri.ratioInvert
        });
      })
    });

    //limit the size of data in the arrays
    cdd.forEach((v,k)=>{
      cdd.set(k, v.slice(0, Math.min(maxHistoryNodes, v.length)));
    });

    ratiosHistory.value = cdd;
  }
  
  useSignalEffect(()=>{
    if(prices.value) {
      getLatestRatios();
    }
  });

  return <div class="oj-sm-margin-3x-top ">
    <oj-list-view
      id="lvRatios"
      aria-label="flamingo price list"
      data={listDataProvider.value}
      class="oj-listview-item-padding-off" 
      selection-mode="none"
      >
        <template slot="itemTemplate" data-oj-as="item" render={(item)=>{
          return(<div class="oj-md-margin-2x-top oj-md-padding-2x-start oj-md-padding-2x-end oj-md-margin-3x-bottom">
            <div class="oj-md-padding-2x-bottom oj-typography-body-lg oj-text-color-primary">{item.data.key}</div>
            <div class="oj-flex oj-md-margin-2x-bottom">
              <img src={`styles/images/${item.item.data.p1}.svg`} class="card-small-token" />
              <img src={`styles/images/${item.item.data.p2}.svg`} class="card-small-token" />
              <div class="oj-sm-padding-1x-start" >{item.item.data.ratioInvert}</div>
            </div>
            <RatioChart data={ratiosHistory.value.get(item.data.key)??[]} ></RatioChart>
          </div>)
        }} />
    </oj-list-view>
    
  </div>
}

export const RatioList: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof RatioListImpl>>
> = registerCustomElement(
    "dashboard-ratio-list",
  RatioListImpl
);