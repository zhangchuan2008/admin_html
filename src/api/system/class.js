import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listClass(query) {
  return request({
    url: '/class/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getClass(classId) {
  return request({
    url: '/class/' + classId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addClass(data) {
  return request({
    url: '/class',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateClass(data) {
  return request({
    url: '/class',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delClass(classId) {
  return request({
    url: '/class/' + classId,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportClass(query) {
  return request({
    url: '/class/export',
    method: 'get',
    params: query
  })
}
