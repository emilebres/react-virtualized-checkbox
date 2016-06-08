import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer} from 'react-virtualized'

const Checkbox = ({onChange, checked, label}) => (
  <label>
    <input
      type='checkbox'
      onChange={() => onChange()}
      checked={checked || false}
    />
  {label}
  </label>
  )

class CheckboxGroup extends Component {

  static propTypes ={
    options: PropTypes.array.isRequired,
    labelKey: PropTypes.string.isRequired,
    valueKey: PropTypes.string.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    maxHeight: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired
  }

  static defaultProps = {
    maxHeight: 300,
    rowHeight: 30,
    onOk: () => null,
    onCancel: () => null,
    labelKey: 'label',
    valueKey: 'value'
  }

  constructor (props) {
    super(props)
    const {options, labelKey, valueKey} = props
    this.checkboxRenderer = this.checkboxRenderer.bind(this)
    var allBox = {}
    allBox[valueKey] = '#ALL#'
    allBox[labelKey] = '(Select all)'
    const boxes = [allBox, ...this.getDistinctFast(options, labelKey)]
    const checkedCounter = boxes.filter(box => box.checked).length
    this.state = {
      boxes: boxes,
      checkedCounter,
      valueKey,
      labelKey
    }
    this.checkedBoxes = this.checkedBoxes.bind(this)
  }

  getDistinctFast (options, labelKey) {
    var unique = {}
    var distinct = []
    for (var i in options) {
      if (typeof (unique[options[i][labelKey]]) === 'undefined') {
        distinct.push(options[i])
      }
      unique[options[i][labelKey]] = 0
    }
    console.log(unique, distinct)
    console.log(options, labelKey)
    return distinct
  }

  onChange (box) {
    if (box[this.state.valueKey] === '#ALL#') {
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
      const newBoxes = this.state.boxes.map(bx => bx[this.state.labelKey] === box[this.state.labelKey] ? {...box, checked: !box.checked} : bx)
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
      return this.state.boxes.slice(1).map(box => box[this.state.labelKey])
    } else {
      return this.state.boxes.slice(1)
        .filter(box => box.checked)
        .map(box => box[this.state.labelKey])
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
            />
        }
        </AutoSizer>
        <input type='button' value='Ok' onClick={() => this.props.onOk(this.checkedBoxes())} />
        <input type='button' value='Cancel' onClick={() => this.props.onCancel()} />
      </div>
    )
  }

  checkboxRenderer ({index, isScrolling}) {
    const box = this.state.boxes[index]
    return <Checkbox key={box[this.state.labelKey]} onChange={() => this.onChange(box)} label={box[this.state.labelKey]} {...box} />
  }
}

export default CheckboxGroup
