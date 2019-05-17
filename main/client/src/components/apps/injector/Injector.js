import React, { Component } from 'react'
import classnames from 'classnames'
import axios from 'axios'

import './Injector.css'
import networkImage from './inj1.png'
import Spinner from '../../layout/Spinner'

class Injector extends Component {
  state = {
    files: [],
    gateway: null,
    extensions: ['pcap', 'cap'],
    output: null,
    errors: {},
    loading: false
  }

  handleFile(e) {
    const files = e.target.files
    var fileError
    if (!files[0]) {
      fileError = 'No file selected'
    } else if (files[0] && files[0].size > 20000000) {
      fileError = 'Max file size is 20Mb'
    } else if (!this.state.extensions.some(el => files[0].name.includes(el))) {
      fileError = 'Only pcap or cap extensions allowed'
    } else {
      fileError = null
      this.setState({ files: files })
    }
    this.setState({
      errors: { ...this.state.errors, file: fileError }
    })
  }

  handleIP(e) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        e.target.value
      )
    ) {
      this.setState({
        errors: { ...this.state.errors, ip: null },
        gateway: e.target.value
      })
    } else {
      this.setState({
        errors: { ...this.state.errors, ip: 'Invalid IP address' }
      })
    }
  }

  handleUpload(e) {
    if (
      !this.state.errors.ip &&
      !this.state.errors.file &&
      this.state.files[0]
    ) {
      this.setState({ loading: true })
      const formdata = new FormData()
      formdata.append('injector', this.state.files[0])
      formdata.append('gateway', this.state.gateway)

      axios({
        url: '/api/injector',
        method: 'POST',
        data: formdata
      })
        .then(res => {
          this.setState({ loading: false })
          alert(res.data)
        })
        .catch(err => {
          this.setState({ loading: false })
          alert(err.response.data)
        })
    }
  }

  render() {
    const { errors, loading } = this.state
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="display-4 text-center">efi Injector</div>
              <p className="lead text-center">Quickly inject pcap files</p>
              <form className="form-group">
                <p className="font-weight-bold">Instructions</p>
                <p>
                  Start by setting up a gateway with your preferred blades.
                  Next, connect an interface to SEC_LABS_LAN1 network on the VM
                  settings. Finally, choose an IP on 192.168.0.0/16 network per
                  your assigned IP. For example, if my assigned subnet is
                  172.30.157.0, I will choose an IP from 192.168.157.0/24.
                  <br />
                  <br />
                  Injection is currently available for TAC ESX host 11 only.
                </p>
                <p className="font-weight-bold">
                  Add your GW to SEC_LABS_LAN1 network
                </p>
                <img
                  src={networkImage}
                  alt=""
                  style={{
                    width: '420px'
                  }}
                />
                <p className="font-weight-bold">
                  Assign an IP from 192.168.0.0 and insert below:
                </p>
                <input
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.ip
                  })}
                  onChange={e => this.handleIP(e)}
                  placeholder="i.e 192.168.157.1"
                />
                {errors.ip && (
                  <div className="invalid-feedback">{errors.ip}</div>
                )}
                <p className="font-weight-bold">Choose PCAP file:</p>
                <input
                  className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.file
                  })}
                  type="file"
                  name="file"
                  onChange={e => this.handleFile(e)}
                />
                {errors.file && (
                  <div className="invalid-feedback">{errors.file}</div>
                )}
                {loading ? (
                  <Spinner />
                ) : (
                  <button
                    type="button"
                    className="btn btn-info btn-block mt-4"
                    onClick={e => this.handleUpload(e)}
                  >
                    Inject
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

export default Injector
