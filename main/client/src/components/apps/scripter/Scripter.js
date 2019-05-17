import React, { Component } from 'react'

class Scripter extends Component {
  render() {
    return (
      <div className="sipVerifier">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="display-4 text-center">Scripter - Legacy App</div>
              <p className="lead">Full screen available at:</p>
              <a href="https://efi:8443/apps/scripter.html">
                https://efi:8443/apps/scripter.html
              </a>
              <br />
              <iframe
                src="https://efi:8443/apps/scripter.html"
                height="700"
                width="800"
                frameBorder="0"
                scrolling="yes"
                title="Scripter"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Scripter
