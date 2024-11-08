import { type MaybeArray, call } from '@/utils'
import { type PropType, defineComponent } from 'vue'
import style from './Radio.module.css'

let uid = 0

export interface RadioOption {
  label: string
  key: string
  disabled?: boolean
}

const props = {
  title: String,
  value: String,
  options: {
    type: Array as PropType<RadioOption[]>,
    default: () => [],
  },
  'onUpdate:value': [Function, Array] as PropType<
    MaybeArray<(value: string) => void>
  >,
  onUpdateValue: [Function, Array] as PropType<
    MaybeArray<(value: string) => void>
  >,
}

export default defineComponent({
  name: 'Radio',
  props,
  setup(props) {
    const handleUpdateValue = (e: Event, value: string) => {
      e.preventDefault()
      const { 'onUpdate:value': _onUpdateValue, onUpdateValue } = props
      if (_onUpdateValue) call(_onUpdateValue, value)
      if (onUpdateValue) call(onUpdateValue, value)
    }

    return {
      name: Date.now().toString(),
      handleUpdateValue,
    }
  },
  render() {
    return (
      <fieldset class={style.radio}>
        <legend class={style['radio-legend']}>{this.title}</legend>

        {this.options.map(option => (
          <label
            class={style['radio-option']}
            key={option.key}
            onChange={e => this.handleUpdateValue(e, option.key)}
          >
            <div class={style['radio-input']}>
              <input
                type="radio"
                value={option.key}
                name={(++uid).toString()}
                checked={option.key === this.value}
                disabled={option.disabled}
              />
              <span class={style['checkmark']}></span>
            </div>
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
    )
  },
})
