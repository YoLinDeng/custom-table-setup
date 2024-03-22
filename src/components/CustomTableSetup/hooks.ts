import { ref, computed, nextTick } from 'vue'
import type { optionsType, columnType } from './config'

export const useCustomTableSetup = (options: optionsType) => {
  const { initColumnData, tableRef } = options;
  const tableProps = ref<any>({})
  const allColumn = ref<Array<columnType>>(initColumnData)
  const tableColumn = computed(() => {
    return allColumn.value.filter((x: any) => x.visible);
  })
  
  const updateCustomTableSetup = (data: any) => {
    tableProps.value = data.tableProps;
    allColumn.value = data.columnData;
    nextTick(() => {
      if (tableRef.value) {
        tableRef.value.doLayout();
      }
    });
  }

  return {
    allColumn,
    tableColumn,
    tableProps,
    updateCustomTableSetup
  }
}
