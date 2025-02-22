export interface IListChartCount {
   labels: string[],
   values: string[],
   colors: string[]
}

export interface Props {
   listComponentsByDs: { [key: string | number]: string | number };
   totalComponent: number;
   totalComponentDs: number;
   totalComponentOthers: number;
   percentualComponentByDs: number;
   percentualComponentByOthers: number;
   chartCount: IListChartCount;
}