import fs from 'fs'
import { TLanguageOptions, getTextLanguage } from './language'

export interface IConfigProps {
   output?: string;
   dirRead: string[],
   extensions: string[],
   prefixDs: string,
   ignoreComponent: string[],
   regexToSearchComponent: RegExp;
   showChartGeneral?: boolean;
   showChartCountComponent?: boolean;
   showUrl: boolean;
   buildJson?: boolean;
   buildMarkdown?: boolean;
   language: TLanguageOptions;
}

function verifyDefaultValues(config: IConfigProps) {

   const {
      output,
      ignoreComponent,
      showChartCountComponent,
      showChartGeneral,
      showUrl,
      buildJson,
      buildMarkdown,
      language
   } = config

   if (!output)
      config.output = './metrics-ds'

   if (!ignoreComponent)
      config.ignoreComponent = []

   if (showChartCountComponent === undefined)
      config.showChartCountComponent = true

   if (showChartGeneral === undefined)
      config.showChartGeneral = true

   if (showUrl === undefined)
      config.showUrl = true

   if (buildJson === undefined)
      config.buildJson = true

   if (buildMarkdown === undefined)
      config.buildMarkdown = true

   if (language === undefined)
      config.language = 'pt-BR'

}

function verifyConfig(config: IConfigProps): boolean {

   // verify default values 
   verifyDefaultValues(config)

   const { language } = config

   // validation parameters required
   if (config.dirRead.length === 0) {
      console.log(getTextLanguage('message-dir-search', language))
      return false
   }

   if (config.extensions.length === 0) {
      console.log(getTextLanguage('message-extension', language))
      return false
   }

   if (config.prefixDs.length === 0) {
      console.log(getTextLanguage('message-prefix', language))
      return false
   }

   if (!config.regexToSearchComponent) {
      console.log(getTextLanguage('message-search-component', language))
      return false
   }

   // verify if dir output exists
   if (!fs.existsSync(config.output!))
      fs.mkdirSync(config.output!);

   return true
}

export {
   verifyConfig
}