import request from '@/utils/request'

export function getHomePage() {
    return request({
      url: '/home/statistic',
      method: 'get',
      params: { }
    })
  }