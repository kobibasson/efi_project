import React, { Component } from 'react'

import './Landing.css'

export default class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">efi</h1>
                <p className="lead"> Automating troubleshooting since 2018</p>
                <hr />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row align-items-start">
              <div className="col">
                <h1 className="display-4">Scripter</h1>
              </div>
              <div className="col">
                <h1 className="display-4">Injector</h1>
              </div>
              <div className="col">
                <h1 className="display-4">Hotfixer</h1>
              </div>
              <div className="col">
                <h1 className="display-4">SIP Verifier</h1>
              </div>
            </div>
            <hr />
            <div className="credits">
              <h5>For bug reports / suggestions</h5>
              <p className="lead">Kobi Basson - kobib@checkpoint.com</p>
              <p className="lead">Uri Yahalom - uriya@checkpoint.com</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
