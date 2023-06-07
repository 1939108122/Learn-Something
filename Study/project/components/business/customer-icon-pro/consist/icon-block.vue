<template>
    <div class="customer-icon-item">
        <!-- v3.62.17新增 阻断判断中图标 adviseBlockProcessStatus 1、3、4 -->
        <template v-if="origin.adviseBlockProcessStatus == 1 || origin.adviseBlockProcessStatus == 3 || origin.adviseBlockProcessStatus == 4">
            <ui-tooltip2 
                placement="bottom-start"
                appendToBody
                effect="light"
                popperClass="popper-customer-icon-blocking"
                @on-show="onShow"
                @on-hide="onHide('icon-customer-blocking')">
                <span class="icon-customer-trigger icon-customer-blocking"></span>
                <template slot="content">
                    <div class="icon-blocking-content">
                        <p class="blocking">阻断判断中...</p>
                        <div class="jump-container">
                            <span v-if="showClick">点击</span><a v-if="showClick" :href="blockUrl">{{ origin.adviseBlockProcessStatus == 3 ? '确认' : '查看' }}</a><span v-if="showClick">，</span>
                            <span>{{ blockingMap[origin.adviseBlockProcessStatus] }}</span>
                        </div>
                    </div>
                </template>
            </ui-tooltip2>
        </template>
        <template v-else>
            <!-- blockType == 1 || 2 || 3 -->
            <template 
                v-if="origin.blockShowType == 1 || 
                    (origin.blockShowType == 2 || origin.blockShowType == 3) && origin.blockTemplateConfigVO && 
                    ( origin.blockTemplateConfigVO.iconType == 1 || 
                        origin.blockTemplateConfigVO.iconType == 2 || 
                        origin.blockTemplateConfigVO.iconType == 3 || 
                        origin.blockTemplateConfigVO.iconType == 4 || 
                        origin.blockTemplateConfigVO.iconType == 6 )">
                <ui-tooltip2
                    placement="top"
                    appendToBody
                    effect="light"
                    popperClass="popper-customer-icon-simple"
                    @on-show="onShow"
                    @on-hide="onHide('icon-customer-blocking')">
                    <span :class="simpleBlockInfo.iconClassName" class="icon-customer-trigger"></span>
                    <template slot="content">
                        <div class="customer-icon-content">
                            <p class="desc">{{ simpleBlockInfo.popperContent }}</p>
                        </div>
                    </template>
                </ui-tooltip2>
            </template>
            <template v-if="origin.blockShowType > 3">
                <ui-tooltip2
                    placement="right"
                    appendToBody
                    effect="light"
                    popperClass="popper-customer-icon-block"
                    @on-show="onShow"
                    @on-hide="onHide(blockIconClassName)">
                    <span :class="blockIconClassName" class="icon-customer-trigger"></span>
                    <template slot="content">
                        <div class="block-popup">
                            <div class="title">
                                <h3>
                                    <span v-if="origin.blockShowType == 5 && origin.blockTemplateConfigVO">{{ origin.blockTemplateConfigVO.equityTypeName }}：</span>
                                    <span>{{ showName }}</span>
                                </h3>
                            </div>
                            <template v-if="origin.blockTemplateConfigVO && origin.blockTemplateConfigVO.blockAddTime">
                                <div class="block-title">阻断添加时间</div>
                                <div class="remarks" v-if="true">{{ origin.blockTemplateConfigVO.blockAddTime }}</div>
                            </template>
                            <div class="block-title">阻断规则</div>
                            <div class="remarks" v-if="origin.blockTemplateConfigVO && origin.blockTemplateConfigVO.allowOfflineWork == 0">不允许线下合作</div>
                            <div class="remarks" v-if="origin.blockTemplateConfigVO && origin.blockTemplateConfigVO.remark">{{ origin.blockTemplateConfigVO.remark }}</div>
                            <template v-if="origin.blockTemplateConfigVO && origin.blockTemplateConfigVO.onlineAccountPrice">
                                <div class="block-title">
                                    {{ origin.blockTemplateConfigVO.jobBlockType == 1 ? '线上职位价格' : '线上账号价格' }}
                                </div>
                                <div class="remarks">{{ origin.blockTemplateConfigVO.onlineAccountPrice }}</div>
                            </template>
                            <template v-if="origin.blockShowType == 5 && origin.blockTemplateConfigVO && origin.blockTemplateConfigVO.showEquityDetail">
                                <div class="block-title">权益表</div>
                                <div class="details">
                                    <table>
                                        <tr>
                                            <th width="60">权益类型</th>
                                            <th width="140">权益说明</th>
                                            <th width="60">免费账号</th>
                                            <th width="60">{{ origin.blockTemplateConfigVO && origin.blockTemplateConfigVO.jobBlockType == 1 ? '线上职位' : '线上账号' }}</th>
                                            <th width="90">线下账号</th>
                                        </tr>
                                        <tr v-for="(item, index) in ((origin.blockTemplateConfigVO || {}).equityList || [])" :key="index">
                                            <td>{{ item.detailTypeName }}</td>
                                            <td>{{ item.equityDesc }}</td>
                                            <td>{{ item.freeAccountDesc }}</td>
                                            <td>{{ item.onlineEquityDesc }}</td>
                                            <td>{{ item.offlineEquityDesc }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </template>
                        </div>
                    </template>
                </ui-tooltip2>
            </template>
        </template>
    </div>
</template>
<script>
import trackEventMixins from './track-event-mixins';

const blockingMap = {
    1: '预计需要三分钟，目前无法报价',
    3: '确认是否可以添加到建议阻断',
    4: '查询当前阻断添加进度'
};

export default {
    name: 'customer-icon-protection',
    mixins: [trackEventMixins],
    data () {
        return {
            blockingMap
        };
    },
    props: {
        origin: {
            type: Object,
            default: () => ({})
        },
    },
    computed: {
        showName () {
            let __name = '';
            if(this.origin.blockTemplateConfigVO) {
                __name = this.origin.blockTemplateConfigVO.blockShowName || this.origin.blockTemplateConfigVO.blockName || '';
            };
            return __name;
        },
        equityTypeName () {
            let __name = '';
            if(this.origin.blockTemplateConfigVO) {
                __name = this.origin.blockTemplateConfigVO.equityTypeName || '';
            };
            return __name;
        },
        blockIconClassName () {
            let __iconClassName = '';
            if(this.origin.blockTemplateConfigVO.iconType == 1) {
                __iconClassName = 'icon-super-fire';
            } 
            else if(this.origin.blockTemplateConfigVO.iconType == 2) {
                // __iconClassName = 'icon-slip-king';
                __iconClassName = 'icon-vip';
            }
            else if(this.origin.blockTemplateConfigVO.iconType == 3) {
                __iconClassName = 'icon-super-vip';
            }
            else if(this.origin.blockTemplateConfigVO.iconType == 4) {
                __iconClassName = 'icon-vip-girl';
            }
            else if(this.origin.blockTemplateConfigVO.iconType == 6) {
                __iconClassName = 'icon-common-fire';
            };
            return __iconClassName;
        },
        simpleBlockInfo () {
            let __iconClassName = '';
            let __popperContent = '';
            if(this.origin.blockShowType == 1) {
                __iconClassName = 'icon-block-unassociated';
                __popperContent = '请联系管理员关联图标';
            }
            else if(this.origin.blockShowType == 2 || this.origin.blockShowType == 3) {
                __iconClassName = this.blockIconClassName;
                __popperContent = this.origin.blockShowType == 3 ? (this.equityTypeName || this.showName) : this.showName;
            };
            return {
                iconClassName: __iconClassName,
                popperContent: __popperContent,
            };
        },
        blockUrl() {
            return `${this.$nginxPrefix}/dashboard/customer/block?tab=${this.origin.adviseBlockProcessStatus - 1}&customerName=${this.origin.name || this.origin.customerName}`;
        },
        showClick() {
            return this.origin.adviseBlockProcessStatus == 3 || this.origin.adviseBlockProcessStatus == 4;
        }
    }
};
</script>