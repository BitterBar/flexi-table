import { type PropType, defineComponent } from 'vue'
import { type MaybeArray, call } from '@/utils'
import style from './Button.module.css'

const props = {
  disabled: Boolean,
  onClick: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
}

export default defineComponent({
  name: 'Button',
  props,
  setup(props) {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault()
      const { onClick } = props
      if (onClick) call(onClick, e)
    }

    return {
      handleClick,
    }
  },
  render() {
    const defaultSlot = this.$slots.default

    return (
      <button
        disabled={this.disabled}
        onClick={this.handleClick}
        class={style.button}
      >
        {defaultSlot ? defaultSlot() : null}
      </button>
    )
  },
})
