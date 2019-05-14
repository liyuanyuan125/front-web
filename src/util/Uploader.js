/**
 * 上传功能
 * @author zhangpeng
 */
import EventClass from '@/fn/EventClass';
import deepExtend from 'deep-extend';
import exif from 'exif-js';
import { post } from '@/fn/ajax';
/** 图片类型 */
export var ImageType;
(function (ImageType) {
    ImageType["gif"] = "gif";
    ImageType["png"] = "png";
    ImageType["jpeg"] = "jpeg";
    ImageType["bmp"] = "bmp";
    ImageType["webp"] = "webp";
})(ImageType || (ImageType = {}));
const defaultOptions = {
    imagePostUrl: '/file/images',
    imageFieldName: 'images',
    filePostUrl: '/file/miscs',
    fileFieldName: 'files',
    imageCompress: {
        minWidth: null,
        maxWidth: 2000,
        minHeight: null,
        maxHeight: null,
        quality: 0.9,
        keepTypes: [ImageType.gif]
    },
};
const between = (val, min, max, defaultValue) => {
    return val >= min && val <= max ? val : defaultValue;
};
// 获取图片文件的方向
const getOrientation = (file) => {
    return new Promise(resolve => {
        const reader = new FileReader;
        // 读取超过 3s，就取消，但认为方向为 1
        const timer = setTimeout(() => {
            reader.abort();
            resolve({ orientation: 1 });
        }, 3000);
        reader.onload = ({ target }) => {
            clearTimeout(timer);
            let val = 1;
            try {
                const buffer = target.result;
                const data = exif.readFromBinaryFile(buffer);
                val = parseInt(data.Orientation, 10) || 1;
            }
            catch (ex) {
            }
            resolve({ orientation: between(val, 1, 8, 1) });
        };
    });
};
// 考虑了方向计算图片适合的最大尺寸，更精准，拍照方向请参考 http://www.cnblogs.com/strick/p/5183570.html 中的图示
const suitSize = ({ maxWidth, maxHeight, imgWidth, imgHeight, orientation }) => {
    const maxW = orientation < 5 ? maxWidth : maxHeight;
    const maxH = orientation < 5 ? maxHeight : maxWidth;
    const rate = maxW > 0 && maxH > 0
        ? Math.min(1, maxW / imgWidth, maxH / imgHeight)
        : maxW > 0
            ? Math.min(1, maxW / imgWidth)
            : maxH > 0
                ? Math.min(1, maxH / imgHeight)
                : 1;
    return { width: imgWidth * rate, height: imgHeight * rate, rate };
};
// 在 canvas 上按照 width, height 的最大尺寸绘制图片
// 下面的算法来自 https://github.com/stomita/ios-imagefile-megapixel/blob/master/src/megapix-image.js
// 拍照方向请参考 http://www.cnblogs.com/strick/p/5183570.html 中的图示
const drawImage = ({ canvas, image, width, height, orientation }) => {
    const context = canvas.getContext('2d');
    canvas.width = orientation < 5 ? width : height;
    canvas.height = orientation < 5 ? height : width;
    switch (orientation) {
        case 2:
            context.translate(width, 0);
            context.scale(-1, 1);
            break;
        case 3:
            context.translate(width, height);
            context.rotate(Math.PI);
            break;
        case 4:
            context.translate(0, height);
            context.scale(1, -1);
            break;
        case 5:
            context.rotate(0.5 * Math.PI);
            context.scale(1, -1);
            break;
        case 6:
            context.rotate(0.5 * Math.PI);
            context.translate(0, -height);
            break;
        case 7:
            context.rotate(0.5 * Math.PI);
            context.translate(width, -height);
            context.scale(-1, 1);
            break;
        case 8:
            context.rotate(-0.5 * Math.PI);
            context.translate(-width, 0);
            break;
    }
    context.drawImage(image, 0, 0, width, height);
};
export default class Uploader extends EventClass {
    constructor(options = {}) {
        super();
        this.options = deepExtend({}, defaultOptions, options);
    }
    async upload(file) {
        // 发出 perpare 事件，该事件可以通过设置 canceled 拦截接下来的操作
        const ev = { file, canceled: false };
        this.emit('prepare', ev);
        if (ev.canceled) {
            return;
        }
        let item;
        try {
            item = await this.prepare(file);
        }
        catch (ex) {
            return this.emit('fail', ex);
        }
        try {
            this.emit('begin');
            const { data: { items = [] } = {} } = await this.postFile(item);
            this.emit('done', items[0] || {});
        }
        catch (ex) {
            this.emit('fail', ex);
        }
        finally {
            this.emit('end');
        }
    }
    async postFile({ file, type }) {
        const { imagePostUrl, imageFieldName, filePostUrl, fileFieldName } = this.options;
        const isImage = type === 'image';
        const postUrl = isImage ? imagePostUrl : filePostUrl;
        const fieldName = isImage ? imageFieldName : fileFieldName;
        const form = new FormData;
        form.append(fieldName, file, file.name);
        return post(postUrl, form, {
            onUploadProgress: (ev) => {
                this.emit('progress', ev);
            }
        });
    }
    // 准备文件，对于图片，按照配置进行压缩等操作
    async prepare(file) {
        const [type, subtype = ''] = (file.type || '').split('/');
        const compressOptions = this.options.imageCompress;
        if (type === 'image' && compressOptions !== false) {
            return new Promise((resolve, reject) => {
                const { minWidth, maxWidth, minHeight, maxHeight, quality, keepTypes } = compressOptions;
                const thumb = URL.createObjectURL(file);
                const image = new Image;
                image.onload = async () => {
                    URL.revokeObjectURL(thumb);
                    const { width: imgWidth, height: imgHeight } = image;
                    const result = { file, type, subtype, thumb, width: imgWidth, height: imgHeight };
                    // 检查最小宽度、高度
                    if (minWidth != null && imgWidth < minWidth) {
                        return reject({
                            code: 400,
                            data: { ...result },
                            msg: `图片宽度 ${imgWidth} < 最小宽度 ${minWidth}`,
                        });
                    }
                    if (minHeight != null && imgHeight < minHeight) {
                        return reject({
                            code: 400,
                            data: { ...result },
                            msg: `图片高度 ${imgHeight} < 最小高度 ${minHeight}`,
                        });
                    }
                    this.emit('thumb', { ...result });
                    // 是否跳过限制长宽，所有在 keepTypes 的都要直接 PASS
                    const shouldPass = keepTypes && keepTypes.includes(subtype);
                    if (shouldPass || (maxWidth == null && maxHeight == null)) {
                        return resolve(result);
                    }
                    // 只有 jpeg 才有 orientation 问题
                    const orientation = subtype === ImageType.jpeg
                        ? (await getOrientation(file)).orientation
                        : 1;
                    const { width, height, rate } = suitSize({ maxWidth, maxHeight,
                        imgWidth, imgHeight, orientation }); // tslint:disable-line:align
                    // 若缩小范围正好为 1，直接返回
                    if (rate == 1) {
                        return resolve(result);
                    }
                    // 在 canvas 上绘制图片，从而达到缩放图片的目的
                    const canvas = document.createElement('canvas');
                    drawImage({ canvas, image, width, height, orientation });
                    canvas.toBlob((blob) => {
                        // 补全 name 信息（上传需要），所有格式转换成 jpeg 上传
                        blob.name = file.name.replace(/\.[^.]+$/i, '.jpg');
                        resolve({ ...result, file: blob });
                    }, 'image/jpeg', quality);
                };
                image.onerror = () => {
                    reject({
                        code: 400,
                        data: { file },
                        msg: '无法获取预览，请检查是否为图片',
                    });
                };
                image.src = thumb;
            });
        }
        return { file, type, subtype };
    }
}
//# sourceMappingURL=Uploader.js.map