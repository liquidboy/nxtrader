import { useSignal } from "@preact/signals";
import { WChartData } from "dashboard/wallet-manager/wallet-charts";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
type Props = Readonly<{
    id: string;
    title: string;
    data: Array<WChartData>;
    style: string;
  }>;
export function ChartItem(props: Props) {
    const chartDataProvider = new ArrayDataProvider(props.data, {
        keyAttributes: "id",
    });
    return (<div><oj-chart
        id={props.id}
        type="pyramid"
        data={chartDataProvider}
        animation-on-display="auto"
        animation-on-data-change="auto"
        legend={{rendered: "off"}}
        style={props.style}
      >
        <template slot="itemTemplate" data-oj-as="item" render={(item)=>{
          return(<oj-chart-item value={item.data.value} groupId={item.data.groupId} seriesId={item.data.seriesId}></oj-chart-item>);
        }} />
      </oj-chart><div style="text-align:center">{props.title}</div></div>)
}