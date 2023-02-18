import request from '@/utils/request'

export function listSalaryRecord(data) {
  return request({
    url: '/salaryRecord/query',
    method: 'post',
    data
  })
}

export function getSalaryRecord(id) {
  return request({
    url: '/salaryRecord/get',
    method: 'get',
    params: { id }
  })
}
