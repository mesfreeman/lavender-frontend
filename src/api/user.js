import axios from '@/libs/api.request'

export const list = (data) => {
  return axios.request({
    url: '/api/manage/user/list',
    data: data,
    method: 'post'
  })
}
