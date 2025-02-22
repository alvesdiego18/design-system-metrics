import { IConfigProps } from './config'

type TtypeChart = 'doughnut' | 'bar'

export interface IChartImageGeneralProps {
   type?: TtypeChart;
   data: string[] | number[];
   labels: string[];
   colors?: string[];
   total: number;
   name: string,
   config: IConfigProps
}

export interface IChartCountProps {
   type?: TtypeChart,
   data: string[],
   colors?: string[],
   labels: string[],
   name: string;
   config: IConfigProps
}