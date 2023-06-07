<template>
    <!-- <div style="display: flex; align-items: center">
        <template v-for="item in switchData">
            <div v-if="item.canSwitch" :class="[expandType]" class="tree-node-expand-icon" @click.stop="expand" :key="item.id">
                <i class="icrm-triangle"></i>
            </div>
            <div v-else class="tree-switch" :class="[item.className]" :key="item.id"></div>
        </template>
    </div> -->
    <div :class="[expandType]" class="tree-node-expand-icon" @click.stop="expand" :key="item.id">
        <i class="icrm-triangle"></i>
    </div>
</template>

<script>
// import { joinTypeEnum } from '../utils/const-variable';

export default {
    name: 'TreeSwitch',
    props: {
        item: {
            type: Object,
            required: true,
        },
        idKey: {
            type: String,
            default: 'id',
        },
    },
    computed: {
        // switchData() {
        //     const result = [];
        //     for (let i = 0; i < this.item.deep; i++) {
        //         const item = {
        //             id: Math.random(),
        //             // switchButton: '',
        //             canSwitch: false,
        //             className: '',
        //         };
        //         if (i === this.item.deep - 1) {
        //             // 大于1是枝节点
        //             if (this.item.rNode - this.item.lNode > 1) {
        //                 // item.switchButton = 'switch-button';
        //                 item.canSwitch = true;
        //                 if (result.length >= 1) {
        //                     result[result.length - 1].className = 'line-join';
        //                 }
        //             } else {
        //                 item.canSwitch = false;
        //                 // 其他是叶节点
        //                 if (this.item.joinType === joinTypeEnum.start) {
        //                     item.className = this.item.lNode === 0 ? 'line-top' : 'line-join';
        //                 } else if (this.item.joinType === joinTypeEnum.center) {
        //                     item.className = 'line-join';
        //                 } else {
        //                     item.className = 'line-bottom';
        //                 }

        //                 result.pop();
        //             }
        //         } else {
        //             const hole = this.item.hole;
        //             if (hole.indexOf(`[${i + 1}]`) !== -1) {
        //                 item.className = '';
        //             } else {
        //                 item.className = 'line';
        //             }
        //         }
        //         result.push(item);
        //     }
        //     return result;
        // },
        expandType() {
            return this.item.expand ? 'expand' : '';
        },
    },
    methods: {
        expand() {
            this.$emit('expand', { item: this.item });
        },
    },
};
</script>

<style lang="less" scoped>
.tree-node-expand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
        background-color: #E4E8F0;
    }
    .icrm-triangle {
        font-size: 16px;
        color: #363F55;
        transform: rotate(-90deg);
        transition: all .28s;
    }
    &.expand {
        .icrm-triangle {
            transform: rotate(0deg);
        }
    }
}
// .tree-switch {
//   height: 20px;
//   width: 20px;
//   object-fit: cover;
//   position: relative;
//   &.line {
//     &::before {
//         content: '';
//         position: absolute;
//         top: -8px;
//         bottom: -8px;
//         left: calc(~"50% - 1px");
//         border-left: 1px dotted #D3D8E6;
//     }
//   }
//   &.line-bottom {
//     &::before {
//         content: '';
//         position: absolute;
//         top: -8px;
//         bottom: 10px;
//         left: calc(~"50% - 1px");
//         border-left: 1px dotted #D3D8E6;
//     }
//     &::after {
//         content: '';
//         position: absolute;
//         top: 50%;
//         right: 0;
//         left: 10px;
//         border-top: 1px dotted #D3D8E6;
//     }
//   }
//   &.line-join {
//     &::before {
//         content: '';
//         position: absolute;
//         top: -8px;
//         bottom: -8px;
//         left: calc(~"50% - 1px");
//         border-left: 1px dotted #D3D8E6;
//     }
//     &::after {
//         content: '';
//         position: absolute;
//         top: 50%;
//         right: 0;
//         left: 10px;
//         border-top: 1px dotted #D3D8E6;
//     }
//   }
//   &.line-top {
//     &::before {
//         content: '';
//         position: absolute;
//         top: 10px;
//         bottom: -8px;
//         left: calc(~"50% - 1px");
//         border-left: 1px dotted #D3D8E6;
//     }
//     &::after {
//         content: '';
//         position: absolute;
//         top: 50%;
//         right: 0;
//         left: 10px;
//         border-top: 1px dotted #D3D8E6;
//     }
//   }
// }
</style>
