import React, { Component, PropTypes } from 'react'
import List from 'react-virtualized/dist/commonjs/List'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'

const Checkbox = ({ onChange, checked, label, style }) => (
  <div style={{ ...style, textAlign: 'left' }}>
    <label>
      <input
        type='checkbox'
        value={label}
        onChange={onChange}
        checked={checked || false}
      />
      {label}
    </label>
  </div>
)

class VirtualizedCheckbox extends Component {
  static propTypes = {
    hasButtons: PropTypes.bool,
    hasFilterBox: PropTypes.bool,
    labelKey: PropTypes.string,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onOk: PropTypes.func,
    items: PropTypes.array,
    rowHeight: PropTypes.number,
    textFilter: PropTypes.string,
    valueKey: PropTypes.string
  };

  static defaultProps = {
    hasButtons: true,
    hasFilterBox: true,
    labelKey: 'label',
    onCancel: () => null,
    onChange: () => null,
    onOk: () => null,
    items: [],
    rowHeight: 30,
    textFilter: '',
    valueKey: 'value'
  };

  constructor (props) {
    super(props)
    const { items, labelKey, valueKey, textFilter } = props

    let allBox = {}
    allBox[valueKey] = '#ALL#'
    allBox[labelKey] = '(Select all)'

    const objectItems = typeof items[0] === 'string'
      ? items.map(item => ({ [labelKey]: item, [valueKey]: item }))
      : items
    const _boxes = [allBox, ...this.getDistinctFast(objectItems, labelKey)]
    const boxes = this.applyTextFilter(textFilter, _boxes, labelKey)

    this.state = {
      boxes,
      textFilter
    }

    boxes[0].checked = this.checkedCounter === boxes.length - 1

    this._checkboxRenderer = this._checkboxRenderer.bind(this)
    this.onTextFilterChange = this.onTextFilterChange.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  getDistinctFast (items, labelKey) {
    let unique = {}
    let distinct = []
    for (let opt of items) {
      if (typeof unique[opt[labelKey]] === 'undefined') {
        distinct.push(opt)
      }
      unique[opt[labelKey]] = 0
    }
    return distinct
  }

  onChange (box) {
    const { valueKey, labelKey, onChange } = this.props
    const { boxes } = this.state
    if (box[valueKey] === '#ALL#') {
      if (this.checkedAll) {
        const newBoxes = boxes.map(box => ({ ...box, checked: false }))
        this.setState({
          boxes: newBoxes
        })
      } else {
        const newBoxes = boxes.map(box => ({ ...box, checked: true }))
        this.setState({
          boxes: newBoxes
        })
      }
    } else {
      const newBoxes = boxes.map(bx => {
        if (bx[labelKey] === box[labelKey]) {
          return { ...box, checked: !box.checked }
        }
        return bx
      })
      const newCheckedCounter = box.checked
        ? this.checkedCounter - 1
        : this.checkedCounter + 1
      if (this.checkedAll) {
        newBoxes[0].checked = false
      } else if (newCheckedCounter === boxes.length - 1) {
        newBoxes[0].checked = true
      }
      this.setState({
        boxes: newBoxes
      })
    }
    // this.list.forceUpdate()
    if (onChange) {
      onChange(box)
    }
  }

  onTextFilterChange (event) {
    const { labelKey } = this.props
    const { boxes } = this.state
    const textFilter = event.target.value
    const filteredBoxes = this.applyTextFilter(textFilter, boxes, labelKey)
    this.setState({ textFilter, boxes: filteredBoxes })
  }

  applyTextFilter (value, boxes, labelKey) {
    const textFilter = value.toLowerCase()
    const filteredBoxes = boxes.map(
      box =>
        box[labelKey].toLowerCase().startsWith(textFilter)
          ? { ...box, filtered: true }
          : { ...box, filtered: false }
    )
    if (textFilter) {
      filteredBoxes[0] = { ...filteredBoxes[0], filtered: false }
    } else {
      filteredBoxes[0] = { ...filteredBoxes[0], filtered: true }
    }
    return filteredBoxes
  }

  get checkedBoxes () {
    const { boxes } = this.state
    if (this.checkedAll) {
      return boxes.slice(1)
    } else {
      return boxes
        .slice(1)
        .filter(box => box.filtered)
        .filter(box => box.checked)
    }
  }

  get checkedAll () {
    const { boxes, textFilter } = this.state
    return boxes[0].checked && !textFilter
  }

  get checkedCounter () {
    const { boxes } = this.state
    return boxes.filter(box => box.filtered).filter(box => box.checked).length
  }

  render () {
    const { rowHeight, hasButtons, hasFilterBox } = this.props
    const { boxes, textFilter } = this.state
    const filteredBoxes = boxes.filter(box => box.filtered)
    const virtualScrollHeight = height => {
      let i = 0
      if (hasButtons) i++
      if (hasFilterBox) i++
      return height - (i * rowHeight)
    }
    return (
      <AutoSizer>
        {({ width, height }) => (
          <div>
            {hasFilterBox
              ? <div style={{ height: rowHeight }}>
                <input
                  type='text'
                  id='filter'
                  placeholder='Filter boxes'
                  value={textFilter}
                  onChange={this.onTextFilterChange}
                />
              </div>
              : null}
            <List
              height={virtualScrollHeight(height)}
              width={width}
              rowCount={filteredBoxes.length}
              rowHeight={rowHeight}
              rowRenderer={this._checkboxRenderer}
              boxes={filteredBoxes}
              {...this.props}
            />
            {hasButtons
              ? <div style={{ display: 'flex', width, height: rowHeight }}>
                <input
                  type='button'
                  value='Ok'
                  onClick={() =>
                    this.props.onOk(
                      this.checkedAll,
                      this.checkedBoxes,
                      textFilter
                    )}
                />
                <input
                  type='button'
                  value='Cancel'
                  onClick={() => this.props.onCancel()}
                />
              </div>
              : null}
          </div>
        )}
      </AutoSizer>
    )
  }

  _checkboxRenderer ({ index, style }) {
    const { valueKey, labelKey } = this.props
    const { boxes } = this.state
    let box = boxes.filter(box => box.filtered)[index]
    if (box[valueKey] === '#ALL#') {
      box = { ...box, style: { color: 'black' } }
    }
    return (
      <Checkbox
        style={style}
        key={box[labelKey]}
        onChange={() => this.onChange(box)}
        label={box[labelKey]}
        checked={box.checked}
      />
    )
  }
}

export default VirtualizedCheckbox
