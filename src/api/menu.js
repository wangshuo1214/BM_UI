import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: '/menu/query',
    method: 'post',
    data
  })
}
