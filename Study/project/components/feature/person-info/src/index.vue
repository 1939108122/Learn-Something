<template>
    <div class="person-info">
        <ui-tooltip
            :class="tooltipsClass"
            :wrapClass="wrapClassAll"
            :placement="placement"
            :trigger="trigger"
            :theme="theme"
            :width="width"
            :appendToBody="isAppendToBody">
            <span slot="reference" :class="referenceClassAll">
                {{ userName || '--'}}
                <span v-if="level">-{{ level }}</span>
            </span>
            <ul slot="content" v-if="userName">
                <li>{{ deptName }}</li>
                <li>{{ userEmail }}</li>
            </ul>
        </ui-tooltip>
    </div>
</template>
<script>
export default {
    name: 'personInfo',
    props: {
        userName: {
            type: String,
            default: ''
        },
        level: {
            type: String,
            default: ''
        },
        deptName: {
            type: String,
            default: ''
        },
        userEmail: {
            type: String,
            default: ''
        },
        trigger: {
            type: String,
            default: 'hover'
        },
        placement: {
            type: String,
            default: 'top'
        },
        theme: {
            type: String,
            default: 'dark'
        },
        width: {
            type: String,
            default: '200'
        },
        isAppendToBody: {
            type: Boolean,
            default: false
        },
        wrapClass: {
            type: String,
            default: ''
        },
        tooltipsClass: {
            type: String,
            default: ''
        },
        referenceClass: {
            type: String,
            default: ''
        }
    },
    computed: {
        wrapClassAll() {
            return `comp-wrap-class ${this.wrapClass}`;
        },
        referenceClassAll() {
            return `reference-class ${this.referenceClass}`;
        }
    }
};
</script>
<style lang="less" scoped>
    .person-info {
        display: inline-block;
        .reference-class {
            cursor: default;
        }
    }
</style>
<style lang="less">
    .comp-wrap-class.popover-wrap {
        z-index: 1200;
        .popover-content {
            li {
                text-align: left;
                color: #fff;
            }
        }
    }
</style>
