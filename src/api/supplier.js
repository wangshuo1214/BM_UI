import request from '@/utils/request'

export function listSupplier(data) {
  return request({
    url: '/supplier/query',
    method: 'post',
    data
  })
}

export function addSupplier(data) {
  return request({
    url: '/supplier/add',
    method: 'post',
    data
  })
}

export function updateSupplier(data) {
  return request({
    url: '/supplier/update',
    method: 'post',
    data
  })
}

export function getSupplier(bmSupplierId) {
  return request({
    url: '/supplier/get',
    method: 'get',
    params: { bmSupplierId }
  })
}

export function delSupplier(data) {
  return request({
    url: '/supplier/delete',
    method: 'post',
    data
  })
}

export function getSuppliers() {
  return request({
    url: '/supplier/getAll',
    method: 'get',
    params: { }
  })
}
