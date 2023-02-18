import request from '@/utils/request'

export function listEmployee(data) {
  return request({
    url: '/employee/query',
    method: 'post',
    data
  })
}

export function addEmployee(data) {
  return request({
    url: '/employee/add',
    method: 'post',
    data
  })
}

export function updateEmployee(data) {
  return request({
    url: '/employee/update',
    method: 'post',
    data
  })
}

export function getEmployee(bmEmployeeId) {
  return request({
    url: '/employee/get',
    method: 'get',
    params: { bmEmployeeId }
  })
}

export function delEmployee(data) {
  return request({
    url: '/employee/delete',
    method: 'post',
    data
  })
}

export function employeeTreeSelect() {
  return request({
    url: '/employee/employeeTree',
    method: 'get'
  })
}

export function getAllEmployee() {
  return request({
    url: '/employee/allEmployee',
    method: 'get'
  })
}

