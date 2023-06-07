/** 
 * 合同状态 
 * @params { contractStatus | 1 } => { fileStatus | -1/0/1/2 };
 * */
const contractStateOpts = [
    {'label': '待提交', 'value': '99', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '待发放合同', 'value': '20', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '待发放合同', 'value': '27', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '合同发放驳回', 'value': '21', 'textClassName': 'text-red', 'iconClassName': 'icon-red'},
    {'label': '已撤销', 'value': '26', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '待签约', 'value': '22', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '待审核', 'value': '0', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '已通过', 'value': '1', 'fileStatus': '-1', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '已通过-待归档', 'value': '1', 'fileStatus': '0', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '已通过-已归档', 'value': '1', 'fileStatus': '1', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '已通过-未归档', 'value': '1', 'fileStatus': '2', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '审核驳回', 'value': '2', 'textClassName': 'text-red', 'iconClassName': 'icon-red'},
    {'label': '待补合同', 'value': '3', 'textClassName': 'text-purple', 'iconClassName': 'icon-purple'},
    {'label': '待审核', 'value': '4', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '退单-无合同', 'value': '5', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-待回收', 'value': '6', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-已回收', 'value': '7', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-未回收', 'value': '8', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-已签终止协议', 'value': '28', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
];

/** 
 * 到款状态 
 * @params { payStatus } => { refundApplyId > 0 }
 * */
const payStatusOpts = [
    {'label': '待确认', 'value': '0', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '部分到款', 'value': '1', 'textClassName': 'text-purple', 'iconClassName': 'icon-purple'},
    {'label': '全部到款', 'value': '2', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '退单-无需退款', 'value': '3', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-待退款', 'value': '4', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-已退款', 'value': '5', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
];

/** 
 * 产品开通状态 
 * @params { productOpenedStatus }
 * */
const productOpenedStatusOpts = [
    {'label': '待开通', 'value': '0', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '部分开通', 'value': '1', 'textClassName': 'text-purple', 'iconClassName': 'icon-purple'},
    {'label': '全部开通', 'value': '2', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '退单-已关闭', 'value': '3', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
];

/** 
 * 开票状态 
 * @params { invoiceStatus }
 * */
const invoiceStatusOpts = [
    {'label': '待申请', 'value': '0', 'textClassName': 'text-purple', 'iconClassName': 'icon-purple'},
    {'label': '待开票', 'value': '1', 'textClassName': 'text-orange', 'iconClassName': 'icon-orange'},
    {'label': '部分开票', 'value': '2', 'textClassName': 'text-purple', 'iconClassName': 'icon-purple'},
    {'label': '全额开票', 'value': '3', 'textClassName': 'text-green', 'iconClassName': 'icon-green'},
    {'label': '已驳回', 'value': '4', 'textClassName': 'text-red', 'iconClassName': 'icon-red'},
    {'label': '无需开票', 'value': '5', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-待回收', 'value': '6', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-已回收', 'value': '7', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '退单-已重开票', 'value': '8', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
    {'label': '放弃开票', 'value': '18', 'textClassName': 'text-gray', 'iconClassName': 'icon-gray'},
];

export default {
    contractStateOpts,
    payStatusOpts,
    productOpenedStatusOpts,
    invoiceStatusOpts,
};