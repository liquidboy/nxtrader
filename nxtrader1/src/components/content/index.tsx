/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import "dashboard/wallet-manager/loader";
import "dashboard/price-list/loader";
import "dashboard/ratio-list/loader";
import "dashboard/notifications-layer/loader"
import "dashboard/bot-maintainer/loader"
import "dashboard/wallet-peek/loader";
import "dashboard/watch-list/loader";
import "dashboard/flamingo-api/loader";

export function Content() {

  return (
    <div class="oj-web-applayout-max-width oj-web-applayout-content">
      <div className="oj-flex">
        <div class="first-column-content">
          <dashboard-price-list pricesToShow={['fWBTC','WBTC','fWETH','WETH','FLM','FLUND','bNEO','NEO','GAS','FUSD','fUSDT', 'USDT']} ></dashboard-price-list>
          <dashboard-ratio-list ratiosToShow={['bNEO/WBTC','FLM/WBTC','GAS/WBTC','FLM/bNEO','GAS/bNEO','FLM/GAS']}></dashboard-ratio-list>
          <dashboard-watch-list></dashboard-watch-list>
        </div>
        <div class="oj-flex-item wallet-manager-content">
          <dashboard-wallet-manager></dashboard-wallet-manager>
          <dashboard-bot-maintainer></dashboard-bot-maintainer>
        </div>
      </div>
      <dashboard-notifications-layer></dashboard-notifications-layer>
    </div>
  );
};









