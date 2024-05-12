import { h } from "preact";
import "css!dashboard/wallet-manager/wallet-manager-styles.css";
import "ojs/ojbutton";
import "ojs/ojactioncard";
import "ojs/ojcolorspectrum";
import "ojs/ojlistview";
import "ojs/ojlistitemlayout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojvalidationgroup";
export interface WChartData {
    "id": number;
    "seriesId": string[];
    "groupId": string[];
    "value": number;
}
type Props = Readonly<{
    chartData: Array<WChartData>;
}>;
export declare function WalletCharts({ chartData }: Props): h.JSX.Element;
export {};
