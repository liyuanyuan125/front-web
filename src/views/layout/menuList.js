import { walkTree } from '@/fn/tree';
import routes from '@/routes';
let menuRouteMapCache = null;
// 获取 routes 中被标记为 authIsMenu 的 route 项
const getMenuRouteMap = () => {
    if (menuRouteMapCache != null) {
        return menuRouteMapCache;
    }
    const map = {};
    walkTree(routes, {
        onEachBefore(route) {
            const meta = (route.meta || {});
            const isMenu = !!meta.authIsMenu;
            const key = (meta.authKey || '').toLowerCase();
            isMenu && (map[key] = route);
        }
    });
    // 在开发环境不缓存
    VAR.env !== 'dev' && (menuRouteMapCache = map);
    return map;
};
/**
 * 将 authKey 映射为菜单 name，所有的 authKey 必须全是小写
 * 这里只映射第一级，第二级可以通过 routes 配置关联出来
 */
const authKeyToMenuNameMap = {
    // 广告主
    'ads.index': 'home',
    'ads.promotion': 'pop',
    'ads.data-report': 'report',
    'ads.customer-manage': 'customer',
    'ads.financial-manage': 'finance',
    'ads.account-manage': 'account',
    // 资源方
    'resource.index': 'home',
    'resource.adordermanage': 'order',
    'resource.financemanage': 'resfinance',
    'resource.account-manage': 'account',
};
/**
 * 获取菜单项
 * @param permMenu 后端获取过来的菜单配置
 * @param systemCode 系统 code
 */
export function getMenuList(permMenu, systemCode) {
    const menuRouteMap = getMenuRouteMap();
    const prefix = new RegExp(`^${systemCode}\\.`, 'i');
    const result = walkTree(permMenu, {
        childrenKey: 'subPages',
        onEachBefore(menu) {
            const key = menu.key.toLowerCase();
            const noPrefixKey = key.replace(prefix, '');
            const route = menuRouteMap[noPrefixKey];
            const routeName = route && route.name;
            const name = authKeyToMenuNameMap[key] || routeName || noPrefixKey;
            const item = {
                name,
                label: menu.name,
                route: routeName,
            };
            return item;
        }
    });
    return result;
}
//# sourceMappingURL=menuList.js.map