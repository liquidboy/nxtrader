import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/watch-list-strings");
import "css!dashboard/watch-list/watch-list-styles.css";
import transactionsDbService, { StoredTransactionRecord } from "dashboard/flamingo-api/indexdb/transactionsDbService";
import { signal, useSignal, useSignalEffect } from "@preact/signals";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { prices } from "dashboard/price-list/price-list";
import 'ojs/ojgauge';
import { WatchListItem } from "./watch-list-item";
import { deleteWatchListItem } from "dashboard/wallet-manager/asset-watchlist";

const watchlist = signal([]);
export function tryLoadTransactionsInWatchlist() {
  setTimeout(() => {
    transactionsDbService.getAllTransactions().then(result=>{
     function conv(s:StoredTransactionRecord){
      const unitPriceFound = prices.value.find(p=>p.symbol === s.symbol);
      const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
      const curPriceInUsdt = parseFloat(s.value) * unitPriceInUsd;
      const purchaseCostUsdt = s.purchaseCostUsdt;
      const goalUsdt = s.goalUsdt;
      const profitInUsdt = curPriceInUsdt-purchaseCostUsdt;
      return {...s, ...{profitInUsdt,curPriceInUsdt,unitPriceInUsd}};
     }
     const r2 = result.map((x,y)=>conv(x));

     watchlist.value = r2.sort((x,y)=>y.profitInUsdt-x.profitInUsdt);
    });  
  }, 1000);
}

async function tryDeleteWatchListItem (event: any) {
  const id = event.srcElement.dataset.id;
  const symbol = event.srcElement.dataset.symbol;
  const val = event.srcElement.dataset.value;
  //console.log(id,  event.srcElement.dataset);
  await deleteWatchListItem(parseInt(id), symbol, val);
  tryLoadTransactionsInWatchlist();
}

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function WatchListImpl() {
  console.log("watch-list > render", watchlist.value);
  
  const dataProvider = new ArrayDataProvider(watchlist.value , {
    keyAttributes: "id",
  });

  useSignalEffect(() => {
    if(prices.value && prices.value.length > 0) {
      tryLoadTransactionsInWatchlist();
    };
  });


  return <div>
    <oj-list-view
          id="lvWatchlist"
          aria-label="transactions"
          data={dataProvider}
          gridlines={{item:"hidden"}}
          class="oj-sm-padding-2x" 
          selectionMode="none"
        >
        <template slot="itemTemplate" data-oj-as="item" render={item=>WatchListItem(item.data, tryDeleteWatchListItem)}/>
    </oj-list-view>
  </div>
}

export const WatchList: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof WatchListImpl>>
> = registerCustomElement(
    "dashboard-watch-list",
  WatchListImpl
);