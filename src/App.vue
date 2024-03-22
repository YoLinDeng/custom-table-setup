<!-- 这是例子 -->
<template>
  <div class="base-custom-table-setup">
    <!-- 本地缓存 -->
    <custom-table-setup
      style="margin-bottom: 10px"
      :allColumn="allColumn"
      :storageColumnKey="storageColumnKey"
      :defaultTableProps="defaultTableProps"
      @confirm="updateCustomTableSetup"
      @init="updateCustomTableSetup"
    >
      <!-- <template #showButton>
        <el-button>自定义展示按钮</el-button>
      </template> -->
    </custom-table-setup>
    <!-- 线上缓存 -->
    <!-- <base-custom-table-setup
      style="margin-bottom: 10px"
      :allColumn="allColumn"
      isOnline
      :getCustomSetupFn="getCustomSetupFn"
      :updateCustomSetupFn="updateCustomSetupFn"
      :storageColumnKey="storageColumnKey"
      :defaultTableProps="defaultTableProps"
      @confirm="updateCustomTableSetup"
      @init="updateCustomTableSetup"
    >
    </base-custom-table-setup> -->
    <el-table ref="tableRef" :data="tableData" v-bind="tableProps">
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth"
        :sortable="item.sortable"
      >
        <template #default="{ row }">
          <div v-if="item.slotName === 'sexSlot'">
            {{ row.sex === 1 ? '男' : '女' }}
          </div>
          <div v-else>
            {{ row[item.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCustomTableSetup } from './components/CustomTableSetup/hooks';
// import { getCustomerColumnData, updateCustomerColumnData } from '@/api/common';
import type { defaultTablePropsType } from './components/CustomTableSetup/config';
import CustomTableSetup from './components/CustomTableSetup/index.vue'

const storageColumnKey = ref<string>('defaultStorageColumnKey') // 保证唯一key
// const tableProps = ref<any>({})
const tableRef = ref<any>(null);
const defaultTableProps = ref<defaultTablePropsType>({
  border: false,
  stripe: false,
  showHeader: true,
  highlightCurrentRow: false,
});
const initColumnData = [
  {
    label: 'ID',
    prop: 'id',
    minWidth: 180,
    visible: true,
    sortable: false,
  },
  {
    label: '姓名',
    prop: 'username',
    minWidth: 80,
    visible: true,
    sortable: false,
  },
  {
    label: '性别',
    prop: 'sex',
    minWidth: 80,
    visible: true,
    sortable: false,
    slotName: 'sexSlot',
  },
  {
    label: '年龄',
    prop: 'age',
    minWidth: 80,
    visible: true,
    sortable: false,
  },
  {
    label: '手机号码',
    prop: 'phone',
    minWidth: 180,
    visible: true,
    sortable: false,
  },
  {
    label: '身份证',
    prop: 'idcard',
    minWidth: 180,
    visible: true,
    sortable: false,
  },
];
const tableData = ref<Array<any>>([
  {
    id: '1',
    username: '用户1',
    age: '18',
    sex: 1,
    phone: '13534558776',
    idcard: '441322199902239928',
  },
  {
    id: '2',
    username: '用户2',
    age: '19',
    sex: 1,
    phone: '13436448998',
    idcard: '411102199902293301',
  },
  {
    id: '3',
    username: '用户3',
    age: '20',
    sex: 2,
    phone: '13687990778',
    idcard: '401328197702290037',
  },
  {
    id: '4',
    username: '用户4',
    age: '21',
    sex: 2,
    phone: '13768665669',
    idcard: '441427199909980032',
  },
  {
    id: '5',
    username: '用户4',
    age: '22',
    sex: 1,
    phone: '13435665337',
    idcard: '441421198802280021',
  },
]);

const {
  allColumn,
  tableColumn,
  tableProps,
  updateCustomTableSetup,
} = useCustomTableSetup({
  initColumnData,
  tableRef,
});

// const tableColumn = computed(() => {
//   return allColumn.value.filter((x) => x.visible);
// })

// const updateCustomTableSetup = (data: any) => {
//   tableProps.value = data.tableProps;
//   allColumn.value = data.columnData;
//   nextTick(() => {
//     if (tableRef.value) {
//       tableRef.value.doLayout();
//     }
//   });
// }

// // 获取用户自定义信息
// const getCustomSetupFn = () =>{
//   return new Promise((resolve, reject) => {
//     getCustomerColumnData({
//       pathKey: storageColumnKey.value,
//     })
//       .then((res: any) => {
//         resolve(res.result.data);
//       })
//       .catch((err: any) => {
//         reject(err);
//       });
//   });
// };

// // 更新用户自定义信息
// const updateCustomSetupFn = (params: any) => {
//   return new Promise((resolve, reject) => {
//     updateCustomerColumnData({
//       pathKey: params.pathKey,
//       data: params.data,
//     })
//       .then((res: any) => {
//         resolve(res);
//       })
//       .catch((err: any) => {
//         reject(err);
//       });
//   });
// };
</script>
