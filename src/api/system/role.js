import request from '@/utils/request'

export function listRole(data) {
  return request({
    url: '/system/role/query',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

export function getRole(bmRoleId) {
  return request({
    url: '/system/role/get',
    method: 'get',
    params: { bmRoleId }
  })
}

export function delRole(data) {
  return request({
    url: '/system/role/delete',
    method: 'post',
    data
  })
}

export function authUserSelect(data) {
  return request({
    url: '/system/role/allocate',
    method: 'post',
    data
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/system/role/unAllocate',
    method: 'post',
    data
  })
}
