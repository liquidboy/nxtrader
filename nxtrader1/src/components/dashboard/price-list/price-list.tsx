import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import { useEffect } from "preact/hooks"
import "css!dashboard/price-list/price-list-styles.css";
import axios from 'axios';
import { Signal, computed, signal, useSignal } from "@preact/signals";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import { IntlNumberConverter } from "ojs/ojconverter-number";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import ApiClient from "dashboard/flamingo-api/api/api-client";

const FLAMINGO_PRICE_URL: string = "https://cdn.flamingo.finance/token-info/prices";
export const prices: Signal<Array<any>> = signal([]);
const refreshEvery5Mins = 300000;
let refreshTimerId = signal<number>(0);
const _apiClient = new ApiClient()

type Props = Readonly<{
  pricesToShow?: Array<string>;
}>;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function PriceListImpl(
  { pricesToShow }: Props
) {
  const filteredPrices = prices.value.sort((x,y)=>x.symbol.localeCompare(y.symbol)).filter(function(x){
    if(pricesToShow) {
      return pricesToShow.indexOf(x.symbol) >= 0;
    }
    return false;
  });
  
  const dataProvider = new ArrayDataProvider(filteredPrices ?? [], {
    keyAttributes: "symbol",
  });
  const usdNumberConverter = new IntlNumberConverter({
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    currencyFormat: "standard",
    decimalFormat: "long",
    maximumFractionDigits: 12,
  });
  
  const renderItem = (item: any) => {
    return (<div>
        <div className="oj-flex oj-sm-padding-2x">
          <img src={`styles/images/${item.item.data.symbol}.svg`} class="token"></img>
          <div>
            <div className="oj-flex">
              <span class={`oj-typography-body-md oj-text-color-primary`}>
                {item.item.data.symbol}
              </span>
            </div>
            <div style={{fontSize: 22}}>          
              {usdNumberConverter.format(item.item.data.usd_price)}
            </div>
          </div>
          </div>
      </div>
    );
  }
  
  useEffect(()=>{
    //console.log("price-list > refreshPrices > useEffect");
    refreshPrices();
    startPriceRefreshTimer();
    return () => stopPriceRefreshTimer();
  }, []);

  return <div>
     <oj-list-view
      id="lvPrices"
      aria-label="flamingo price list"
      data={dataProvider}
      class="oj-listview-item-padding-off" 
      selection-mode="none"
      >
        <template slot="itemTemplate" data-oj-as="item" render={renderItem} />
    </oj-list-view>
  </div>
}

export const PriceList: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof PriceListImpl>>
> = registerCustomElement(
    "dashboard-price-list",
  PriceListImpl
);

function refreshPrices() {
  getFlamingoPriceFeed().then(data => {
    console.log("price-list > refreshPrices > completed", data);
    prices.value = addMissingBNEO(data);
  });
}

async function getFlamingoPriceFeed() {
  return _apiClient.getFlamingoLivedataPricesLatest(); // <-- new way
  //return axios.get(FLAMINGO_PRICE_URL).then((ret) => addMissingBNEO(ret.data)); // <-- old flamingo single pool uses the USDT/FUSD pool
}

function addMissingBNEO(data: Array<any>){
  var neo = data.filter(x=>x.symbol === "bNEO");
  if(neo.length === 1) {
    //neo[0].symbol = "bNEO";
    //return Array.prototype.concat(data, neo);
    data.push({
      hash: neo[0].hash,
      symbol:"NEO",
      unwrappedSymbol: "NEO",
      usd_price: neo[0].usd_price
    })
  }
  return data;
}

export function stopPriceRefreshTimer() {
  if(refreshTimerId.value !== 0) {
    console.log("price-list > stop refresh timer");
    clearInterval(refreshTimerId.value);
    refreshTimerId.value = 0;
  }
}

export const isAutoPriceRefreshRunning = computed( () => refreshTimerId.value > 0); 

export function startPriceRefreshTimer() {
  if(refreshTimerId.value === 0) {
    console.log("price-list > start refresh timer");
    refreshTimerId.value = setInterval(refreshPrices, refreshEvery5Mins);
  }
}