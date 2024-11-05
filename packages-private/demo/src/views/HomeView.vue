<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import createSwapper, { type CreateSwapperTurn } from '@flexi-table/swapper'

interface DataRow {
  username: string
  email: string
  age: number
}

export default defineComponent({
  name: 'DraggableTable',
  setup() {
    let tableSwapper: CreateSwapperTurn | null = null
    const tableRef = ref<HTMLTableElement | null>(null)

    const tableData = ref<DataRow[]>([
      { username: 'Alice', email: '', age: 20 },
      { username: 'Bob', email: '', age: 21 },
      { username: 'Charlie', email: '', age: 22 },
    ])

    const handleUpdateTableData = () => {
      nextTick(() => tableSwapper?.reset())
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        tableData.value = [
          ...tableData.value,
          { username: 'David', email: '', age: 23 },
          { username: 'Eve', email: '', age: 24 },
        ]
      }
    })

    onMounted(() => {
      tableSwapper = createSwapper({
        container: tableRef.value!,
        onSwap: (from, to, f, t) => {
          const data = tableData.value.slice()
          const { rowKey: fromIndex, columnKey: fromKey } = from
          const { rowKey: toIndex, columnKey: toKey } = to

          // This is only swapping the text content of the cells
          // const fclone = f.cloneNode(true)
          // const tclone = t.cloneNode(true)
          // f.parentElement?.replaceChild(tclone, f)
          // t.parentElement?.replaceChild(fclone, t)

          // This is swapping the data in the tableData array
          // @ts-ignore
          ;[data[fromIndex][fromKey], data[toIndex][toKey]] = [
            // @ts-ignore
            data[toIndex][toKey],
            // @ts-ignore
            data[fromIndex][fromKey],
          ]

          handleUpdateTableData()
        },
      })
    })

    onBeforeUnmount(() => {
      tableSwapper?.destroy()
    })

    return {
      tableRef,
      tableData,
    }
  },
})
</script>

<template>
  <table ref="tableRef">
    <caption>
      Draggable Table
    </caption>

    <colgroup>
      <col style="width: 100px" />
      <col style="width: 200px" />
      <col style="width: 100px" />
    </colgroup>

    <thead>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Age</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(row, index) in tableData" :key="index">
        <td draggable="true" :data-row-key="index" data-column-key="username">
          {{ row.username }}
        </td>
        <td draggable="true" :data-row-key="index" data-column-key="email">
          {{ row.email }}
        </td>
        <td draggable="true" :data-row-key="index" data-column-key="age">
          {{ row.age }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
