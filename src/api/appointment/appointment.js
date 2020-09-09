import request from '@/utils/request'

// 查询菜单列表
export function listAppointment(query) {
  return request({
    url: '/api/v1/appointment/list',
    method: 'get',
    params: query
  })
}

export function dataAppointment(id) {
  return request({
    url: '/api/v1/appointment/data/' + id,
    method: 'get'
  })
}

export function delAppointment(id) {
  return request({
    url: '/api/v1/appointment/' + id,
    method: 'delete'
  })
}

export function updateAppointment(data) {
  return request({
    url: '/api/v1/appointment/',
    method: 'put',
    data: data
  })
}

export function addAppointment(data) {
  return request({
    url: '/api/v1/appointment/add',
    method: 'post',
    data: data
  })
}

// 状态修改
export function changeStatus(data) {
  data.status = parseInt(data.status)
  return request({
    url: '/api/v1/appointment/',
    method: 'put',
    data: data
  })
}
