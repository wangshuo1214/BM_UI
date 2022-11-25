import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: '/menu/query',
    method: 'post',
    data
  })
}

export function listMenuExcludeChild(bmMenuId) {
  return request({
    url: '/menu/exclude',
    method: 'post',
    params: { 'bmMenuId': bmMenuId }
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data
  })
}

export function addMenu(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data
  })
}

export function getMenu(bmMenuId) {
  return request({
    url: '/menu/get',
    method: 'get',
    params: { bmMenuId }
  })
}

export function delMenu(bmMenuId) {
  return request({
    url: '/menu/delete',
    method: 'post',
    params: { 'bmMenuId': bmMenuId }
  })
}
