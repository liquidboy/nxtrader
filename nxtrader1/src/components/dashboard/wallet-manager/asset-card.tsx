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
import { CAsset } from "./wallet-lib";
import { ActionCardElement } from "ojs/ojactioncard";
import * as Color from "ojs/ojcolor";

type Props = Readonly<{
  wassetName?: string;
  wasset?: Array<CAsset>;
  prices: Array<any>;
  onCardSelected: (wallet_address: string, wasset_name: string, asset_id: string | null, sourceElementId: string) => void;
}>;

export function AssetCard(
  { wassetName, wasset, prices, onCardSelected }: Props
) {

  if(wasset?.length === 0) return (<></>);

  const usdNumberConverter = new IntlNumberConverter({
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    currencyFormat: "standard",
    decimalFormat: "long",
    maximumFractionDigits: 12,
  });

  const unitPriceFound = prices.find(p=>p.symbol === wassetName);
  const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
  const totalPrice = wasset?.reduce((a,b)=> a + (b.balance ? parseFloat(b.balance) : 0),0);
  const totalPriceInFUSDT = wasset?.reduce((a,b)=> a + (b.balance ? parseFloat(b.balance) * unitPriceInUsd : 0),0);


  function walletAssetSelected(event: any) {
    var el = (event.currentTarget as HTMLElement);
    var walletAddress = el.getAttribute("data-walletAddress");
    var assetId = el.getAttribute("data-assetid");
    if(onCardSelected && walletAddress && assetId) onCardSelected(walletAddress, wassetName ?? "", assetId, el.id);
  }

  return <oj-action-card 
    id="acFUSD" 
    class="oj-bg-neutral-20 oj-md-margin-2x-end oj-md-margin-2x-bottom" 
    //data-assetid={wasset ? wasset[0].asset_id : undefined}
    //onojAction={assetCardSelected}
    >
    <div class="oj-md-margin-3x card-asset">
      <div class="oj-flex">
        <img src={`styles/images/${wassetName}.svg`} class="card-token" />
        <div>
          <div class="oj-text-primary-color oj-typography-subheading-xs">{wassetName}</div>  
          <div class="oj-text-primary-color oj-typography-subheading-xs">{totalPrice}</div>
        </div>
        <div class="oj-flex-item"></div>
        <div class="oj-sm-flex-initial oj-flex-item oj-flex oj-text-secondary-color oj-typography-body-sm oj-sm-padding-4x-top">
          <img src="styles/images/FUSDT.svg" class="card-small-token" />
          <span class="oj-sm-margin-2x-top">{usdNumberConverter.format(totalPriceInFUSDT??0)}</span>
        </div>
      </div>
      
      <div class="oj-md-margin-6x-top oj-md-margin-3x-bottom oj-md-margin-3x-start oj-md-margin-3x-end oj-flex">
        {wasset?.map((asset => (
          <oj-button chroming="borderless" class="card-wasset" 
              id={`btn-${asset.walletName}-${asset.asset_id}`}
              data-walletAddress={asset.walletAddress}
              data-assetId={asset.asset_id}
              onClick={walletAssetSelected}>
              <div class="oj-flex card-wasset">
                <div style={{width: "5px", height: "35px", backgroundColor: (asset.walletColor ? new Color(asset.walletColor) : BLACK).toString() }}></div>
                <div class="oj-sm-margin-1x-start">
                  <div class="oj-text-primary-color oj-typography-body-sm">
                  {asset.walletName} 
                  </div>
                  <div class="oj-text-secondary-color oj-typography-body-xs" title={asset.balance}>
                    { parseFloat(asset.balance??"").toFixed(8) }
                  </div>
                </div>
              </div>
          </oj-button>
        )))}
      </div>
    </div>
  </oj-action-card>
}