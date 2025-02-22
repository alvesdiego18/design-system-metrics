import { IConfigProps } from './config'

function isComponentDS(component: string, config: IConfigProps): boolean {
   return component.indexOf(`<${config.prefixDs}`) !== -1
}

export {
   isComponentDS
}