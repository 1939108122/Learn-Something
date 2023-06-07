## 司龄组件 `CRM专用`

> 目前不支持反显数据

```vue
<template>
    <div class="test">
        <ui-select-seniority v-model="seniorityRange" />

        <ui-select-seniority v-model="seniorityRange">
            <span slot="labelPrefix">司龄</span>
        </ui-select-seniority>
    </div>
</template>

<script>
import UiSelectSeniority from '@/components/business/select-seniority';

export default {
    name: 'TEST',
    components: { UiSelectSeniority },
    data() {
        return {
            seniorityRange: []
        };
    }
};
</script>

<style lang="less" scoped></style>
```

### Attributes

| 参数                  | 说明   | 类型   | 可选值 | 默认值 |
| --------------------- | ------ | ------ | ------ | ------ |
| model-value / v-model | 绑定值 | string | —      | ''     |


### Events

| 事件名称 | 说明    | 回调参数     |
| -------- |-------|----------|
| change   | 选中的数据 | number[] |


### Slots

| name        | 说明         |
| ----------- | ------------ |
| labelPrefix | 内置表单文本 |
