import request from '@/utils/request'
import axios from 'axios'
// 程序管理列表查询
export function programList(data) {
  return request({
    url: '/equipment/program/list',
    method: 'post',
    data
  })
}
// 程序管理是上传文件
export function programUpload(data) {
  return axios({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    url: process.env.VUE_APP_BASE_API + '/equipment/program/upload',
    timeout: 20000,
    data
  })
}
// 程序管理发布正式版本
export function programPublish(data) {
  return request({
    url: '/equipment/program/publish',
    method: 'post',
    data
  })
}

