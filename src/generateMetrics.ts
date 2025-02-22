import { verifyConfig, IConfigProps } from './config'

import { createImageChartGeneral, createImageChartCount } from './chart'
import { searchDirectory } from './directory'
import { readFileByDirectory } from './readFile'
import { countComponentUse } from './count'
import { createMarkdown } from './markdown'
import { getTextLanguage } from './language'

async function generateMetrics(config: IConfigProps): Promise<void> {

   if (!verifyConfig(config)) {
      console.log('Cancelled')
      return
   }

   const listDirectory = await searchDirectory(config)
   const listAllComponents = await readFileByDirectory(listDirectory, config)
   const countComponent = await countComponentUse(listAllComponents.components, config)

   const {
      totalComponent,
      totalComponentDs,
      totalComponentOthers,
      percentualComponentByDs,
      percentualComponentByOthers,
      listComponentsByDs,
      chartCount
   } = countComponent

   // create a chart image to general infos
   if (config.showChartGeneral)
      await createImageChartGeneral({
         data: [percentualComponentByDs, percentualComponentByOthers],
         labels: ['Design System', getTextLanguage('others', config.language)],
         total: totalComponent,
         name: 'chartgeneral',
         config
      })

   // create a chart image to
   // how many times the component has been used
   if (config.showChartCountComponent)
      await createImageChartCount({
         data: chartCount.values,
         labels: chartCount.labels,
         colors: chartCount.colors,
         name: 'chartcount',
         config
      })

   // create a markdown doc
   await createMarkdown({
      totalReadFiles: listDirectory.length,
      totalComponent,
      totalComponentDs,
      totalComponentOthers,
      percentualComponentByDs,
      percentualComponentByOthers,
      listComponentsByDs,
      listComponentsByPage: listAllComponents.json,
      config
   })
}

export {
   generateMetrics
}