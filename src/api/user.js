import request from '@/utils/request'
import axios from 'axios'
export function login(data) {
  return request({
    url: '/userManage/login',
    method: 'post',
    data
  })
}
export function getEncKey(data) {
  return request({
    url: '/user/userManage/getEncKey',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function modifyPassword(data) { // 密码修改
  return request({
    url: '/userManage/modifyPassword',
    method: 'post',
    data
  })
}
export function passwordReset(data) { // 密码重置
  return request({
    url: '/userManage/passwordReset',
    method: 'post',
    data
  })
}
export function getFunctionList(params) { // 查询菜单列表
  return request({
    url: '/systemManage/getFunctionList ',
    method: 'get',
    params
  })
}
export function addCompany(data) { // 新增公司
  return request({
    url: '/systemManage/addCompany',
    method: 'post',
    data
  })
}
export function deleteCompany(data) { // 删除公司
  return request({
    url: '/systemManage/deleteCompany',
    method: 'post',
    data
  })
}
export function modifyCompanyInformation(data) { // 修改公司信息
  return request({
    url: '/systemManage/modifyCompanyInformation',
    method: 'post',
    data
  })
}
export function getCompanyInformation(params) { // 查询公司详细信息
  return request({
    url: '/systemManage/getCompanyInformation',
    method: 'get',
    params
  })
}
export function getCompanyList(params) { // 查询公司列表
  return request({
    url: '/systemManage/getCompanyList',
    method: 'get',
    params
  })
}
export function addUser(data) { // 新增用户
  return request({
    url: '/systemManage/addUser',
    method: 'post',
    data
  })
}
export function modifyUserInformation(data) { // 修改用户信息
  return request({
    url: '/systemManage/modifyUserInformation',
    method: 'post',
    data
  })
}
export function getUserInformation(params) { // 查询用户信息
  return request({
    url: '/systemManage/getUserInformation',
    method: 'get',
    params
  })
}
export function midifyUserStatus(data) { // 修改用户状态
  return request({
    url: '/systemManage/midifyUserStatus',
    method: 'post',
    data
  })
}
export function getUserList(params) { // 查询用户列表
  return request({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  })
}
export function addRole(data) { // 新增角色
  return request({
    url: '/systemManage/addRole',
    method: 'post',
    data
  })
}
export function modifyRoleInformation(data) { // 修改角色信息
  return request({
    url: '/systemManage/modifyRoleInformation',
    method: 'post',
    data
  })
}
export function getFunctionListByRoleList(params) { // 查询角色信息
  return request({
    url: '/systemManage/getFunctionListByRoleList',
    method: 'get',
    params
  })
}

export function deleteRole(data) { // 删除角色信息
  return request({
    url: '/systemManage/deleteRole',
    method: 'post',
    data
  })
}
export function getRoleList(params) { // 查询角色列表
  return request({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  })
}
export function getRoleFunction(params) { // 查询角色功能列表
  return request({
    url: '/systemManage/getRoleFunction',
    method: 'get',
    params
  })
}
export function uploadImage(data) { // 上传图片
  return axios({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    url: process.env.VUE_APP_BASE_API + '/systemManage/uploadImage',
    timeout: 20000,
    data
  })
}
