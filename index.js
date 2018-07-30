
// 3rd party deps
const express = require('express')
const bodyParser = require('body-parser')
const randomBytes = require('randombytes')

// Globs
const port = 80;
const app = express()
const registeredDevices = {}

// Server initalization
app.use(
  bodyParser.json({
    'extended': true
  }
))

app.use(
  bodyParser.urlencoded({
    'extended': true
  })
)

app.listen(port, function(){
  console.log('Server started on port ' + port)
})

// Enpoints
app.get('/devices', function(req, res){
  let deviceList = getDeviceList();

  res.json(deviceList)
})

app.get('/update/:deviceID', function(req, res){
  let deviceType = req.params.deviceID
  let limit = parseInt(req.query.limit) || 1

  let deviceUpdateInformation = getDeviceUpdateInformation(deviceType, limit)

  res.json(deviceUpdateInformation)
})

app.get('/update/:deviceID/:updateID', function(req, res){
  let deviceType = req.params.deviceID
  let updateVersion = req.params.updateID

  let data = getUpdateBinary(deviceType, updateVersion)

  res.type('application/octet-stream').send(data).end()
})

app.post('/register', function(req, res){
  let name = req.body.name
  let deviceType = req.body.deviceType
  let ip = req.ip

  if(name == ''){
    res.status(400).send('{' + 
      '"errmsg": "Please supply a name"' +
    '}'
    )
    return
  }
  if(deviceType == ''){
    res.status(400).send('{' + 
      '"errmsg": "Please supply a deviceType"' +
    '}'
    )
    return
  }

  err = saveRegisteredDevice({
    'name': name,
    'deviceType': deviceType,
    'ip': ip
  })

  if(err){
    res.status(400).json(err)
  }
  else{
    res.end()
  }
})


// Helper Functions
function getDeviceList(){
  // Since this is a Concept API, our list of devices is hardcoded
  return ['Lamp', 'Outlet', 'Switch', 'Speaker', 'Assistant', 'Television']
}

function getDeviceUpdateInformation(deviceType, limit){
  // Since this is a Concept API, our device update information is hardcoded
  let deviceUpdateInformation = []; 
  switch (deviceType){
    case 'Lamp':
    case 'Outlet':
    case 'Switch':
    case 'Speaker':
    case 'Assistant':
    case 'Television':
      deviceUpdateInformation = [
        {'updateId': '0.0.1', 'deviceType': deviceType, 'size': '512b'},
        {'updateId': '0.0.2', 'deviceType': deviceType, 'size': '1Mb'},
        {'updateId': '0.0.3', 'deviceType': deviceType, 'size': '100Mb'},
      ]
  }

  return deviceUpdateInformation.reverse().slice(0, limit)
}

function getUpdateBinary(deviceType, updateVersion){
  // Since this is a Concept API, our update binary is actually /dev/random 
  // up to the desired size. 
  // For testing purposes, 0.0.1 is 512B, .2 is 1MB, and .3 is 100MB
  var data;
  switch(updateVersion){
    case '0.0.1':
      data = randomBytes(512)
      break
    case '0.0.2':
      data = randomBytes(1024 * 1024)
      break
    case '0.0.3':
      data = randomBytes(1024 * 1024 * 100)
      break
  }
  return data;
}

function saveRegisteredDevice(deviceRegistrationConfiguration){
  // Since this is a Concept API, state is not yet saved over restarts
  if( !(ddeviceRegistrationConfiguration.deviceType in getDeviceList()) ){
    return 'Device not supported'
  }
  registeredDevices[deviceRegistrationConfiguration.name] = 
    deviceRegistrationConfiguration
  
  return
}
