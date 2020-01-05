import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // headers: {
  //   'Content-Type': 'application/json'
  // },
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [
    function(data) {
      // Do whatever you want to transform the data
      data = Object.assign({}, data)
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (data[key] === '') {
            delete data[key]
          }
        }
      }
      const request = qs.stringify(data)
      // const request = JSON.stringify(data)
      return request
    }
  ],
  paramsSerializer: function(params) {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (params[key] === '') {
          delete params[key]
        }
      }
    }
    return qs.stringify(params)
  },
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 1) {
      // eslint-disable-next-line eqeqeq
      if (res.code == 80001) {
        // to re-login
        MessageBox.confirm('你的登录已失效，你可以重新登录或者取消。', '登录失效', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
        return Promise.reject(res.msg || 'error')
      }
      Message({
        message: res.msg || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.msg || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
