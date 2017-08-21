import React, { Component } from 'react';
import { List } from 'react-virtualized';

const Checkbox = ({ onChange, checked, label, style }) =>
  <div style={{ ...style, textAlign: 'left' }}>
    <label>
      <input
        type="checkbox"
        value={label}
        onChange={onChange}
        checked={checked || false}
      />
      {label}
    </label>
  </div>;

class Checkboxes extends Component {
  componentWillReceiveProps() {
    this.list.forceUpdateGrid();
  }

  handleChange = event => {
    const { labelKey, onChange } = this.props;
    onChange({ [labelKey]: event.target.value, checked: event.target.checked });
  };

  handleSelectAllChange = event => {
    const { onSelectAllChange } = this.props;
    onSelectAllChange(event.target.checked);
  };
  checkboxRenderer = ({ index, style }) => {
    const { items, filtered, labelKey } = this.props;

    if (index === 0) {
      const label = filtered ? '(Select all search results)' : '(Select all)';
      const checked = items.filter(i => i.checked).length === items.length;
      return (
        <Checkbox
          style={style}
          key={'#ALL#'}
          onChange={this.handleSelectAllChange}
          label={label}
          checked={checked}
        />
      );
    }
    const item = items[index - 1];
    return (
      <Checkbox
        style={style}
        key={item[labelKey]}
        onChange={this.handleChange}
        label={item[labelKey]}
        checked={item.checked}
      />
    );
  };
  render() {
    const { items, rowHeight, height, width } = this.props;
    const rowCount = items.length + 1;
    return (
      <List
        height={height}
        width={width}
        ref={ref => {
          this.list = ref;
        }}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowRenderer={this.checkboxRenderer}
      />
    );
  }
}

export default Checkboxes;
