import {
  EventHandler,
  createEventCallback,
  setCurrentEventHandler,
} from './EventHandler'

export function createSwapper(setup: () => void): {
  enable: () => void
  disable: () => void
  mount: (el: HTMLElement) => void
} {
  const handler = setCurrentEventHandler(new EventHandler())
  setup()
  setCurrentEventHandler(null)

  let container: HTMLElement | null = null
  const dragstart = createEventCallback('dragstart', handler)
  const drag = createEventCallback('drag', handler)
  const dragend = createEventCallback('dragend', handler)
  const dragenter = createEventCallback('dragenter', handler)
  const dragover = createEventCallback('dragover', handler)
  const dragleave = createEventCallback('dragleave', handler)
  const drop = createEventCallback('drop', handler)

  function enableDragEvents() {
    if (!container) return
    container.addEventListener('dragstart', dragstart)
    container.addEventListener('drag', drag)
    container.addEventListener('dragend', dragend)
    container.addEventListener('dragenter', dragenter)
    container.addEventListener('dragover', dragover)
    container.addEventListener('dragleave', dragleave)
    container.addEventListener('drop', drop)
  }

  function disableDragEvents() {
    if (!container) return
    container.removeEventListener('dragstart', dragstart)
    container.removeEventListener('drag', drag)
    container.removeEventListener('dragend', dragend)
    container.removeEventListener('dragenter', dragenter)
    container.removeEventListener('dragover', dragover)
    container.removeEventListener('dragleave', dragleave)
    container.removeEventListener('drop', drop)
  }

  function mount(el: HTMLElement, enable = true) {
    if (!el) throw new Error('Swapper: Element is required')
    disableDragEvents() // When calling `mount`, remove the previous event listener first
    handler.target = container = el
    if (enable) enableDragEvents()
  }

  return {
    enable: enableDragEvents,
    disable: disableDragEvents,
    mount,
  }
}
