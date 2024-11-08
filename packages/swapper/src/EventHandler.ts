import type { OnExpect } from './hooks'

export type EventCallback = (event: DragEvent) => void

export type DragEventType =
  | 'dragstart'
  | 'drag'
  | 'dragend'
  | 'dragenter'
  | 'dragover'
  | 'dragleave'
  | 'drop'

export class EventHandler {
  public expect: OnExpect | null = null
  public target: HTMLElement | null = null
  private handlers: Record<DragEventType, Set<EventCallback>> = {
    dragstart: new Set(),
    drag: new Set(),
    dragend: new Set(),
    dragenter: new Set(),
    dragover: new Set(),
    dragleave: new Set(),
    drop: new Set(),
  }

  public add(cb: EventCallback, type: DragEventType): void {
    this.handlers[type].add(cb)
  }

  public get(type: DragEventType): EventCallback[] {
    return Array.from(this.handlers[type])
  }

  public delete(cb: EventCallback, type: DragEventType): void {
    this.handlers[type].delete(cb)
  }

  public clear(type: DragEventType): void {
    this.handlers[type].clear()
  }
}

let currentEventHandlers: EventHandler | null = null

export function getCurrentEventHandler(): EventHandler | null {
  return currentEventHandlers
}

export function setCurrentEventHandler<T extends EventHandler | null>(
  handler: T,
): T {
  return (currentEventHandlers = handler) as unknown as T
}

export function createEventCallback(
  type: DragEventType,
  handler: EventHandler,
): EventCallback {
  return (event: DragEvent) => {
    if (!(event.target instanceof HTMLElement)) return
    if (!handler.target) return

    if (
      !handler.target.contains(event.target) ||
      (handler.expect && !handler.expect(event.target, type))
    ) {
      return
    }

    handler.get(type).forEach(cb => cb(event))
  }
}
