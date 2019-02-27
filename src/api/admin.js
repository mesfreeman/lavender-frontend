import axios from '@/libs/api.request'

export const login = ({ userName, password, remember }) => {
  return axios.request({
    url: '/api/manage/admin/login',
    data: { email: userName, password: password, remember: remember },
    method: 'post'
  })
}

export const getLoginAdmin = (token) => {
  return axios.request({
    url: '/api/manage/admin/getLoginAdmin',
    data: { adminAccessToken: token },
    method: 'post'
  })
}

export const getMenuInfo = (token) => {
  return axios.request({
    url: '/api/manage/admin/myMenus',
    data: { adminAccessToken: token },
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/api/manage/admin/logout',
    data: { adminAccessToken: token },
    method: 'post'
  })
}

export const viewProfile = (data) => {
  return axios.request({
    url: '/api/manage/admin/viewProfile',
    data: data,
    method: 'post'
  })
}

export const modifyProfile = (data) => {
  return axios.request({
    url: '/api/manage/admin/modifyProfile',
    data: data,
    method: 'post'
  })
}

export const list = (data) => {
  return axios.request({
    url: '/api/manage/admin/list',
    data: data,
    method: 'post'
  })
}
