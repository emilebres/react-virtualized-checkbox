import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AutoSizer } from 'react-virtualized';

import Checkboxes from './Checkboxes';

function getDistinctFast(items, key) {
  let unique = {};
  let distinct = [];
  for (let opt of items) {
    if (typeof unique[opt[key]] === 'undefined') {
      distinct.push(opt);
    }
    unique[opt[key]] = 0;
  }
  return distinct;
}

// Fast function to update items
// Use the fact that both arrays are sorted and have no duplicates
// and that all elements of the second array are present in the first array
function updateItems(base, items, labelKey) {
  let index = 0;
  for (let it of items) {
    while (base[index][labelKey] !== it[labelKey]) {
      index += 1;
    }
    base[index].checked = it.checked;
  }
  return base;
}

const FilterBar = ({ value, onChange, height, width }) =>
  <div style={{ height }}>
    <input
      style={{ width }}
      type="text"
      id="filter"
      placeholder="Filter boxes"
      value={value}
      onChange={event => onChange(event.target.value)}
    />
  </div>;

const Footer = ({
  width,
  height,
  hasOkButton,
  hasCancelButton,
  onOk,
  onCancel
}) =>
  <div style={{ display: 'flex', width, height }}>
    {hasOkButton && <input type="button" value="Ok" onClick={onOk} />}
    {hasCancelButton &&
      <input type="button" value="Cancel" onClick={onCancel} />}
  </div>;

class VirtualizedCheckbox extends Component {
  static propTypes = {
    hasCancelButton: PropTypes.bool,
    hasFilterBox: PropTypes.bool,
    hasOkButton: PropTypes.bool,
    height: PropTypes.number,
    items: PropTypes.array,
    labelKey: PropTypes.string,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onOk: PropTypes.func,
    rowHeight: PropTypes.number,
    textFilter: PropTypes.string
  };

  static defaultProps = {
    hasOkButton: true,
    hasCancelButton: true,
    hasFilterBox: true,
    labelKey: 'label',
    onCancel: () => null,
    onChange: () => null,
    onOk: () => null,
    items: [],
    rowHeight: 30,
    textFilter: ''
  };

  constructor(props) {
    super(props);
    const { items: propsItems, labelKey, textFilter } = props;

    const objectItems =
      typeof propsItems[0] === 'string'
        ? propsItems.map(item => ({ [labelKey]: item }))
        : propsItems;
    const items = getDistinctFast(objectItems, labelKey);
    this.state = {
      items,
      filter: textFilter
    };
  }

  handleSelectAllChange = checked => {
    const items = this.getFilteredItems().map(it => ({ ...it, checked }));
    this.setState(prevState => ({
      items: updateItems(prevState.items, items, this.props.labelKey)
    }));
    if (this.props.onChange) {
      this.props.onChange(items);
    }
  };

  handleChange = eventTarget => {
    const index = this.state.items.findIndex(
      it => it[this.props.labelKey] === eventTarget[this.props.labelKey]
    );
    const items = [...this.state.items];
    items[index].checked = eventTarget.checked;
    this.setState(prevState => ({
      items
    }));
    if (this.props.onChange) {
      this.props.onChange(items[index]);
    }
  };

  handleFilterChange = filter => {
    this.setState(() => ({
      filter
    }));
  };

  getFilteredItems = () => {
    const { items, filter } = this.state;
    return items.filter(
      it =>
        it[this.props.labelKey] &&
        it[this.props.labelKey].toLowerCase().startsWith(filter.toLowerCase())
    );
  };

  handleOkClick = () => {
    const { items, filter } = this.state;
    const checkedItems = items.filter(i => i.checked);
    this.props.onOk(checkedItems, checkedItems.length === items.length, filter);
  };

  handleCancelClick = () => this.props.onCancel();

  render() {
    const {
      rowHeight,
      hasOkButton,
      hasCancelButton,
      hasFilterBox,
      height,
      width: propWidth
    } = this.props;
    const hasFooter = hasOkButton || hasCancelButton;
    const virtualScrollHeight = h => {
      let i = 0;
      if (hasFooter) {
        i += 1;
      }
      if (hasFilterBox) {
        i += 1;
      }
      const actualHeight = height || h;
      return actualHeight - i * rowHeight;
    };
    return (
      <AutoSizer>
        {({ width, height }) =>
          <div>
            {hasFilterBox
              ? <FilterBar
                  value={this.state.filter}
                  onChange={this.handleFilterChange}
                  height={rowHeight}
                  width={propWidth || width}
                />
              : null}
            <Checkboxes
              height={virtualScrollHeight(height)}
              width={propWidth || width}
              items={this.getFilteredItems()}
              labelKey={this.props.labelKey}
              filtered={!!this.state.filter}
              rowHeight={rowHeight}
              onChange={this.handleChange}
              onSelectAllChange={this.handleSelectAllChange}
            />
            {hasFooter
              ? <Footer
                  onOk={this.handleOkClick}
                  onCancel={this.handleCancelClick}
                  width={propWidth || width}
                  height={rowHeight}
                  hasOkButton={hasOkButton}
                  hasCancelButton={hasCancelButton}
                />
              : null}
          </div>}
      </AutoSizer>
    );
  }
}

export default VirtualizedCheckbox;
