import request from '@/utils/request'

export function listDept(data) {
    return request({
      url: '/dept/query',
      method: 'post',
      data
    })
  }