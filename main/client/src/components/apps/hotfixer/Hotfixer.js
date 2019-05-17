import React, { useState } from 'react'
import axios from 'axios'

import Spinner from '../../layout/Spinner'

const Hotfixer = () => {
  const [formData, setFormData] = useState({
    hotfix: '',
    mod: 'fw1_wrapper',
    ver: 'R80_20',
    isJumbo: 'no',
    jumbo: '',
    srNum: ''
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({ msg: '' })
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setResponse({ msg: '' })
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const body = JSON.stringify(formData)
      const res = await axios.post('/api/hotfixer', body, config)
      await setResponse(res.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setResponse(err)
      setLoading(false)
    }
  }

  const { hotfix, mod, ver, isJumbo, srNum, jumbo } = formData
  const { msg } = response
  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="display-4 text-center">efi Hotfixer</div>
            <p className="lead text-center">Automating the hotfix upload</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
              <p className="font-weight-bold">Instructions</p>
              <p>
                <a
                  href="http://ftp-win.checkpoint.com:8181/TACUsers/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Click here
                </a>{' '}
                to create an SFTP folder. Once created fill in the info below.
                The hotfix would be uploaded to the specified SFTP folder.
              </p>
              <select
                className="form-control form-control-lg"
                onChange={e => onChange(e)}
                name="isJumbo"
                value={isJumbo}
              >
                <option value="no">Private Hotfix</option>
                <option value="yes">Jumbo Hotfix</option>
              </select>
              {isJumbo === 'yes' ? (
                <>
                  <select
                    className="form-control form-control-lg"
                    onChange={e => onChange(e)}
                    name="ver"
                    value={ver}
                  >
                    <option value="R80_20">R80.20</option>
                    <option value="R80_10">R80.10</option>
                    <option value="R77_30">R77.30</option>
                  </select>
                  <input
                    type="text"
                    name="jumbo"
                    value={jumbo}
                    className="form-control form-control-lg"
                    onChange={e => onChange(e)}
                    placeholder="Jumbo take"
                    required
                  />
                </>
              ) : null}
              {isJumbo === 'no' ? (
                <>
                  <select
                    className="form-control form-control-lg"
                    onChange={e => onChange(e)}
                    name="mod"
                    value={mod}
                  >
                    <option value="fw1_wrapper">fw1_wrapper</option>
                    <option value="vsec_wrapper">vsec_wrapper</option>
                    <option value="sim">sim</option>
                    <option value="securePlatform">securePlatform</option>
                    <option value="cvpn">cvpn</option>
                    <option value="ReportingServer">ReportingServer</option>
                    <option value="mgmt_wrapper">mgmt_wrapper</option>
                  </select>
                  <input
                    type="text"
                    name="hotfix"
                    value={hotfix}
                    className="form-control form-control-lg"
                    onChange={e => onChange(e)}
                    placeholder="Hotfix Name"
                    required
                  />
                </>
              ) : null}{' '}
              <br />
              <br /> <h6>Server: sftp.checkpoint.com</h6>
              <input
                type="text"
                name="srNum"
                value={srNum}
                className="form-control form-control-lg"
                onChange={e => onChange(e)}
                placeholder="SFTP Folder (SR Number)"
                required
              />
              <small className="form-text text-muted">
                {' '}
                * 700Mb jumbo hotfix uploads in under 40 seconds
                <br />* Due to server's location, only IL sftp server is listed{' '}
              </small>
              {loading ? (
                <Spinner />
              ) : (
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Upload"
                />
              )}
              {msg && <p>{msg}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hotfixer
