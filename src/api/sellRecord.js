import request from '@/utils/request'

export function listSellRecord(data) {
  return request({
    url: '/sellRecord/query',
    method: 'post',
    data
  })
}

export function addSellRecord(data) {
  return request({
    url: '/sellRecord/add',
    method: 'post',
    data
  })
}

export function updateSellRecord(data) {
  return request({
    url: '/sellRecord/update',
    method: 'post',
    data
  })
}

export function getSellRecord(bmOrderId) {
  return request({
    url: '/sellRecord/get',
    method: 'get',
    params: { bmOrderId }
  })
}

export function delSellRecord(data) {
  return request({
    url: '/sellRecord/delete',
    method: 'post',
    data
  })
}

export function getSellInfo() {
  return request({
    url: '/sellRecord/sellInfo',
    method: 'get',
    params: { }
  })
}

