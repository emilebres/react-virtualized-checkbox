import React, { Component, PropTypes } from 'react'
import CheckboxGroup from './VirtualizedCheckbox'
import styles from './VirtualizedCheckbox.example.css'

export default class VirtualizedCheckboxExample extends Component {

  static propTypes = {
    cityData: PropTypes.array.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      result: ['']
    }
  }

  render () {
    return (
      <div>
        <h4 className={styles.header}>
         Default Option Renderer
        </h4>

        <div className={styles.description}>
         Displays a list of the 1,000 largest cities in the world.
        </div>
        <div>
          <CheckboxGroup
            options={this.props.cityData}
            onOk={(args) => this.setState({result: args})}
            onCancel={() => this.setState({result: ['checkboxes selection canceled']})}
          />
        </div>
        <div>
          <h4 className={styles.header}>
           Results
          </h4>
          {this.state.result.join(' ')}
        </div>
      </div>
    )
  }
}
