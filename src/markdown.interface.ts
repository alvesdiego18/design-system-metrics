import { IConfigProps } from './config'
import { IJsonReadFile, ITotalizators } from './readFile'

export interface IConfiguration {
   directory: string[];
   prefixDs: string;
   extensions: string;
   regexSearch: string;
}

export interface IJsonFile {
   totalReadFiles: number;
   totalComponent: number;
   totalComponentDs: number;
   totalComponentOthers: number;
   percentualComponentByDs: string;
   percentualComponentByOthers: string;
   averageComponentPerPage: string;
   pageWithMoreComponent: string;
   percentPageWithComponentDs: string;
   listComponentsDsUse: string[];
   listComponentsByPage: { [key: string]: ITotalizators };
   configuration: IConfiguration;
}

export interface ICreateMarkdownProps {
   totalReadFiles: number;
   totalComponent: number;
   totalComponentDs: number;
   totalComponentOthers: number;
   percentualComponentByDs: string | number;
   percentualComponentByOthers: string | number;
   listComponentsByDs: any;
   listComponentsByPage: IJsonReadFile;
   config: IConfigProps;
}