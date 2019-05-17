import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/landing/Landing'
import Scripter from './components/apps/scripter/Scripter'
import Scripterv2 from './components/apps/scripter/Scripterv2'
import SipVerifier from './components/apps/sipVerifer/SipVerifier'
import Injector from './components/apps/injector/Injector'
import Instructions from './components/apps/sipVerifer/Instructions'
import './App.css'
import Hotfixer from './components/apps/hotfixer/Hotfixer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/apps/scripter" component={Scripter} />
          <Route exact path="/apps/scripterv2" component={Scripterv2} />
          <Route exact path="/apps/injector" component={Injector} />
          <Route exact path="/apps/sipverify" component={SipVerifier} />
          <Route
            exact
            path="/apps/sipverifier/instructions"
            component={Instructions}
          />
          <Route exact path="/apps/hotfixer" component={Hotfixer} />
        </Router>
        <Footer />
      </div>
    )
  }
}

export default App
