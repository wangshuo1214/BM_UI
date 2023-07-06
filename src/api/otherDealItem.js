import request from '@/utils/request'

export function listOtherDealItem(data) {
  return request({
    url: '/otherDealItem/query',
    method: 'post',
    data
  })
}

export function addOtherDealItem(data) {
  return request({
    url: '/otherDealItem/add',
    method: 'post',
    data
  })
}

export function updateOtherDealItem(data) {
  return request({
    url: '/otherDealItem/update',
    method: 'post',
    data
  })
}

export function getOtherDealItem(id) {
  return request({
    url: '/otherDealItem/get',
    method: 'get',
    params: { id }
  })
}

export function getOtherDealItemByType(type) {
  return request({
    url: '/otherDealItem/getByType',
    method: 'get',
    params: { type }
  })
}

export function delOtherDealItem(data) {
  return request({
    url: '/otherDealItem/delete',
    method: 'post',
    data
  })
}
