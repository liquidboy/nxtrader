import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/watch-list-strings");
import "css!dashboard/watch-list/watch-list-styles.css";
import transactionsDbService from "dashboard/flamingo-api/indexdb/transactionsDbService";
import { useSignal, useSignalEffect } from "@preact/signals";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { prices } from "dashboard/price-list/price-list";
import 'ojs/ojgauge';
import { WatchListItem } from "./watch-list-item";

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function WatchListImpl() {
  console.log("watch-list > render");
  const watchlist = useSignal([]);
  const dataProvider = new ArrayDataProvider(watchlist.value , {
    keyAttributes: "id",
  });

  useSignalEffect(() => {
    if(prices.value && prices.value.length > 0) {
      tryLoadTransactions();
    };
  });

  function tryLoadTransactions() {
    setTimeout(() => {
      transactionsDbService.getAllTransactions().then(result=>{
       watchlist.value = result.sort((x,y)=>x.value-y.value);
      });  
    }, 1000);
  }

  return <div>
    <oj-list-view
          id="lvWatchlist"
          aria-label="transactions"
          data={dataProvider}
          gridlines={{item:"hidden"}}
          class="oj-sm-padding-2x" 
          selectionMode="none"
        >
        <template slot="itemTemplate" data-oj-as="item" render={item=>WatchListItem(item.data)}/>
    </oj-list-view>
  </div>
}

export const WatchList: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof WatchListImpl>>
> = registerCustomElement(
    "dashboard-watch-list",
  WatchListImpl
);