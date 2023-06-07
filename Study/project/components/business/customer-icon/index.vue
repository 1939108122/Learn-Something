<template>
    <div class="inner_customer-icon-tootips-box" v-if="list.length">
        <span v-for="(item, index) in list" :key="index" class="icon-item">
            <ui-tooltip2
                v-if="!item.showTable"
                placement="top"
                appendToBody
                effect="light"
                :key="item.timeStamp"
                popperClass="inner_customer-icon-single-dialog"
                @on-show="onShow(item)"
                @on-hide="onHide(item)">
                <!-- 自定义图标 -->
                <span 
                    v-if="item.type == 'customTag'" 
                    :name="item.nameProps || item.name" 
                    :class="item.iconClass"
                    :style="{'background-image': 'url('+ item. iconUrl +')'} "></span>
                <!-- 目前只有：经营状态一种 -->
                <span 
                    v-else-if="item.htmlStr" 
                    v-html="item.htmlStr"></span>
                <!-- 通用 -->
                <span 
                    v-else 
                    :class="item.iconClass" 
                    class="block-icon-box"></span>
                <div slot="content">
                    <template v-if="item.type === 'blocking'">
                        <div class="icon-blocking-content">
                            <p class="blocking">{{ item.name }}</p>
                            <div class="jump-container">
                                <span v-if="item.href">点击</span><a v-if="item.href" :href="item.href">{{ item.hrefStr }}</a><span v-if="item.href">，</span>
                                <span>{{ item.blockingStr }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <span>{{item.name}}</span>
                        <p v-if="item.addTime" class="_tooltip-remark">添加时间：{{item.addTime}}</p>
                        <p v-if="item.remark1" class="_tooltip-remark">{{item.remark1}}</p>
                        <p v-if="item.remark2" class="_tooltip-remark">{{item.remark2}}</p>
                    </template>
                </div>
            </ui-tooltip2>
            <!-- 集采（询价保护）和阻断 -->
            <ui-tooltip2
                v-else
                :key="item.timeStamp"
                effect="light"
                :placement="placement"
                appendToBody
                popperClass="inner_customer-icon-tootips-box-dialog"
                @on-show="onShow(item)"
                @on-hide="onHide(item)">
                <span :class="item.iconClass" class="block-icon-box"></span>
                <div slot="content" class="block-content" :class="[item.showTable == 'table' ? 'block-content' : 'protection-content']">
                    <template v-if="item.showTable == 'table'">
                        <div class="_custom-block-common-fire">
                            <div class="tooltip-title">
                                <h3>
                                    {{(inner_customer || {}).blockShowType == 5 ? ((inner_customer || {}).blockTemplateConfigVO || {}).equityTypeName + '：' : ''}}{{((inner_customer || {}).blockTemplateConfigVO || {}).blockShowName ? ((inner_customer || {}).blockTemplateConfigVO || {}).blockShowName : ((inner_customer || {}).blockTemplateConfigVO || {}).blockName}}
                                </h3>
                            </div>
                            <template v-if="((inner_customer || {}).blockTemplateConfigVO || {}).blockAddTime">
                                <p class="block-title">
                                    <span></span>阻断添加时间
                                </p>
                                <div class="remarks">
                                    <p>{{ ((inner_customer || {}).blockTemplateConfigVO || {}).blockAddTime }}</p>
                                </div>
                            </template>
                            <p class="block-title">
                                <span></span>阻断规则
                            </p>
                            <div class="remarks">
                                <p v-if="((inner_customer || {}).blockTemplateConfigVO || {}).allowOfflineWork === 0" v-html="['不', ''][((inner_customer || {}).blockTemplateConfigVO || {}).allowOfflineWork] + '允许线下合作'"></p>
                                <p v-html="((inner_customer || {}).blockTemplateConfigVO || {}).remark"></p>
                            </div>
                            <template v-if="((inner_customer || {}).blockTemplateConfigVO || {}).onlineAccountPrice">
                                <p class="block-title">
                                    <span></span>线上{{((inner_customer || {}).blockTemplateConfigVO || {}).jobBlockType === 0 ?'账号价格':'职位价格'}}
                                </p>
                                <div class="remarks">
                                    <p v-html="((inner_customer || {}).blockTemplateConfigVO || {}).onlineAccountPrice"></p>
                                </div>
                            </template>
                            <p class="block-title">
                                <span></span>权益表
                            </p>
                            <ui-table style="margin: 0;">
                                <thead slot="header">
                                    <tr>
                                        <th width="">权益类型</th>
                                        <th width="170">权益说明</th>
                                        <th width="">免费账号</th>
                                        <th width="">{{((inner_customer || {}).blockTemplateConfigVO || {}).jobBlockType === 0 ?'线上账号':'线上职位'}}</th>
                                        <th width="">线下账号</th>
                                    </tr>
                                </thead>
                                <tbody slot="body" v-html="formatHtml(((inner_customer || {}).blockTemplateConfigVO || {}).equityList)"></tbody>
                            </ui-table>
                        </div>
                    </template>
                    <template v-else>
                        <div class="tooltip-title">
                            <h3>{{((inner_customer || {}).priceProtectionDO || {}).protectType == 1 ? "集采" : ""}}询价保护客户</h3>
                        </div>
                        <div class="sub-content" :style="{'width': !((inner_customer || {}).priceProtectionDO || {}).remarks || ((inner_customer || {}).priceProtectionDO || {}).remarks == '' ? 'auto' : 'auto'}">
                            <p>{{((inner_customer || {}).priceProtectionDO || {}).customerName}}申请了询价保护
                                <span v-if="(inner_customer || {}).name != ((inner_customer || {}).priceProtectionDO || {}).customerName">
                                ，当前客户与{{((inner_customer || {}).priceProtectionDO || {}).customerName}}存在关联关系，请按以下价格方案统一报价！</span>
                                保护期截止为:<i class="red">{{getDate(((inner_customer || {}).priceProtectionDO || {}).endTime)}}</i>，还剩
                                <i class="red">{{(inner_customer || {}).protectionDays}}</i>天。</p>
                            <p v-if="((inner_customer || {}).priceProtectionDO || {}).protectType == 1" class="sub c-green">集采续约周期：{{ getFormatCycleText(((inner_customer || {}).priceProtectionDO || {}).endTime) }}</p>
                        </div>
                        <div class="content" :class="{'no-remarks': !((inner_customer || {}).priceProtectionDO || {}).remarks || ((inner_customer || {}).priceProtectionDO || {}).remarks == ''}">
                            <div class="chunk" >
                                <ui-table style="margin: 0;">
                                    <thead slot="header">
                                        <tr>
                                            <th width="70">产品名称</th>
                                            <th width="70">产品价格</th>
                                        </tr>
                                    </thead>
                                    <tbody slot="body">
                                        <tr v-for="(item, index) in ((inner_customer || {}).priceProtectionDO || {}).priceProtectionProductDOs" :key="index">
                                            <td width="70">{{item.productName}}</td>
                                            <td width="70">{{item.productDesc}}</td>
                                        </tr>
                                    </tbody>
                                </ui-table>
                            </div>
                            <div v-if="((inner_customer || {}).priceProtectionDO || {}).remarks" class="chunk">
                                <div class="desc">
                                    <p class="t">备注</p>
                                    <p  class="remark" v-html="((inner_customer || {}).priceProtectionDO || {}).remarks"></p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </ui-tooltip2>
        </span>
    </div>
</template>

<script>
/**
 * 
    1、详情页面
    customerId 必传
    isDetail 必传
    其他参数不需要
    <customerIcon :isDetail="true" :customerId="'9fbc562f1095911b0Xd-2tm1'"></customerIcon>

    2、列表页面
    customer 必传，图标信息
    <customerIcon :customer="{}"></customerIcon>
 */

import { formatDate } from '@/utils/tools/utils.js';

export default {
    name: 'CustomerIcon',
    data() {
        return {
            inner_customer: {},
            list: [], // 展示图标的列表

            blockingMap: {
                1: '预计需要三分钟，目前无法报价',
                3: '确认是否可以添加到建议阻断',
                4: '查询当前阻断添加进度'
            },
            levelMap: ['S', 'A', 'B', 'C', 'D'],
        };
    },
    props: {
        customer: {
            type: Object,
            default: () => {}
        },
        placement: {
            type: String,
            default: 'right'
        },
        url: {
            type: String,
            default: '/customer/icon.json'
        },
        customerId: { // TODO 默认 空,
            type: String,
            default: ''
        },
        isDetail: {
            type: Boolean, // TODO 详情中是 true
            default: false,
        },
        //是否显示 成单概率 高（中低）
        showRecruitLevel: {
            type: Boolean,
            default: false,
        },
        //是否显示 好望角客户
        showCape: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        onShow (item) {
            item.trackEventStartTime = Date.now(); // 记录点击时间
        },
        onHide (item) {
            const trackEventEndTime = Date.now();
            const duration = trackEventEndTime - item.trackEventStartTime;

            // 小于200ms 不上报
            if (duration < 200) return;

            const __duration = (duration / 1000).toFixed(1);
            const options = {
                p1: this.$store.state.user.userInfo.userId, // userid
                p2: this.customer?.customerId || this.customerId, // 客户id
                p3: item.customTrackEventName || item.nameProps || item.iconClass ||  item.name, // 标签名称
                p4: formatDate(new Date(item.trackEventStartTime), 'yyyy-MM-dd HH:mm:ss'), // 触发hover的时间
                p5: __duration, // 停留时长
            };

            this.$BossAnalytics.track('crm-customer-icon-hover', {
                ...options,
            });
        },
        triggerEvent (name) {
            if (name && typeof this[name] == 'function') {
                this[name]();
            }
        },
        feedback() {
            // 经营反馈
            // 调用经营状态反馈的功能 暂时下掉，后期可转为custmer-icon-pro 组件
            // {
            //     customerId: this.inner_customer.encryptId,
            //     dept: this.inner_customer.deptName,
            //     user: this.inner_customer.userName,
            //     email: this.inner_customer.userEmail,
            //     curCompanyStatus: (this.inner_customer.customerJerusalemDO || {}).operatingStateCode || ''
            // }
        },
        getFormatCycleText (time) {
            let str = ''; //YYYY-MM-DD至YYYY-MM-DD
            if(time) {
                const endTime = new Date(time);
                const y = endTime.getFullYear();
                const m = endTime.getMonth();
                const d = endTime.getDate();

                const startDate = new Date(y, m - 3, d);
                const endDate = new Date(y, m + 2, d);

                str = `${formatDate(startDate)} 至 ${formatDate(endDate)}`;
            };
            return str;
        },
        getDate(date) {
            return Number(date) ? formatDate(new Date(Number(date))) : date;
        },
        formatHtml (list)  {
            return (list || []).map(item => {
                // TODO 暂时先去掉空数据过滤 2.98
                // if (item.freeAccountDesc || item.onlineEquityDesc || item.offlineEquityDesc) {
                return `<tr>
                    <td>${item.detailTypeName}</td>
                    <td>${item.equityDesc}</td>
                    <td>${item.freeAccountDesc === null ? '' : item.freeAccountDesc}</td>
                    <td>${item.onlineEquityDesc === null ? '' : item.onlineEquityDesc}</td>
                    <td>${item.offlineEquityDesc === null ? '' : item.offlineEquityDesc}</td>
                </tr>`;
            }).join('');
        },
        getInfo () {
            this.$ajax({
                method: 'GET',
                url: this.url,
                params: {
                    customerId: this.customerId
                }
            }).then( ({code, data}) => {
                if (code == 1) {
                    this.inner_customer = JSON.parse(JSON.stringify(data || {}));
                }
            });
        },
        // 阻断阻断中图标需要跳转的url
        blockUrl(val) {
            if(val.adviseBlockProcessStatus == 3 || val.adviseBlockProcessStatus == 4) {
                return `${this.$nginxPrefix}/dashboard/customer/block?tab=${val.adviseBlockProcessStatus - 1}&customerName=${val.name || val.customerName}`;
            } else {
                return '';
            }
        },
    },
    watch: {
        customerId: {
            handler (val) {
                if (val) {
                    this.getInfo();
                }
            },
            immediate: true
        },
        customer: {
            handler (val) {
                if (val) {
                    this.inner_customer = val || {};
                }
            },
            immediate: true
        },
        inner_customer: {
            handler (val) {
                if (val) {

                    let list = [];
                    let timeStamp = Date.now();

                    if (val.fromClue > 0 && val.fromClue != 3) {
                        list.push({
                            iconClass: 'icon-slip-clue',
                            name: '线索客户',
                            timeStamp
                        });

                        timeStamp += 100;
                    };

                    if (val.recruitLevel > 0 && this.showRecruitLevel) {
                        let num = val.recruitLevel | 0;
                        switch (num) {
                            case 1:
                                list.push({
                                    iconClass: 'icon-slip-middle',
                                    name: '成单概率中，成单率是其他客户的2倍',
                                    timeStamp
                                });
                                timeStamp += 100;
                                break;
                            case 2:
                                list.push({
                                    iconClass: 'icon-slip-high',
                                    name: '成单概率高，成单率是其他客户的7倍',
                                    timeStamp
                                });

                                timeStamp += 100;
                                break;
                            default: break;
                        }
                    };

                    if (val.busiHightQuality == 1) {
                        list.push({
                            iconClass: 'icon-slip-excellent',
                            name: '优质客户成单率是其他客户的3倍',
                            timeStamp
                        });
                    };

                    // v3.62.17新增 阻断判断中图标
                    if(val.adviseBlockProcessStatus == 1 || val.adviseBlockProcessStatus == 3 || val.adviseBlockProcessStatus == 4) {
                        list.push({
                            iconClass: 'icon-customer-blocking',
                            name: '阻断判断中...',
                            timeStamp,
                            href: this.blockUrl(val),
                            hrefStr: val.adviseBlockProcessStatus == 3 ? '确认' : '查看',
                            type: 'blocking',
                            blockingStr: this.blockingMap[val.adviseBlockProcessStatus],
                        });
                        timeStamp += 100;

                    } else {
                        if (val.blockTemplateConfigVO && val.blockShowType != 1) {
                            let num = val.blockTemplateConfigVO.iconType | 0;
                            let showTable = val.blockShowType > 3  && val.blockTemplateConfigVO ? 'table': false;

                            let filterName = (str) => {
                                let _name = val.blockTemplateConfigVO.blockShowName? val.blockTemplateConfigVO.blockShowName :val.blockTemplateConfigVO.blockName;
                                if (val.blockShowType == 3) {
                                    return `${str}：${_name}`;
                                } else if (val.blockShowType == 2) {
                                    return _name;
                                } else {
                                    return str;
                                }
                            };

                            switch (num) {
                                case 1 :
                                    list.push({
                                        iconClass: 'icon-super-fire',
                                        name: filterName('超火'),
                                        showTable,
                                        timeStamp
                                    });

                                    timeStamp += 100;
                                    break;
                                case 2:
                                    list.push({
                                        iconClass: 'icon-vip',
                                        name: filterName('vip'),
                                        showTable,
                                        timeStamp
                                    });

                                    timeStamp += 100;
                                    break;
                                case 3:
                                    list.push({
                                        iconClass: 'icon-super-vip',
                                        name: filterName('超级vip'),
                                        showTable,
                                        timeStamp
                                    });

                                    timeStamp += 100;
                                    break;
                                case 4:
                                    list.push({
                                        iconClass: 'icon-vip-girl',
                                        name: filterName('vip3'),
                                        showTable,
                                        timeStamp
                                    });

                                    timeStamp += 100;
                                    break;
                                case 6 :
                                    if (this.isDetail) {
                                        list.push({
                                            iconClass: 'icon-common-fire',
                                            name: filterName('普火'),
                                            showTable
                                        });
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    };

                    if (val.level && this.levelMap.includes(val.level)) {
                        list.push({
                            iconClass: `icon-slip-${val.level.toLowerCase()}}`,
                            name: `客户级别${val.level}`,
                            timeStamp
                        });
                        timeStamp += 100;
                    };

                    if (val.isMerge == 1) {
                        list.push({
                            iconClass: 'icon-grid-merge',
                            name: '合并客户',
                            timeStamp
                        });
                        timeStamp += 100;
                    };

                    if ((val || {}).priceProtectionDO && Object.keys((val.priceProtectionDO || {})).length) {

                        let priceProtection = val.priceProtectionDO;
                        const showTable = 'table-des';

                        switch (String(priceProtection.protectType)) {
                            case '1':
                                list.push({
                                    iconClass: 'icon-collect',
                                    name: '集采客户',
                                    showTable,
                                    timeStamp
                                });
                                timeStamp += 100;
                                break;
                            case '2':
                                list.push({
                                    iconClass: 'icon-price-protect',
                                    name: '询价保护',
                                    showTable,
                                    timeStamp
                                });
                                timeStamp += 100;
                                break;
                        }
                    };

                    // 好望角客户
                    if(this.showCape || this.isDetail) {
                        if (val.cape == 1) {
                            list.push({
                                iconClass: 'icon-cape',
                                name: '好望角客户',
                            });
                        }
                    };

                    if (this.isDetail) {
                        if (val.competitionAdType == 1) {
                            list.push({
                                iconClass: 'icon-bidding-products',
                                name: '竞品中标',
                            });
                        }
                        if (val.swap == 1) {
                            list.push({
                                iconClass: 'icon-exchange',
                                name: '置换',
                            });
                        }
                    };

                    // 阻断判断中 和 “待” 不能同时出现
                    if ((val.blockShowType == 1 || val.iconType == 0) && val.adviseBlockProcessStatus && (val.adviseBlockProcessStatus != 1 && val.adviseBlockProcessStatus != 3 && val.adviseBlockProcessStatus != 4)) {
                        list.push({
                            iconClass: 'icon-block-unassociated',
                            name: '请联系管理员关联图标',
                            timeStamp
                        });
                        timeStamp += 100;
                    };

                    if (this.isDetail) {
                        if (val.black) {
                            list.push({
                                iconClass: 'icon-inner_customer-black', // icon-customer-x
                                name: 'X客户',
                                customTrackEventName: 'icon-customer-x',
                            });
                        }
                        if (val.singleRemindDept) {
                            list.push({
                                iconClass: 'icon-bell',
                                name: `此客户相关的询价保护客户或疑似关联客户已成单，了解签单情况，请联系${val.singleRemindDept}${val.singleRemindUser}`,
                            });
                        }
                        if (val.customerJerusalemDO) {
                            if ((val.customerJerusalemDO || {}).economicType && (val.customerJerusalemDO || {}).economicType == '个体工商户') {
                                list.push({
                                    iconClass: 'icon-customer-individual',
                                    name: '基于运营策略的调整，平台暂不支持个体工商户发布任何工作地点与其营业执照经营场所不在同一城市的职位',
                                });
                            }

                            // error / warning
                            list.push({
                                htmlStr: `<span class="slip-title-bulb ${val.customerJerusalemDO.operatingStateClass || ''}"><i class="icrm-bulb"></i> 经营状态:${val.customerJerusalemDO.operatingState}<span>`,
                                name: `${val.customerJerusalemDO.operatingStateTxt}`,
                                customTrackEventName: 'operating-state', // 埋点类型
                            });
                        }
                        if (val.safeProcessing) {
                            list.push({
                                iconClass: 'icon-customer-safe-audit',
                                name: `此客户正在进行安全审核`,
                            });
                        }

                        if (val.ironManTag == 2) {
                            list.push({
                                iconClass: 'icon-customer-tie',
                                name: '指被铁壁明访过，但不是人资、派遣类公司',
                            });
                        }

                        if (val.ironCustomerTag && Object.keys(val.ironCustomerTag || {}).length) {
                            let name = val.ironCustomerTag.addV ? `此客户于${val.ironCustomerTag.addTimeStr}被判定为人资/派遣类客户，且已被铁壁拜访过。请按人资要求及指定阻断合作，业绩按人资/派遣类规则核算`: `此客户于${val.ironCustomerTag.addTimeStr}被判定为人资/派遣类客户，请按人资要求及指定阻断合作，业绩按人资/派遣类规则核算。`;
                            list.push({
                                iconClass: val.ironCustomerTag.addV ? 'icon-customer-human-vip' : 'icon-customer-human',
                                name,
                            });
                        }
                    }

                    if(val.customerTagVOS && val.customerTagVOS.length) {
                        val.customerTagVOS.map((item, idx) => {
                            list.push({
                                type: 'customTag',
                                iconClass:  'block-icon-box icon-img',
                                name: item.tagDesc,
                                nameProps: item.name,
                                iconUrl: item.iconUrl,
                                remark1: item.customerRemark,
                                remark2: item.customerRemarkTwo,
                                timeStamp,
                                addTime: item.showAddTime ? item.addTime : '',
                            });

                            timeStamp += 100;
                        });
                    }

                    // 最多展示4个图标
                    this.list = [...list];
                    if(list.length >= 4 &&  !this.isDetail) {
                        this.list = list.slice(0, 4);
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
};
</script>

<style lang="less">
.inner_customer-icon-tootips-box {
    display: inline-flex;
    height: 18px;
    .block-icon-box {
        display: inline-block;
        margin-right: 4px;
        vertical-align: middle;
    }
    .icon-item {
        display: inline-flex;
    }
    .icon-item:last-child {
        & .block-icon-box {
            margin-right: 0;
        }
    }
    &.no-feedback .icrm-fankui {
        display: none;
    }
    .ui-tooltip{
        cursor: default;
    }
    .icon-inner_customer-black{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(../../../assets/images/icon-x.png) no-repeat;
        background-size: 18px auto;
        vertical-align: middle;
        margin-top: 0;
    }
    .icon-img {
        width: 18px;
        height: 18px;
        display: inline-block;
        background-size: cover;
        border-radius: 3px;
        // 特殊处理高++自定义图标，非常规尺寸，32*18
        &[name="高++"] {
            width: 32px;
        }
        &[name="高+"] {
            width: 25px;
        }
    }
    .icrm-individual {
        font-size: 18px;
        color: #53CAC3;
    }
    .icon-text-jie {
        background-color: #33b4e7;
    }
    .icon-text-jie::after{
        content: '介';
    }
    .icon-text-sign {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        display: inline-block;
        text-align: center;
        line-height: 14px !important;
        vertical-align: middle;
    }
    .icon-text-sign::after {
        display: inline-block;
        font-size: 12px;
        // transform: scale(0.9);
        color: #ffffff;
        text-align: center;
    }
    .icon-text-tie {
        background-color: rgb(255, 165, 92);
    }
    .icon-text-tie::after{
        content: '铁';
        position: relative;
        top: 0px;
        display: inline-block;
        line-height: 20px;
    }
    .human-resource {
        width: 18px;
        height: 18px;
        display: inline-block;
        background: url(../../../assets/images/renzi.png);
        background-size: cover;
    }
    .human-resource-vip {
        width: 20px;
        height: 20px;
        display: inline-block;
        background: url(../../../assets/images/renziVIP.png);
        background-size: cover;
    }
    .icrm-aaum {
        display: inline-block;
        line-height: 18px;
        font-size: 18px;
        color: #53CAC3;
        vertical-align: middle;
    }
    .slip-title-bulb {
        position: relative;
        display: inline-block;
        padding: 1px 4px 0;
        margin-right: 5px;
        line-height: 16px;
        background:rgba(203, 239, 237, 0.3);
        font-size: 12px;
        color: #828A9E;
        border: 1px solid #53CAC3;
        border-radius: 3px;
        vertical-align: top;
    }
    .slip-title-bulb.error {
        border-color: #FD7F83;
        background: rgba(253, 127, 131, 0.2);
    }
    .slip-title-bulb.error .icrm-bulb {
        color: #FD7F83;
    }
    .slip-title-bulb.warning {
        border-color: #FFC98A;
        background: rgba(255, 203, 147, 0.15);
    }
    .slip-title-bulb.warning .icrm-bulb {
        color: #FFCB93;
    }
    .slip-title-bulb .icrm-bulb {
        display: inline-block;
        width: 8px;
        margin-right: 6px;
        margin-top: -1px;
        font-size: 17px;
        color: #53CAC3;
        vertical-align: middle;
    }
    .icrm-fankui {
        line-height: 16px;
        font-size: 16px;
        color: #53CAC3;
        // vertical-align: middle;
    }
    .icrm-safe-audit{
        // display: inline-block;
        // vertical-align: middle;
        font-size: 18px;
        color: rgb(42, 107, 212);
    }
    .icrm-high-quality-customers{
        margin-top: -1px;
        color: #EE8686;
        font-size: 18px;
    }
}
._tooltip-remark{
    font-size: 12px;
    color: #a0a4b1;
}
.inner_customer-icon-tootips-box-dialog {
    border: none;
    width: 580px;
    box-shadow: -1px 2px 15px rgba(0, 0, 0, .2);
    .tooltip-title {
        font-size: 18px;
        margin-bottom: 10px;
    }
    .table-header {
        width: 100% !important;
    }
    .content {
        display: flex;
        padding: 9px 0;
        margin-top: 10px;
        .chunk {
            position: relative;
            margin-right: 20px;
            max-height: 267px;
            &:last-of-type {
                margin-right: 0;
            }
            &+.chunk:before {
                content: '';
                position: absolute;
                left: -10px;
                top: 10px;
                bottom: 0;
                width: 1px;
                background: #eceff1;
            }
            .ui-table {
                display: block;
                padding: 0;
                min-width: auto;
                width: 281px;
                max-height: 245px;
                overflow: auto;
                margin-top: 10px;
            }
            .desc {
                // width: 288px;
                padding: 6px 10px;
                max-height: 245px;
                font-size: 12px;
                color: #a0a4b1;
                border: 1px solid #eceff1;
                border-radius: 4px;
                overflow: auto;
                word-wrap: break-word;
                word-break: break-all;
                .t {
                    line-height: 20px;
                    color: #414a60;
                    font-weight: 500;
                }
                .remark {
                    color: #a0a4b1;
                }
            }
        }
    }
    .no-remarks{
        .ui-table{
            width: auto !important;
        }
    }
    .popover-content {
        padding: 0 !important;
        .block-content {
            width: 580px;
        }
        .protection-content {
            width: 580px;
        }
        .tooltip-title {
            padding: 10px 20px;
            h3 {
                line-height: 22px;
                font-size: 16px;
            }
        }
        .sub-content {
            padding: 0 20px 10px 20px;
            border-bottom: 1px solid #eceff1;
            p {
                line-height: 17px;
                font-size: 12px;
            }
        }
        .ui-table {
            padding: 0px 0px 10px 0px;
            margin-top: 0;
        }
    }
    .red {
        color: #ee7272;
    }
}
._custom-block-common-fire{
    padding: 0 10px;
    .title{
        font-size: 16px;
    }
    .block-title{
        padding: 5px 0;
        font-weight:500;
        font-size: 14px;
        margin-top: 5px;
        span{
            margin-right: 5px;
            display:inline-block;
            height:12px;
            width:3px;
            background:#0CC3BC;
            vertical-align: middle;
            position: relative;
            top: -2px;
        }
    }
    .remarks{
        font-size: 14px;
    }
}
.inner_customer-icon-single-dialog{
    // .popover-content{
        max-width: 400px;
    // }

    .icon-blocking-content {
        .blocking {
            line-height: 22px;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            color: #363F55;
        }
        .jump-container {
            display: flex;
            line-height: 22px;
            font-size: 13px;
            color: #363F55;
            a {
                color: #01A09C;
                text-decoration: underline;
                margin-right: 6px;
            }
            >span {
                line-height: 22px;
            }
        }
    }
}
</style>
