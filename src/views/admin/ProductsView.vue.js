/* __placeholder__ */

import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'


const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const fileAgent = ref(null)

// 表單對話框的開啟狀態
const dialog = ref(false)
// 表單對話框正在編輯的商品 ID，空的話代表是新增商品
const dialogId = ref('')
// 打開編輯對話框
const openDialog = () => {
  dialogId.value = ''
  dialog.value = true
}
// 關閉對話框
const closeDialog = () => {
  dialog.value = false
  resetForm()
  fileAgent.value.deleteFileRecord()
}

// 分類
const categories = ['衣服', '食品', '3C', '遊戲']
// 表單驗證
const schema = yup.object({
  name: yup
    .string()
    .required('缺少商品名稱'),
  price: yup
    .number()
    .typeError('商品價格格式錯誤')
    .required('缺少商品價格')
    .min(0, '商品價格不能小於 0'),
  description: yup
    .string()
    .required('缺少商品說明'),
  category: yup
    .string()
    .required('缺少商品分類')
    .test('isCategory', '商品分類錯誤', value => categories.includes(value)),
  sell: yup
    .boolean()
})
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: false
  }
})
const name = useField('name')
const price = useField('price')
const description = useField('description')
const category = useField('category')
const sell = useField('sell')

const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = handleSubmit(async (values) => {
  if (fileRecords.value.length === 0 || fileRecords.value[0].error) return
  try {
    // 建立 FormData 物件
    // 使用 fd.append(欄位, 值) 將資料放進去
    const fd = new FormData()
    for (const key in values) {
      fd.append(key, values[key])
    }
    fd.append('image', fileRecords.value[0].file)

    await apiAuth.post('/products', fd)

    createSnackbar({
      text: '新增成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    closeDialog()
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})

// 表格每頁幾個
const tableItemsPerPage = ref(10)
// 表格排序
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
// 表格頁碼
const tablePage = ref(1)
// 表格商品資料陣列
const tableProducts = ref([])
// 表格欄位設定
const tableHeaders = [
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '名稱', align: 'center', sortable: true, key: 'name' },
  { title: '價格', align: 'center', sortable: true, key: 'price' },
  // { title: '說明', align: 'center', sortable: true, key: 'description' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  { title: '上架', align: 'center', sortable: true, key: 'sell' },
  { title: '編輯', align: 'center', sortable: false, key: 'edit' }
]
// 表格載入狀態
const tableLoading = ref(true)
// 表格全部資料數
const tableItemsLength = ref(0)
// 表格搜尋文字
const tableSearch = ref('')
// 表格載入資料
const tableLoadItems = async () => {
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/products/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order === 'asc' ? 1 : -1,
        search: tableSearch.value
      }
    })
    tableProducts.value.splice(0, tableProducts.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
  tableLoading.value = false
}
tableLoadItems()

const __VLS_componentsOption = {};

let __VLS_name!: 'ProductsView';
function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {
};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & (new () => { $slots: typeof __VLS_slots })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {}
& __VLS_WithComponent<'VContainer', typeof __VLS_localComponents, "VContainer", "VContainer", "VContainer">
& __VLS_WithComponent<'VRow', typeof __VLS_localComponents, "VRow", "VRow", "VRow">
& __VLS_WithComponent<'VCol', typeof __VLS_localComponents, "VCol", "VCol", "VCol">
& __VLS_WithComponent<'VDivider', typeof __VLS_localComponents, "VDivider", "VDivider", "VDivider">
& __VLS_WithComponent<'VBtn', typeof __VLS_localComponents, "VBtn", "VBtn", "VBtn">
& __VLS_WithComponent<'VDataTableServer', typeof __VLS_localComponents, "VDataTableServer", "VDataTableServer", "VDataTableServer">
& __VLS_WithComponent<'VTextField', typeof __VLS_localComponents, "VTextField", "VTextField", "VTextField">
& __VLS_WithComponent<'VImg', typeof __VLS_localComponents, "VImg", "VImg", "VImg">
& __VLS_WithComponent<'VIcon', typeof __VLS_localComponents, "VIcon", "VIcon", "VIcon">
& __VLS_WithComponent<'VDialog', typeof __VLS_localComponents, "VDialog", "VDialog", "VDialog">
& __VLS_WithComponent<'VForm', typeof __VLS_localComponents, "VForm", "VForm", "VForm">
& __VLS_WithComponent<'VCard', typeof __VLS_localComponents, "VCard", "VCard", "VCard">
& __VLS_WithComponent<'VCardTitle', typeof __VLS_localComponents, "VCardTitle", "VCardTitle", "VCardTitle">
& __VLS_WithComponent<'VCardText', typeof __VLS_localComponents, "VCardText", "VCardText", "VCardText">
& __VLS_WithComponent<'VSelect', typeof __VLS_localComponents, "VSelect", "VSelect", "VSelect">
& __VLS_WithComponent<'VCheckbox', typeof __VLS_localComponents, "VCheckbox", "VCheckbox", "VCheckbox">
& __VLS_WithComponent<'VTextarea', typeof __VLS_localComponents, "VTextarea", "VTextarea", "VTextarea">
& __VLS_WithComponent<'VueFileAgent', typeof __VLS_localComponents, "VueFileAgent", "VueFileAgent", "VueFileAgent">
& __VLS_WithComponent<'VCardActions', typeof __VLS_localComponents, "VCardActions", "VCardActions", "VCardActions">
& __VLS_WithComponent<'VSpacer', typeof __VLS_localComponents, "VSpacer", "VSpacer", "VSpacer">
;
__VLS_components.VContainer;
// @ts-ignore
[VContainer,];
__VLS_components.VRow;
// @ts-ignore
[VRow,];
__VLS_components.VCol;__VLS_components.VCol;__VLS_components.VCol;
// @ts-ignore
[VCol,VCol,VCol,];
__VLS_intrinsicElements.h1;
__VLS_components.VDivider;
// @ts-ignore
[VDivider,];
__VLS_components.VBtn;__VLS_components.VBtn;__VLS_components.VBtn;__VLS_components.VBtn;
// @ts-ignore
[VBtn,VBtn,VBtn,VBtn,];
__VLS_components.VDataTableServer;
// @ts-ignore
[VDataTableServer,];
__VLS_intrinsicElements.template;__VLS_intrinsicElements.template;__VLS_intrinsicElements.template;__VLS_intrinsicElements.template;
__VLS_components.VTextField;__VLS_components.VTextField;__VLS_components.VTextField;
// @ts-ignore
[VTextField,VTextField,VTextField,];
__VLS_components.VImg;
// @ts-ignore
[VImg,];
__VLS_components.VIcon;
// @ts-ignore
[VIcon,];
__VLS_components.VDialog;
// @ts-ignore
[VDialog,];
__VLS_components.VForm;
// @ts-ignore
[VForm,];
__VLS_components.VCard;
// @ts-ignore
[VCard,];
__VLS_components.VCardTitle;
// @ts-ignore
[VCardTitle,];
__VLS_components.VCardText;
// @ts-ignore
[VCardText,];
__VLS_components.VSelect;
// @ts-ignore
[VSelect,];
__VLS_components.VCheckbox;
// @ts-ignore
[VCheckbox,];
__VLS_components.VTextarea;
// @ts-ignore
[VTextarea,];
__VLS_components.VueFileAgent;
// @ts-ignore
[VueFileAgent,];
__VLS_components.VCardActions;
// @ts-ignore
[VCardActions,];
__VLS_components.VSpacer;
// @ts-ignore
[VSpacer,];
{
const __VLS_0 = ({} as 'VContainer' extends keyof typeof __VLS_ctx ? { 'VContainer': typeof __VLS_ctx.VContainer }: typeof __VLS_resolvedLocalAndGlobalComponents).VContainer;
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({...{ }, }));
({} as { VContainer: typeof __VLS_0 }).VContainer;
const __VLS_2 = __VLS_1({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_0, typeof __VLS_2> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
let __VLS_4!: __VLS_NormalizeEmits<typeof __VLS_3.emit>;
{
const __VLS_5 = ({} as 'VRow' extends keyof typeof __VLS_ctx ? { 'VRow': typeof __VLS_ctx.VRow }: typeof __VLS_resolvedLocalAndGlobalComponents).VRow;
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({...{ }, }));
({} as { VRow: typeof __VLS_5 }).VRow;
const __VLS_7 = __VLS_6({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_5, typeof __VLS_7> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7)!;
let __VLS_9!: __VLS_NormalizeEmits<typeof __VLS_8.emit>;
{
const __VLS_10 = ({} as 'VCol' extends keyof typeof __VLS_ctx ? { 'VCol': typeof __VLS_ctx.VCol }: typeof __VLS_resolvedLocalAndGlobalComponents).VCol;
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({...{ }, cols: ("12"), }));
({} as { VCol: typeof __VLS_10 }).VCol;
const __VLS_12 = __VLS_11({ ...{ }, cols: ("12"), }, ...__VLS_functionalComponentArgsRest(__VLS_11));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_10, typeof __VLS_12> & Record<string, unknown>) => void)({ ...{ }, cols: ("12"), });
const __VLS_13 = __VLS_pickFunctionalComponentCtx(__VLS_10, __VLS_12)!;
let __VLS_14!: __VLS_NormalizeEmits<typeof __VLS_13.emit>;
{
const __VLS_15 = __VLS_intrinsicElements["h1"];
const __VLS_16 = __VLS_elementAsFunctionalComponent(__VLS_15);
const __VLS_17 = __VLS_16({ ...{ }, class: (" text-center"), }, ...__VLS_functionalComponentArgsRest(__VLS_16));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_15, typeof __VLS_17> & Record<string, unknown>) => void)({ ...{ }, class: (" text-center"), });
const __VLS_18 = __VLS_pickFunctionalComponentCtx(__VLS_15, __VLS_17)!;
let __VLS_19!: __VLS_NormalizeEmits<typeof __VLS_18.emit>;
(__VLS_18.slots!).default;
}
(__VLS_13.slots!).default;
}
{
const __VLS_20 = ({} as 'VDivider' extends keyof typeof __VLS_ctx ? { 'VDivider': typeof __VLS_ctx.VDivider }: typeof __VLS_resolvedLocalAndGlobalComponents).VDivider;
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({...{ }, }));
({} as { VDivider: typeof __VLS_20 }).VDivider;
const __VLS_22 = __VLS_21({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_21));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_20, typeof __VLS_22> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22)!;
let __VLS_24!: __VLS_NormalizeEmits<typeof __VLS_23.emit>;
}
{
const __VLS_25 = ({} as 'VCol' extends keyof typeof __VLS_ctx ? { 'VCol': typeof __VLS_ctx.VCol }: typeof __VLS_resolvedLocalAndGlobalComponents).VCol;
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({...{ }, cols: ("12"), }));
({} as { VCol: typeof __VLS_25 }).VCol;
const __VLS_27 = __VLS_26({ ...{ }, cols: ("12"), }, ...__VLS_functionalComponentArgsRest(__VLS_26));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_25, typeof __VLS_27> & Record<string, unknown>) => void)({ ...{ }, cols: ("12"), });
const __VLS_28 = __VLS_pickFunctionalComponentCtx(__VLS_25, __VLS_27)!;
let __VLS_29!: __VLS_NormalizeEmits<typeof __VLS_28.emit>;
{
const __VLS_30 = ({} as 'VBtn' extends keyof typeof __VLS_ctx ? { 'VBtn': typeof __VLS_ctx.VBtn }: typeof __VLS_resolvedLocalAndGlobalComponents).VBtn;
const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({...{ onClick: {} as any, }, color: ("green"), }));
({} as { VBtn: typeof __VLS_30 }).VBtn;
const __VLS_32 = __VLS_31({ ...{ onClick: {} as any, }, color: ("green"), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_30, typeof __VLS_32> & Record<string, unknown>) => void)({ ...{ onClick: {} as any, }, color: ("green"), });
const __VLS_33 = __VLS_pickFunctionalComponentCtx(__VLS_30, __VLS_32)!;
let __VLS_34!: __VLS_NormalizeEmits<typeof __VLS_33.emit>;
let __VLS_35 = { 'click': __VLS_pickEvent(__VLS_34['click'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_31, typeof __VLS_32>).onClick) };
__VLS_35 = { click: (__VLS_ctx.openDialog) };
(__VLS_33.slots!).default;
}
(__VLS_28.slots!).default;
}
{
const __VLS_36 = ({} as 'VCol' extends keyof typeof __VLS_ctx ? { 'VCol': typeof __VLS_ctx.VCol }: typeof __VLS_resolvedLocalAndGlobalComponents).VCol;
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({...{ }, cols: ("12"), }));
({} as { VCol: typeof __VLS_36 }).VCol;
const __VLS_38 = __VLS_37({ ...{ }, cols: ("12"), }, ...__VLS_functionalComponentArgsRest(__VLS_37));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_36, typeof __VLS_38> & Record<string, unknown>) => void)({ ...{ }, cols: ("12"), });
const __VLS_39 = __VLS_pickFunctionalComponentCtx(__VLS_36, __VLS_38)!;
let __VLS_40!: __VLS_NormalizeEmits<typeof __VLS_39.emit>;
{
const __VLS_41 = ({} as 'VDataTableServer' extends keyof typeof __VLS_ctx ? { 'VDataTableServer': typeof __VLS_ctx.VDataTableServer }: typeof __VLS_resolvedLocalAndGlobalComponents).VDataTableServer;
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({...{ "onUpdate:itemsPerPage": {} as any, "onUpdate:sortBy": {} as any, "onUpdate:page": {} as any, }, itemsPerPage: ((__VLS_ctx.tableItemsPerPage)), sortBy: ((__VLS_ctx.tableSortBy)), page: ((__VLS_ctx.tablePage)), items: ((__VLS_ctx.tableProducts)), headers: ((__VLS_ctx.tableHeaders)), loading: ((__VLS_ctx.tableLoading)), itemsLength: ((__VLS_ctx.tableItemsLength)), search: ((__VLS_ctx.tableSearch)), hover: (true), }));
({} as { VDataTableServer: typeof __VLS_41 }).VDataTableServer;
const __VLS_43 = __VLS_42({ ...{ "onUpdate:itemsPerPage": {} as any, "onUpdate:sortBy": {} as any, "onUpdate:page": {} as any, }, itemsPerPage: ((__VLS_ctx.tableItemsPerPage)), sortBy: ((__VLS_ctx.tableSortBy)), page: ((__VLS_ctx.tablePage)), items: ((__VLS_ctx.tableProducts)), headers: ((__VLS_ctx.tableHeaders)), loading: ((__VLS_ctx.tableLoading)), itemsLength: ((__VLS_ctx.tableItemsLength)), search: ((__VLS_ctx.tableSearch)), hover: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_42));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_41, typeof __VLS_43> & Record<string, unknown>) => void)({ ...{ "onUpdate:itemsPerPage": {} as any, "onUpdate:sortBy": {} as any, "onUpdate:page": {} as any, }, itemsPerPage: ((__VLS_ctx.tableItemsPerPage)), sortBy: ((__VLS_ctx.tableSortBy)), page: ((__VLS_ctx.tablePage)), items: ((__VLS_ctx.tableProducts)), headers: ((__VLS_ctx.tableHeaders)), loading: ((__VLS_ctx.tableLoading)), itemsLength: ((__VLS_ctx.tableItemsLength)), search: ((__VLS_ctx.tableSearch)), hover: (true), });
const __VLS_44 = __VLS_pickFunctionalComponentCtx(__VLS_41, __VLS_43)!;
let __VLS_45!: __VLS_NormalizeEmits<typeof __VLS_44.emit>;
let __VLS_46 = { 'update:items-per-page': __VLS_pickEvent(__VLS_45['update:items-per-page'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_42, typeof __VLS_43>)["onUpdate:itemsPerPage"]) };
__VLS_46 = { "update:items-per-page": (__VLS_ctx.tableLoadItems) };
let __VLS_47 = { 'update:sort-by': __VLS_pickEvent(__VLS_45['update:sort-by'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_42, typeof __VLS_43>)["onUpdate:sortBy"]) };
__VLS_47 = { "update:sort-by": (__VLS_ctx.tableLoadItems) };
let __VLS_48 = { 'update:page': __VLS_pickEvent(__VLS_45['update:page'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_42, typeof __VLS_43>)["onUpdate:page"]) };
__VLS_48 = { "update:page": (__VLS_ctx.tableLoadItems) };
{
const __VLS_49 = __VLS_intrinsicElements["template"];
const __VLS_50 = __VLS_elementAsFunctionalComponent(__VLS_49);
const __VLS_51 = __VLS_50({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_50));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_49, typeof __VLS_51> & Record<string, unknown>) => void)({ ...{ }, });
{
(__VLS_44.slots!).top;
{
const __VLS_52 = ({} as 'VTextField' extends keyof typeof __VLS_ctx ? { 'VTextField': typeof __VLS_ctx.VTextField }: typeof __VLS_resolvedLocalAndGlobalComponents).VTextField;
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({...{ }, label: ("搜尋"), }));
({} as { VTextField: typeof __VLS_52 }).VTextField;
const __VLS_54 = __VLS_53({ ...{ }, label: ("搜尋"), }, ...__VLS_functionalComponentArgsRest(__VLS_53));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_52, typeof __VLS_54> & Record<string, unknown>) => void)({ ...{ }, label: ("搜尋"), });
const __VLS_55 = __VLS_pickFunctionalComponentCtx(__VLS_52, __VLS_54)!;
let __VLS_56!: __VLS_NormalizeEmits<typeof __VLS_55.emit>;
}
// @ts-ignore
[openDialog,tableItemsPerPage,tableSortBy,tablePage,tableProducts,tableHeaders,tableLoading,tableItemsLength,tableSearch,tableItemsPerPage,tableSortBy,tablePage,tableProducts,tableHeaders,tableLoading,tableItemsLength,tableSearch,tableItemsPerPage,tableSortBy,tablePage,tableProducts,tableHeaders,tableLoading,tableItemsLength,tableSearch,tableLoadItems,tableLoadItems,tableLoadItems,];
}
}
{
const __VLS_57 = __VLS_intrinsicElements["template"];
const __VLS_58 = __VLS_elementAsFunctionalComponent(__VLS_57);
const __VLS_59 = __VLS_58({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_58));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_57, typeof __VLS_59> & Record<string, unknown>) => void)({ ...{ }, });
{
const [{ item }] = __VLS_getSlotParams((__VLS_44.slots!)[`item.image`]);
{
const __VLS_60 = ({} as 'VImg' extends keyof typeof __VLS_ctx ? { 'VImg': typeof __VLS_ctx.VImg }: typeof __VLS_resolvedLocalAndGlobalComponents).VImg;
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({...{ }, src: ((item.image)), height: ("50px"), }));
({} as { VImg: typeof __VLS_60 }).VImg;
const __VLS_62 = __VLS_61({ ...{ }, src: ((item.image)), height: ("50px"), }, ...__VLS_functionalComponentArgsRest(__VLS_61));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_60, typeof __VLS_62> & Record<string, unknown>) => void)({ ...{ }, src: ((item.image)), height: ("50px"), });
const __VLS_63 = __VLS_pickFunctionalComponentCtx(__VLS_60, __VLS_62)!;
let __VLS_64!: __VLS_NormalizeEmits<typeof __VLS_63.emit>;
}
}
}
{
const __VLS_65 = __VLS_intrinsicElements["template"];
const __VLS_66 = __VLS_elementAsFunctionalComponent(__VLS_65);
const __VLS_67 = __VLS_66({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_66));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_65, typeof __VLS_67> & Record<string, unknown>) => void)({ ...{ }, });
{
const [{ item }] = __VLS_getSlotParams((__VLS_44.slots!)[`item.sell`]);
if (item.sell) {
{
const __VLS_68 = ({} as 'VIcon' extends keyof typeof __VLS_ctx ? { 'VIcon': typeof __VLS_ctx.VIcon }: typeof __VLS_resolvedLocalAndGlobalComponents).VIcon;
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({...{ }, icon: ("mdi-check"), }));
({} as { VIcon: typeof __VLS_68 }).VIcon;
const __VLS_70 = __VLS_69({ ...{ }, icon: ("mdi-check"), }, ...__VLS_functionalComponentArgsRest(__VLS_69));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_68, typeof __VLS_70> & Record<string, unknown>) => void)({ ...{ }, icon: ("mdi-check"), });
const __VLS_71 = __VLS_pickFunctionalComponentCtx(__VLS_68, __VLS_70)!;
let __VLS_72!: __VLS_NormalizeEmits<typeof __VLS_71.emit>;
}
}
}
}
{
const __VLS_73 = __VLS_intrinsicElements["template"];
const __VLS_74 = __VLS_elementAsFunctionalComponent(__VLS_73);
const __VLS_75 = __VLS_74({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_74));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_73, typeof __VLS_75> & Record<string, unknown>) => void)({ ...{ }, });
{
const [{ item }] = __VLS_getSlotParams((__VLS_44.slots!)[`item.edit`]);
{
const __VLS_76 = ({} as 'VBtn' extends keyof typeof __VLS_ctx ? { 'VBtn': typeof __VLS_ctx.VBtn }: typeof __VLS_resolvedLocalAndGlobalComponents).VBtn;
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({...{ onClick: {} as any, }, icon: ("mdi-pencil"), variant: ("text"), color: ("blue"), }));
({} as { VBtn: typeof __VLS_76 }).VBtn;
const __VLS_78 = __VLS_77({ ...{ onClick: {} as any, }, icon: ("mdi-pencil"), variant: ("text"), color: ("blue"), }, ...__VLS_functionalComponentArgsRest(__VLS_77));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_76, typeof __VLS_78> & Record<string, unknown>) => void)({ ...{ onClick: {} as any, }, icon: ("mdi-pencil"), variant: ("text"), color: ("blue"), });
const __VLS_79 = __VLS_pickFunctionalComponentCtx(__VLS_76, __VLS_78)!;
let __VLS_80!: __VLS_NormalizeEmits<typeof __VLS_79.emit>;
let __VLS_81 = { 'click': __VLS_pickEvent(__VLS_80['click'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_77, typeof __VLS_78>).onClick) };
__VLS_81 = { click: $event => {
__VLS_ctx.openDialog(item);
// @ts-ignore
[openDialog,];
}
 };
}
}
}
}
(__VLS_39.slots!).default;
}
(__VLS_8.slots!).default;
}
(__VLS_3.slots!).default;
}
{
const __VLS_82 = ({} as 'VDialog' extends keyof typeof __VLS_ctx ? { 'VDialog': typeof __VLS_ctx.VDialog }: typeof __VLS_resolvedLocalAndGlobalComponents).VDialog;
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({...{ }, modelValue: ((__VLS_ctx.dialog)), persistent: (true), width: ("500px"), }));
({} as { VDialog: typeof __VLS_82 }).VDialog;
const __VLS_84 = __VLS_83({ ...{ }, modelValue: ((__VLS_ctx.dialog)), persistent: (true), width: ("500px"), }, ...__VLS_functionalComponentArgsRest(__VLS_83));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_82, typeof __VLS_84> & Record<string, unknown>) => void)({ ...{ }, modelValue: ((__VLS_ctx.dialog)), persistent: (true), width: ("500px"), });
const __VLS_85 = __VLS_pickFunctionalComponentCtx(__VLS_82, __VLS_84)!;
let __VLS_86!: __VLS_NormalizeEmits<typeof __VLS_85.emit>;
{
const __VLS_87 = ({} as 'VForm' extends keyof typeof __VLS_ctx ? { 'VForm': typeof __VLS_ctx.VForm }: typeof __VLS_resolvedLocalAndGlobalComponents).VForm;
const __VLS_88 = __VLS_asFunctionalComponent(__VLS_87, new __VLS_87({...{ onSubmit: {} as any, }, disabled: ((__VLS_ctx.isSubmitting)), }));
({} as { VForm: typeof __VLS_87 }).VForm;
const __VLS_89 = __VLS_88({ ...{ onSubmit: {} as any, }, disabled: ((__VLS_ctx.isSubmitting)), }, ...__VLS_functionalComponentArgsRest(__VLS_88));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_87, typeof __VLS_89> & Record<string, unknown>) => void)({ ...{ onSubmit: {} as any, }, disabled: ((__VLS_ctx.isSubmitting)), });
const __VLS_90 = __VLS_pickFunctionalComponentCtx(__VLS_87, __VLS_89)!;
let __VLS_91!: __VLS_NormalizeEmits<typeof __VLS_90.emit>;
let __VLS_92 = { 'submit': __VLS_pickEvent(__VLS_91['submit'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_88, typeof __VLS_89>).onSubmit) };
__VLS_92 = { submit: (__VLS_ctx.submit) };
{
const __VLS_93 = ({} as 'VCard' extends keyof typeof __VLS_ctx ? { 'VCard': typeof __VLS_ctx.VCard }: typeof __VLS_resolvedLocalAndGlobalComponents).VCard;
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({...{ }, }));
({} as { VCard: typeof __VLS_93 }).VCard;
const __VLS_95 = __VLS_94({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_94));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_93, typeof __VLS_95> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_96 = __VLS_pickFunctionalComponentCtx(__VLS_93, __VLS_95)!;
let __VLS_97!: __VLS_NormalizeEmits<typeof __VLS_96.emit>;
{
const __VLS_98 = ({} as 'VCardTitle' extends keyof typeof __VLS_ctx ? { 'VCardTitle': typeof __VLS_ctx.VCardTitle }: typeof __VLS_resolvedLocalAndGlobalComponents).VCardTitle;
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({...{ }, }));
({} as { VCardTitle: typeof __VLS_98 }).VCardTitle;
const __VLS_100 = __VLS_99({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_99));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_98, typeof __VLS_100> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_101 = __VLS_pickFunctionalComponentCtx(__VLS_98, __VLS_100)!;
let __VLS_102!: __VLS_NormalizeEmits<typeof __VLS_101.emit>;
( __VLS_ctx.dialogId === '' ? '新增商品' : '編輯商品' );
(__VLS_101.slots!).default;
}
{
const __VLS_103 = ({} as 'VCardText' extends keyof typeof __VLS_ctx ? { 'VCardText': typeof __VLS_ctx.VCardText }: typeof __VLS_resolvedLocalAndGlobalComponents).VCardText;
const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({...{ }, }));
({} as { VCardText: typeof __VLS_103 }).VCardText;
const __VLS_105 = __VLS_104({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_104));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_103, typeof __VLS_105> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_106 = __VLS_pickFunctionalComponentCtx(__VLS_103, __VLS_105)!;
let __VLS_107!: __VLS_NormalizeEmits<typeof __VLS_106.emit>;
{
const __VLS_108 = ({} as 'VTextField' extends keyof typeof __VLS_ctx ? { 'VTextField': typeof __VLS_ctx.VTextField }: typeof __VLS_resolvedLocalAndGlobalComponents).VTextField;
const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({...{ }, label: ("名稱"), modelValue: ((__VLS_ctx.name.value.value)), errorMessages: ((__VLS_ctx.name.errorMessage.value)), }));
({} as { VTextField: typeof __VLS_108 }).VTextField;
const __VLS_110 = __VLS_109({ ...{ }, label: ("名稱"), modelValue: ((__VLS_ctx.name.value.value)), errorMessages: ((__VLS_ctx.name.errorMessage.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_109));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_108, typeof __VLS_110> & Record<string, unknown>) => void)({ ...{ }, label: ("名稱"), modelValue: ((__VLS_ctx.name.value.value)), errorMessages: ((__VLS_ctx.name.errorMessage.value)), });
const __VLS_111 = __VLS_pickFunctionalComponentCtx(__VLS_108, __VLS_110)!;
let __VLS_112!: __VLS_NormalizeEmits<typeof __VLS_111.emit>;
}
{
const __VLS_113 = ({} as 'VTextField' extends keyof typeof __VLS_ctx ? { 'VTextField': typeof __VLS_ctx.VTextField }: typeof __VLS_resolvedLocalAndGlobalComponents).VTextField;
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({...{ }, label: ("價格"), type: ("number"), min: ("0"), modelValue: ((__VLS_ctx.price.value.value)), errorMessages: ((__VLS_ctx.price.errorMessage.value)), }));
({} as { VTextField: typeof __VLS_113 }).VTextField;
const __VLS_115 = __VLS_114({ ...{ }, label: ("價格"), type: ("number"), min: ("0"), modelValue: ((__VLS_ctx.price.value.value)), errorMessages: ((__VLS_ctx.price.errorMessage.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_114));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_113, typeof __VLS_115> & Record<string, unknown>) => void)({ ...{ }, label: ("價格"), type: ("number"), min: ("0"), modelValue: ((__VLS_ctx.price.value.value)), errorMessages: ((__VLS_ctx.price.errorMessage.value)), });
const __VLS_116 = __VLS_pickFunctionalComponentCtx(__VLS_113, __VLS_115)!;
let __VLS_117!: __VLS_NormalizeEmits<typeof __VLS_116.emit>;
}
{
const __VLS_118 = ({} as 'VSelect' extends keyof typeof __VLS_ctx ? { 'VSelect': typeof __VLS_ctx.VSelect }: typeof __VLS_resolvedLocalAndGlobalComponents).VSelect;
const __VLS_119 = __VLS_asFunctionalComponent(__VLS_118, new __VLS_118({...{ }, label: ("分類"), items: ((__VLS_ctx.categories)), modelValue: ((__VLS_ctx.category.value.value)), errorMessages: ((__VLS_ctx.category.errorMessage.value)), }));
({} as { VSelect: typeof __VLS_118 }).VSelect;
const __VLS_120 = __VLS_119({ ...{ }, label: ("分類"), items: ((__VLS_ctx.categories)), modelValue: ((__VLS_ctx.category.value.value)), errorMessages: ((__VLS_ctx.category.errorMessage.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_119));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_118, typeof __VLS_120> & Record<string, unknown>) => void)({ ...{ }, label: ("分類"), items: ((__VLS_ctx.categories)), modelValue: ((__VLS_ctx.category.value.value)), errorMessages: ((__VLS_ctx.category.errorMessage.value)), });
const __VLS_121 = __VLS_pickFunctionalComponentCtx(__VLS_118, __VLS_120)!;
let __VLS_122!: __VLS_NormalizeEmits<typeof __VLS_121.emit>;
}
{
const __VLS_123 = ({} as 'VCheckbox' extends keyof typeof __VLS_ctx ? { 'VCheckbox': typeof __VLS_ctx.VCheckbox }: typeof __VLS_resolvedLocalAndGlobalComponents).VCheckbox;
const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({...{ }, label: ("上架"), modelValue: ((__VLS_ctx.sell.value.value)), errorMessages: ((__VLS_ctx.sell.errorMessage.value)), }));
({} as { VCheckbox: typeof __VLS_123 }).VCheckbox;
const __VLS_125 = __VLS_124({ ...{ }, label: ("上架"), modelValue: ((__VLS_ctx.sell.value.value)), errorMessages: ((__VLS_ctx.sell.errorMessage.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_124));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_123, typeof __VLS_125> & Record<string, unknown>) => void)({ ...{ }, label: ("上架"), modelValue: ((__VLS_ctx.sell.value.value)), errorMessages: ((__VLS_ctx.sell.errorMessage.value)), });
const __VLS_126 = __VLS_pickFunctionalComponentCtx(__VLS_123, __VLS_125)!;
let __VLS_127!: __VLS_NormalizeEmits<typeof __VLS_126.emit>;
}
{
const __VLS_128 = ({} as 'VTextarea' extends keyof typeof __VLS_ctx ? { 'VTextarea': typeof __VLS_ctx.VTextarea }: typeof __VLS_resolvedLocalAndGlobalComponents).VTextarea;
const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({...{ }, label: ("說明"), modelValue: ((__VLS_ctx.description.value.value)), errorMessages: ((__VLS_ctx.description.errorMessage.value)), }));
({} as { VTextarea: typeof __VLS_128 }).VTextarea;
const __VLS_130 = __VLS_129({ ...{ }, label: ("說明"), modelValue: ((__VLS_ctx.description.value.value)), errorMessages: ((__VLS_ctx.description.errorMessage.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_129));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_128, typeof __VLS_130> & Record<string, unknown>) => void)({ ...{ }, label: ("說明"), modelValue: ((__VLS_ctx.description.value.value)), errorMessages: ((__VLS_ctx.description.errorMessage.value)), });
const __VLS_131 = __VLS_pickFunctionalComponentCtx(__VLS_128, __VLS_130)!;
let __VLS_132!: __VLS_NormalizeEmits<typeof __VLS_131.emit>;
}
{
const __VLS_133 = ({} as 'VueFileAgent' extends keyof typeof __VLS_ctx ? { 'VueFileAgent': typeof __VLS_ctx.VueFileAgent }: typeof __VLS_resolvedLocalAndGlobalComponents).VueFileAgent;
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({...{ }, modelValue: ((__VLS_ctx.fileRecords)), rawModelValue: ((__VLS_ctx.rawFileRecords)), accept: ("image/jpeg,image/png"), deletable: (true), errorText: (({type: '檔案格式不支援', size: '檔案超過 1MB 大小限制'})), helpText: ("選擇檔案或拖曳到這裡"), maxFiles: ((1)), maxSize: ("1MB"), ref: ("fileAgent"), }));
({} as { VueFileAgent: typeof __VLS_133 }).VueFileAgent;
const __VLS_135 = __VLS_134({ ...{ }, modelValue: ((__VLS_ctx.fileRecords)), rawModelValue: ((__VLS_ctx.rawFileRecords)), accept: ("image/jpeg,image/png"), deletable: (true), errorText: (({type: '檔案格式不支援', size: '檔案超過 1MB 大小限制'})), helpText: ("選擇檔案或拖曳到這裡"), maxFiles: ((1)), maxSize: ("1MB"), ref: ("fileAgent"), }, ...__VLS_functionalComponentArgsRest(__VLS_134));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_133, typeof __VLS_135> & Record<string, unknown>) => void)({ ...{ }, modelValue: ((__VLS_ctx.fileRecords)), rawModelValue: ((__VLS_ctx.rawFileRecords)), accept: ("image/jpeg,image/png"), deletable: (true), errorText: (({type: '檔案格式不支援', size: '檔案超過 1MB 大小限制'})), helpText: ("選擇檔案或拖曳到這裡"), maxFiles: ((1)), maxSize: ("1MB"), ref: ("fileAgent"), });
const __VLS_136 = __VLS_pickFunctionalComponentCtx(__VLS_133, __VLS_135)!;
let __VLS_137!: __VLS_NormalizeEmits<typeof __VLS_136.emit>;
// @ts-ignore
(__VLS_ctx.fileAgent);
}
(__VLS_106.slots!).default;
}
{
const __VLS_138 = ({} as 'VCardActions' extends keyof typeof __VLS_ctx ? { 'VCardActions': typeof __VLS_ctx.VCardActions }: typeof __VLS_resolvedLocalAndGlobalComponents).VCardActions;
const __VLS_139 = __VLS_asFunctionalComponent(__VLS_138, new __VLS_138({...{ }, }));
({} as { VCardActions: typeof __VLS_138 }).VCardActions;
const __VLS_140 = __VLS_139({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_139));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_138, typeof __VLS_140> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_141 = __VLS_pickFunctionalComponentCtx(__VLS_138, __VLS_140)!;
let __VLS_142!: __VLS_NormalizeEmits<typeof __VLS_141.emit>;
{
const __VLS_143 = ({} as 'VSpacer' extends keyof typeof __VLS_ctx ? { 'VSpacer': typeof __VLS_ctx.VSpacer }: typeof __VLS_resolvedLocalAndGlobalComponents).VSpacer;
const __VLS_144 = __VLS_asFunctionalComponent(__VLS_143, new __VLS_143({...{ }, }));
({} as { VSpacer: typeof __VLS_143 }).VSpacer;
const __VLS_145 = __VLS_144({ ...{ }, }, ...__VLS_functionalComponentArgsRest(__VLS_144));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_143, typeof __VLS_145> & Record<string, unknown>) => void)({ ...{ }, });
const __VLS_146 = __VLS_pickFunctionalComponentCtx(__VLS_143, __VLS_145)!;
let __VLS_147!: __VLS_NormalizeEmits<typeof __VLS_146.emit>;
}
{
const __VLS_148 = ({} as 'VBtn' extends keyof typeof __VLS_ctx ? { 'VBtn': typeof __VLS_ctx.VBtn }: typeof __VLS_resolvedLocalAndGlobalComponents).VBtn;
const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({...{ onClick: {} as any, }, color: ("red"), disabled: ((__VLS_ctx.isSubmitting)), }));
({} as { VBtn: typeof __VLS_148 }).VBtn;
const __VLS_150 = __VLS_149({ ...{ onClick: {} as any, }, color: ("red"), disabled: ((__VLS_ctx.isSubmitting)), }, ...__VLS_functionalComponentArgsRest(__VLS_149));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_148, typeof __VLS_150> & Record<string, unknown>) => void)({ ...{ onClick: {} as any, }, color: ("red"), disabled: ((__VLS_ctx.isSubmitting)), });
const __VLS_151 = __VLS_pickFunctionalComponentCtx(__VLS_148, __VLS_150)!;
let __VLS_152!: __VLS_NormalizeEmits<typeof __VLS_151.emit>;
let __VLS_153 = { 'click': __VLS_pickEvent(__VLS_152['click'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_149, typeof __VLS_150>).onClick) };
__VLS_153 = { click: (__VLS_ctx.closeDialog) };
(__VLS_151.slots!).default;
}
{
const __VLS_154 = ({} as 'VBtn' extends keyof typeof __VLS_ctx ? { 'VBtn': typeof __VLS_ctx.VBtn }: typeof __VLS_resolvedLocalAndGlobalComponents).VBtn;
const __VLS_155 = __VLS_asFunctionalComponent(__VLS_154, new __VLS_154({...{ }, color: ("green"), type: ("submit"), loading: ((__VLS_ctx.isSubmitting)), }));
({} as { VBtn: typeof __VLS_154 }).VBtn;
const __VLS_156 = __VLS_155({ ...{ }, color: ("green"), type: ("submit"), loading: ((__VLS_ctx.isSubmitting)), }, ...__VLS_functionalComponentArgsRest(__VLS_155));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_154, typeof __VLS_156> & Record<string, unknown>) => void)({ ...{ }, color: ("green"), type: ("submit"), loading: ((__VLS_ctx.isSubmitting)), });
const __VLS_157 = __VLS_pickFunctionalComponentCtx(__VLS_154, __VLS_156)!;
let __VLS_158!: __VLS_NormalizeEmits<typeof __VLS_157.emit>;
(__VLS_157.slots!).default;
}
(__VLS_141.slots!).default;
}
(__VLS_96.slots!).default;
}
(__VLS_90.slots!).default;
}
(__VLS_85.slots!).default;
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!:{
};
// @ts-ignore
[dialog,dialog,dialog,isSubmitting,isSubmitting,isSubmitting,submit,dialogId,name,name,name,name,name,name,price,price,price,price,price,price,categories,category,category,categories,category,category,categories,category,category,sell,sell,sell,sell,sell,sell,description,description,description,description,description,description,fileRecords,rawFileRecords,fileRecords,rawFileRecords,fileRecords,rawFileRecords,fileAgent,isSubmitting,isSubmitting,isSubmitting,closeDialog,isSubmitting,isSubmitting,isSubmitting,];
return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
setup() {
return {
fileAgent: fileAgent as typeof fileAgent,
dialog: dialog as typeof dialog,
dialogId: dialogId as typeof dialogId,
openDialog: openDialog as typeof openDialog,
closeDialog: closeDialog as typeof closeDialog,
categories: categories as typeof categories,
isSubmitting: isSubmitting as typeof isSubmitting,
name: name as typeof name,
price: price as typeof price,
description: description as typeof description,
category: category as typeof category,
sell: sell as typeof sell,
fileRecords: fileRecords as typeof fileRecords,
rawFileRecords: rawFileRecords as typeof rawFileRecords,
submit: submit as typeof submit,
tableItemsPerPage: tableItemsPerPage as typeof tableItemsPerPage,
tableSortBy: tableSortBy as typeof tableSortBy,
tablePage: tablePage as typeof tablePage,
tableProducts: tableProducts as typeof tableProducts,
tableHeaders: tableHeaders as typeof tableHeaders,
tableLoading: tableLoading as typeof tableLoading,
tableItemsLength: tableItemsLength as typeof tableItemsLength,
tableSearch: tableSearch as typeof tableSearch,
tableLoadItems: tableLoadItems as typeof tableLoadItems,
};
},
});
export default (await import('vue')).defineComponent({
setup() {
return {
};
},
});
