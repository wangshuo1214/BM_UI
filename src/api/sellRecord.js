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

export function getSellInfo(bmClientId) {
  return request({
    url: '/sellRecord/sellInfo',
    method: 'get',
    params: { bmClientId }
  })
}

export function payMoney(data) {
  return request({
    url: '/sellRecord/payMoney',
    method: 'post',
    data
  })
}

export function clearMoney(bmClientId) {
  return request({
    url: '/sellRecord/clearMoney',
    method: 'post',
    params: { 'bmClientId': bmClientId }
  })
}

