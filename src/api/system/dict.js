import request from '@/utils/request'

export function queryType(data) {
  return request({
    url: '/system/dict/type/query',
    method: 'post',
    data
  })
}

export function listType() {
  return request({
    url: '/system/dict/type/list',
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(bmDictType) {
  return request({
    url: '/system/dict/data/getDataByType',
    method: 'get',
    params: { bmDictType }
  })
}

export function getType(bmDictId) {
  return request({
    url: '/system/dict/type/get',
    method: 'get',
    params: { bmDictId }
  })
}

export function updateType(data) {
  return request({
    url: '/system/dict/type/update',
    method: 'post',
    data
  })
}

export function addType(data) {
  return request({
    url: '/system/dict/type/add',
    method: 'post',
    data
  })
}

export function delType(data) {
  return request({
    url: '/system/dict/type/delete',
    method: 'post',
    data
  })
}

export function queryData(data) {
  return request({
    url: '/system/dict/data/query',
    method: 'post',
    data
  })
}

export function updateData(data) {
  return request({
    url: '/system/dict/data/update',
    method: 'post',
    data
  })
}

export function addData(data) {
  return request({
    url: '/system/dict/data/add',
    method: 'post',
    data
  })
}

export function getData(bmDictId) {
  return request({
    url: '/system/dict/data/get',
    method: 'get',
    params: { bmDictId }
  })
}

export function delData(data) {
  return request({
    url: '/system/dict/data/delete',
    method: 'post',
    data
  })
}

// 根据字典类型和字典名称获得唯一的字典
export function getSoleDict(bmDictType, bmDictCode) {
  return request({
    url: '/system/dict/data/sole',
    method: 'get',
    params: { bmDictType, bmDictCode }
  })
}
