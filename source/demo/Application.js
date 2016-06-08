import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import VirtualizedCheckboxExample from '../VirtualizedCheckbox/VirtualizedCheckbox.example'
import cityData from './data/cities.js'
import styles from './Application.css'
import '../../styles.css'

class Application extends Component {
  render () {
    return (
      <div>
        <header className={styles.header}>
          <h1 className={styles.container}>
            React Virtualized Checkbox
          </h1>

          <div className={styles.container}>
            Checkbox group component powered by react-virtualized
          </div>

          <div className={styles.container}>
            Docs and code on <a className={styles.headerLink} href='https://github.com/emilebres/react-virtualized-checkbox/'>GitHub</a>.
          </div>
        </header>

        <section className={styles.container}>
          <VirtualizedCheckboxExample
            cityData={cityData}
          />
        </section>
      </div>
    )
  }
}

ReactDOM.render(
  <Application/>,
  document.getElementById('root')
)

// Import and attach the favicon
// document.querySelector('[rel="shortcut icon"]').href = require('file!./favicon.png')
