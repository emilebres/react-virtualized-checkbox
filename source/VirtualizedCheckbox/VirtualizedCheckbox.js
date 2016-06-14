import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer} from 'react-virtualized'
import 'react-virtualized/styles.css'

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
    var allBox = {}
    allBox[valueKey] = '#ALL#'
    allBox[labelKey] = '(Select all)'
    const objectOptions = typeof (options[0]) === 'string'
      ? options.map(option => ({label: option, value: option})) : options
    const boxes = [allBox, ...this.getDistinctFast(objectOptions, labelKey)]
    const checkedCounter = boxes.filter(box => box.checked).length
    const checkedAll = checkedCounter === boxes.length - 1
    if (checkedCounter === boxes.length - 1) { boxes[0].checked = true }
    this.state = {
      boxes: boxes,
      checkedCounter,
      valueKey,
      labelKey,
      checkedAll
    }
    this._checkboxRenderer = this._checkboxRenderer.bind(this)
    // this.checkedBoxes = this.checkedBoxes.bind(this)
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
    return distinct
  }

  onChange (box) {
    const {valueKey, labelKey, boxes, checkedCounter} = this.state
    if (box[valueKey] === '#ALL#') {
      if (boxes[0].checked) {
        const newBoxes = boxes.map(box => ({...box, checked: false}))
        this.setState({
          boxes: newBoxes,
          checkedCounter: 0,
          checkedAll: false
        })
      } else {
        const newBoxes = boxes.map(box => ({...box, checked: true}))
        this.setState({
          boxes: newBoxes,
          checkedCounter: boxes.length - 1,
          checkedAll: false
        })
      }
    } else {
      const newBoxes = boxes.map(bx => bx[labelKey] === box[labelKey] ? {...box, checked: !box.checked} : bx)
      const newCheckedCounter = box.checked ? checkedCounter - 1 : checkedCounter + 1
      var checkedAll
      if (boxes[0].checked) {
        newBoxes[0].checked = false
        checkedAll = false
      } else if (newCheckedCounter === boxes.length - 1) {
        newBoxes[0].checked = true
        checkedAll = true
      }
      this.setState({
        boxes: newBoxes,
        checkedCounter: newCheckedCounter,
        checkedAll
      })
    }
  }

  get checkedBoxes () {
    const {labelKey, boxes} = this.state
    if (boxes[0].checked) {
      return boxes.slice(1).map(box => box[labelKey])
    } else {
      return boxes.slice(1)
        .filter(box => box.checked)
        .map(box => box[labelKey])
    }
  }

  get checkedAll () {
    return this.state.checkedAll
  }

  render () {
    const {rowHeight} = this.props
    const {boxes} = this.state
    return (
      <AutoSizer>
          {({width, height}) =>
            <div>
              <VirtualScroll
                height={height - rowHeight}
                width={width}
                rowCount={boxes.length}
                rowHeight={rowHeight}
                rowRenderer={this._checkboxRenderer}
                boxes={boxes}
              />
              <div style={{display: 'flex', width, height: rowHeight}}>
                <input type='button' value='Ok' onClick={() => this.props.onOk(this.checkedAll, this.checkedBoxes)} />
                <input type='button' value='Cancel' onClick={() => this.props.onCancel()} />
              </div>
            </div>
          }
      </AutoSizer>
    )
  }

  _checkboxRenderer ({index, isScrolling}) {
    const {labelKey, boxes} = this.state
    const box = boxes[index]
    return <Checkbox key={box[labelKey]} onChange={() => this.onChange(box)} label={box[labelKey]} {...box} />
  }
}

export default CheckboxGroup
