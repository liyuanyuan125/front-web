/***
 * 所有的 modal 包装方法，均支持 promise，并且永远不 reject，所以
 * 1、不要定义 onOk，直接使用 await
 * 2、要处理 cancel，传 onCancel
 */
import { Modal, Message } from 'iview';
const newConfirm = (msg, options = {}) => {
    if ('onOk' in options) {
        throw new Error('don\'t use `onOk`, use `await` or `then` instead');
    }
    return new Promise(resolve => {
        const opts = {
            icon: 'confirm',
            content: msg,
            showCancel: false,
            onOk: () => {
                resolve();
            },
            ...options
        };
        // TODO: 使用了 iview 未文档化的特性
        let instance = Modal.newInstance({
            closable: false,
            maskClosable: false,
            footerHide: true,
        });
        opts.onRemove = () => {
            instance = null;
        };
        instance.show(opts);
    });
};
/**
 * 显示错误信息对话框，一般来说 alert 默认带一个错误提示图标
 * @param msg 要显示的消息
 * @param config 选项
 */
export function alert(msg, config = {}) {
    return newConfirm(msg, {
        icon: 'error',
        ...config
    });
}
/**
 * 显示确认对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function confirm(msg, config = {}) {
    return newConfirm(msg, {
        showCancel: true,
        ...config
    });
}
/**
 * 显示提示信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function info(msg, config = {}) {
    return newConfirm(msg, {
        icon: 'info',
        title: '信息',
        ...config
    });
}
/**
 * 显示成功信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function success(msg, config = {}) {
    return newConfirm(msg, {
        icon: 'success',
        title: '成功',
        ...config
    });
}
/**
 * 显示警告信息对话框
 * @param msg 要显示的消息
 * @param config 选项
 */
export function warning(msg, config = {}) {
    return newConfirm(msg, {
        icon: 'warning',
        title: '警告',
        ...config
    });
}
/**
 * 显示全局 toast 提示
 * @param msg 要显示的消息
 * @param config 配置
 */
export function toast(msg, config = {}) {
    const cfg = { content: msg, type: 'success', ...config };
    Message.config({
        top: cfg.top || Math.floor(window.innerHeight / 3)
    });
    (Message[cfg.type] || Message.success).call(Message, cfg);
}
/**
 * 显示全局 loading 提示
 * @param msg 要显示的消息
 * @param config 配置
 */
export function loading(msg = 'loading', config = {}) {
    toast(msg, { type: 'loading', ...config });
}
//# sourceMappingURL=modal.js.map