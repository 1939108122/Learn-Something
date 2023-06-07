<template>
    <div class="address-select-content-box">
        <ui-cascader :data="options" v-model="cascaderValue" @on-change="change"></ui-cascader>
    </div>
</template>

<script>
import storage from '@/utils/tools/localstorage';
const formatData = val => {
    let _val = val || [];

    let arr = _val.map(item => {
        item.value = item.code;
        item.label = item.name;
        if ((item.subLevelModelList || []).length) {
            item.children = formatData(item.subLevelModelList);
        }

        return item;
    });

    return arr;
};
export default {
    name: 'address-select',
    data(){
        return {
            cascaderValue: [],
            options: []
        };
    },
    props: {
        value: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    watch: {
        value: {
            handler (val) {
                if (val) {
                    this.cascaderValue = JSON.parse(JSON.stringify(val));
                }
            },
            deep: true,
            immediate: true
        }
    },
    created() {
        this.getAllCity();
    },
    methods: {
        change (currentValue, arr) {
            this.$emit('input', currentValue);
            this.$emit('selectValue', arr);
        },
        getAllCity () {
            let cityStorage = JSON.parse(storage.get('globalCityList') || '{"timeStamp":0}');
            let oneDay = 24 * 60 * 60 * 1000;

            let vm = this;

            let initLst = (root) => {
                vm.options = formatData(root);
            };

            if (Date.now() - cityStorage.timeStamp > oneDay || !cityStorage.root) {
                vm.$ajax({
                    url: '/config/allcity.json',
                    method: 'GET'
                }).then(({success, root, code, data}) => {
                    storage.set('globalCityList', JSON.stringify({
                        timeStamp: Date.now(),
                        root
                    }));
                    initLst(root);
                });
            } else {
                initLst(cityStorage.root);
            }
        }
    }
};

</script>
<style lang="less">
.address-select-content-box{
    display: inline-block;
    .ui-select{
        min-width: 0;
        width: 130px;
    }
    // .hasNoSelect{
    //     .ui-select-placeholder{
    //         color: #414A60 !important;
    //     }
    // }
}
</style>