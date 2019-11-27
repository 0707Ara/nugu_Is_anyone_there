const uuid = require('uuid').v4
const _ = require('lodash')
const { DOMAIN } = require('../config')
const config = require('./config.json')
const fs = require('fs')
let result=0;

function buyonion(result) {
  const results = []
  let midText = ''
  let resultText = ''
  let sum = 0
  
  let gathered=0
  let success='Fail'
  gathered=result;
  if(gathered == 5){
    success='Success'
  }

  return {gathered,success}
}

class NPKRequest {
  constructor (httpReq) {
    this.context = httpReq.body.context
    this.action = httpReq.body.action
    console.log(`NPKRequest: ${JSON.stringify(this.context)}, ${JSON.stringify(this.action)}`)
  }

  do(npkResponse) {
    this.actionRequest(npkResponse)
  }

  actionRequest(npkResponse) {
    console.log('actionRequest')
    console.dir(this.action)

    const actionName = this.action.actionName
    const parameters = this.action.parameters
 
    switch (actionName) {
    case 'ORDER_ONION':
        fs.readFile('./onion.json', 'utf8', (err, jsonString) => {
          if (err) {
              console.log("Error reading file from disk:", err)
              return
          }
          try {
              const onion_num = JSON.parse(jsonString)
              console.log("The number of onion is now", onion_num.onion) // => "Customer address is: Infinity Loop Drive"
      } catch(err) {
              console.log('Error parsing JSON string:', err)
          }
      })
      jsonReader('./onion.json', (err, onion_num) => {
        if (err) {
            console.log('Error reading file:',err)
            return
        }
    // increase customer order count by 1
    onion_num.onion += 1
    result=onion_num.onion
    if(onion_num.onion == 5){
      console.log("There are 5 people who wants to buy onion.")
    }
    fs.writeFile('./onion.json', JSON.stringify(onion_num), (err) => {
            if (err) console.log('Error writing file:', err)
        })
    })   
      const throwResult = buyonion(result)
      npkResponse.setOutputParameters(throwResult)
      break
    }
  }
}

class NPKResponse {
  constructor () {
    console.log('NPKResponse constructor')

    this.version = '2.0'
    this.resultCode = 'OK'
    this.output = {}
    this.directives = []
  }

  setOutputParameters(throwResult) {

    this.output = {
      gathered: throwResult.diceCount,
      success: throwResult.sum,
    }
  }

}

const nuguReq = function (httpReq, httpRes, next) {
  npkResponse = new NPKResponse()
  npkRequest = new NPKRequest(httpReq)
  npkRequest.do(npkResponse)
  console.log(`NPKResponse: ${JSON.stringify(npkResponse)}`)
  return httpRes.send(npkResponse)
};

module.exports = nuguReq;
