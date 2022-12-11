import request from '@/utils/request'

export function listRole(data) {
  return request({
    url: '/role/query',
    method: 'post',
    data
  })
}
