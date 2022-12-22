import request from '@/utils/request'

export function listRole(data) {
  return request({
    url: '/role/query',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function getRole(bmRoleId) {
  return request({
    url: '/role/get',
    method: 'get',
    params: { bmRoleId }
  })
}

export function delRole(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}

