import { h } from "preact";
import "css!dashboard/ratio-list/ratio-list-styles.css";
type Props = Readonly<{
    data: Array<WChartData>;
}>;
export interface WChartData {
    id: number;
    seriesId: string;
    groupId: string;
    value: number;
}
export declare function RatioChart({ data }: Props): h.JSX.Element;
export {};
