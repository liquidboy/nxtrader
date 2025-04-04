import { ojChart } from "@oracle/oraclejet/ojchart";
import { useSignal } from "@preact/signals";
import { WChartData } from "dashboard/wallet-manager/wallet-charts";
import * as ArrayDataProvider from "ojs/ojarraydataprovider";
type Props = Readonly<{
    id: string;
    title: string;
    data: Array<WChartData>;
    style: string;
    chartType: ojChart.ChartType;
    orientation?: 'horizontal' | 'vertical';
  }>;
export function ChartItem(props: Props) {
    const chartDataProvider = new ArrayDataProvider(props.data, {
        keyAttributes: "id",
    });
    return (<div><oj-chart
        id={props.id}
        type={props.chartType}
        data={chartDataProvider}
        orientation={props.orientation}
        animation-on-display="auto"
        animation-on-data-change="auto"
        legend={{rendered: "off"}}
        style={props.style}
      >
        <template slot="itemTemplate" data-oj-as="item" render={(item)=>{
          return(<oj-chart-item value={item.data.value} groupId={item.data.groupId} seriesId={item.data.seriesId}></oj-chart-item>);
        }} />
        {/* <template slot="seriesTemplate" data-oj-as="item" render={(item)=>{return(<oj-chart-series 
            color={item.data.id==1?"#8561C8": null}
            borderColor={item.data.id==1?"#8561C8": null}
            pattern="auto"
        ></oj-chart-series>)}} /> */}
      </oj-chart><div style="text-align:center">{props.title}</div></div>)
}