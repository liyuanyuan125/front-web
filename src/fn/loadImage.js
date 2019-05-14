const promiseMap = {};
const defaultOptions = {
    anonymous: false
};
/**
 * 手动加载图片
 * @param url 图片地址
 * @param options 选项
 */
export default function (url, options = {}) {
    const opts = {
        ...defaultOptions,
        ...options,
    };
    let promise = promiseMap[url];
    if (promise == null) {
        const img = new Image;
        const clearHandlers = () => {
            delete img.onload;
            delete img.onerror;
        };
        promise = promiseMap[url] = new Promise((resolve, reject) => {
            img.onload = ev => {
                clearHandlers();
                resolve({
                    img,
                    width: img.width,
                    height: img.height
                });
            };
            img.onerror = ev => {
                clearHandlers();
                delete promiseMap[url];
                reject();
            };
            // anonymous 用于 canvas 下载图片到本地等情形
            opts.anonymous && img.setAttribute('crossOrigin', 'Anonymous');
            img.src = url;
        });
    }
    return promise;
}
//# sourceMappingURL=loadImage.js.map