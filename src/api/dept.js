import request from '@/utils/request'

export function listDept(data) {
  return request({
    url: '/dept/query',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/dept/update',
    method: 'post',
    data
  })
}

export function addDept(data) {
  return request({
    url: '/dept/add',
    method: 'post',
    data
  })
}

export function getDept(bmDeptId) {
  return request({
    url: '/dept/get',
    method: 'get',
    params: { bmDeptId }
  })
}

export function listDeptExcludeChild(bmDeptId) {
  return request({
    url: '/dept/exclude',
    method: 'post',
    params: { 'bmDeptId': bmDeptId }
  })
}

export function delDept(bmDeptId) {
  return request({
    url: '/dept/delete',
    method: 'post',
    params: { 'bmDeptId': bmDeptId }
  })
}

export function deptTreeSelect() {
  return request({
    url: '/dept/deptTree',
    method: 'get'
  })
}
