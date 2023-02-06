import request from '@/utils/request'

export function listBuyRecord(data) {
  return request({
    url: '/buyRecord/query',
    method: 'post',
    data
  })
}

export function addBuyRecord(data) {
  return request({
    url: '/buyRecord/add',
    method: 'post',
    data
  })
}

export function updateBuyRecord(data) {
  return request({
    url: '/buyRecord/update',
    method: 'post',
    data
  })
}

export function getBuyRecord(bmOrderId) {
  return request({
    url: '/buyRecord/get',
    method: 'get',
    params: { bmOrderId }
  })
}

export function delBuyRecord(data) {
  return request({
    url: '/buyRecord/delete',
    method: 'post',
    data
  })
}
