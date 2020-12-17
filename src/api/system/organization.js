import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listOrganization(query) {
  return request({
    url: '/organization/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getOrganization(organizationId) {
  return request({
    url: '/organization/' + organizationId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addOrganization(data) {
  return request({
    url: '/organization',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateOrganization(data) {
  return request({
    url: '/organization',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delOrganization(organizationId) {
  return request({
    url: '/organization/' + organizationId,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportOrganization(query) {
  return request({
    url: '/organization/export',
    method: 'get',
    params: query
  })
}
