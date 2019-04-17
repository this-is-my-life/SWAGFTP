const superagent = require('superagent')
const preftp = require('ftp')
const ftp = require('ftp-deploy')
const preConnection = new preftp()

function connect () {
  let id = document.getElementById('inputID')
  let pw = document.getElementById('inputPW')
  let co = document.getElementById('inputCo')
  let form = document.getElementById('loginForm')
  superagent.get('https://api.myjson.com/bins/9r7vs')
  .set('Content-Type', 'application/json')
  .then((response) => {
    if (!id.value) {
      id.style.backgroundColor = 'lightpink'
    }
    if (!pw.value) {
      pw.style.backgroundColor = 'lightpink'
    }
    if (!response.body.users[id.value]) {
      if (response.body.inviteCodes.includes(co.value)) {
        response.body.users[id.value] = {
          passwd: pw.value
        }
        response.body.inviteCodes.splice(response.body.inviteCodes.indexOf(co.value), 1)
      } else {
        co.style.backgroundColor = 'lightpink'
        return 403
      }
    }
    id.style.backgroundColor = 'lightgreen'
    co.style.backgroundColor = 'lightgreen'
    if (response.body.users[id.value].passwd === pw.value) {
      pw.style.backgroundColor = 'lightgreen'
      form.style.display = 'none'
      superagent.put('https://api.myjson.com/bins/9r7vs')
        .set('Content-Type', 'application/json')
        .send(response.body)
        .catch((err) => {
          alert('Err502: ' + err)
        })
      preConnnect(id.value)
    } else { pw.style.backgroundColor = 'lightpink' }
  }).catch((err) => {
    alert('Err502: ' + err)
  })
}

function preConnnect (id) {
  preConnection.list('/StudentProject/' + id, (err) => {
    if (err) {
      preConnection.mkdir('/StudentProject/' + id, (err) => {
        if (err) { alert('Err502: ' + err) }
        preConnection.end()
      })
    }
  })
}

preConnection.connect({
  host: 'swagftp.iptime.org',
  port: 21,
  secure: false,
  user: 'Student',
  password: 'swag',
})

