import request from '@/utils/request'

export function listDept(data) {
  return request({
    url: '/system/dept/query',
    method: 'post',
    data
  })
}

export function updateDept(data) {
  return request({
    url: '/system/dept/update',
    method: 'post',
    data
  })
}

export function addDept(data) {
  return request({
    url: '/system/dept/add',
    method: 'post',
    data
  })
}

export function getDept(bmDeptId) {
  return request({
    url: '/system/dept/get',
    method: 'get',
    params: { bmDeptId }
  })
}

export function listDeptExcludeChild(bmDeptId) {
  return request({
    url: '/system/dept/exclude',
    method: 'post',
    params: { 'bmDeptId': bmDeptId }
  })
}

export function delDept(bmDeptId) {
  return request({
    url: '/system/dept/delete',
    method: 'post',
    params: { 'bmDeptId': bmDeptId }
  })
}

export function deptTreeSelect() {
  return request({
    url: '/system/dept/deptTree',
    method: 'get'
  })
}
