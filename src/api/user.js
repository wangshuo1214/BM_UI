import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function listUser(data) {
  return request({
    url: '/user/query',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function getUser(bmUserId) {
  return request({
    url: '/user/get',
    method: 'get',
    params: { bmUserId }
  })
}

export function delUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function resetPwd(userId) {
  return request({
    url: '/user/reset',
    method: 'post',
    params: { 'bmUserId': userId }
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  return request({
    url: '/user/changeStatus',
    method: 'post',
    params: { 'bmUserId': userId, 'status': status }
  })
}

export function allocatedUserList(data) {
  return request({
    url: '/user/allocated',
    method: 'post',
    data
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(data) {
  return request({
    url: '/user/unAllocated',
    method: 'post',
    data
  })
}
