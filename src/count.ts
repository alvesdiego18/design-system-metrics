const { isComponentDS } = require('./validation')
import { IConfigProps } from './config'
import { IListChartCount, Props } from './count.interface'
import { getTextLanguage } from './language'

async function countComponentUse(
   listAllComponents: string[],
   config: IConfigProps
): Promise<Props> {

   // counts how many times 
   // the component has been used
   let listComp: { [key: string]: number } = {}
   for (const c of listAllComponents) {
      if (c.length > 0)
         listComp[c] = listComp[c] ? listComp[c] + 1 : 1
   }

   // show just DS components
   const listComponentsByDs: any = []
   for (let component of Object.keys(listComp)) {
      if (isComponentDS(component, config))
         listComponentsByDs[component.replace('<', '').trim()] = listComp[component]
   }

   // sort components max to min
   const listComponentMaxMin = Object.fromEntries(
      // @ts-ignore
      Object.entries(listComponentsByDs).sort(([, a], [, b]) => b - a)
   )

   const newlistComponentMaxMin: { [key: string | number]: string | number } = {}
   const otherText = getTextLanguage('others', config.language)
   for (let c of Object.keys(listComponentMaxMin)) {

      if (Object.keys(newlistComponentMaxMin).length < 10)
         newlistComponentMaxMin[c] = listComponentMaxMin[c] as string
      else
         newlistComponentMaxMin[otherText] = newlistComponentMaxMin[otherText]
            ? Number(newlistComponentMaxMin[otherText]) + Number(listComponentMaxMin[c]) : 1
   }

   const randomHexColorCode = () => {
      let n = (Math.random() * 0xfffff * 1000000).toString(16);
      return '#' + n.slice(0, 6);
   }

   const listChartCount: IListChartCount = { labels: [], values: [], colors: [] }
   for (let chartItem of Object.keys(newlistComponentMaxMin)) {
      listChartCount.values.push(newlistComponentMaxMin[chartItem] as string)
      listChartCount.labels.push(chartItem)

      // add a random color
      let newColor = randomHexColorCode()
      if (listChartCount.colors.includes(newColor))
         newColor = randomHexColorCode()

      listChartCount.colors.push(newColor)
   }

   let countDSComponents = 0
   let countOthersComponents = 0
   for (let component of Object.entries(listComp)) {

      if (isComponentDS(component[0], config))
         countDSComponents += component[1]
      else
         countOthersComponents += component[1]
   }

   const totalComponent = countDSComponents + countOthersComponents
   const percentualComponentByDs = Math.round((countDSComponents / totalComponent) * 100)
   const percentualComponentByOthers = Math.round((countOthersComponents / totalComponent) * 100)

   return {
      listComponentsByDs: newlistComponentMaxMin,
      totalComponent,
      totalComponentDs: countDSComponents,
      totalComponentOthers: countOthersComponents,
      percentualComponentByDs,
      percentualComponentByOthers,
      chartCount: listChartCount
   }
}

export {
   countComponentUse
}