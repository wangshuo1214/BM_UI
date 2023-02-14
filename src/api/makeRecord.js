import request from '@/utils/request'

export function listMakeRecord(data) {
  return request({
    url: '/makeRecord/query',
    method: 'post',
    data
  })
}

export function addMakeRecord(data) {
  return request({
    url: '/makeRecord/add',
    method: 'post',
    data
  })
}

export function updateMakeRecord(data) {
  return request({
    url: '/makeRecord/update',
    method: 'post',
    data
  })
}

export function getMakeRecord(bmOrderId) {
  return request({
    url: '/makeRecord/get',
    method: 'get',
    params: { bmOrderId }
  })
}

export function delMakeRecord(data) {
  return request({
    url: '/makeRecord/delete',
    method: 'post',
    data
  })
}

export function payWage(data) {
  return request({
    url: '/makeRecord/payWage',
    method: 'post',
    data
  })
}

