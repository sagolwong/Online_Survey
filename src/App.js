import React, { Component } from 'react'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <Footer />
      </div>
    )
  }
}

