import env from './env'

const DEV_URL = 'http://double.dandy.fun'
const PRO_URL = 'https://dandy.fun'

export default env === 'development' ? DEV_URL : PRO_URL
