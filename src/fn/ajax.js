/**
 * 所有的 ajax 请求，都要使用该组件进行
 * @author zhangpeng
 */
import axios from 'axios';
import event from './event';
import tryParseJson from '@/fn/tryParseJson';
const ajaxBaseUrl = VAR.ajaxBaseUrl;
const isAbsoluteUrl = (url) => /^[a-z][a-z0-9+.-]*:/.test(url);
const emit = (data) => {
    event.emit(`ajax${data.code}`, data);
    return data;
};
// 确保最终的数据，始终有值
const perfectData = ({ code, data, msg } = {}) => {
    return {
        code,
        data: data || {},
        msg: msg || '',
    };
};
const request = async (url, opts) => {
    const isAbs = isAbsoluteUrl(url);
    const config = {
        baseURL: isAbs ? '' : ajaxBaseUrl,
        url,
        withCredentials: true,
        ...opts,
    };
    let res;
    try {
        res = await axios(config);
    }
    catch (ex) {
        if (ex && ex.response) {
            const { status, data: html } = ex.response;
            const error = { code: status, data: { html }, msg: 'HTTP 错误' };
            // 对 500 进一步处理
            if (status == 500) {
                res = {
                    data: tryParseJson(html, error)
                };
            }
            else {
                throw emit(error);
            }
        }
        else {
            const msg = ex && ex.message || '未知错误';
            throw emit({ code: 810, data: { ex }, msg });
        }
    }
    const { data } = res;
    if (data && data.code !== undefined) {
        const result = perfectData(data);
        if (data.code == 0) {
            return result;
        }
        else {
            throw emit(result);
        }
    }
    else {
        throw emit({ code: 800, data: { raw: data }, msg: '数据格式错误' });
    }
};
export async function get(url, data = {}, opts = {}) {
    return request(url, {
        method: 'get',
        params: {
            ...data,
            _: Date.now(),
        },
        ...opts,
    });
}
export async function post(url, data = {}, opts = {}) {
    return request(url, {
        method: 'post',
        data,
        ...opts,
    });
}
export async function put(url, data = {}, opts = {}) {
    return request(url, {
        method: 'put',
        data,
        ...opts,
    });
}
export async function del(url, data = {}, opts = {}) {
    return request(url, {
        method: 'delete',
        data,
        ...opts,
    });
}
//# sourceMappingURL=ajax.js.map