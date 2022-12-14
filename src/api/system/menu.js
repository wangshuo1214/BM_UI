import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: '/system/menu/query',
    method: 'post',
    data
  })
}

export function listMenuExcludeChild(bmMenuId) {
  return request({
    url: '/system/menu/exclude',
    method: 'post',
    params: { 'bmMenuId': bmMenuId }
  })
}

export function updateMenu(data) {
  return request({
    url: '/system/menu/update',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data
  })
}

export function getMenu(bmMenuId) {
  return request({
    url: '/system/menu/get',
    method: 'get',
    params: { bmMenuId }
  })
}

export function delMenu(bmMenuId) {
  return request({
    url: '/system/menu/delete',
    method: 'post',
    params: { 'bmMenuId': bmMenuId }
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(bmRoleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect',
    method: 'get',
    params: { 'bmRoleId': bmRoleId }
  })
}
