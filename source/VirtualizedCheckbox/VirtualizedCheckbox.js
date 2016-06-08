import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer} from 'react-virtualized'

const Checkbox = ({onChange, checked, name}) => (
      <label>
        <input
          type='checkbox'
          onChange={() => onChange()}
          checked={checked}
        />
      {name}
      </label>
    )

class CheckboxGroup extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired
  };

  static defaultProps = {
    maxHeight: 300,
    rowHeight: 30,
    onOk: () => null,
    onCancel: () => null
  };

  constructor (props) {
    super(props)
    this.checkboxRenderer = this.checkboxRenderer.bind(this)
    const distinctBoxes = this.getDistinctFast(props.options)
    const boxes = [{code: '#ALL#', name: '(Select all)', indeterminate: true}, ...distinctBoxes]
    const checkedCounter = distinctBoxes.filter(box => box.checked).length
    this.state = {
      boxes: boxes,
      checkedCounter
    }
    this.checkedBoxes = this.checkedBoxes.bind(this)
  }

  getDistinctFast (boxes) {
    var unique = {}
    var distinct = []
    for (var i in boxes) {
      if (typeof (unique[boxes[i].name]) === 'undefined') {
        distinct.push(boxes[i])
      }
      unique[boxes[i].name] = 0
    }
    return distinct
  }

  onChange (box) {
    if (box.code === '#ALL#') {
      if (this.state.boxes[0].checked) {
        const newBoxes = this.state.boxes.map(box => Object.assign(box, {checked: false}))
        this.setState({
          boxes: newBoxes,
          checkedCounter: 0
        })
      } else {
        const newBoxes = this.state.boxes.map(box => Object.assign(box, {checked: true}))
        this.setState({
          boxes: newBoxes,
          checkedCounter: this.state.boxes.length - 1
        })
      }
    } else {
      const newBoxes = this.state.boxes.map(bx => bx.name === box.name ? {...box, checked: !box.checked} : bx)
      const newCheckedCounter = box.checked ? this.state.checkedCounter - 1 : this.state.checkedCounter + 1
      if (this.state.boxes[0].checked) {
        newBoxes[0].checked = false
      } else if (newCheckedCounter === this.state.boxes.length - 1) {
        newBoxes[0].checked = true
      }
      this.setState({
        boxes: newBoxes,
        checkedCounter: newCheckedCounter
      })
    }
  }

  checkedBoxes () {
    if (this.state.boxes[0].checked) {
      return this.state.boxes.slice(1).map(box => box.name)
    } else {
      return this.state.boxes.slice(1)
        .filter(box => box.checked)
        .map(box => box.name)
    }
  }

  render () {
    const {maxHeight, rowHeight} = this.props
    const height = Math.min(maxHeight, this.state.boxes.length * rowHeight)
    return (
      <div>
        <AutoSizer disableHeight>
          {({width}) =>
            <VirtualScroll
              height={height}
              width={width}
              rowCount={this.state.boxes.length}
              rowHeight={rowHeight}
              rowRenderer={this.checkboxRenderer}
              boxes={this.state.boxes}
              overscanRowCount={0}
            />
        }
        </AutoSizer>
        <input type='button' value='Ok' onClick={() => this.props.onOk(this.checkedBoxes())}/>
        <input type='button' value='Cancel' onClick={() => this.props.onCancel()}/>
      </div>
    )
  }

  checkboxRenderer ({index, isScrolling}) {
    const box = this.state.boxes[index]
    return <Checkbox key={box.name} onChange={() => this.onChange(box)} {...box} />
  }
}

export default CheckboxGroup
