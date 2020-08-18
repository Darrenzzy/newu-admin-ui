import request from '@/utils/request'
// 查询菜单列表
export function listMember(query) {
  return request({
    url: '/api/v1/member/list',
    method: 'get',
    params: query
  })
}

export function dataMember(id) {
  return request({
    url: '/api/v1/member/data/' + id,
    method: 'get'
  })
}

export function delMember(id) {
  console.log(123123, id)
  return request({
    url: '/api/v1/member/' + id,
    method: 'delete'
  })
}

// 修改
export function updateMember(data) {
  return request({
    url: '/api/v1/member/',
    method: 'put',
    data: data
  })
}