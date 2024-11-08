import {
  onDragend,
  onDragenter,
  onDragleave,
  onDragover,
  onDragstart,
  onDrop,
  onExpect,
} from '@flexi-table/swapper'
import type { Ref } from 'vue'
import type { DataRow } from './mock'

function handleSwapElement(from: HTMLElement, to: HTMLElement) {
  const toParent = to.parentElement!
  const toNext = to.nextSibling

  from.parentElement!.insertBefore(to, from.nextSibling)
  toParent.insertBefore(from, toNext)
}

function handleSwapData(
  from: HTMLElement,
  to: HTMLElement,
  data: DataRow[],
  dragTarget: string,
) {
  const fromIndex = Number(from.getAttribute('data-row-key'))
  const toIndex = Number(to.getAttribute('data-row-key'))
  if (dragTarget === 'row') {
    const fromData = data[fromIndex]
    data[fromIndex] = data[toIndex]
    data[toIndex] = fromData
    return
  }

  const fromKey = from.getAttribute('data-col-key')
  const toKey = to.getAttribute('data-col-key')
  const fromData = data[fromIndex][fromKey!]
  data[fromIndex][fromKey!] = data[toIndex][toKey!]
  data[toIndex][toKey!] = fromData
}

export default function TableSwapper({
  data,
  swapMode,
  dragTarget,
}: {
  data: Ref<DataRow[]>
  swapMode: Ref<string>
  dragTarget: Ref<string>
}) {
  let draggedElement: HTMLElement | null = null

  const getTagName = () => (dragTarget.value === 'row' ? 'TR' : 'TD')

  onExpect(target => {
    const tagName = getTagName()
    return (
      target.tagName === tagName ||
      target.closest(tagName.toLocaleLowerCase()) !== null
    )
  })

  onDragstart(event => {
    draggedElement = event.target as HTMLElement
    draggedElement.classList.add('dragstart')
    event.dataTransfer!.effectAllowed = 'move'
  })

  onDragenter(event => {
    const target = (event.target as HTMLElement).closest(
      getTagName().toLowerCase(),
    )!
    if (draggedElement !== target) target.classList.add('dragenter')
  })

  onDragleave(event => {
    const target = (event.target as HTMLElement).closest(
      getTagName().toLowerCase(),
    )!
    target.classList.remove('dragenter')
  })

  onDragover(event => {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
  })

  onDrop(event => {
    event.preventDefault()
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      getTagName().toLowerCase(),
    )!
    if (!draggedElement || draggedElement === target) return
    target.classList.remove('dragenter')

    if (swapMode.value === 'element') {
      return handleSwapElement(draggedElement, target)
    }
    handleSwapData(draggedElement, target, data.value, dragTarget.value)
  })

  onDragend(() => {
    if (!draggedElement) return
    draggedElement.classList.remove('dragstart')
    draggedElement = null
  })
}
