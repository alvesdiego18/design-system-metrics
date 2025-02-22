import fs from 'fs'
import { getTextLanguage } from './language'
import { IJsonFile, ICreateMarkdownProps } from './markdown.interface'

function addSubTitle(text: string): string {
   return `### ${text}\n\n`
}

function addQuote(text: string): string {
   return `> ${text}\n\n`
}

function addTableHeader(header: string[]) {
   let newHeader = '|' + header.map(item => `${item.replace(':', '')}|`)
   newHeader = `${newHeader.split(',').join('')}\n`

   let newLineHeader = '|' + header.map(item => item.indexOf(':') > -1 ? `:--:|` : `--|`)
   newHeader += `${newLineHeader.split(',').join('')}\n`

   return newHeader
}

async function createMarkdown({
   totalReadFiles,
   totalComponent,
   totalComponentDs,
   totalComponentOthers,
   percentualComponentByDs,
   percentualComponentByOthers,
   listComponentsByDs,
   listComponentsByPage,
   config
}: ICreateMarkdownProps): Promise<void> {

   const { language } = config

   let headerMD = `# ${getTextLanguage('title', language)}\n\n`
   headerMD += `${getTextLanguage('subtitle', language)}\n\n`

   headerMD += `- ${getTextLanguage('topic-total-general', language)}\n`
   headerMD += `- ${getTextLanguage('topic-total-per-component', language)}\n`
   headerMD += `- ${getTextLanguage('topic-total-per-page', language)}\n`
   headerMD += `- ${getTextLanguage('topic-average-per-page', language)}\n`
   headerMD += `- ${getTextLanguage('topic-configuration', language)} \n\n`

   // Average component per page
   const averageComponentPerPage = (totalComponentDs / totalReadFiles).toFixed(2)

   // Total general
   // -------------------
   headerMD += addSubTitle(getTextLanguage('total-general', language))
   headerMD += addQuote(getTextLanguage('total-general-subtitle', language))
   headerMD += addTableHeader([
      `:${getTextLanguage('total-general-t1', language)}`,
      `:${getTextLanguage('total-general-t2', language)}`,
      `:${getTextLanguage('total-general-t3', language)}`,
      `:${getTextLanguage('total-general-t4', language)}`,
   ])
   headerMD += `| ${totalReadFiles} | ${totalComponent} | ${totalComponentDs} | ${percentualComponentByDs}% | \n\n`

   if (config.showChartGeneral)
      headerMD += `![Total](chartgeneral.png) \n\n`

   // Total by component
   // -------------------
   headerMD += addSubTitle(getTextLanguage('total-component', language))
   headerMD += addQuote(getTextLanguage('total-component-subtitle', language))
   headerMD += addTableHeader([
      `${getTextLanguage('total-component-t1', language)}`,
      `:${getTextLanguage('total-component-t2', language)}`,
   ])

   const countByComponent = Object.keys(listComponentsByDs).map(item => `| ${item.replace('<', '')} | ${listComponentsByDs[item]} |\n`)
   headerMD += countByComponent.toString().split(',').join('')
   headerMD += `\n\n`

   if (config.showChartCountComponent)
      headerMD += `![Total](chartcount.png) \n\n`

   // Total page
   // -------------------
   headerMD += addSubTitle(getTextLanguage('total-page', language))
   headerMD += addQuote(getTextLanguage('total-page-subtitle', language))
   headerMD += addTableHeader([
      `${getTextLanguage('total-page-t1', language)}`,
      `:${getTextLanguage('total-page-t2', language)}`,
      `:${getTextLanguage('total-page-t3', language)}`,
      `:${getTextLanguage('total-page-t4', language)}`,
      `:${getTextLanguage('total-page-t5', language)}`,
   ])
   headerMD += listComponentsByPage.componentsDsByPageMarkdown
   headerMD += `\n\n`

   // Average page
   // -------------------
   headerMD += addSubTitle(getTextLanguage('average-page', language))
   headerMD += addQuote(getTextLanguage('average-page-subtitle', language))
   headerMD += addTableHeader([
      `:${getTextLanguage('average-page-t1', language)}`,
      `:${getTextLanguage('average-page-t2', language)}`,
      `:${getTextLanguage('average-page-t3', language)}`,
   ])
   const { page, count } = listComponentsByPage.pageToMoreComponentDs
   const dividerPageTotal = listComponentsByPage.pageWithoutComponent / listComponentsByPage.pageRead
   const percentPageWithComponentDs = (100 - (dividerPageTotal) * 100).toFixed(2)
   headerMD += `| ${page} (${count}) | ${averageComponentPerPage} | ${percentPageWithComponentDs}% |\n\n`

   // Configuration 
   // -------------------
   headerMD += addSubTitle(getTextLanguage('configuration', language))
   headerMD += addQuote(getTextLanguage('configuration-subtitle', language))
   headerMD += addTableHeader([
      `${getTextLanguage('configuration-t1', language)}`,
      `${getTextLanguage('configuration-t2', language)}`,
      `${getTextLanguage('configuration-t3', language)}`,
   ])
   headerMD += `| ${config.prefixDs} | ${config.extensions.toString()} | ${config.regexToSearchComponent} | \n\n`

   headerMD += `#### ${getTextLanguage('directory-search', language)}\n`
   config.dirRead.map((dir: string) => {
      return headerMD += ` - \`${dir}\` \n`
   })
   headerMD += `\n\n`

   if (config.ignoreComponent && config.ignoreComponent.length > 0) {
      headerMD += `#### ${getTextLanguage('component-ignored', language)}\n`
      config.ignoreComponent.map((dir: string) => {
         return headerMD += ` - \`${dir}\` \n`
      })
   }

   // Save the markdown file   
   // -------------------
   if (config.buildMarkdown) {
      fs.writeFileSync(`./${config.output}/METRICS.md`, headerMD)
   }

   // Save json file   
   // -------------------
   if (config.buildJson) {
      let jsonFile: IJsonFile = {
         totalReadFiles,
         totalComponent,
         totalComponentDs,
         totalComponentOthers,
         percentualComponentByDs: `${percentualComponentByDs}%`,
         percentualComponentByOthers: `${percentualComponentByOthers}%`,
         averageComponentPerPage,
         pageWithMoreComponent: `${page} (${count})`,
         percentPageWithComponentDs: `${percentPageWithComponentDs}%`,
         listComponentsDsUse: listComponentsByDs,
         listComponentsByPage: listComponentsByPage.componentsDsByPage,
         configuration: {
            directory: config.dirRead,
            prefixDs: config.prefixDs,
            extensions: config.extensions.toString(),
            regexSearch: config.regexToSearchComponent.toString()
         }
      }

      fs.writeFileSync(`./${config.output}/metrics.json`, JSON.stringify(jsonFile))
   }
}

export {
   createMarkdown
}