import jwt from 'jwt-simple'
import moment from 'moment'
import jsCookie from 'js-cookie'

export default {
  validateToke,
}

function validateToke() {
  let token = jsCookie.get('token')
  if (token) {
    // let tokenInfo = jwt.decode(token, '7R4D3RPL4N37')
    // let now = moment().format()

    // if (!moment(now).isAfter(tokenInfo.expire)) {
    //   return true
    // }

    return true
  } else {
    return false
  }
}
