import {
  type DragEventType,
  type EventCallback,
  getCurrentEventHandler,
} from './EventHandler'

const createHook =
  <T extends Function = () => any>(type: DragEventType) =>
  (hook: T): void => {
    const current = getCurrentEventHandler()
    if (current) current.add((...args: unknown[]) => hook(...args), type)
  }
type CreateHook<T = any> = (hook: T) => void

export const onDragstart: CreateHook<EventCallback> = createHook('dragstart')
export const onDrag: CreateHook<EventCallback> = createHook('drag')
export const onDragend: CreateHook<EventCallback> = createHook('dragend')
export const onDragenter: CreateHook<EventCallback> = createHook('dragenter')
export const onDragover: CreateHook<EventCallback> = createHook('dragover')
export const onDragleave: CreateHook<EventCallback> = createHook('dragleave')
export const onDrop: CreateHook<EventCallback> = createHook('drop')

export type OnExpect = (target: HTMLElement, type: DragEventType) => boolean
export const onExpect = (expect: OnExpect): void => {
  const current = getCurrentEventHandler()
  if (current) current.expect = expect
}
