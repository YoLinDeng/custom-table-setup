
### 自定义表格设置组件
a vue3 list custom column component(vue3自定义列组件)
#### 参数

名称|说明|类型|默认值
---|:---:|---:|---
allColumn|列表数组对象(必传)|Array|[]
storageColumnKey|存储key值(原localColumnKey，0.0.21版本更名为storageColumnKey)，必须传入，并保证唯一性，特别是一个页面有多个需要使用自
defaultTableProps|默认表格设置对象(在没有缓存时生效)|Object|-
hideTablePropsSetup|是否隐藏表格设置项|Boolean|false
appendToBody|Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true|Boolean|true
modalAppendToBody|遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Drawer 的父元素上|Boolean|true
wrapperClosable|点击遮罩层是否可以关闭 Drawer|Boolean|true
drawerName|Drawer 的ref名称|String|drawer
drawerTitle|Drawer 的标题|String|自定义设置
size|Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释|Number or String|500
isShowFooter|是否显示页脚|Boolean|true
isOnline|是否使用线上存储（关联用户）|Boolean|false
getCustomSetupFn|获取用户线上存储自定义设置内容（isOnline为true时，必须传入），函数类型，返回值为一个Promise对象，里面是一个缓存数据字符串|Function| () => Promise.resolve(dataString)
updateCustomSetupFn|更新用户线上存储自定义设置内容（isOnline为true时，必须传入），函数类型，传入值为（{ pathKey, data }）,执行保存逻辑，返回值为一个Promise对象|Function| ({ pathKey, data }) => Promise.resolve()
isAsync|是否开启初始化逻辑异步执行，适用于列表内容由接口返回的情况（即动态列表），需配置asyncDone属性使用，在动态列表接口获取并赋值成功后，将asyncDone设置为true，注意dom加载时机，建议在nextTick里面执行asyncDone的赋值。|Boolean|false
asyncDone|异步操作是否完成，当被置为true时，会触发初始化逻辑|Boolean|false

#### 方法

名称|说明|返回值 
---|:---:|---

#### 事件

名称|说明|返回值 
---|:---:|---
init|初始化事件|{ tableProps, columnData }
confirm|点击确认按钮| { tableProps, columnData }
close|点击取消按钮|null

#### 插槽

名称|说明|备注
---|:---:|---
showButton|展示按钮插槽|请先设置useCustomShowButton为true开启自定义展示按钮插槽

#### hooks
##### useCustomTableSetup
**使用方法：**
```js
import { hooks } from './src/components/CustomTableSetup/hooks.ts'
const {
  allColumn,
  tableColumn,
  tableProps,
  updateCustomTableSetup,
} = hooks.useCustomTableSetup({
  initColumnData,
  tableRef,
});
```

**传入参数：**
名称|说明|备注
---|:---:|---
initColumnData|初始化列配置数据|必传
tableRef|table的Ref|必传

**返回值：**
名称|说明|备注
---|:---:|---
allColumn|列配置数据｜-
tableColumn|表格配置数据|-
tableProps|表格属性配置|-
updateCustomTableSetup|触发更新方法|-


使用示例
```vue
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

```