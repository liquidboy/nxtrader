import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
//import componentStrings = require("ojL10n!./resources/nls/wallet-manager-strings");
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import { sc, rpc, tx, wallet as wallet2, u, CONST } from '@cityofzion/neon-core';
import { wallet as wallet3 } from '@cityofzion/neon-core-neo3';
import * as Logger  from 'ojs/ojlogger';
import axios from 'axios';
import { Signal, computed, effect, signal, useSignal, useSignalEffect } from "@preact/signals";
import "ojs/ojchart";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
import "ojs/ojpopup";
import "ojs/ojdrawerpopup";
import { DrawerPopupElement } from "ojs/ojdrawerpopup";
import { ojChart } from "ojs/ojchart";
import { ojColorSpectrum} from "ojs/ojcolorspectrum";
import { ojValidationGroup } from 'ojs/ojvalidationgroup';
import { InputTextElement } from "ojs/ojinputtext";
import { InputNumberElement } from "ojs/ojinputnumber";
import { ojListView } from "ojs/ojlistview";
//import { ArrayListDataProvider } from "ojs/ojarraydataprovider";
import { IntlNumberConverter } from "ojs/ojconverter-number";
import { KeySetImpl } from "@oracle/oraclejet/ojkeyset";
import { ojButton } from "ojs/ojbutton";
import BigNumber from "./bignumber"
import { BLACK } from "ojs/ojcolor";
import { WalletJSON } from "@cityofzion/neon-core/lib/wallet";
import { AssetCard } from "./asset-card";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");
//import { AssetTransactions } from "./asset-transactions";
import { ojPopup } from "ojs/ojpopup";
import { Asset, AssetTransactionsMessage, CAsset, CWallet, KEY, addWalletToStorage, deleteWalletFromStorage, getN3AddressBalances, getN3AllTxs, getN3AssetTxs, getSelectedTagsFromStorage, loadWalletsFromStorage, updateWalletToStorage } from "./wallet-lib";
import { WalletList, refreshLastUpdatedTime } from "./wallet-list";
import { WChartData, WalletCharts } from "./wallet-charts";
import { WalletEditor } from "./wallet-editor";
import { prices, startPriceRefreshTimer, stopPriceRefreshTimer } from "dashboard/price-list/price-list";
import { createNotification } from "dashboard/notifications-layer/notifications-layer";
import * as Color from "ojs/ojcolor";
import { ojComboboxMany } from "ojs/ojselectcombobox";
import { AssetManager, showAssetManagerRoute } from "./asset-manager";
import transactionsDbService from "dashboard/flamingo-api/indexdb/transactionsDbService";
import { bawHidden, bcloHidden, bclrHidden, bcrHidden, brbHidden, buHidden, tbnDisabled, tdnHidden } from "./form-elements";

const refreshEvery1Minute = 60000;
let refreshIntervalId: number | undefined = undefined;

const currentTransactions = signal<AssetTransactionsMessage|undefined>(undefined);
const currentSelectedAsset = signal<{walletAddress: string, asset_name: string, assetId: string}>(undefined);
const useCacheing = false;
const cacheAddressBalances = new Map<string, { data: Array<Asset>, age: number}>();


// wallet tags
export const tags = signal(new Set<string>());
export const tagsAsArray = computed(()=> Array.from(tags.value).map((x)=>({"name": x, "value": x})))
let tempIds = getSelectedTagsFromStorage();
//tempIds = tempIds.length === 0 ? new Array<string>("personel", "bot") : tempIds;
export const selectedTags = signal(tempIds);


// wallets
export const walletsRaw = signal<Array<CWallet>>([]);
export const wallets = computed(()=>{
  if(selectedTags.value.length === 0) return walletsRaw.value;
  let found = walletsRaw.value.filter(w => {
    var found = false;
    w.tags.forEach(t=>{
      var found2= selectedTags.value.includes(t);
      if(found2) found = true;
    });
    return found;
  });
  console.log("wallet-manager > wallets > computed");
  // console.log("wallet-manager > wallets > computed", walletsRaw.peek(), selectedTags.peek(), found);
  return found;
});

function updateWallets(force?: boolean, postUpdateWallets? : () => void) {
  const existingWallets = loadWalletsFromStorage();
  console.log(`wallet-manager > updateWallets ${existingWallets.length}`);
  if(force || existingWallets && existingWallets.length > 0) {
    walletsRaw.value = existingWallets;
    if(postUpdateWallets) postUpdateWallets();
  }
}
function updateWalletsDelayed(interval: number = 1000) {
  setTimeout(updateWallets, interval);
  //updateWallets(true);
}

export async function refreshCurrentSelectedAssetTransactions() {
  if(currentSelectedAsset.value.assetId) {
    stopPriceRefreshTimer();
    currentTransactions.value = { transactions: [], watchlist: [], asset_name: currentSelectedAsset.value.asset_name, assetId: currentSelectedAsset.value.assetId, walletAddress: currentSelectedAsset.value.walletAddress };
    var result = await getN3AssetTxs(currentSelectedAsset.value.walletAddress, currentSelectedAsset.value.assetId);
    var watchlistFound = await transactionsDbService.getTransactions(currentSelectedAsset.value.asset_name);
    currentTransactions.value = { transactions: result, watchlist: watchlistFound,  asset_name:currentSelectedAsset.value.asset_name, assetId: currentSelectedAsset.value.assetId, walletAddress: currentSelectedAsset.value.walletAddress } as AssetTransactionsMessage;
    // console.log("xxx assetSelected", watchlistFound);
  }
}


/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function WalletManagerImpl() {
  const walletsMetadata = useSignal<Map<string,{}>>(new Map());
  const walletAssetTotals = useSignal<Array<WChartData>>([]);
  
  const aFUSDT = useSignal<Array<CAsset>>([]);
  const aFUSD = useSignal<Array<CAsset>>([]);
  const aNEO = useSignal<Array<CAsset>>([]);
  const aGAS = useSignal<Array<CAsset>>([]);
  const aFLM = useSignal<Array<CAsset>>([]);
  const aBTC = useSignal<Array<CAsset>>([]);
  const aETH = useSignal<Array<CAsset>>([]);
  const aFLUND = useSignal<Array<CAsset>>([]);

  useSignalEffect(() => {
    if(prices.value && prices.value.length > 0) {
      console.log("wallet-manager > useSignalEffect > prices changed");
      //if(wallets && wallets.peek().length=== 0) {
        console.log("wallet-manager > useSignalEffect > wallets changed");
        updateWallets(false, ()=>{
          console.log("wallet-manager > useSignalEffect > updateWallets > callback");
          refreshAllWalletBalances();
          refreshLastUpdatedTime(Date.now());
          
          const fe = getFormElements();
          brbHidden.value = wallets.value.length === 0;
        });
      //}
    }
  })
  
  function getFormElements() {
    const lvw = document.getElementById('lvWallets') as ojListView<{keyAttributes: "name"}, wallet3.Wallet[]>;
    const wcol = document.getElementById('wcol') as ojColorSpectrum;
    const wg = document.getElementById('wg') as InputNumberElement;
    const wn = document.getElementById('wn') as InputTextElement<string>;
    const wdn = document.getElementById('wdn') as InputTextElement<string>;
    const wpk = document.getElementById('wpk') as InputTextElement<string>;
    const wk = document.getElementById('wk') as InputTextElement<string>;
    const tracker = document.getElementById('tracker') as ojValidationGroup;
    const we = document.getElementById('walletEditor') as HTMLElement;
    const wt = document.getElementById('wt') as ojComboboxMany<any, any, any>;
    const de = document.getElementById('de') as DrawerPopupElement;
    const dat = document.getElementById('dat') as DrawerPopupElement;
    return {wcol, wn, wdn, wpk, wk, tracker, lvw, we, wg, wt, de, dat};
  }

  function refreshWalletsDelayed(interval: number = 1000) {
    setTimeout(() => {
      refreshAllWalletBalances();
    }, interval);
  }

  function tryCreate() {
    if(isFormValid()){
      const fe = getFormElements();
      if(fe.wn.value && fe.wpk.value && fe.wk.value) {
        addWalletToStorage(fe.wn.value, fe.wpk.value, fe.wk.value, fe.wg.value, fe.wcol.value?.toString(), fe.wt.value);
        //wallets.value = loadWalletsFromStorage();
        close();
        updateWalletsDelayed(1000);
        refreshWalletsDelayed(2000);
        brbHidden.value = false;
      }
    }
  }

  function tryUpdate() {
    const fe = getFormElements();
    if(isFormValid() && fe.wn.value && fe.wn.value){
      updateWalletToStorage(fe.wn.value,  fe.wpk.value, fe.wg.value, fe.wcol.value?.toString(), fe.wt.value, fe.wdn.value); //fe.wt.valueOptions.flatMap(x=>x.value));
      //wallets.value = loadWalletsFromStorage();
      close();
      //updateWallets();
      updateWalletsDelayed();
    }
  }

  function tryDeleteWallet(event: any){
    const wk = event.srcElement.attributes["row-data"].value;
    // todo: delete wallet/account
    deleteWalletFromStorage(wk);

    const newMessage = {
      id: 1,
      severity: 'none',
      summary: `wallet "${wk}" deleted`,
      autoTimeout: 3000,
    };
    createNotification(newMessage);

    ////await refreshAllWalletBalances();
    updateWallets(true);
  }

  function clear() {
    const fe = getFormElements();
    fe.wn.value = "";
    fe.wdn.value = "";
    fe.wpk.value = "";
    fe.wk.value = KEY;
    bcrHidden.value = false;
    bclrHidden.value = false;
    buHidden.value = true;
    bcloHidden.value = false;
    fe.wcol.value = BLACK;
    fe.wg.value = 0;
    fe.wt.value = [];
  }

  function clearWalletsState() {
    aFUSDT.value = [];
    aFUSD.value = [];
    aNEO.value = [];
    aGAS.value = [];
    aFLM.value = [];
    aBTC.value = [];
    aETH.value = [];
    aFLUND.value = [];
    walletsMetadata.value.clear();
    walletAssetTotals.value=[];
  }

  function close() {
    const fe = getFormElements();
    clear();
    fe.we.hidden = true;
    bawHidden.value = false;
    fe.de.opened = false;
    startPriceRefreshTimer();
  }

  function isFormValid() {
    const fe = getFormElements();
    if (fe.tracker.valid === 'valid') {
      return true;
    } else {
      fe.tracker.showMessages();
      fe.tracker.focusOn('@firstInvalidShown');
      return false;
    }
  }

  async function walletSelected(event: ojListView.selectedChanged<{keyAttributes: "name"}, wallet3.Wallet[]>) {
    const fe = getFormElements();
    if(event.detail.items === null) {
      clear();
      fe.we.hidden = true;
      bawHidden.value = false;
      return;
    }

    //const w = fe.lvw.firstSelectedItem.data as unknown as CWallet; // wallet3.Wallet;
    //const www = window.window as any;
    //www["test"] = w;
    //const w3 = w.accounts[0] as wallet3.Account;
    
    
    ////var result = await getN3AddressBalances(w3.label);
    ////console.log("xxxx balances", w);
    ////getN3AssetTxs
    //var result = await getN3AllTxs(w.publicKey ? w.publicKey : w3.label);
  }

  async function assetSelected(walletAddress: string, asset_name: string, assetId: string | null, sourceElementId: string) {
    if(assetId) {
      currentSelectedAsset.value = {walletAddress, asset_name, assetId};
      const fe = getFormElements();
      //const popup = document.querySelector("#popup1") as ojPopup;
      //popup.open(`#${sourceElementId}`);
      fe.dat.opened = true;
      stopPriceRefreshTimer();
      currentTransactions.value = { transactions: [], watchlist: [], asset_name, assetId, walletAddress };
      var result = await getN3AssetTxs(walletAddress, assetId);
      var watchlistFound = await transactionsDbService.getTransactions(asset_name);
      currentTransactions.value = { transactions: result, watchlist: watchlistFound, asset_name, assetId, walletAddress } as AssetTransactionsMessage;
      // console.log("xxx assetSelected", watchlistFound);
    }
  }


  async function refreshAllTags() {
    console.log("wallet-manager > refreshAllTags", wallets);
    const runningTags = new Set<string>();
    for (let index = 0; index < walletsRaw.value.length; index++) {
      const w = walletsRaw.value[index];
      w.tags.forEach(x=>runningTags.add(x));
    };
    tags.value = runningTags;
  }

  async function refreshAllWalletBalances() {
    clearWalletsState();
    console.log("wallet-manager > refreshAllWalletBalances", wallets);
    for (let index = 0; index < wallets.value.length; index++) {
      const w = wallets.value[index];
      const publicKey = w.publicKey ? w.publicKey : w.accounts[0].label;

      //var result = await getN3AddressBalances(w.publicKey ? w.publicKey : publicKey);


      let assets: Asset[]| undefined;

      if(useCacheing) {
        const foundInCache = cacheAddressBalances.get(publicKey);
        if(foundInCache) {
          const dt1 = new Date(foundInCache.age);
          let dif = dt1.getTime() - Date.now();
          let difInSecs = Math.abs(dif/1000);
          if(difInSecs < 300) {assets = foundInCache.data;}
          else {assets = undefined; cacheAddressBalances.delete(publicKey);}
        }
      }

      if(assets === undefined) {
        assets = await getN3AddressBalances(publicKey);
        if(useCacheing)cacheAddressBalances.set(publicKey, {data: assets, age: Date.now()});
      }



      
      let runningWalletTotalInUsd: number = 0;
      assets.forEach(a=>{
        if(prices.value && a.balance && a.balance !== "0") {
          let unitPriceFound = prices.value.find(p=>p.symbol === a.symbol);;   
          
          switch(a.symbol){
            case "fUSDT" : aFUSDT.value = [...aFUSDT.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            case "FUSD" : aFUSD.value = [...aFUSD.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            case "NEO" : aNEO.value = [...aNEO.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; unitPriceFound = prices.value.find(p=>p.symbol === "bNEO"); break;
            case "bNEO" : aNEO.value = [...aNEO.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; unitPriceFound = prices.value.find(p=>p.symbol === "bNEO"); break;
            case "GAS" : aGAS.value = [...aGAS.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            case "FLM" : aFLM.value = [...aFLM.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            case "fWBTC" : aBTC.value = [...aBTC.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            case "fWETH" : aETH.value = [...aETH.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            case "FLUND" : aFLUND.value = [...aFLUND.value, {...a, walletAddress: publicKey, walletName: w.displayName ?? w.name, walletColor: w.walletColor}]; break;
            default: console.log(a.symbol);
          }
          const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
          runningWalletTotalInUsd += parseFloat(a.balance) * unitPriceInUsd;
        }
      });
      walletsMetadata.value.set(w.name, {runningWalletTotalInUsd, goal: w.goal});

      // calculate totals
      const newTotals: any = [];
      
      function addNewTotal(assetName: string, asset: CAsset[] | undefined) {
        const unitPriceFound = prices.value.find(p=>p.symbol === assetName);
        const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
        const totalInUsd = asset?.reduce((a,b)=> a + (b.balance ? parseFloat(b.balance) * unitPriceInUsd : 0),0);
        newTotals.push({
          "id": newTotals.length,
          "seriesId": assetName,
          "groupId": "0",
          "value": totalInUsd
        });
        newTotals.push({
          "id": newTotals.length,
          "seriesId": assetName,
          "groupId": "1",
          "value": totalInUsd
        });
        return totalInUsd ?? 0;
      }

      addNewTotal("FUSD", aFUSD.value);
      addNewTotal("fUSDT", aFUSDT.value);
      addNewTotal("GAS", aGAS.value);
      addNewTotal("bNEO", aNEO.value);
      addNewTotal("FLM", aFLM.value);
      addNewTotal("fWBTC", aBTC.value);
      addNewTotal("fWETH", aETH.value);
      addNewTotal("FLUND", aFLUND.value);

      walletAssetTotals.value = newTotals;
    };
    //console.log("xxxxxxxxx ", walletsMetadata.value);
    refreshAllTags();
  }

  function showEditWallet(event: any){
    const wk = event.srcElement.attributes["row-data"].value;
    const w = wallets.value.find(x=>x.name===wk);
    if(w) {
      const w3 = w.accounts[0] as any;
      const fe = getFormElements();
      console.log("wallet-manager > showEditWallet", w);

      fe.we.hidden = false;
      fe.wn.value = w.name;
      tdnHidden.value = false;
      fe.wdn.value = w.displayName ?? w.name;
      fe.wpk.value = w.publicKey ? w.publicKey : w3._WIF ;
      fe.wg.value = w.goal;
      fe.wcol.value = w.walletColor ? new Color(w.walletColor) : BLACK;
      bcrHidden.value = true;
      bclrHidden.value = true;
      buHidden.value = false;
      bcloHidden.value = false;
      bawHidden.value = true;
      fe.wt.value = w.tags;
      fe.de.opened = true;
      tbnDisabled.value = true;
      stopPriceRefreshTimer();
    }
  }

  function showAddWallet(){
    clear();
    const fe = getFormElements();
    fe.we.hidden = false;
    tdnHidden.value = true;
    bawHidden.value = true;
    fe.de.opened = true;
    tbnDisabled.value = false;
    stopPriceRefreshTimer();
  }

  return <div>
    <oj-drawer-popup id="dat" edge="end" class="drawerAssetTransactions" onojBeforeClose={close} onopenedChanged={(item)=>{
      if(item.detail.value === true) {
        showAssetManagerRoute({assetTransactionsHidden: false});
      };
    }}>
      <div>
        <AssetManager transactions={currentTransactions.value} ></AssetManager>
      </div>
    </oj-drawer-popup>
    <oj-drawer-popup id="de" edge="start" class="drawerEditor" onojBeforeClose={close} >
      <WalletEditor 
        tryCreate={tryCreate}
        tryUpdate={tryUpdate}
        clear={clear}
        close={close}
        showAddWallet={showAddWallet}
        refreshAllWalletBalances={refreshAllWalletBalances}
      ></WalletEditor>
    </oj-drawer-popup>

    <WalletList 
      wallets={wallets.value} 
      walletsMetadata={walletsMetadata.value}
      walletSelected={walletSelected}
      tryDeleteWallet={tryDeleteWallet}
      showAddWallet={showAddWallet}
      showEditWallet={showEditWallet}
      refreshAllWalletBalances={refreshAllWalletBalances} />
  
    <WalletCharts chartData={walletAssetTotals.value} ></WalletCharts>
    
    <div class="oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end oj-sm-margin-5x-top">
      <AssetCard wassetName="FUSD" wasset={aFUSD.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="fUSDT" wasset={aFUSDT.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="FLM" wasset={aFLM.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="FLUND" wasset={aFLUND.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="bNEO" wasset={aNEO.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="GAS" wasset={aGAS.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="fWBTC" wasset={aBTC.value} prices={prices.value} onCardSelected={assetSelected} />
      <AssetCard wassetName="fWETH" wasset={aETH.value} prices={prices.value} onCardSelected={assetSelected} />
    </div>
  </div>
}

export const WalletManager: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof WalletManagerImpl>>
> = registerCustomElement(
    "dashboard-wallet-manager",
  WalletManagerImpl
);

export function getWallet(address: string) {
  for (let index = 0; index < wallets.value.length; index++) {
    const w = wallets.value[index];
    if(w.publicKey===address) return w;
  }
}