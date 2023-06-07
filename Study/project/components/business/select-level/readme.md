## 员工级别组件 `CRM专用`

> 目前不支持反显数据

```vue
<template>
    <div class="test">
        <ui-select-level v-model="userLevel" />

        <ui-select-level v-model="userLevel">
            <span slot="labelPrefix">员工级别</span>
        </ui-select-level>
    </div>
</template>

<script>
import UiSelectLevel from '@/components/business/select-level';

export default {
    name: 'TEST',
    components: { UiSelectLevel },
    data() {
        return {
            userLevel: ''
        };
    }
};
</script>

<style lang="less" scoped></style>
```

### Attributes

| 参数                  | 说明   | 类型   | 可选值 | 默认值 |
| --------------------- | ------ | ------ | ------ | ----- |
| model-value / v-model | 绑定值 | string | —      | ''      |

### Events

| 事件名称 | 说明             | 回调参数 |
| -------- | ---------------- | -------- |
| change   | 选中的树节点数据 | -        |

### Slots

| name   | 说明     |
|--------|--------|
| labelPrefix | 内置表单文本 |
