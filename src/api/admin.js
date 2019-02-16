import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: '/api/manage/admin/login',
    data: { name: userName, password: password },
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
