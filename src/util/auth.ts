import event from '@/fn/event'

/**
 * 显示 403 权限不足页，但不改变当前 route
 * @param show 是否显示，默认为 true
 */
export function show403(show = true) {
  event.emit('route-perm', { has: !show })
}
