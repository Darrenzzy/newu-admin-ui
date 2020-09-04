import request from '@/utils/request'

// 查询菜单列表
export function listMemberTransaction(query) {
  return request({
    url: '/api/v1/member_transaction/list',
    method: 'get',
    params: query
  })
}

export function dataMemberTransaction(id) {
  return request({
    url: '/api/v1/member_transaction/data/' + id,
    method: 'get'
  })
}

export function delMemberTransaction(id) {
  return request({
    url: '/api/v1/member_transaction/' + id,
    method: 'delete'
  })
}

export function updateMemberTransaction(data) {
  return request({
    url: '/api/v1/member_transaction',
    method: 'put',
    data: data
  })
}

export function addMemberTransaction(data) {
  return request({
    url: '/api/v1/member_transaction/add',
    method: 'post',
    data: data
  })
}
