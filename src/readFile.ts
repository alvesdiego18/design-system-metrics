import fs from 'fs'
import path from 'path'
import readline from 'readline'

import { isComponentDS } from './validation'
import { IConfigProps } from './config'

export interface ITotalizators {
   totalComponent: number;
   totalComponentDs: number;
   totalComponentOthers: number;
   percentComponentDs: string;
}

export interface IJsonReadFile {
   componentsDsByPage: { [key: string]: ITotalizators },
   componentsDsByPageMarkdown: string,
   pageToMoreComponentDs: { page: string, count: number },
   pageWithoutComponent: number,
   pageRead: number
}

function getPageName(file: string): string {

   const pageName = path.basename(file)
   const lastPageName = path.dirname(file).split(path.sep).pop()

   if (pageName.indexOf('index') > -1)
      return lastPageName!
   else
      return `${lastPageName}/${pageName}`
}

async function searchComponentInFile(file: readline.Interface, config: IConfigProps) {

   const lineAllComponent = []

   for await (const line of file) {

      const positionOpenComponent = line.search(config.regexToSearchComponent)
      if (line[positionOpenComponent] !== undefined) {

         let component = ''
         const closeTagOne = line.indexOf(' ', positionOpenComponent + 1)
         const closeTagTwo = line.indexOf('>', positionOpenComponent + 1)

         // valid where close the component
         let positionCloseComponent = Math.min(closeTagOne, closeTagTwo) === -1
            ? Math.max(closeTagOne, closeTagTwo)
            : Math.min(closeTagOne, closeTagTwo)

         // if component not close
         // use size to calculate the end line
         positionCloseComponent = positionCloseComponent === -1
            ? line.length
            : positionCloseComponent

         component = line.substring(positionOpenComponent, positionCloseComponent).trim()

         // add component if not ignored in config
         if (!config.ignoreComponent.includes(component.replace('<', '').trim()))
            lineAllComponent.push(component)
      }
   }

   return lineAllComponent
}

async function readFileLineByLine(
   file: string,
   json: IJsonReadFile,
   config: IConfigProps
) {

   const fileStream = fs.createReadStream(file);
   const readlineFile = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
   })


   // get the name file/page searching
   const pageName = getPageName(file)

   // get all components by file
   const listAllComponents = await searchComponentInFile(readlineFile, config)

   // filter the components by ds
   const listAllComponentsDs = listAllComponents.filter(item => isComponentDS(item, config))

   // add only if you have a component
   if (listAllComponents.length > 0 && json) {

      // totalizators
      const totalComponent = listAllComponents.length
      const totalComponentDs = listAllComponentsDs.length
      const totalComponentOthers = listAllComponents.length - listAllComponentsDs.length
      const percentComponentDs = Math.round((listAllComponentsDs.length / listAllComponents.length) * 100) + '%'

      json.componentsDsByPage[pageName] = {
         totalComponent,
         totalComponentDs,
         totalComponentOthers,
         percentComponentDs
      }

      // calc page more component ds
      if (json.pageToMoreComponentDs.count < totalComponentDs) {
         json.pageToMoreComponentDs = {
            page: pageName,
            count: totalComponentDs
         }
      }

      // count with not component ds
      if (totalComponentDs === 0) {
         json.pageWithoutComponent += 1
      }

      json.pageRead += 1

      const pageNameUrl = config.showUrl ? `[${pageName}](${file})` : pageName

      json.componentsDsByPageMarkdown +=
         `|${pageNameUrl}|${totalComponent}|${totalComponentDs}|${totalComponentOthers}|${percentComponentDs}|\n`
   }

   return listAllComponents
}

async function readFileByDirectory(directory: string[], config: IConfigProps) {

   let json: IJsonReadFile = {
      componentsDsByPage: {},
      componentsDsByPageMarkdown: '',
      pageToMoreComponentDs: { page: '', count: 0 },
      pageWithoutComponent: 0,
      pageRead: 0
   }

   let listAllComponents: string | string[] = ''
   for (const file of directory)
      listAllComponents += ',' + await readFileLineByLine(file, json, config)

   listAllComponents = listAllComponents.length > 0
      ? listAllComponents.split(',')
      : []

   return {
      components: listAllComponents,
      json
   }
}

export {
   readFileByDirectory
}