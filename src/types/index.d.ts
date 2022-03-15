export interface OptionItem {
  id: number,
  title: string
}

export type FilterFunc = (
  options: {
    [key: string]: OptionItem
  },
  filter: Array<number>,
  order?: Array<string>
) => Array<OptionItem>

export type OptionsCollection = {
  [key: string]: {
    [key: string]: OptionItem
  }
}