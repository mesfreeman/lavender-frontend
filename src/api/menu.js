import axios from '@/libs/api.request'

export const list = (data) => {
  return axios.request({
    url: '/api/manage/menu/list',
    data: data,
    method: 'post'
  })
}

export const add = (data) => {
  return axios.request({
    url: '/api/manage/menu/add',
    data: data,
    method: 'post'
  })
}

export const view = (data) => {
  return axios.request({
    url: '/api/manage/menu/view',
    data: data,
    method: 'post'
  })
}

export const modify = (data) => {
  return axios.request({
    url: '/api/manage/menu/modify',
    data: data,
    method: 'post'
  })
}

export const deleteItem = (data) => {
  return axios.request({
    url: '/api/manage/menu/delete',
    data: data,
    method: 'post'
  })
}
