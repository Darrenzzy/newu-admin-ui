import request from '@/utils/request'

// 查询菜单列表
export function listContacts(query) {
  return request({
    url: '/api/v1/Contacts/list',
    method: 'get',
    params: query
  })
}

export function dataContacts(id) {
  return request({
    url: '/api/v1/Contacts/data/' + id,
    method: 'get'
  })
}

export function delContacts(id) {
  return request({
    url: '/api/v1/Contacts/' + id,
    method: 'delete'
  })
}

export function updateContacts(data) {
  return request({
    url: '/api/v1/Contacts/',
    method: 'put',
    data: data
  })
}

export function addContacts(data) {
  return request({
    url: '/api/v1/Contacts/add',
    method: 'post',
    data: data
  })
}

// 状态修改
export function changeStatus(data) {
  data.status = parseInt(data.status)
  return request({
    url: '/api/v1/Contacts/',
    method: 'put',
    data: data
  })
}
