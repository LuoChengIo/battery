import request from '@/utils/request'
// 实时列表---列表查询
export function dataList(data) {
  return request({
    url: '/data/list',
    method: 'post',
    data
  })
}
// 实时列表---详情查询
export function equipmentid(data) {
  return request({
    url: '/data/equipmentid',
    method: 'post',
    data
  })
}
