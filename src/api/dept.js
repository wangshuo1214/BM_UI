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

export function getDept(deptId) {
  return request({
    url: '/dept/get',
    method: 'get',
    params: { deptId }
  })
}

export function listDeptExcludeChild(deptId) {
  return request({
    url: '/dept/exclude',
    method: 'post',
    params: { 'deptId': deptId }
  })
}

export function delDept(deptId) {
  return request({
    url: '/dept/delete',
    method: 'post',
    params: { 'deptId': deptId }
  })
}
