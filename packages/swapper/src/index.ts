interface CellKey {
  rowKey: string | null
  columnKey: string | null
}

function getCellKey(cell: HTMLElement): CellKey {
  return {
    rowKey: cell.getAttribute('data-row-key'),
    columnKey: cell.getAttribute('data-column-key'),
  }
}

function attachSwapEvents(
  container: HTMLElement,
  onSwap: CreateSwapperOptions['onSwap'],
): () => void {
  let from: HTMLElement | null = null
  let to: HTMLElement | null = null

  const handleDragStart = (event: DragEvent) => {
    from = event.target as HTMLElement

    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', '')
    }
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    to = event.target as HTMLElement
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    if (!from || !to || Object.is(from, to)) return

    const fromMeta = getCellKey(from)
    const toMeta = getCellKey(to)
    onSwap(fromMeta, toMeta, from, to)
  }

  container.querySelectorAll<HTMLElement>('[draggable]').forEach(cell => {
    cell.addEventListener('dragstart', handleDragStart)
    cell.addEventListener('dragover', handleDragOver)
    cell.addEventListener('drop', handleDrop)
  })

  return () => {
    container.querySelectorAll<HTMLElement>('[draggable]').forEach(cell => {
      cell.removeEventListener('dragstart', handleDragStart)
      cell.removeEventListener('dragover', handleDragOver)
      cell.removeEventListener('drop', handleDrop)
    })
  }
}

export interface CreateSwapperOptions {
  container: HTMLElement
  onSwap: (
    from: CellKey,
    to: CellKey,
    fromElement: HTMLElement,
    toElement: HTMLElement,
  ) => void
}

export default function createSwapper({
  container,
  onSwap,
}: CreateSwapperOptions): CreateSwapperTurn {
  if (!container) {
    throw new Error('container is required.')
  }

  // 初始添加事件
  let detachEvents = attachSwapEvents(container, onSwap)

  function reset() {
    // 移除旧的事件监听
    detachEvents!()
    // 重新附加事件
    detachEvents = attachSwapEvents(container, onSwap)
  }

  function destroy() {
    detachEvents()
  }

  return { reset, destroy }
}

export interface CreateSwapperTurn {
  reset: () => void
  destroy: () => void
}
