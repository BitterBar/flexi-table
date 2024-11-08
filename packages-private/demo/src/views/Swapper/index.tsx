import { type VNodeChild, defineComponent, onMounted, ref, watch } from 'vue'
import { createSwapper } from '@flexi-table/swapper'
import NButton from '@/components/Button/Button'
import NRadio from '@/components/Radio/Radio'
import NFlex from '@/components/Flex/Flex'

import { type DataRow, mockData } from './mock'
import TableSwapper from './TableSwapper'
import ExempleRaw from './ExempleRaw'
import DataRaw from './DataRaw'
import GithubIcon from './GithubIcon'

export default defineComponent({
  name: 'Swapper',
  setup() {
    const tableData = ref(mockData())
    const columns: {
      title: string
      key: keyof DataRow
      width: number
      render?: (row: DataRow, rowIndex: number) => VNodeChild
    }[] = [
      {
        title: 'No',
        key: 'no',
        width: 80,
      },
      {
        title: 'Title',
        key: 'title',
        width: 200,
      },
      {
        title: 'Length',
        key: 'length',
        width: 200,
      },
      {
        title: 'Action',
        key: 'actions',
        width: 100,
        render({ length }) {
          return (
            <NButton
              onClick={() => (tableData.value = mockData(length as number))}
            >
              Random
            </NButton>
          )
        },
      },
    ]

    const container = ref<HTMLElement | null>(null)
    const enabled = ref('yes')
    const dragTarget = ref('cell')

    const swapMode = ref('data')
    watch(swapMode, () => (tableData.value = mockData()))

    const swapper = createSwapper(() =>
      TableSwapper({ data: tableData, swapMode, dragTarget }),
    )
    onMounted(() => swapper.mount(container.value!))

    return {
      tableData,
      enabled,
      swapMode,
      dragTarget,
      columns,
      container,
    }
  },
  render() {
    const { tableData, enabled, swapMode, dragTarget, columns } = this

    const trDraggable = enabled === 'yes' && dragTarget === 'row'
    const tdDraggable = enabled === 'yes' && dragTarget === 'cell'

    return (
      <main
        ref={v => (this.container = v as HTMLElement)}
        style="max-width: 1400px; padding: 1rem 1.5rem 2rem; margin: 0 auto"
      >
        <NFlex vertical gap="2rem" align="center">
          <NFlex align="center" gap="1rem">
            <h1>Table Swapper</h1>
            <a
              href="https://github.com/BitterBar/flexi-table/tree/main/packages/swapper"
              target="_blank"
              rel="noopener noreferrer"
              style="line-height: 1"
            >
              <GithubIcon />
            </a>
          </NFlex>

          <NFlex gap="1rem" justify="center">
            <NRadio
              value={dragTarget}
              onUpdateValue={value => (this.dragTarget = value)}
              title="Drag target"
              options={[
                {
                  label: 'Cell',
                  key: 'cell',
                },
                {
                  label: 'Row',
                  key: 'row',
                },
              ]}
            />

            <NRadio
              value={enabled}
              onUpdateValue={value => (this.enabled = value)}
              title="Enabled"
              options={[
                {
                  label: 'Yes',
                  key: 'yes',
                },
                {
                  label: 'No',
                  key: 'no',
                },
              ]}
            />

            <NRadio
              value={swapMode}
              onUpdateValue={value => (this.swapMode = value)}
              title="Swap mode"
              options={[
                {
                  label: 'Data',
                  key: 'data',
                },
                {
                  label: 'Element',
                  key: 'element',
                },
              ]}
            />
          </NFlex>

          <NFlex justify="center" gap="1rem">
            <table>
              <colgroup>
                {columns.map(column => (
                  <col key={column.key} width={column.width} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  {columns.map(column => (
                    <th key={column.key}>{column.title}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr
                    draggable={trDraggable}
                    data-row-key={rowIndex}
                    key={row.id as number}
                  >
                    {columns.map(column => (
                      <td
                        key={column.key}
                        draggable={column.key !== 'actions' && tdDraggable}
                        data-row-key={rowIndex}
                        data-col-key={column.key}
                      >
                        {column.render
                          ? column.render(row, rowIndex)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <DataRaw data={tableData} />
          </NFlex>

          <ExempleRaw />
        </NFlex>
      </main>
    )
  },
})
