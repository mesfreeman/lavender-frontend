import axios from '@/libs/api.request'

export const liteList = (data) => {
  return axios.request({
    url: '/api/manage/role/liteList',
    data: data,
    method: 'post'
  })
}
