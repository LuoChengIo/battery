/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
import request from '@/utils/request'
// 设备管理-数据查询
export function equipmentList(data) {
  return request({
    url: '/equipment/list',
    method: 'post',
    data
  })
}
// 设备管理-数据保存
export function equipmentSave(data) {
    return request({
      url: '/equipment/save',
      method: 'post',
      data
    })
  }

  // 设备管理-数据删除
export function equipmentDel(data) {
    return request({
      url: '/equipment/del',
      method: 'post',
      data
    })
  }

  //  设备管理-详情列表
export function equipmentView(data) {
    return request({
      url: '/equipment/view',
      method: 'post',
      data
    })
  }

  // 设备管理-数据统计
  export function equipmentStatics(data) {
    return request({
      url: '/equipment/statics',
      method: 'post',
      data
    })
  }

  // 设备管理-出库
export function equipmentOut(data) {
    return request({
      url: '/equipment/storage/out',
      method: 'post',
      data
    })
  }

  // 设备管理-入库
export function equipmentIn(data) {
    return request({
      url: '/equipment/storage/in',
      method: 'post',
      data
    })
  }
  
// 设备管理-  设备搜索接口
export function getEquipment(data) {
  return request({
    url: '/paramsManage/query',
    method: 'post',
    data
  })
}
// 设备管理- 读取设备信息
export function readDevice(data) {
  return request({
    url: '/paramsManage/read',
    method: 'post',
    data
  })
}
// 设备管理- 命令下发
export function downCode(data) {
  return request({
    url: '/paramsManage/set',
    method: 'post',
    data
  })
}
