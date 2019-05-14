import * as tslib_1 from "tslib";
import { Vue, Component } from 'vue-property-decorator';
import { slice } from '@/fn/object';
import { numberify, numberKeys } from '@/fn/typeCast';
import { prettyQuery, urlParam } from '@/fn/url';
import { isEmpty } from 'lodash';
/**
 * 实现 URL 管理
 */
let UrlManager = class UrlManager extends Vue {
    /**
     * 实现 URL 管理
     */
    constructor() {
        super(...arguments);
        this.updateUrlByCode = false;
    }
    beforeRouteUpdate(to, from, next) {
        next();
        this.updateUrlByCode || this.updateQuery(to.query);
        this.updateUrlByCode = false;
    }
    /**
     * 从 Url 参数，route 参数中读取数据，更新查询条件
     * @param extraQuery 附加查询条件
     * @param options 选项
     */
    updateQueryByParam(extraQuery, { noRouteParam = false } = {}) {
        const urlParams = urlParam();
        const routeParams = noRouteParam ? {} : this.$route.params;
        const query = { ...urlParams, ...routeParams, ...extraQuery };
        this.updateQuery(query);
    }
    /**
     * 更新 Location Url
     */
    updateUrl() {
        const query = prettyQuery(this.query, this.defQuery);
        this.updateUrlByCode = true;
        this.$router.replace({ query });
    }
    /**
     * 更新查询条件
     * @param query 查询条件
     */
    updateQuery(query) {
        const keys = Object.keys(this.defQuery);
        const urlQuery = slice(query, keys);
        const newQuery = numberify({ ...this.defQuery, ...urlQuery }, numberKeys(this.defQuery));
        isEmpty(this.query)
            ? (this.query = newQuery)
            : keys.forEach(key => this.query[key] = newQuery[key]);
    }
    /**
     * 重置查询
     */
    resetQuery() {
        const { pageSize } = this.query;
        this.updateQuery({ ...this.defQuery, pageSize });
    }
};
UrlManager = tslib_1.__decorate([
    Component
], UrlManager);
export default UrlManager;
//# sourceMappingURL=UrlManager.js.map