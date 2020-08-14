import request from '@/utils/request'

// 查询参数列表
export function worthData(query) {
  return request({
    url: '/api/v1/configList',
    method: 'get',
    params: query
  })
}
