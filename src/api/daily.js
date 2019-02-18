import axios from '@/libs/api.request'

export const list = (data) => {
  return axios.request({
    url: '/api/manage/daily/list',
    data: data,
    method: 'post'
  })
}

export const add = (data) => {
  return axios.request({
    url: '/api/manage/daily/add',
    data: data,
    method: 'post'
  })
}

export const modify = (data) => {
  return axios.request({
    url: '/api/manage/daily/modify',
    data: data,
    method: 'post'
  })
}

export const view = (data) => {
  return axios.request({
    url: '/api/manage/daily/view',
    data: data,
    method: 'post'
  })
}

export const captureCover = (data) => {
  return axios.request({
    url: '/api/manage/daily/captureCover',
    data: data,
    method: 'post'
  })
}

export const captureNote = (data) => {
  return axios.request({
    url: '/api/manage/daily/captureNote',
    data: data,
    method: 'post'
  })
}
