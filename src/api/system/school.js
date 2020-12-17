import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listSchool(query) {
  return request({
    url: '/school/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getSchool(schoolId) {
  return request({
    url: '/school/' + schoolId,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addSchool(data) {
  return request({
    url: '/school',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateSchool(data) {
  return request({
    url: '/school',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delSchool(schoolId) {
  return request({
    url: '/school/' + schoolId,
    method: 'delete'
  })
}

// 导出【请填写功能名称】
export function exportSchool(query) {
  return request({
    url: '/school/export',
    method: 'get',
    params: query
  })
}
//获取阿里云图片上传的参数
export function getUploadData(query) {
  return request({
    url: 'http://47.108.168.121/prod-api/common/oss',
    method: 'get',
    params: query
  })
}
//获取省市区数据
export function getPositionData(query) {
  return request({
    url: '/system/data/treelist',
    method: 'get',
    params: query
  })
}
