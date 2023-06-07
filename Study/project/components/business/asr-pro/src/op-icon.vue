<template>
    <div :class="['op-icon', type]">
        <i :class="['inner', type]"></i>
    </div>
</template>

<script>
export default {
    name: 'op-icon',
    props: {
        type: {
            type: String,
            required: true,
            validator: val => {
                return ['edit', 'mark'].includes(val);
            }
        }
    }
};
</script>

<style lang="less" scoped>
.op-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: 4px;
    margin: 0 4px 0 8px;
    cursor: pointer;

    .inner {
        display: inline-block;
        width: 16px;
        height: 16px;
        &.edit {
            background: url('./svg/edit.svg');
        }

        &.mark {
            background: url('./svg/mark.svg');
        }
    }

    &:hover {
        background: #e4e8f0;
        .inner {
            &.edit {
                background: url('./svg/edit-active.svg');
            }
            &.mark {
                background: url('./svg/mark-active.svg');
            }
        }
    }
}
</style>
