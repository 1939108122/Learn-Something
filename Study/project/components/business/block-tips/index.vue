<template>
    <div class="block-tips">
        <ui-tooltip
        v-if="canshow()"
        :placement="blockTheme ? 'top-right' : 'right'"
        :theme="blockTheme ? 'dark' : ''"
        trigger="hover"
        content="0"
        :wrapClass="table?'customer-icon-tootips-box-dialog':''">
            <span slot="reference" class="reference" style="cursor: default">
                <i :class="getIconClassName(blockConfig.iconType)"></i>
            </span>
            <div slot="content" class="block-popup-wrap" v-html="getIcontips()"></div>
        </ui-tooltip>
    </div>
</template>

<script>
export default {
    name: 'blockTips',
    data () {
        return {
            blockTheme: false,
            iconList: [
                {
                    value: 0,
                    className: 'icrm-unassociated',
                    name: '待关联'
                },
                {
                    value: 1,
                    className: 'icon-super-fire',
                    name: '超火'
                },
                {
                    value: 2,
                    className: 'icon-vip',
                    name: 'vip'
                },
                {
                    value: 3,
                    className: 'icon-super-vip',
                    name: '超级vip'
                },
                {
                    value: 4,
                    className: 'icon-vip-girl',
                    name: 'vip3'
                },
                {
                    value: 5,
                    className: '',
                    name: '无图标'
                },
                // TODO 添加普火
                {
                    value: 6,
                    className: 'icon-common-fire',
                    name: '普火'
                },
            ],
            table: false
        };
    },
    props: {
        blockConfig: {
            type: Object,
            default: () => {},
        },
        showCommonFire: {
            type: Boolean,
            default: true
        }
    },

    created () {
        if(this.blockConfig.iconType === 0 || (this.blockConfig.equityType === 0 && !this.blockConfig.remark) || (this.blockConfig.equityType !== 0 && !this.blockConfig.remark && !this.blockConfig.showEquityDetail)) {
            this.blockTheme = true;
        }
    },
    methods : {
        canshow () {
            let show = true;
            if (Object.keys(this.blockConfig).length) {
                show = true;
                if (!this.showCommonFire) {
                    // 不显示 普火图标
                    show = this.blockConfig.iconType != 6;
                }
            } else {
                show = false;
            }

            return show;
        },
        getIconClassName (iconType) {

            let list = this.iconList.filter(item => {
                return item.value == iconType;
            });
            if(list && list.length) {
                return list[0].className;
            }
        },
        getIcontips () {
            let ht = '';
            if(this.blockConfig.iconType == 0) {
                ht = `请联系管理员关联图标`;
            } else if(this.blockConfig.equityType === 0 && !this.blockConfig.remark) {
                ht = this.blockConfig.blockName;
            } else if(this.blockConfig.equityType !== 0 && !this.blockConfig.remark && !this.blockConfig.showEquityDetail) {
                let equityTypeName = this.blockConfig.equityTypeName == `无` ? `` : `${this.blockConfig.equityTypeName}:`;
                ht = `${equityTypeName}${this.blockConfig.blockName}`;
            } else {
                ht = this.getIcontipsTal(this.blockConfig);
            }
            return ht;
        },

        getIcontipsTal (val) {
            let tableHt = '';
            if(val.equityList.length) {
                this.table = true;
                let _ht = '';
                let onlineEquityDesc = '', freeAccountDesc = '', offlineEquityDesc = '';
                val.equityList.map((item) => {
                    if(item.freeAccountDesc || item.onlineEquityDesc || item.offlineEquityDesc) {
                        onlineEquityDesc = item.onlineEquityDesc ? item.onlineEquityDesc : '';
                        freeAccountDesc = item.freeAccountDesc ? item.freeAccountDesc : '';
                        offlineEquityDesc = item.offlineEquityDesc ? item.offlineEquityDesc : '';
                        _ht +=`<tr>` +
                            `     <td>${item.detailTypeName}</td>` +
                            `     <td>${item.equityDesc}</td>` +
                            `     <td>${freeAccountDesc}</td>` +
                            `     <td>${onlineEquityDesc}</td>` +
                            `     <td>${offlineEquityDesc}</td>` +
                            ` </tr>`;
                    }
                });
                if(val.equityType != 0 && val.showEquityDetail) {
                    tableHt = `<div class="details">` +
                        `    <table>` +
                        `        <tbody><tr>` +
                        `            <th width="60">权益类型</th>` +
                        `            <th width="140">权益说明</th>` +
                        `            <th width="60">免费账号</th>` +
                        `            <th width="60">${val.jobBlockType === 0 ?'线上账号':'线上职位'}</th>` +
                        `            <th width="90">线下账号</th>` +
                        `        </tr> ${_ht}` +
                        `    </tbody></table>` +
                        `</div>`;
                }

            }
            let remark = val.remark ? `${val.remark}` : ``;
            let equityTypeName = val.equityTypeName == `无` ? `` : `${val.equityTypeName}:`;
            return `<div class="block-popup block-content _custom-block-common-fire">` +
                `<div class="title dialog-title">` +
                `    <h4>${equityTypeName}${val.blockShowName || val.blockName}</h4>` +
                `</div>` +
                `<p class="block-title">
                    <span></span>阻断规则
                </p>`+
                `<div class="remarks">
                    ${['<p>不允许线下合作</p>', ''][val.allowOfflineWork] || ''}
                    <p>${remark}</p>
                </div>`+
                `${val.onlineAccountPrice ? `<p class="block-title">
                        <span></span>线上${val.jobBlockType === 0 ? '账号价格' : '职位价格'}
                    </p>
                    <div class="remarks">
                        <p>${val.onlineAccountPrice}</p>
                    </div>` : ''}`+
                `<p class="block-title">
                    <span></span>权益表
                </p>`+
                `${tableHt}` +
                `</div>`;
        }
    }
};
</script>

<style lang="less">
    .block-tips {
        display: inline-block;
        .popover-right {
            .block-popup {
                margin-top: -20px;
                margin-left: -10px;
            }
        }
        .popover-content {
            .block-popup-wrap {
                width: max-content;
            }
            .block-popup {
                position: absolute;
                max-width: 576px;
                background: #FFFFFF;
                box-shadow: 0px 4px 10px 4px rgba(0,0,0,0.11);
                -webkit-box-shadow: 0px 4px 10px 4px rgba(0,0,0,0.11);
                border-radius: 3px;
                .title {
                    padding: 10px 20px;
                    white-space: nowrap;
                    h4 {
                        line-height: 22px;
                        font-size: 16px;
                    }
                }
                // .remarks {
                //     // padding: 0 20px 20px 20px;
                //     // line-height: 17px;
                //     // font-size: 12px;
                //     // min-width: 200px;
                // }
                .details {
                    width: 540px;
                    // padding: 19px 20px 30px 20px;
                    // border-top: 1px solid #EBEBEB;
                    table {
                        width: auto;
                        th {
                            padding: 6px 10px 4px 10px;
                            background: #F8FCFF;
                            line-height: 20px;
                            font-size: 14px;
                            border-bottom: 1px solid #DADADA;
                            font-weight: bold;
                        }
                        td {
                            padding: 6px 10px 4px 10px;
                            height: auto;
                            line-height: 20px;
                            background: #FFFFFF!important;
                            font-size: 14px;
                            border-bottom: 1px solid #DADADA;
                            box-shadow: none!important;
                            -webkit-box-shadow: none!important;
                        }
                    }
                }
            }
        }
    }

._custom-block-common-fire{
    padding: 20px;
    .dialog-title{
        padding:  0 0 10px 0 !important;
    }
    .title{
        font-size: 16px;
    }
    .block-title{
        padding: 5px 0;
        font-weight:500;
        font-size: 14px;
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
    table{
        width: 100% !important;
        table-layout: initial !important;
    }
}
</style>