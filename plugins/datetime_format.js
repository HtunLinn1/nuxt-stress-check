import Vue from 'vue'
import moment from 'moment'

Vue.filter('datetime', function (value) {
  const datetime = moment(value)
  return moment(datetime).format('YYYY年MM月DD日 HH時mm分')
})
