import request from '@/utils/request'

// 查询NetWorth列表
export function listNetWorth(query) {
  return request({
    url: '/api/v1/net-worth',
    method: 'get',
    params: query
  })
}

// 查询NetWorth详细
export function getNetWorth(id) {
  return request({
    url: '/api/v1/net-worth/' + id,
    method: 'get'
  })
}

// 新增NetWorth
export function addNetWorth(data) {
  return request({
    url: '/api/v1/net-worth',
    method: 'post',
    data: data
  })
}

// 修改NetWorth
export function updateNetWorth(data) {
  return request({
    url: '/api/v1/net-worth/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除NetWorth
export function delNetWorth(data) {
  return request({
    url: '/api/v1/net-worth',
    method: 'delete',
    data: data
  })
}

