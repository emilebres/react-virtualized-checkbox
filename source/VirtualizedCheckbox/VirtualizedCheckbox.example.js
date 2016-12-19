import React, { Component, PropTypes } from 'react'
import { Modal, Position } from 'react-overlays'
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
      canceled: false,
      hasButtons: true,
      hasFilterBox: true,
      showOverlay: false
    }

    this.handleFilterToggle = this.handleFilterToggle.bind(this)
    this.handleButtonsToggle = this.handleButtonsToggle.bind(this)
    this.openOverlay = this.openOverlay.bind(this)
    this.closeOverlay = this.closeOverlay.bind(this)
  }

  handleFilterToggle () {
    this.setState({hasFilterBox: !this.state.hasFilterBox})
  }

  handleButtonsToggle () {
    this.setState({hasButtons: !this.state.hasButtons})
  }

  openOverlay () {
    this.setState({ showOverlay: true })
  }

  closeOverlay () {
    this.setState({ showOverlay: false })
  }

  render () {
    const {hasButtons, hasFilterBox} = this.state
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
        <div>
          <h3>Example</h3>
          <div className={styles.description}>
           Displays a list of the 1,000 largest cities in the world.
          </div>
          <div className={styles.description}>
           Check the console to see the callback on each toggle of a checkbox.
          </div>
          <div style={{margin: '1rem 0'}}>
            <label style={{margin: '0 1rem'}}>
              <input type='checkbox' checked={hasFilterBox} onChange={this.handleFilterToggle} />
              Toggle filter box
            </label>
            <label style={{margin: '0 1rem'}}>
              <input type='checkbox' checked={hasButtons} onChange={this.handleButtonsToggle} />
              Toggle Ok and Cancel buttons
            </label>
          </div>
          <div style={{height: 300, boxShadow: '1px 1px 5px 0px rgba(0,0,0,0.75)'}}>
            <VirtualizedCheckbox
              items={this.props.cityData.map(opt => ({...opt, checked: true}))}
              labelKey='name'
              onOk={(all, checked, textFilter) => this.setState({all, results: checked, canceled: false, textFilter})}
              onCancel={() => this.setState({all: false, results: [], canceled: true, textFilter: ''})}
              onChange={(item) => console.log('onChange', item)}
              rowHeight={20}
              hasButtons={hasButtons}
              hasFilterBox={hasFilterBox}
            />
          </div>
          <Results canceled={this.state.canceled} results={this.state.results} all={this.state.all} textFilter={this.state.textFilter} />
        </div>
        <div>
          <h3>Component size</h3>
          <div className={styles.description}>
            The scroll size is inherited from its parent. It is demonstrated below where VirtualizedCheckbox is in a ResizableBox component. Try it out.
          </div>
          <ResizableBox width={400} height={300} minConstraints={[300, 90]}>
            <div style={divStyle}>
              <VirtualizedCheckbox
                items={this.props.cityData.map(opt => ({...opt, checked: true}))}
                labelKey='name'
                onChange={(item) => console.log('onChange', item)}
              />
            </div>
          </ResizableBox>
        </div>
        <div>
          <h3>In an overlay</h3>
          <button ref={ref => { this.overlayButton = ref }} onClick={this.openOverlay}>Open overlay</button>
          <Modal
            autoFocus={false}
            show={this.state.showOverlay}
            keyboard={false}
            onHide={this.closeOverlay}
            target={this.overlayButton}
            container={document.body}
            backdropStyle={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <Position
              placement='bottom'
              container={document.body}
              target={this.overlayButton}
              >
              <div style={{ position: 'absolute', ...divStyle, height: 300, width: 400 }}>
                <VirtualizedCheckbox
                  items={this.props.cityData.map(opt => ({...opt, checked: true}))}
                  labelKey='name'
                  onChange={(item) => console.log('onChange', item)}
                  onOk={this.closeOverlay}
                  onCancel={this.closeOverlay}
                />
              </div>
            </Position>
          </Modal>
        </div>
        <div style={{height: '10rem'}} />
      </div>
    )
  }
}

const Results = ({canceled, results, all, textFilter}) => {
  let message
  if (canceled) {
    message = <div>Selection canceled</div>
  } else if (all) {
    message = <div>All items selected</div>
  } else if (!results) {
    message = <div>No results yet</div>
  } else {
    message = (
      <div >
        <div>
          {textFilter ? `Text filter: ${textFilter}` : 'No text filter'}
        </div>
        <div>
          {results.length} item{results.length > 1 ? 's' : ''} selected.
        </div>
        <div>
          {results.map(item => item.name).join(' ')}
        </div>
      </div>
  ) }
  return (
    <div style={{margin: '1rem 0'}}>
      <div style={{border: '#2196f3 dotted 0.2rem', borderRadius: '1rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.1)'}}>
        {message}
      </div>
    </div>
  )
}
