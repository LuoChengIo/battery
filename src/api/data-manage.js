import request from '@/utils/request'
// 统计分析-数据查询
export function inquireList(params) {
  return request({
    url: '/data/month/list',
    method: 'get',
    params
  })
}
// 统计分析-数据详情
export function listDetails(params) {
  return request({
    url: '/data/month/equipmentid',
    method: 'get',
    params
  })
}
// 统计分析-数据导出
export function exportData(data) {
  return request({
    url: '/data/month/export',
    method: 'get',
    data
  })
}

// 统计分析-当日数据 统计
export function dayList(params) {
  return request({
    url: '/equipment/statics/list',
    method: 'get',
    params
  })
}
