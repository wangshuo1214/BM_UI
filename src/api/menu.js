import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: '/menu/query',
    method: 'post',
    data
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
