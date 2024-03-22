import { type Ref } from "vue";

export type columnType = {
  label: string;
  prop: string;
  minWidth?: number;
  width?: number;
  visible: boolean;
  sortable?: boolean;
  slotName?: string;
}

export type defaultTablePropsType = {
  border: boolean;
  stripe?: boolean;
  showHeader?: boolean;
  highlightCurrentRow?: boolean;
}

export type tableSetupType = {
  label: string;
  key: string;
  value: boolean;
}

export type setupObjType = {
  tableSetupList: Array<tableSetupType>;
  columnData: Array<columnType>;
}

export type optionsType = {
  initColumnData: Array<columnType>;
  tableRef: Ref<any>;
  customStorageColumnKey?: string;
}

export const originTableSetupList: Array<tableSetupType> =  [
  {
    label: "是否带有纵向边框",
    key: "border",
    value: true,
  },
  {
    label: "是否为斑马纹table",
    key: "stripe",
    value: false,
  },
  {
    label: "是否显示表头",
    key: "showHeader",
    value: true,
  },
  {
    label: "是否要高亮当前行",
    key: "highlightCurrentRow",
    value: false,
  },
]