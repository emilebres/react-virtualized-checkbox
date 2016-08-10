import React, { Component, PropTypes } from 'react'
import VirtualizedCheckbox from './VirtualizedCheckbox'
import styles from './VirtualizedCheckbox.example.css'
import {ResizableBox} from 'react-resizable'
import 'react-resizable/css/styles.css'

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
    const divStyle = {
      backgroundColor: 'white',
      border: 'solid 1px',
      boxShadow: '0 5px 15px #9d9d9d',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '90%',
      height: '100%',
      justifyContent: 'space-between',
      padding: '3px',
      width: '100%'
    }
    return (
      <div>
        <h4 className={styles.header}>
         Default Option Renderer
        </h4>

        <div className={styles.description}>
         Displays a list of the 1,000 largest cities in the world.
        </div>
        <div style={{height: 300}}>
          <VirtualizedCheckbox
            items={this.props.cityData.map(opt => ({...opt, checked: true}))}
            labelKey={'name'}
            onOk={(all, checked) => this.setState({all, results: checked, canceled: false})}
            onCancel={() => this.setState({all: false, results: [], canceled: true})}
            rowHeight={20}
          />
        </div>
        <h4 className={styles.header}>
         In a resizable box
        </h4>
        <ResizableBox width={700} height={300} minConstraints={[700, 300]}>
          <div style={divStyle}>
            <VirtualizedCheckbox
              items={this.props.cityData.map(opt => ({...opt, checked: true}))}
              labelKey={'name'}
              onOk={(all, checked) => this.setState({all, results: checked, canceled: false})}
              onCancel={() => this.setState({all: false, results: [], canceled: true})}
            />
          </div>
        </ResizableBox>

        <Results canceled={this.state.canceled} results={this.state.results} all={this.state.all} />
      </div>
    )
  }
}

const Results = ({canceled, results, all}) => {
  let message
  if (canceled) {
    message = <div>Selection canceled</div>
  } else if (all) {
    message = <div>All options selected.</div>
  } else if (!results) {
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
  return (
    <div>
      <h4 className={styles.header}>
       Results
      </h4>
      {message}
    </div>
  )
}
