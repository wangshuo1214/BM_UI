import request from '@/utils/request'

export function listClient(data) {
  return request({
    url: '/client/query',
    method: 'post',
    data
  })
}

export function addClient(data) {
  return request({
    url: '/client/add',
    method: 'post',
    data
  })
}

export function updateClient(data) {
  return request({
    url: '/client/update',
    method: 'post',
    data
  })
}

export function getClient(bmClientId) {
  return request({
    url: '/client/get',
    method: 'get',
    params: { bmClientId }
  })
}

export function delClient(data) {
  return request({
    url: '/client/delete',
    method: 'post',
    data
  })
}
