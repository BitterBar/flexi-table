import { NCode } from 'naive-ui'
import indexRaw from './index?raw'
import swapperRaw from './TableSwapper?raw'
import CopyIcon from './CopyIcon'

export default function ExempleRaw() {
  const handleCopy = (e: MouseEvent, raw: string) => {
    e.preventDefault()
    const copy = new ClipboardEvent('copy', {
      clipboardData: new DataTransfer(),
    })
    copy.clipboardData!.setData('text/plain', raw)
    ;(e.target as HTMLElement).dispatchEvent(copy)
  }

  return (
    <>
      <h2>源代码</h2>
      <details>
        <summary>
          <h3>Swapper.tsx</h3>
          <span
            style="position: absolute; right: 0"
            onClick={e => handleCopy(e, indexRaw)}
          >
            <CopyIcon />
          </span>
        </summary>
        <NCode
          code={indexRaw}
          language="typescript"
          show-line-numbers
          style="width: 800px; margin: 0 auto;"
        />
      </details>
      <details>
        <summary>
          <h3>TableSwapper.ts</h3>
          <span
            style="position: absolute; right: 0"
            onClick={e => handleCopy(e, swapperRaw)}
          >
            <CopyIcon />
          </span>
        </summary>
        <NCode
          code={swapperRaw}
          language="typescript"
          show-line-numbers
          style="width: 800px; margin: 0 auto;"
        />
      </details>
    </>
  )
}
