import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import { useEffect } from "preact/hooks";
//import componentStrings = require("ojL10n!./resources/nls/wallet-manager-strings");
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import { sc, rpc, tx, wallet as wallet2, u, CONST } from '@cityofzion/neon-core';
import { wallet as wallet3 } from '@cityofzion/neon-core-neo3';
import * as Logger  from 'ojs/ojlogger';
import axios from 'axios';
import { Signal, computed, signal, useSignal } from "@preact/signals";
import "ojs/ojbutton";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
import { ojColorSpectrum} from "ojs/ojcolorspectrum";
import { ojValidationGroup } from 'ojs/ojvalidationgroup';
import { InputTextElement } from "ojs/ojinputtext";
import { ojListView } from "ojs/ojlistview";
//import ArrayListDataProvider = require("ojs/ojarraydataprovider");
import { IntlNumberConverter } from "ojs/ojconverter-number";
import { KeySetImpl } from "@oracle/oraclejet/ojkeyset";
import { ojButton } from "ojs/ojbutton";
import BigNumber from "./bignumber"
import { BLACK } from "ojs/ojcolor";
//import Color = require("ojs/ojcolor");
import { WalletJSON } from "@cityofzion/neon-core/lib/wallet";
import { AssetTransactionsMessage, CAsset, Transaction, addressFormat } from "./wallet-lib";
import { ActionCardElement } from "ojs/ojactioncard";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { createNotification } from "dashboard/notifications-layer/notifications-layer";
import { prices } from "dashboard/price-list/price-list";
import { showAssetManagerRoute } from "./asset-manager";
import { seletedAddress } from "dashboard/wallet-peek/wallet-peek";
import { getWallet } from "./wallet-manager";
import * as Color from "ojs/ojcolor";
import transactionsDbService from "dashboard/flamingo-api/indexdb/transactionsDbService";
import { seletedTransaction } from "./asset-watchlist";
import ApiClient from "dashboard/flamingo-api/api/api-client";

const _apiClient = new ApiClient()

type Props = Readonly<{
  hidden: boolean;
  transactions: AssetTransactionsMessage | undefined; 
}>;

export function AssetTransactions(
  { hidden, transactions }: Props
) {
  if(transactions === undefined) return <>none found ...</>
  console.log("asset-transactions > render", transactions);
  const wallet = getWallet(transactions.walletAddress);
  const dataProvider = new ArrayDataProvider(transactions.transactions , {
    keyAttributes: "id",
  });
  const usdNumberConverter = new IntlNumberConverter({
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    currencyFormat: "standard",
    decimalFormat: "long",
    maximumFractionDigits: 12,
  });
  const unitPriceFound = prices.value.find(p=>p.symbol === transactions.asset_name);
  const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
  const copyValueToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    const newMessage = {
      id: 1,
      severity: 'none',
      summary: value + ' copied to clipboard',
      autoTimeout: 3000,
    };
    createNotification(newMessage);
  }
  const peekAddress = (value) => {
    showAssetManagerRoute({walletPeekHidden: false});
    seletedAddress.value = value;
  };
  const showAddAssetToWatchList = async (value: Transaction) => {
    showAssetManagerRoute({assetWatchlistEditorHidden: false});
    let tx = await _apiClient.getNeoTransaction(value.txid);
    console.log("xxx tx", tx);
    seletedTransaction.value = { txDetail: tx, transaction: value, transactionType: "add", watchlist: [] };
  };
  const showEditAssetToWatchList = async (value: Transaction) => {
    showAssetManagerRoute({assetWatchlistEditorHidden: false});
    let tx = await _apiClient.getNeoTransaction(value.txid);
    seletedTransaction.value = { txDetail: tx, transaction: value, transactionType: "edit", watchlist: transactions.watchlist?.filter(x=>x.id === value.id) };
  };

  return <div hidden={hidden}>
    <div class="oj-flex oj-sm-padding-5x-start oj-sm-padding-5x-end oj-sm-padding-2x-top">
      <div class="oj-flex oj-flex-item">
        <div style={{width: "5px", height: "27px", backgroundColor: (wallet.walletColor ? new Color(wallet.walletColor) : BLACK).toString() }}></div>
        <div class="oj-sm-padding-1x-top oj-sm-padding-1x-start oj-sm-padding-2x-end">{wallet.name} &gt; </div>
        <img src={`styles/images/${transactions.asset_name}.svg`} class="card-small-token" />
        <div class="oj-sm-padding-1x-top oj-sm-padding-0x-start oj-sm-padding-2x-end">{transactions.asset_name}</div>
      </div>
      <div class="oj-sm-flex-initial oj-flex-item ">
        {transactions.transactions.length} {transactions.transactions.length > 1 ? "transactions" : 
          transactions.transactions.length === 1 ? "transaction" : ""}</div>
    </div>
    <div>
      <oj-list-view
          id="lvTransactions"
          aria-label="transactions"
          data={dataProvider}
          gridlines={{item:"visible"}}
          class="oj-sm-padding-1x" 
          selectionMode="none"
        >
            <template slot="itemTemplate" data-oj-as="item" render={(item)=>{
              return (<div>
                <div class="oj-flex oj-flex oj-text-primary-color oj-typography-body-md">
                  <img src={`styles/images/${item.data.symbol}.svg`} class=" card-small-token" />
                  <div class="oj-flex-item" style={{width: "200px"}}>
                    {item.data.value}
                    <span class="oj-md-padding-2x-start oj-ux-ico-clipboard-add clipboard-action" 
                      title="copy price to clipboard"
                      onClick={()=>copyValueToClipboard(item.data.value)}></span>
                  </div>
                  {item.data.value>0?
                    <div class="oj-flex-item oj-flex">
                      <img src="styles/images/FUSDT.svg" class="card-small-token" />
                      <div>{ usdNumberConverter.format(parseFloat(item.data.value) * unitPriceInUsd) }</div>
                  </div>:<></>}
                  <div class="oj-sm-flex-initial oj-flex-item oj-flex oj-text-secondary-color">
                    <span class="oj-ux-ico-bookmark clipboard-action" 
                      title="add to watch list" 
                      hidden={item.data.type==="sent" 
                        || (transactions.watchlist?.filter(x=>x.id === item.data.id).length > 0)}
                      onClick={()=>showAddAssetToWatchList(item.data)}></span>
                    <span class="oj-ux-ico-bookmark-selected clipboard-action" 
                      title="remove from watch list" 
                      hidden={transactions.watchlist?.filter(x=>x.id === item.data.id).length !== 1}
                      onClick={()=>showEditAssetToWatchList(item.data)}></span>
                  </div>
                </div>
                <div class="oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm">
                  {item.data.type==="sent"?"sent to " : "recieved from "}
                  <span class="clipboard-action tx-address" title="peek into address" onClick={()=>peekAddress(item.data.type==="sent"? item.data.to[0] :item.data.from[0])}>
                    <span class="oj-ux-ico-wallet oj-md-margin-1x-end oj-md-margin-1x-top"></span> 
                    {item.data.type==="sent"? addressFormat(item.data.to[0]) : addressFormat(item.data.from[0])}
                  </span>
                  <span class="oj-md-padding-2x-start oj-sm-padding-2x-top  oj-ux-ico-clipboard-add clipboard-action" 
                    title="copy address to clipboard"
                    onClick={()=>copyValueToClipboard(item.data.type==="sent"? item.data.to[0] :item.data.from[0])}></span>
                </div>
                <div class="oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm">
                  {getTimeInterval(item.data.block_time * 1000)} ({new Date(item.data.block_time * 1000).toISOString()})
                </div>
              </div>
            )}} />
        </oj-list-view>
      </div>
  </div>
}

export function getTimeInterval(date: number) {
  let seconds = Math.floor((Date.now() - date) / 1000);
  let unit = "second";
  let direction = "ago";
  if (seconds < 0) {
    seconds = -seconds;
    direction = "from now";
  }
  let value = seconds;
  if (seconds >= 31536000) {
    value = Math.floor(seconds / 31536000);
    unit = "year";
  } else if (seconds >= 86400) {
    value = Math.floor(seconds / 86400);
    unit = "day";
  } else if (seconds >= 3600) {
    value = Math.floor(seconds / 3600);
    unit = "hour";
  } else if (seconds >= 60) {
    value = Math.floor(seconds / 60);
    unit = "minute";
  }
  if (value != 1)
    unit = unit + "s";
  return value + " " + unit + " " + direction;
}