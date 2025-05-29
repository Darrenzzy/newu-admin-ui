import request from '@/utils/request'

// 查询Appointment列表
export function listAppointment(query) {
  return request({
    url: '/api/v1/appointment',
    method: 'get',
    params: query
  })
}

// 查询Appointment详细
export function getAppointment(id) {
  return request({
    url: '/api/v1/appointment/' + id,
    method: 'get'
  })
}

// 新增Appointment
export function addAppointment(data) {
  return request({
    url: '/api/v1/appointment',
    method: 'post',
    data: data
  })
}

// 修改Appointment
export function updateAppointment(data) {
  return request({
    url: '/api/v1/appointment/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除Appointment
export function delAppointment(data) {
  return request({
    url: '/api/v1/appointment',
    method: 'delete',
    data: data
  })
}

