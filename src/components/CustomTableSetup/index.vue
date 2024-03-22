<template>
  <div class="customer-column">
    <div v-if="slots.showButton" @click="show">
      <slot name="showButton"></slot>
    </div>
    <el-button v-else :icon="Operation" @click="show"></el-button>
    <el-drawer
      v-model="drawerVisible"
      :ref="drawerName"
      :title="drawerTitle"
      :size="size"
      :before-close="handleClose"
      :append-to-body="appendToBody"
      direction="rtl"
      class="base-drawer"
    >
      <div class="base-drawer-main">
        <div class="base-drawer-main__content">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="表格设置" name="1" v-if="!hideTablePropsSetup">
              <div class="table-setup">
                <div
                  class="table-setup-item"
                  v-for="(item, index) in tableSetupList"
                  :key="index"
                >
                  <div class="table-setup-item__label">{{ item.label }}</div>
                  <div class="table-setup-item__option">
                    <el-switch v-model="item.value"></el-switch>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="字段设置" name="2">
              <template v-if="columnData.length > 0">
                <div class="list title">
                  <el-row
                    :gutter="24"
                    style="width: 100%; height: 100%"
                    align="middle"
                  >
                    <el-col :span="14">
                      <div class="align-center">
                        <el-checkbox
                          v-model="visibleCheckedAllState"
                          label="字段列表"
                          :indeterminate="visibleCheckedAllIsIndeterminate"
                          class="list-checkbox"
                          @input="checkAll"
                        />
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="align-center">
                        <span class="list-text">开启列排序</span>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="align-center">
                        <span class="list-text">排序</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <ul :id="dragContainerID" class="drag-container" v-if="visibleDragContainer">
                  <li
                    v-for="item in columnData"
                    :key="item.prop"
                    :id="item.prop"
                    class="list"
                    draggable="true"
                  >
                    <el-row :gutter="24" style="width: 100%">
                      <el-col :span="14">
                        <div class="align-center">
                          <el-checkbox
                            v-model="item.visible"
                            :label="item.label"
                            class="list-checkbox"
                            @change="changeCheckbox"
                          />
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <el-switch
                          v-model="item.sortable"
                          class="list-checkbox"
                        />
                      </el-col>
                      <el-col :span="4">
                        <div class="handle move-icon"></div>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </template>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="base-drawer-footer" v-if="isShowFooter">
        <el-button type="primary" :loading="btnLoading" @click="submitForm">确定</el-button>
        <el-button :loading="btnLoading" @click="reset">重置</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, useSlots, watch } from 'vue';
import { isEqualObj, initDrag } from './utils';
import { Operation } from '@element-plus/icons-vue';
import { originTableSetupList } from './config';
import type {
  columnType,
  tableSetupType,
  defaultTablePropsType,
  setupObjType,
} from './config';

const slots = useSlots();

interface Props {
  allColumn: Array<columnType>;
  storageColumnKey: string;
  defaultTableProps?: defaultTablePropsType;
  hideTablePropsSetup?: boolean;
  appendToBody?: boolean;
  drawerName?: string;
  drawerTitle?: string;
  size?: number | string;
  isShowFooter?: boolean;
  isOnline?: boolean;
  isAsync?: boolean;
  asyncDone?: boolean;
  getCustomSetupFn?: () => Promise<string | null>;
  updateCustomSetupFn?: (params: {
    pathKey: string;
    data: string;
  }) => Promise<any>;
}

const props = withDefaults(defineProps<Props>(), {
  allColumn: () => [],
  storageColumnKey: '',
  defaultTableProps: () => ({
    border: true,
    stripe: false,
    showHeader: true,
    highlightCurrentRow: false,
  }),
  hideTablePropsSetup: false,
  appendToBody: false,
  drawerName: 'drawer',
  drawerTitle: '自定义设置',
  size: 500,
  isShowFooter: true,
  isOnline: false,
  isAsync: false,
  asyncDone: false,
  getCustomSetupFn: () => Promise.resolve(null),
  updateCustomSetupFn: () => Promise.resolve(),
});

const emit = defineEmits(['init', 'confirm', 'close']);

const drawerVisible = ref<boolean>(false);
const visibleCheckedAllIsIndeterminate = ref<boolean>(true);
const visibleCheckedAllState = ref<boolean>(false);
const columnData = ref<Array<columnType>>([]);
const oldColumnData = ref<Array<columnType>>([]);
const visibleDragContainer = ref<boolean>(true);
const activeNames = ref<Array<string>>(['1', '2']);
const tableSetupList = ref<Array<tableSetupType>>(originTableSetupList);
const btnLoading = ref<boolean>(false);
const dragContainerID = ref<string>(`dragContainer${Date.now()}${Math.floor(Math.random()*10000)}`);

onMounted(() => {
  // 当列表字段是动态接口返回时，开启异步调用方式，不在created生命周期执行初始化。
  !props.isAsync && initCustomerColumn();
});

watch(() => props.asyncDone, (newVal) => {
  if (newVal) {
    initCustomerColumn();
  }
})
const initCustomerColumn = async () => {
  let storageDataStr = "";
  if (props.isOnline) {
    storageDataStr = await props.getCustomSetupFn() as string;
  } else {
    storageDataStr = localStorage.getItem(props.storageColumnKey) as string;
  }
  let columnData = JSON.parse(JSON.stringify(props.allColumn));
  oldColumnData.value = JSON.parse(JSON.stringify(props.allColumn));
  let tableProps: any = {};
  if (storageDataStr) {
    let storageData = JSON.parse(storageDataStr);
    const storageTableSetupList = storageData.tableSetupList;
    const storageColumnData = storageData.columnData;
    let changedStorageData: setupObjType | null = null;
    if (
      storageTableSetupList &&
      isEqualObj(storageTableSetupList, tableSetupList.value)
    ) {
      tableSetupList.value = storageTableSetupList;
    } else {
      changedStorageData = {
        ...storageData,
        tableSetupList: "",
      };
    }
    if (storageColumnData && isEqualObj(storageColumnData, props.allColumn)) {
      columnData = storageColumnData;
    } else {
      changedStorageData = {
        ...storageData,
        columnData: "",
      };
    }
    // 有变化重置存储
    changedStorageData && updateStorage(changedStorageData);
  } else {
    Object.keys(props.defaultTableProps).forEach((key: string) => {
      (tableSetupList.value as any).find(
        (item: tableSetupType) => item.key === key,
      ).value = (props.defaultTableProps as any)[key];
    });
  }
  tableSetupList.value.forEach(item => {
    tableProps[item.key] = item.value;
  });
  emit('init', {
    tableProps,
    columnData,
  });
};

const show = () => {
  columnData.value = JSON.parse(JSON.stringify(props.allColumn));
  updateCheckAllState();
  drawerVisible.value = true;
  nextTick(() => {
    initDrag(dragContainerID.value);
  });
};

const handleClose = (done: () => void) => {
  emit('close');
  done();
};

const reset = () => {
  tableSetupList.value = JSON.parse(JSON.stringify(originTableSetupList));
  visibleDragContainer.value = false;
  columnData.value = oldColumnData.value.map(item => {
    return {
      ...item
    };
  });
  nextTick(() => {
    visibleDragContainer.value = true;
    setTimeout(() => {
      initDrag(dragContainerID.value);
    }, 0);
  })
};

const updateStorage = async (storageData: setupObjType) => {
  if (props.isOnline) {
    btnLoading.value = true;
    await props.updateCustomSetupFn({
      pathKey: props.storageColumnKey,
      data: JSON.stringify(storageData),
    });
    btnLoading.value = false;
  } else {
    localStorage.setItem(
      props.storageColumnKey,
      JSON.stringify(storageData)
    );
  }
};

const submitForm = () => {
  drawerVisible.value = false;
  let tableProps: any = {};
  tableSetupList.value.forEach(item => {
    tableProps[item.key] = item.value;
  });
  columnData.value = handleColumnSort();
  const setupObj = {
    tableSetupList: tableSetupList.value,
    columnData: columnData.value,
  };
  updateStorage(setupObj);
  emit('confirm', {
    tableProps,
    columnData: columnData.value,
  });
};

const handleColumnSort = () => {
  const columnDom = document.querySelectorAll(`#${dragContainerID.value} li`);
  const result: any = [];
  columnDom.forEach(item => {
    const colObj = columnData.value.find(x => x.prop === item.id);
    colObj && result.push(colObj);
  });
  return result;
};

const checkAll = () => {
  const count = columnData.value.filter(item => item.visible === true).length;
  if (count === columnData.value.length) {
    columnData.value = columnData.value.map(item => {
      return {
        ...item,
        visible: false,
      };
    });
  } else {
    columnData.value = columnData.value.map(item => {
      return {
        ...item,
        visible: true,
      };
    });
  }
  updateCheckAllState();
};

const changeCheckbox = () => {
  updateCheckAllState();
};

const updateCheckAllState = () => {
  const count = columnData.value.filter(item => item.visible === true).length;
  if (count > 0) {
    if (count === columnData.value.length) {
      visibleCheckedAllState.value = true;
      visibleCheckedAllIsIndeterminate.value = false;
    } else {
      visibleCheckedAllState.value = false;
      visibleCheckedAllIsIndeterminate.value = true;
    }
  } else {
    visibleCheckedAllState.value = false;
    visibleCheckedAllIsIndeterminate.value = false;
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-collapse) {
  border-top: 0;
}
:deep(.el-collapse-item__wrap) {
  border-bottom: 0;
}
:deep(.el-drawer__body) {
  padding: 0 20px 10px;
  padding-bottom: 90px;
}
:deep(.el-drawer__header ){
  padding: 16px 20px;
  margin-bottom: 0;
  font-size: 16px;
  color: #2d3033;
  font-weight: 600;
}
:deep(.el-drawer__close-btn) {
  padding: 0;
}
:deep(.el-collapse-item__header) {
  font-size: 14px;
  color: #54575e;
  font-weight: bold;
}
:deep(.el-collapse-item__wrap) {
  border-bottom: 0;
}

.align-center {
  display: flex;
  align-items: center;
}
.customer-column {
  display: inline-block;
  .open-icon {
    cursor: pointer;
  }
}
.base-drawer {
  .table-setup {
    &-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 13px;
      color: #54575e;
    }
  }
  .list {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: #606266;
    height: 48px;
    cursor: pointer;
    border-bottom: 1px solid #e6e6e6;
    background: white;
    &.title {
      background: #f5f7fa;
      line-height: 48px;
    }
    &-group {
      margin: 0;
      padding: 0;
    }
    &-text {
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: 5px;
    }
    &-checkbox {
      margin-left: 20px;
    }
  }
  .switch-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .text {
      margin-left: 10px;
    }
  }
  .drag-container {
    padding: 0;
    margin: 0;
  }
  .move-icon {
    cursor: move;
    width: 20px;
    height: 20px;
    margin-left: 12px;
    background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuMTY2ODMgMy4zMzMzM0gxNy41MDAyVjVIOS4xNjY4M1YzLjMzMzMzWk01LjAwMDE2IDUuODMzMzNWOS4xNjY2N0gzLjMzMzVWNS44MzMzM0gwLjgzMzQ5Nkw0LjE2NjgzIDIuNUw3LjUwMDE2IDUuODMzMzNINS4wMDAxNlpNNS4wMDAxNiAxNC4xNjY3SDcuNTAwMTZMNC4xNjY4MyAxNy41TDAuODMzNDk2IDE0LjE2NjdIMy4zMzM1VjEwLjgzMzNINS4wMDAxNlYxNC4xNjY3Wk05LjE2NjgzIDE1SDE3LjUwMDJWMTYuNjY2N0g5LjE2NjgzVjE1Wk03LjUwMDE2IDkuMTY2NjdIMTcuNTAwMlYxMC44MzMzSDcuNTAwMTZWOS4xNjY2N1oiIGZpbGw9IiM1NDU3NUUiLz4KPC9zdmc+Cg==)
      no-repeat;
    background-size: 100%;
    margin-top: 5px;
    &.empty-container {
      cursor: pointer;
      opacity: 0;
    }
  }
  &-footer {
    width: 100%;
    height: 60px;
    text-align: right;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: #fff;
    z-index: 999;
    line-height: 60px;
    padding-right: 20px;
    box-shadow: 5px 5px 10px #ccc;
  }
}
</style>
