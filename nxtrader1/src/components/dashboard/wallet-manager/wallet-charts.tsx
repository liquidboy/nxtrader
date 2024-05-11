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
import { CAsset, CWallet } from "./wallet-lib";
import { ActionCardElement } from "ojs/ojactioncard";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
//import ArrayDataProvider = require("ojs/ojarraydataprovider");

export interface WChartData {
  "id": number,
  "seriesId": string[],
  "groupId": string[],
  "value": number
}

type Props = Readonly<{
  chartData: Array<WChartData>;
}>;

export function WalletCharts(
  { chartData }: Props
) {
  const chartDataProvider = new ArrayDataProvider(chartData, {
    keyAttributes: "id",
  });
  return (
    <div class="oj-flex oj-sm-margin-7x-start oj-sm-margin-7x-end">
      <oj-chart
          id="lineAreaChart"
          type="lineWithArea"
          style="width:50%;"
          data={chartDataProvider}
          animation-on-display="auto"
          animation-on-data-change="auto"
          orientation="vertical"
          stack="on"
          hover-behavior="dim"
          styleDefaults={{lineType:"centeredStepped",  markerDisplayed: "off", lineStyle:"solid"}}
        >
        </oj-chart>
        <oj-chart
          id="pieChart"
          type="pie"
          style="width:50%;"
          data={chartDataProvider}
          animation-on-display="auto"
          animation-on-data-change="auto"
          hover-behavior="dim"
        >
        </oj-chart>
    </div>
  )
}