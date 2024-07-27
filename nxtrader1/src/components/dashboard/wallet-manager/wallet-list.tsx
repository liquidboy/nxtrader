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
import "ojs/ojgauge";
import { ojColorSpectrum} from "ojs/ojcolorspectrum";
import { ojValidationGroup } from 'ojs/ojvalidationgroup';
import { InputTextElement } from "ojs/ojinputtext";
import { ojListView } from "ojs/ojlistview";
import { } from "@oracle/oraclejet/ojarraydataprovider";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { IntlNumberConverter } from "ojs/ojconverter-number";
import { KeySetImpl } from "@oracle/oraclejet/ojkeyset";
import { ojButton } from "ojs/ojbutton";
import BigNumber from "./bignumber"
import { BLACK } from "ojs/ojcolor";
import { WalletJSON } from "@cityofzion/neon-core/lib/wallet";
import { CAsset, CWallet, addressFormat } from "./wallet-lib";
import { ActionCardElement } from "ojs/ojactioncard";
import * as Color from "ojs/ojcolor";
import { isAutoPriceRefreshRunning, startPriceRefreshTimer, stopPriceRefreshTimer } from "dashboard/price-list/price-list";
import { tags } from "./wallet-manager";
import { WalletListFilter } from "./wallet-list-filter";
import { bawHidden, brbHidden } from "./form-elements";

const refreshEvery10Seconds = 10000;
let lastUpdatedTime  = signal<number | undefined>(undefined); 
let lastUpdatedTimeLabel  = signal<number>(0); 

const isPauseHidden = computed(()=> isAutoPriceRefreshRunning.value ? false : true);
const isPlayHidden = computed(()=> isAutoPriceRefreshRunning.value ? true : false);

type Props = Readonly<{
  wallets: Array<CWallet>;
  walletsMetadata: Map<string, {}>;
  showAddWallet: ()=> void;
  showEditWallet: (event: any) => void;
  tryDeleteWallet: (event: any) => void;
  walletSelected: (event: ojListView.selectedChanged<{keyAttributes: "name"}, wallet3.Wallet[]>) => void;
  refreshAllWalletBalances: ()=> void;
}>;

export function WalletList(
  { wallets, walletsMetadata, showAddWallet, showEditWallet, tryDeleteWallet, walletSelected, refreshAllWalletBalances }: Props
) {
  const usdNumberConverter = new IntlNumberConverter({
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    currencyFormat: "standard",
    decimalFormat: "long",
    maximumFractionDigits: 12,
  });
  const dataProvider = new ArrayDataProvider(wallets , {
    keyAttributes: "name",
  });
  function getAllWalletsTotal(allWalletsMd: Map<string, {}>) {
    let runningWalletsTotalInUsd : number = 0;
    let runningGoal : number = 0;
    allWalletsMd.forEach((a,b)=>{
      let rg = 0;
      if(a && 'goal' in a) {
        rg = a.goal as number;
        runningGoal += rg;
      }
      if(a  && 'runningWalletTotalInUsd' in a) { //&& (rg && rg > 0)
        const rt = a.runningWalletTotalInUsd as number;
        runningWalletsTotalInUsd += rt;
      }

    });
    return {runningWalletsTotalInUsd, runningGoal};
  }

  function renderWallet(item: any) {
    const walletColor: Color = item.item.data.walletColor ? new Color(item.item.data.walletColor) : BLACK;
    const walletColorStyle = {
      width: "5px",
      height: "50px",
      backgroundColor: walletColor.toString()
    };
    const md : any = walletsMetadata.get(item.key);
    let runningWalletTotal = 0;
    
    if(md && 'runningWalletTotalInUsd' in md) {
      runningWalletTotal = md.runningWalletTotalInUsd;
    }
    return (
      <li style="align-items:center;"> 
        <oj-list-item-layout style="width:100%">
          <div slot="leading" style={walletColorStyle}></div>
          <div class="oj-typography-body-md oj-text-color-primary">
            {item.item.data.name}
          </div>
          <div slot="secondary" class="oj-typography-body-sm oj-text-color-secondary" style="min-width: 200px;">
            {item.item.data.publicKey ? item.item.data.publicKey : item.item.data.accounts[0].label}
          </div>
          <div slot="tertiary" class="oj-flex oj-typography-body-sm oj-text-color-secondary">
            {item.item.data.tags?.map((item)=>{
              return (<div class="tag-item">{item}</div>);
            })}
          </div>
          <div slot="metadata" class="oj-flex">
            <img src="styles/images/fUSDT.svg" style={{width: "25px"}}/>
            <span class="oj-sm-padding-2x-start oj-sm-padding-2x-end oj-sm-padding-6x-top" style={{verticalAlign: "super"}}>{usdNumberConverter.format(runningWalletTotal??0)}</span>
            <oj-status-meter-gauge
                labelled-by="readOnly"
                orientation="circular"
                min={0}
                max={item.item.data.goal}
                value={runningWalletTotal??0}
                metricLabel={{rendered:"off"}}
                plotArea={{rendered:"on"}}
                innerRadius={0.57}
                size="sm"
                startAngle={180}
                angleExtent={180}
                class="oj-sm-padding-3x-top oj-sm-margin-0x"
                hidden={(item.item.data.goal && item.item.data.goal > 0 )? false : true}
                readonly></oj-status-meter-gauge>
          </div>
          
          <div slot="trailing" style={{width: "50px"}} >
            
          </div>
          <div slot="action" >
            <oj-button id="bEdit" display="icons" onojAction={showEditWallet} class="oj-button-sm" row-data={item.item.data.name}>
              <span slot="startIcon" class="oj-ux-ico-edit"></span>
              Edit</oj-button>
            <oj-button id="bDelete" display="icons" onojAction={tryDeleteWallet} class="oj-button-sm oj-sm-padding-2x-start" row-data={item.item.data.name}>
              <span slot="startIcon" class="oj-ux-ico-trash"></span>
              Delete</oj-button>
          </div>
        </oj-list-item-layout>
      </li>
    );
  }

  function renderTotal(md: any) {
    return (
        <oj-list-item-layout id="lilFooter" style="">
          <div>
            <WalletListFilter></WalletListFilter>
          </div>
          <div slot="metadata" class="oj-flex">
            <img src="styles/images/fUSDT.svg" style={{width: "25px"}}/>
            <span class="oj-sm-padding-2x-start oj-sm-padding-2x-end oj-sm-padding-6x-top" style={{verticalAlign: "super"}}>{usdNumberConverter.format(md.runningWalletsTotalInUsd??0)}</span>
            <oj-status-meter-gauge
                labelled-by="readOnly"
                orientation="circular"
                min={0}
                max={md.runningGoal}
                value={md.runningWalletsTotalInUsd??0}
                metricLabel={{rendered:"off"}}
                plotArea={{rendered:"on"}}
                innerRadius={0.57}
                size="sm"
                startAngle={180}
                angleExtent={180}
                class="oj-sm-padding-3x-top oj-sm-margin-0x"
                readonly></oj-status-meter-gauge>
          </div>
          <div slot="trailing" style={{width: "50px"}} >
            
          </div>
          <div slot="action" style={{width: "52px"}} >
            
          </div>
        </oj-list-item-layout>
    );
  }

  useEffect(() => {
    const timerId = setInterval(refreshLastUpdatedLabel, refreshEvery10Seconds);
    return () => clearInterval(timerId);
  }, []);

  return (<div>
    <div className="oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end">
      <oj-button id="butAddWallet" display="all" onojAction={showAddWallet} class="oj-button-sm" hidden={bawHidden.value}>
        <span slot="startIcon" class="oj-ux-ico-plus"></span>
        Add Wallet
      </oj-button>
      <span className="oj-flex-item"></span>
      <span class="oj-sm-padding-2x-end oj-sm-padding-4x-top oj-text-color-secondary" >last updated {lastUpdatedTimeLabel} second(s) ago</span>
      <oj-button id="butRefreshBalances" display="icons" hidden={brbHidden.value} onojAction={refreshAllWalletBalances} class="oj-button-sm oj-sm-flex-initial oj-flex-item  oj-sm-margin-2x-end">
        <span slot="startIcon" class="oj-ux-ico-refresh"></span>
        Refresh wallet balances
      </oj-button>
      <oj-button id="butPause" display="icons" onojAction={stopPriceRefreshTimer} class="oj-button-sm oj-sm-flex-initial oj-flex-item" hidden={isPauseHidden.value}>
        <span slot="startIcon" class="oj-ux-ico-pause"></span>
        Pause autorefresh
      </oj-button>
      <oj-button id="butPlay" display="icons" onojAction={startPriceRefreshTimer} class="oj-button-sm oj-sm-flex-initial oj-flex-item" hidden={isPlayHidden.value}>
        <span slot="startIcon" class="oj-ux-ico-play"></span>
        Start autorefresh (runs every 60 seconds)
      </oj-button>

    </div>
    <oj-list-view
        id="lvWallets"
        aria-label="wallets"
        data={dataProvider}
        gridlines={{item:"visible"}}
        class="oj-sm-padding-3x-top oj-sm-padding-3x-start oj-sm-padding-3x-end" 
        selectionMode="none"
        onselectedChanged={walletSelected}
      >
          <template slot="itemTemplate" data-oj-as="item" render={renderWallet} />
      </oj-list-view>
      <ul>
        {renderTotal(getAllWalletsTotal(walletsMetadata))}
      </ul>
    </div>
  )
}

function refreshLastUpdatedLabel() {
  console.log("wallet-list > refreshLastUpdatedLabel")

  var diff = Math.abs(Date.now() - lastUpdatedTime.peek());
  var diffInSeconds = Math.floor((diff/1000));
  lastUpdatedTimeLabel.value = diffInSeconds ;
}

export function refreshLastUpdatedTime(dateNowRefreshed: number) {
  console.log("wallet-list > refreshLastUpdatedLabelNow")
  lastUpdatedTime.value = dateNowRefreshed;
  refreshLastUpdatedLabel();
}