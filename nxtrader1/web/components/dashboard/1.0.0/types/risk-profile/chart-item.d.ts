import { WChartData } from "dashboard/wallet-manager/wallet-charts";
type Props = Readonly<{
    id: string;
    title: string;
    data: Array<WChartData>;
}>;
export declare function ChartItem(props: Props): import("preact").JSX.Element;
export {};
