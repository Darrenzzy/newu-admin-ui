import request from '@/utils/request'

// 查询Contacts列表
export function listContacts(query) {
  return request({
    url: '/api/v1/contacts',
    method: 'get',
    params: query
  })
}

// 查询Contacts详细
export function getContacts(id) {
  return request({
    url: '/api/v1/contacts/' + id,
    method: 'get'
  })
}

// 新增Contacts
export function addContacts(data) {
  return request({
    url: '/api/v1/contacts',
    method: 'post',
    data: data
  })
}

// 修改Contacts
export function updateContacts(data) {
  return request({
    url: '/api/v1/contacts/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除Contacts
export function delContacts(data) {
  return request({
    url: '/api/v1/contacts',
    method: 'delete',
    data: data
  })
}

