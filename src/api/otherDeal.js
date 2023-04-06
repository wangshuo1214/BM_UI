import request from '@/utils/request'

export function listOtherDeal(data) {
  return request({
    url: '/other/query',
    method: 'post',
    data
  })
}

export function addOtherDeal(data) {
  return request({
    url: '/other/add',
    method: 'post',
    data
  })
}

export function updateOtherDeal(data) {
  return request({
    url: '/other/update',
    method: 'post',
    data
  })
}

export function getOtherDeal(id) {
  return request({
    url: '/other/get',
    method: 'get',
    params: { id }
  })
}

export function delOtherDeal(data) {
  return request({
    url: '/other/delete',
    method: 'post',
    data
  })
}
