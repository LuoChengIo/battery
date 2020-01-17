
import request from '@/utils/request'
export function homeCount(params) {
  return request({
    url: '/homeManage/count',
    method: 'get',
    params
  })
}
