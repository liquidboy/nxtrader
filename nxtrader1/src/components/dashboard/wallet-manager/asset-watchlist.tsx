import { signal } from "@preact/signals";
import { Transaction, addressFormat } from "./wallet-lib";
import transactionsDbService, { StoredTransactionRecord } from "dashboard/flamingo-api/indexdb/transactionsDbService";
import { createNotification } from "dashboard/notifications-layer/notifications-layer";
import "ojs/ojinputnumber";
import { InputNumberElement } from "ojs/ojinputnumber";
import { WatchListItem } from "dashboard/watch-list/watch-list-item";
import { IntlNumberConverter } from "ojs/ojconverter-number";
import { prices } from "dashboard/price-list/price-list";
import { getTimeInterval } from "./asset-transactions";

export const seletedTransaction = signal<{txDetail: any|undefined, transaction: Transaction, transactionType: "add"|"edit", watchlist: Array<StoredTransactionRecord>}|undefined>(undefined);

type Props = Readonly<{
    hidden: boolean;
    navigateBack: ()=>void;
}>;

export const deleteWatchListItem = async (transactionId: number, transactionSymbol: string, transactionValue: any) => {
    await transactionsDbService.deleteById(transactionId);
    const newMessage = {
        id: 2,
        severity: 'none',
        summary: `${transactionSymbol} ${transactionValue} deleted from watch list`,
        autoTimeout: 2000,
      };
      createNotification(newMessage);
}

export function AssetWatchlistEditor({ hidden, navigateBack }: Props){
    console.log("asset-watchlist > AssetWatchlistEditor");
    const unitPriceFound = prices.value.find(p=>p.symbol === seletedTransaction.value?.transaction.symbol);
    const unitPriceInUsd = unitPriceFound ? unitPriceFound.usd_price : 0;
    const usdNumberConverter = new IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        currencyFormat: "standard",
        decimalFormat: "long",
        maximumFractionDigits: 12,
      });
    const addToWatchList = async () => {
        console.log("asset-transactions > addToWatchList", seletedTransaction.value);

        const tc = document.getElementById('tc') as InputNumberElement;
        const tg = document.getElementById('tg') as InputNumberElement;
        await transactionsDbService.storeTransaction(seletedTransaction.value.transaction, tc.value, tg.value);

        const newMessage = {
          id: 2,
          severity: 'none',
          summary: `${seletedTransaction.value.transaction.symbol} ${seletedTransaction.value.transaction.value} added to watch list`,
          autoTimeout: 2000,
        };
        createNotification(newMessage);
        navigateBack();
    };

    const updateInWatchList = async () => {
        const tc = document.getElementById('tc') as InputNumberElement;
        const tg = document.getElementById('tg') as InputNumberElement;
        await transactionsDbService.storeTransaction(seletedTransaction.value.transaction, tc.value, tg.value);

        const newMessage = {
          id: 2,
          severity: 'none',
          summary: `${seletedTransaction.value.transaction.symbol} ${seletedTransaction.value.transaction.value} updated in watch list`,
          autoTimeout: 2000,
        };
        createNotification(newMessage);
        navigateBack();
    }

    const deleteFromWatchList = async () => {
        //console.log(seletedTransaction.value.transaction);
        await deleteWatchListItem(seletedTransaction.value.transaction.id, seletedTransaction.value.transaction.symbol, seletedTransaction.value.transaction.value);
        navigateBack();
    }

    const foundInWatchlist = seletedTransaction.value?.watchlist.length === 1 ? seletedTransaction.value.watchlist[0] : undefined;


    return (<div hidden={hidden} class="oj-sm-margin-2x">
        <div class="oj-flex">
            <oj-button display="all" onojAction={navigateBack} class="oj-button-md">
                <span slot="startIcon" class="oj-ux-ico-back-parent"></span>
            </oj-button>
            <h6 class="oj-sm-margin-4x-start">{seletedTransaction.value?.watchlist.length === 1 ? "Edit existing item in watchlist" : "Add to watchlist"}</h6>
        </div>
        <div>{seletedTransaction.value?.txDetail ? seletedTransaction.value?.txDetail.index : "loading txdetail"}</div>
        <div>
            <div class="oj-md-margin-3x-top oj-md-margin-5x-bottom">
                <div class="oj-flex oj-flex oj-text-primary-color oj-typography-body-md">
                    <img src={`styles/images/${seletedTransaction.value?.transaction.symbol}.svg`} class=" card-small-token" />
                    <div class="oj-flex-item">{seletedTransaction.value?.transaction.value}</div>
                    <div class="oj-flex-item"></div>
                    {seletedTransaction.value?.transaction.value>0?
                        <div class="oj-sm-flex-initial oj-flex-item oj-flex">
                            <img src="styles/images/fUSDT.svg" class="card-small-token" />
                            <div>{ usdNumberConverter.format(parseFloat(seletedTransaction.value?.transaction.value) * unitPriceInUsd) }</div>
                        </div>:<></>}
                </div>
                <div class="oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm">
                {seletedTransaction.value?.transaction.type==="sent"?"sent to " : "recieved from "}
                <span class="clipboard-action tx-address" title="peek into address">
                    <span class="oj-ux-ico-wallet oj-md-margin-1x-end oj-md-margin-1x-top"></span> 
                    {seletedTransaction.value?.transaction.type==="sent"? addressFormat(seletedTransaction.value?.transaction.to[0]) : addressFormat(seletedTransaction.value?.transaction.from[0])}
                </span>
                </div>
                <div class="oj-md-padding-6x-start oj-md-margin-1x-top oj-text-secondary-color oj-typography-body-sm">
                {getTimeInterval(seletedTransaction.value?.transaction.block_time * 1000)} 
                ({ seletedTransaction.value ? new Date(seletedTransaction.value?.transaction.block_time * 1000).toISOString(): <></>})
                </div>
            </div>

            <div class="oj-md-margin-5x-start">
                <oj-input-number id="tc" labelHint="Purchase Cost (fUSDT)" labelEdge="inside" value={foundInWatchlist?foundInWatchlist.purchaseCostUsdt : null} class="oj-sm-padding-1x-top"></oj-input-number>
                <oj-input-number id="tg" labelHint="Goal (fUSDT)" labelEdge="inside" value={foundInWatchlist?foundInWatchlist.goalUsdt : null} class="oj-sm-padding-1x-top"></oj-input-number>
            </div>
            
        </div>
        <div class="oj-md-margin-5x-top oj-md-margin-3x-bottom">
            <ul style="list-style-type: none;">
                { seletedTransaction.value?.watchlist.length === 1 ? WatchListItem(seletedTransaction.value.watchlist[0], () => {}) : <></> }
            </ul>
        </div>
        <div class="oj-flex oj-sm-padding-4x-top">
            <div class="oj-flex-item"></div>
            <div class="oj-sm-flex-initial oj-flex-item">
                <oj-button id="butCancel" chroming="outlined" onojAction={navigateBack}>cancel</oj-button>
                <oj-button id="butCreate" chroming="callToAction" class="oj-sm-margin-2x-start" onojAction={addToWatchList} hidden={seletedTransaction.value?.transactionType==="edit"}>create</oj-button>
                <oj-button id="butUpdate" chroming="callToAction" class="oj-sm-margin-2x-start" onojAction={updateInWatchList} hidden={seletedTransaction.value?.transactionType==="add"}>update</oj-button>
                <oj-button id="butDelete" chroming="danger" class="oj-sm-margin-2x-start" onojAction={deleteFromWatchList} hidden={seletedTransaction.value?.transactionType==="add"}>delete</oj-button>
            </div>
        </div>
    
    </div>);
}