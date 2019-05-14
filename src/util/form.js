import scrollIntoView from 'scroll-into-view-if-needed';
/**
 * 跳转到 FormItem 错误发生的位置
 * @param box 一般为 form 或 Form 对象
 */
export function scrollToError(box) {
    const el = box.querySelector ? box : box.$el;
    const node = el.querySelector('.ivu-form-item-error');
    node && scrollIntoView(node, {
        behavior: 'smooth',
        block: 'start',
    });
}
//# sourceMappingURL=form.js.map