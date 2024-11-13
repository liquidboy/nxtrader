import componentStrings = require("ojL10n!./resources/nls/watch-list-strings");
import "css!dashboard/watch-list/watch-list-styles.css";
import { StoredTransactionRecord } from "dashboard/flamingo-api/indexdb/transactionsDbService";
import { prices } from "dashboard/price-list/price-list";
import { IntlNumberConverter } from "ojs/ojconverter-number";
import 'ojs/ojgauge';
import { ojStatusMeterGauge } from "ojs/ojgauge";
import { createNotification } from "dashboard/notifications-layer/notifications-layer";
import { ojButtonEventMap } from "@oracle/oraclejet/ojbutton";

const usdNumberConverter = new IntlNumberConverter({
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
    currencyFormat: "standard",
    decimalFormat: "long",
    maximumFractionDigits: 2,
});

const numberConverter = new IntlNumberConverter({
    style: "decimal",
    minimumIntegerDigits: 2,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    useGrouping: false,
});

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

const tooltipRenderer = (ctx: ojStatusMeterGauge.TooltipContext) => {
    return { insert: `purchased ⠀(${ctx.componentElement.getAttribute("data-valueSymbol")}) : ${ctx.componentElement.getAttribute("data-value")}
      ⠀⠀⠀⠀⠀⠀⠀⠀ (USDT) : ${ctx.componentElement.getAttribute("data-purchaseCostUsdt")} 
      current⠀⠀⠀ (USDT) : ${ctx.componentElement.getAttribute("data-curPriceInUsdt")}
      goal⠀⠀⠀⠀⠀ (USDT) : ${ctx.componentElement.getAttribute("data-goalUsdt")}` }
};

export function WatchListItem(item: any, deleteItenAction: (value: ojButtonEventMap<any>["ojAction"]) => void) {
    // const unitPriceFound = prices.value.find(p=>p.symbol === item.symbol);
    const unitPriceInUsd = item.unitPriceInUsd; //unitPriceFound ? unitPriceFound.usd_price : 0;
    const curPriceInUsdt = item.curPriceInUsdt; //parseFloat(item.value) * unitPriceInUsd;
    const purchaseCostUsdt = item.purchaseCostUsdt;
    const goalUsdt = item.goalUsdt;
    const profitInUsdt = item.profitInUsdt; //curPriceInUsdt-purchaseCostUsdt;
   
    return (<li class="oj-md-padding-3x-top oj-md-padding-3x-bottom">
                <div class="oj-flex oj-flex oj-text-primary-color oj-typography-body-md">
                  <img src={`styles/images/${item.symbol}.svg`} class=" card-small-token" />
                  <div onClick={()=>copyValueToClipboard(item.value)}>{numberConverter.format(parseFloat(item.value))}</div>
                  <div class="oj-flex-item">
                    
                  </div>
                  <div class="oj-sm-flex-initial oj-flex-item oj-flex">
                    <img src={`styles/images/fUSDT.svg`} class="oj-md-padding-2x-start card-small-token" />
                    <div>{usdNumberConverter.format(curPriceInUsdt)}</div>
                    <div class={`oj-md-margin-2x-start ${profitInUsdt>0?(profitInUsdt>(goalUsdt-purchaseCostUsdt)?"profit-above-goal":"in-profit"):"at-a-loss"}`}>{usdNumberConverter.format(profitInUsdt)}</div>
                  </div>
                </div>
                <div class="oj-flex oj-md-padding-5x-start oj-md-padding-3x-top oj-md-padding-1x-bottom">
                  <div class="oj-flex-item"></div>
                  <oj-status-meter-gauge
                      labelled-by="metricLabel"
                      min={Math.max(0, curPriceInUsdt - 100)}
                      max={item.goalUsdt + 50}
                      value={curPriceInUsdt}
                      thresholds={[{ max: purchaseCostUsdt, color: "red" }, { max: goalUsdt, color: "black" }, { color: "green"}]}
                      size="lg"
                      referenceLines={[{ value: purchaseCostUsdt, color: 'red'}, { value: goalUsdt, color: "black" }]}
                      tooltip={{ renderer: tooltipRenderer}}
                      data-curPriceInUsdt={curPriceInUsdt}
                      data-purchaseCostUsdt={purchaseCostUsdt}
                      data-goalUsdt={goalUsdt}
                      data-value={item.value}
                      data-valueSymbol={item.symbol}
                      style={{width: "250px", top: "10px"}}
                      plotArea={{rendered:"on"}}
                      readonly></oj-status-meter-gauge>
                  <oj-button 
                      id="bDelete" 
                      display="icons" 
                      class="oj-button-sm oj-sm-padding-2x-start" 
                      onojAction={deleteItenAction} 
                      data-id={item.id} 
                      data-value={item.value} 
                      data-symbol={item.symbol}>
                      <span slot="startIcon" class="oj-ux-ico-trash" ></span>
                  </oj-button>
                  <div class="oj-flex-item"></div>
                </div>
            </li>)
}