<template>
    <div class="select-search">
        <template v-if="isV2">
            <ui-select2 v-bind="$attrs" v-on="$listeners" @on-query-change="onQueryChange">
                <span slot="labelPrefix" v-if="labelPrefixName">{{ labelPrefixName }}</span>
                <ui-option2 v-for="(item, index) in optionsComputed" :key="index" :value="item[props.value]">{{
                    item[props.label]
                }}</ui-option2>
            </ui-select2>
        </template>

        <template v-else>
            <ui-select v-bind="$attrs" v-on="$listeners" @on-query-change="onQueryChange">
                <span slot="labelPrefix" v-if="labelPrefixName">{{ labelPrefixName }}</span>
                <ui-option v-for="(item, index) in optionsComputed" :key="index" :value="item[props.value]">{{
                        item[props.label]
                    }}</ui-option>
            </ui-select>
        </template>
    </div>
</template>

<script>
export default {
    name: 'SelectSearch', // 前端筛选
    props: {
        // 是否使用的是 ui-select2
        isV2: {
            type: Boolean,
            default: false
        },
        labelPrefixName: {
            type: String
        },
        sourceList: {
            type: Array,
            default: () => []
        },
        props: {
            type: Object,
            default: () => ({
                label: 'label',
                value: 'value'
            })
        },
        // needDefaultList: {
        //     type: Boolean,
        //     default: true
        // },
        maxOptionLength: {
            type: Number,
            default: 30
        }
    },
    data() {
        return {
            queryStr: ''
        };
    },
    computed: {
        // 根据筛选词动态计算的下拉数据
        optionsComputed() {
            if (this.queryStr) {
                return this.sourceList
                    ?.filter((item) => item?.[this.props.label]?.includes(this.queryStr))
                    ?.slice(0, this.maxOptionLength); // eslint-disable-line
            }
            return this.sourceList.slice(0, this.maxOptionLength);
        }
    },
    methods: {
        onQueryChange(queryStr) {
            this.queryStr = queryStr;
        }
    }
};
</script>
