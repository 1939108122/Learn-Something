<template>
    <ul class="select-option-group">
        <div>
            <li class="select-option-group-label">{{label}}</li>
            <slot></slot>
            <li class="select-option-group-line"></li>
        </div>
    </ul>
</template>
<script>

export default {
    name: 'SelectOptionGroup',
    props: {
        label: {
            type: String,
            default: ''
        }
    }
};
</script>
<style lang='less' scoped>
.select-option-group {
    .select-option-group-label {
        padding: 8px;
        color: #a4a7ac;
    }
    .select-option-group-line {
        height: 1px;
        background: #dbdbdc;
        margin: 24px 8px;
    }
}
</style>