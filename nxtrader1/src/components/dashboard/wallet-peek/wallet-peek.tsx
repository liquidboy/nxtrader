import { ExtendGlobalProps, registerCustomElement } from "ojs/ojvcomponent";
import { h, ComponentProps, ComponentType } from "preact";
import componentStrings = require("ojL10n!./resources/nls/wallet-peek-strings");
import "css!dashboard/wallet-peek/wallet-peek-styles.css";
import { signal, useSignal, useSignalEffect } from "@preact/signals";
import ApiClient from "dashboard/flamingo-api/api/api-client";
import tokens, { findTokenByHash } from "dashboard/flamingo-api/data/tokens";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
import { BigNumber } from "dashboard/wallet-manager/bignumber";

const _apiClient = new ApiClient()
export const seletedAddress = signal<string|undefined>(undefined);

type Props = Readonly<{
  hiddenRoot: boolean;
  message?: string;
  navigateBack: ()=>void;
}>;

/**
 * @ojmetadata pack "dashboard"
 * @ojmetadata version "1.0.0"
 * @ojmetadata displayName "A user friendly, translatable name of the component"
 * @ojmetadata description "A translatable high-level description for the component"
 * 
 */
function WalletPeekImpl(
  { hiddenRoot, navigateBack }: Props
) {
  console.log("wallet-peek > render");
  const walletData = useSignal(undefined);
  const walletBalances = useSignal([]);
  const dataProvider = new ArrayDataProvider(walletBalances.value, {
    keyAttributes: "symbol",
  });

  function getAssetBalances() {
    var balances = [];
    if(walletData.value?.data) {
        Object.keys(walletData.value.data[0].balances).forEach((k,i)=>{
          const found = findTokenByHash(tokens, k, undefined);
          balances.push({
            key: k,
            total: walletData.value.data[0].balances[k],
            token: found
          });
        });
    }
    console.log("xxx ", balances);
    return balances;
  }

  useSignalEffect(()=>{
    if(seletedAddress.value) {
      console.log("wallet-peek > render > selectedAddress.value changed", seletedAddress.value);
      walletBalances.value=[];
      getWalletDetails(seletedAddress.value).then(result=>{
        console.log("wallet-peek > getWalletDetails", result);
        walletData.value = result;
        walletBalances.value = getAssetBalances();
      });
    }
  });
  
  return <div hidden={hiddenRoot} class="oj-sm-margin-2x" >
    <oj-button display="all" onojAction={navigateBack} class="oj-button-md">
      <span slot="startIcon" class="oj-ux-ico-back-parent"></span>
    </oj-button>

    <div>{seletedAddress.value}</div>

    <oj-list-view
      aria-label="wallet balances"
      data={dataProvider}
      class="oj-listview-item-padding-off" 
      selection-mode="none"
      >
        <template slot="itemTemplate" data-oj-as="item" render={(item)=>{
          if(item.data.token===undefined) return (<>no tokens...</>);
          return (<div>
            <div>{item.data.token.symbol}</div>
            <div>{BigNumber(item.data.total, 10).shiftedBy(-item.data.token.decimals).toFixed()}</div>
          </div>)
        }} />
    </oj-list-view>
  </div>
}

export const WalletPeek: ComponentType <
  ExtendGlobalProps < ComponentProps < typeof WalletPeekImpl>>
> = registerCustomElement(
    "dashboard-wallet-peek",
  WalletPeekImpl
);


async function getWalletDetails (address: string) {
    const result = await _apiClient.getWalletWalletLatest(address);
    return result;
}