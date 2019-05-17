import React, { useState, Component } from 'react'
import axios from 'axios'
import Select from 'react-dropdown-select'
class Scripterv2 extends Component {
  handleChange(selectedItems) {
    this.setState({ selectedItems })
  }
  render() {
    const { options } = this.state
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="display-4 text-center">efi Scripter</div>
              <p className="lead text-center">
                Full one-click kernel and user-process debugs
              </p>
              <Select
                options={options}
                onChange={values => this.setValues(values)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/*
const Scripterv2 = () => {


  const { hotfix, mod, ver, isJumbo, srNum, jumbo } = formData
  const { msg } = response
  return (
   
  )
}
*/
export default Scripterv2
