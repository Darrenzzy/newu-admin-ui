import { praseStrEmpty } from '@/utils/costum'
import request from '@/utils/request'

// 查询菜单列表
export function listMember(query) {
  return request({
    url: '/api/v1/member/list',
    method: 'get',
    params: query
  })
}

export function listWorth(query) {
  return request({
    url: '/api/v1/netWorth/list',
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

export function dataWorth(id) {
  return request({
    url: '/api/v1/netWorth/data/' + id,
    method: 'get'
  })
}

export function delWorth(id) {
  return request({
    url: '/api/v1/netWorth/' + id,
    method: 'delete'
  })
}

export function delMember(id) {
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

export function addWorth(data) {
  data.code = praseStrEmpty(data.code)
  return request({
    url: '/api/v1/netWorth/',
    method: 'post',
    data: data
  })
}

// 修改
export function updateWorth(data) {
  return request({
    url: '/api/v1/netWorth/',
    method: 'put',
    data: data
  })
}
