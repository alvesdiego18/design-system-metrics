import fs from 'fs'
import path from 'path'

import { IConfigProps } from './config'

async function getFilesByDirectory(
   directory: string,
   list: string[],
   config: IConfigProps
) {

   // validation if exists dot to extension
   const NEW_EXTENSION = config.extensions.map((dir: string) => dir.indexOf('.') > -1 ? dir : `.${dir}`)

   fs.readdirSync(directory).forEach((file: string) => {
      const dirFile = path.join(directory, file);
      const extensionFile = path.extname(dirFile)

      if (fs.statSync(dirFile).isDirectory())
         return getFilesByDirectory(dirFile, list, config);
      else if (NEW_EXTENSION.includes(extensionFile))
         return list.push(dirFile);
   })
}

async function searchDirectory(config: IConfigProps) {

   const listComponents: string[] = []

   for (let dir of config.dirRead)
      getFilesByDirectory(dir, listComponents, config)

   return listComponents
}

export {
   searchDirectory
}