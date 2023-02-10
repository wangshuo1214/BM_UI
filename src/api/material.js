import request from '@/utils/request'

export function listMaterial(data) {
  return request({
    url: '/material/query',
    method: 'post',
    data
  })
}

export function addMaterial(data) {
  return request({
    url: '/material/add',
    method: 'post',
    data
  })
}

export function updateMaterial(data) {
  return request({
    url: '/material/update',
    method: 'post',
    data
  })
}

export function getMaterial(bmMaterialId) {
  return request({
    url: '/material/get',
    method: 'get',
    params: { bmMaterialId }
  })
}

export function delMaterial(data) {
  return request({
    url: '/material/delete',
    method: 'post',
    data
  })
}

export function getMaterialByType(type) {
  return request({
    url: '/material/getByType',
    method: 'get',
    params: { type }
  })
}
