/* eslint-disable */
declare module '*.vue' {
  import {defineComponent, ComponentOptionsWithObjectProps} from "vue"
  const Component: ComponentOptionsWithObjectProps<ReturnType<typeof defineComponent>>
  export default Component
}
