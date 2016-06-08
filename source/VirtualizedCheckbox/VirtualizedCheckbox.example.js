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
      results: undefined,
      canceled: false
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
            labelKey={'name'}
            onOk={(args) => this.setState({results: args, canceled: false})}
            onCancel={() => this.setState({results: [], canceled: true})}
          />
        </div>
        <Results canceled={this.state.canceled} results={this.state.results} />
      </div>
    )
  }
}

const Results = ({canceled, results}) => {
  let message
  if (canceled) {
    message = <div>Selection canceled</div>
  } else {
    if (!results) {
      message = <div></div>
    } else {
      message = (
        <div>
          <div>
            {results.length} option{results.length > 1 ? 's' : ''} selected.
          </div>
          <div>
            {results.join(' ')}
          </div>
        </div>
    ) }
  }
  return (
    <div>
      <h4 className={styles.header}>
       Results
      </h4>
      {message}
    </div>
  )
}
