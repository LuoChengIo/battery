
import request from '@/utils/request'
export function homeCount(data) {
  return request({
    url: '/homeManage/count',
    method: 'get',
    data
  })
}
