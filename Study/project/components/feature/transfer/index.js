import transfer from './main';
import transferPanel from './transfer-panel';

transfer.install = function install(Vue) {
    Vue.component(transfer.name, transfer);
};
transferPanel.install = function install(Vue) {
    Vue.component(transferPanel.name, transferPanel);
};
export const uiTransfer = transfer;
export const uiTransferPanel = transferPanel;
export default {
    uiTransfer,
    uiTransferPanel
};