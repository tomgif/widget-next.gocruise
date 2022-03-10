export interface OptionItem {
  id: number,
  title: string
}

export type FilterFunc = (
  options: Array<OptionItem>,
  filter: Array<number>,
  order?: Array<string>
) => Array<OptionItem>