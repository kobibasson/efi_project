import React, { Component } from 'react'
import classnames from 'classnames'
import axios from 'axios'
import { Link } from 'react-router-dom'

import Spinner from '../../layout/Spinner'
import sip from './sip.png'
import sip_dyn from './sip_dyn.png'
import siptcp from './siptcp.png'
import siptcp_dyn from './siptcp_dyn.png'

class SipVerifier extends Component {
  state = {
    files: [],
    nat: 'static',
    extensions: ['pcap', 'cap', 'txt', 'log'],
    output: { service: { handler: null, port: null } },
    errors: null,
    loading: false
  }
  componentDidMount() {
    this.setState({ errors: 'No files chosen' })
  }

  handleFile(e) {
    const files = e.target.files
    if (files.length !== 2) {
      this.setState({ errors: '2 files are required' })
    } else if ((files[0].size || files[1].size) > 20000000) {
      this.setState({ errors: 'Max file size is 20Mb' })
    } else if (
      !(
        this.state.extensions.some(el => files[0].name.includes(el)) &&
        this.state.extensions.some(el => files[1].name.includes(el))
      )
    ) {
      this.setState({
        errors: 'Invlaid file format: only pcap,cap,txt,log allowed'
      })
    } else {
      this.setState({ errors: null, files: files })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleUpload(e) {
    if (this.state.errors === null) {
      this.setState({ loading: true })
      const formdata = new FormData()
      Array.from(this.state.files).map(file => {
        formdata.append(file.name.split('.').pop(), file)
        return null
      })
      formdata.append('nat', this.state.nat)
      axios({
        url: '/api/sip',
        method: 'POST',
        data: formdata
      })
        .then(res => {
          var output = {
            ...res.data,
            service: {
              handler: res.data.service.split(':')[0],
              port: res.data.service.split(':')[1]
            }
          }
          console.log(output)
          switch (output.service.handler) {
            case 'sip_dyn':
              output.service.handler = sip_dyn
              break
            case 'siptcp_dyn':
              output.service.handler = siptcp_dyn
              break
            case 'siptcp':
              output.service.handler = siptcp
              break
            default:
              output.service.handler = sip
          }

          this.setState({ output: output, loading: false })
        })
        .catch(err => console.log(err))
    }
  }

  render() {
    const { output, errors, loading } = this.state

    return (
      <div className="sipVerifier">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="display-4 text-center">efi SIP Verifier</div>
              <p className="lead text-center">Easy SIP Troubleshooting</p>
              <form className="form-group">
                <p className="font-weight-bold">Instructions</p>
                <p>
                  To start, choose 2 files for analyzing, an fw monitor traffic
                  capture(pcap) and topology output from the relevant gateway of
                  the customer.{' '}
                  <Link to="/apps/sipverifier/instructions"> Click here </Link>
                  for explaination on how to collect this info.
                </p>

                <p style={{ textDecorationLine: 'underline' }}>
                  Only useful for customers who require SIP inspection
                </p>
                <p className="font-weight-bold">
                  PCAP and topology file are required:
                </p>
                <input
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors
                  })}
                  type="file"
                  name="file"
                  onChange={e => this.handleFile(e)}
                  multiple
                />
                {errors && <div className="invalid-feedback">{errors}</div>}
                <p className="font-weight-bold">Do the SIP servers use NAT?</p>
                <select
                  className="form-control form-control-lg"
                  onChange={e => this.onChange(e)}
                >
                  <option value="hide">Hide/Static NAT is in use</option>
                  <option value="no">No NAT is used</option>
                </select>

                {output.service.port === '5060\n' ? (
                  <img
                    src={output.service.handler}
                    alt=""
                    style={{
                      width: '730px'
                    }}
                  />
                ) : (
                  output.service.port && (
                    <p>
                      Port is different than 5060, use custom object with
                      handler.
                    </p>
                  )
                )}

                {output.flow && (
                  <>
                    <p style={{ textDecorationLine: 'underline' }}>
                      Traffic Flow:
                    </p>
                    <p>{output.flow}</p>
                  </>
                )}
                {output.earlyNat && <p>{output.earlyNat}</p>}
                {output.payloadNat && <p>{output.payloadNat}</p>}
                {loading ? (
                  <Spinner />
                ) : (
                  <button
                    type="button"
                    className="btn btn-info btn-block mt-4"
                    onClick={e => this.handleUpload(e)}
                  >
                    Analyze
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SipVerifier
