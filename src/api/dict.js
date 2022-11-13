import request from '@/utils/request'

export function listType(data) {
  return request({
    url: '/dict/type/query',
    method: 'post',
    data
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(bmDictType) {
  return request({
    url: '/dict/data/getDataByType',
    method: 'get',
    params: { bmDictType }
  })
}

export function getType(bmDictId) {
  return request({
    url: '/dict/type/get',
    method: 'get',
    params: { bmDictId }
  })
}

export function updateType(data) {
  return request({
    url: '/dict/type/update',
    method: 'post',
    data
  })
}

export function addType(data) {
  return request({
    url: '/dict/type/add',
    method: 'post',
    data
  })
}

export function delType(data) {
  return request({
    url: '/dict/type/delete',
    method: 'post',
    data
  })
}
