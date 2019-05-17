const express = require('express')
const shell = require('shelljs')
const upload = require('./multer')
const router = express()

const SipLog = require('../../models/SipLog')

//multer middleware
const sipUpload = upload.fields([
  { name: 'pcap', maxCount: 1 },
  { name: 'txt', maxCount: 1 }
])

router.post('/', sipUpload, async (req, res, err) => {
  //Get the file names and nat
  const pcap = './uploads/' + req.files.pcap[0].filename
  const txt = './uploads/' + req.files.txt[0].filename
  const { nat } = req.body

  const log = new SipLog({
    application: 'SIP Verifier',
    type: 'Success'
  })

  var output = {
    service: null,
    flow: null,
    earlyNat: null,
    payloadNat: null
  }

  const service = 'sh ./scripts/sip/HandlePcap.sh grule ' + pcap
  const flow = 'sh ./scripts/sip/HandlePcap.sh chktop ' + pcap + ' ' + txt
  const earlyNat = 'sh ./scripts/sip/HandlePcap.sh chkenat ' + pcap
  const payloadNat =
    'sh ./scripts/sip/HandlePcap.sh pyload ' + pcap + ' ' + nat + ' ' + txt

  // Each shell.exec(total of 4 commands), populate the Output object above.
  // Expected stdout is in HANDLER:PORT format
  output.service = await shell.exec(service, { silent: true }).stdout

  // Expected stdout is 'valid:flow', 'invalid:reason'
  output.flow = await shell.exec(flow, { silent: true }).stdout

  if (output.flow.includes('Invalid')) {
    output = {
      ...output,
      flow: 'Topology invalid: ' + output.flow.split(':').pop()
    }
  }

  // Expected stdout is a block of text
  output.earlyNat = await shell.exec(earlyNat, { silent: true }).stdout

  // Expected stdout is a block of text
  output.payloadNat = await shell.exec(payloadNat, { silent: true }).stdout

  if (output.service === 'Invalid') {
    output.error = 'Invalid pcap file'
    log = { ...log, type: 'Error' }
  }

  log.info = output

  await log
    .save()
    .then(() => console.log('SIP entry added to mongo.'))
    .catch(err => console.log(err))

  return res.json(output)
})

module.exports = router
