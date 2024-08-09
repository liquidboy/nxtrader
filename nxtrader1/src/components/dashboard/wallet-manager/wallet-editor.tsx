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
import "ojs/ojinputnumber";
import "ojs/ojselectcombobox";
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
import { CAsset, CWallet, KEY } from "./wallet-lib";
import { ActionCardElement } from "ojs/ojactioncard";
import { bcrHidden, buHidden, bcloHidden, bclrHidden, tbnDisabled } from "./form-elements";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");


type Props = Readonly<{
  tryCreate: ()=> void;
  tryUpdate: ()=> void;
  clear: ()=> void;
  close: ()=> void;
  showAddWallet: ()=> void;
  refreshAllWalletBalances: ()=> void;
}>;

export function WalletEditor(
  { tryCreate, tryUpdate, clear, close, showAddWallet, refreshAllWalletBalances }: Props
) {
  console.log("wallet-editor > init");
  const groupValid = signal<'valid' | 'pending' | 'invalidHidden' | 'invalidShown' | undefined>(undefined);

  const eatNonNumbers = (event: KeyboardEvent) => {
    let charCode = event.which ? event.which : event.keyCode;
    let char = String.fromCharCode(charCode);
    // Only allow ".0123456789" (and non-display characters)
    let replacedValue = char.replace(/[^0-9\.]/g, "");
    if (char !== replacedValue) {
      event.preventDefault();
    }
  };

  useEffect(()=>{
    return(()=>{
      console.log("wallet-editor > disposed!!!!!!");
    })
  }, []);

  return (<div>
   <div id="walletEditor" className="oj-sm-margin-4x-start oj-sm-padding-3x" hidden>
      <oj-validation-group id="tracker" valid={groupValid.value}>
        <oj-form-layout>
          <oj-input-text id="wn" required={true} label-hint="wallet friendly name" disabled={tbnDisabled.value}></oj-input-text>
          <oj-input-password id="wpk" required={true} label-hint="public wallet address" mask-icon="visible"></oj-input-password>
          <oj-input-password id="wk" required={false} value={KEY} label-hint="key" mask-icon="visible" style="display:none" hidden></oj-input-password>
          <oj-input-number id="wg" onKeyPress={eatNonNumbers} labelHint="Goal (fUSDT)" labelEdge="inside"></oj-input-number>
          <oj-color-spectrum id="wcol" label-hint="wallet color" ></oj-color-spectrum>
          <oj-combobox-many
            id="wt"
            class="oj-form-control-max-width-md"
            labelEdge="none"
            required={true}
            placeholder="keywords to tag this wallet with">
              <oj-option value="bot">bot</oj-option>
              <oj-option value="fees">fees</oj-option>
              <oj-option value="flamingo">flamingo</oj-option>
              <oj-option value="personal">personal</oj-option>
          </oj-combobox-many>


          <div className="oj-flex">
            <oj-button id="butCreate" onojAction={tryCreate} chroming="callToAction" hidden={bcrHidden.value}>Create</oj-button>
            <oj-button id="butUpdate" onojAction={tryUpdate} chroming="callToAction" hidden={buHidden.value}>Update</oj-button>
            <oj-button id="butClear" onojAction={clear} class="oj-sm-padding-2x-start" hidden={bcrHidden.value}>Clear</oj-button>
            <oj-button id="butClose" onojAction={close} class="oj-sm-padding-2x-start" hidden={bcloHidden.value}>Close</oj-button>
          </div>
        </oj-form-layout>
      </oj-validation-group>
    </div>
  </div>)
}

