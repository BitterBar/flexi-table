import { type PropType, defineComponent } from 'vue'

const props = {
  vertical: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String as PropType<
      | 'center'
      | 'flex-end'
      | 'flex-start'
      | 'space-around'
      | 'space-between'
      | 'space-evenly'
      | 'stretch'
    >,
    default: 'flex-start',
  },
  align: {
    type: String as PropType<
      'center' | 'flex-end' | 'flex-start' | 'baseline' | 'stretch'
    >,
    default: 'flex-start',
  },
  gap: {
    type: String,
    default: '0',
  },
}

export default defineComponent({
  name: 'Flex',
  props,
  render() {
    const defaultSlot = this.$slots.default

    return (
      <div
        style={{
          display: this.inline ? 'inline-flex' : 'flex',
          flexWrap: 'wrap',
          flexDirection: this.vertical ? 'column' : 'row',
          justifyContent: this.justify,
          alignItems: this.align,
          gap: this.gap,
        }}
      >
        {defaultSlot ? defaultSlot() : null}
      </div>
    )
  },
})
