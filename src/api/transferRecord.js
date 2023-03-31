import request from '@/utils/request'

export function listTransferRecord(data) {
  return request({
    url: '/transferRecord/query',
    method: 'post',
    data
  })
}

export function getTransferRecord(id) {
  return request({
    url: '/transferRecord/get',
    method: 'get',
    params: { id }
  })
}
