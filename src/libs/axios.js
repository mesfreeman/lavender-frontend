import axios from 'axios'
import { Message } from 'iview'
import store from '@/store'
import Router from '@/router'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url.response)
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            Message.error(error.response.data.error.message)
            break;
          case 401:
            Message.error(error.response.data.error.message)
            store.dispatch('handleLogOut').then(() => {
              Router.push({ name: 'login' })
            })
            break
          case 403:
            Message.error(error.response.data.error.message)
            break
          case 404:
            Message.error('接口请求异常: ' + error.response.config.url + ', 请重试')
            break
          default:
            Message.error('Oops, 出错啦')
        }
      }

      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
