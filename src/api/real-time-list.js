import request from '@/utils/request'
// 实时列表---列表查询
export function dataList(params) {
  return request({
    url: '/data/list',
    method: 'get',
    params
  })
}
// 实时列表---详情查询
export function equipmentid(params) {
  return request({
    url: '/data/equipmentid',
    method: 'get',
    params
  })
}
