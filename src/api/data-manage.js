import request from '@/utils/request'
// 统计分析-数据查询
export function inquireList(data) {
  return request({
    url: '/data/month/list',
    method: 'post',
    data
  })
}
// 统计分析-数据详情
export function listDetails(data) {
  return request({
    url: '/data/month/equipmentid',
    method: 'post',
    data
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
export function dayList(data) {
  return request({
    url: '/equipment/statics/list',
    method: 'post',
    data
  })
}
