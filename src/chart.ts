import fs from 'fs'
import QuickChart from 'quickchart-js'

import { IChartImageGeneralProps, IChartCountProps } from './chart.interface'

async function createImageChartGeneral({
   type = 'doughnut',
   data = [],
   labels = [],
   colors = [
      'rgb(255, 159, 64)',
      'rgb(54, 162, 235)',
   ],
   total = 0,
   name = 'chart',
   config
}: IChartImageGeneralProps): Promise<void> {

   try {

      const myChart = `{ 
         type: '${type}',
         data: {
         datasets: [
            {
               data: [${data}],
               backgroundColor: [${colors.map(i => `'${i}'`)}],
            },
         ],
         labels: [${labels.map(i => `'${i}'`)}],
         },
         options: {
            legend: {
               labels: {
                  fontColor: '#8b949e',
               }
            },
            plugins: {            
               datalabels: {
                  display: true,
                  formatter: (value) => value + '%',
                  backgroundColor: '#fff',
                  borderRadius: 3,              
                  font: {
                     size: 10,
                  }
               },
               doughnutlabel: {
                  labels: [{
                     text: '${total}',
                     font: {
                        size: 20,
                        weight: 'bold',
                     },
                        color: '#8b949e'
                     }, {
                        text: 'componentes',
                        color: '#8b949e'
                     }
                  ]
               }
            }
         },
      }`

      const chart = new QuickChart()
      chart.setWidth(300)
      chart.setHeight(300)
      chart.setBackgroundColor('transparent')
      chart.setConfig(myChart)

      const directoryFile = `./${config.output}/${name}.png`

      if (fs.existsSync(directoryFile))
         fs.unlinkSync(directoryFile)

      chart.toFile(directoryFile);

   } catch (error) {
      console.log('Erro ao criar o arquivo do gráfico', error)
   }
}

async function createImageChartCount({
   type = 'bar',
   data = [],
   colors = [],
   labels = [],
   name = 'chart',
   config
}: IChartCountProps): Promise<void> {

   try {

      const myChart = `{ 
         type: '${type}',
         
         data: {
            datasets: [
               {
                  data: [${data}],               
                  backgroundColor: 'rgb(255, 159, 64)',
                  borderWidth: 2,
                  borderColor: 'white',
               },
            ],
            labels: [${labels.map(i => `'${i}'`)}],
         },
         options: {
            legend: { display: false },  
                 
         },
      }`

      const chart = new QuickChart()
      chart.setWidth(600)
      chart.setHeight(300)
      chart.setBackgroundColor('transparent')
      chart.setConfig(myChart)

      const directoryFile = `./${config.output}/${name}.png`

      if (fs.existsSync(directoryFile))
         fs.unlinkSync(directoryFile)

      chart.toFile(directoryFile);

   } catch (error) {
      console.log('Erro ao criar o arquivo do gráfico', error)
   }
}

export {
   createImageChartGeneral,
   createImageChartCount
}