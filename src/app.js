const fs = require('fs-extra')
const _ = require('lodash')
const express = require('express')
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const bodyParser = require('body-parser')

const uploadsRaw = 'app/temp/'
const uploadDir = 'app/uploads/'
const upload = multer({ dest: uploadsRaw })

const httpPort = 3011

let app = express()
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))

app.post('/uploadFile', upload.array('uploadFile', 40), (req, res) => {
  res.json({res: req.files})
})

app.listen(httpPort, function () {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    if (err) console.error(err)
    console.log('addr: ' + add + ':' + httpPort)
  })
})
