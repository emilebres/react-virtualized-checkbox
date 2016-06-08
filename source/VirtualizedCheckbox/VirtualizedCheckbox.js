import React, {Component, PropTypes} from 'react';
import {VirtualScroll, AutoSizer} from 'react-virtualized';

class Checkbox extends Component{
  render(){
    return (
      <label>
        <input
          type="checkbox"
          onChange={() => this.props.onChange()}
          checked={this.props.checked}
        />
        {this.props.label}
      </label>
    )
  }
}

class CheckboxGroup extends Component{

  static propTypes = {
    maxHeight: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    maxHeight: 300,
    rowHeight: 30,
    onOk: ()=>null,
    onCancel: ()=>null,
  };

  constructor(props){
    super(props);
    this.checkboxRenderer = this.checkboxRenderer.bind(this);
    const boxes = [{name: '#ALL#', label:'(Select all)', indeterminate: true}, ...props.boxes];
    const checkedCounter = props.boxes.filter(box => box.checked).length;
    this.state = {
      boxes: boxes,
      checkedCounter
    };
    this.checkedBoxes = this.checkedBoxes.bind(this);
  }

  onChange(box){
    if (box.name ==='#ALL#'){
      if(this.state.boxes[0].checked){
        const newBoxes = this.state.boxes.map(box => Object.assign(box, {checked:false}));
        this.setState({
          boxes: newBoxes,
          checkedCounter: 0,
        });
      }
      else {
        const newBoxes = this.state.boxes.map(box => Object.assign(box, {checked:true}));
        this.setState({
          boxes: newBoxes,
          checkedCounter: this.state.boxes.length - 1,
        });
      }
    }
    else {
      const newBoxes = this.state.boxes.map(bx => bx.name === box.name ? {...box, checked:box.checked ? false : true} : bx);
      const newCheckedCounter = box.checked ? this.state.checkedCounter - 1 : this.state.checkedCounter + 1;
      if (this.state.boxes[0].checked) {
        newBoxes[0].checked = false;
      }
      else if (newCheckedCounter === this.state.boxes.length - 1){
        newBoxes[0].checked = true;
      }
      this.setState({
        boxes: newBoxes,
        checkedCounter: newCheckedCounter,
      })
    }
  }

  checkedBoxes(){
    if(this.state.boxes[0].checked){
      return this.state.boxes.slice(1).map(box => box.label)
    }
    else {
      return this.state.boxes.slice(1)
        .filter(box => box.checked)
        .map(box => box.label)
    }
  }

  handleClick(){
    console.log(`checked`, this.checkedBoxes());
  }

  render(){
    const {maxHeight, rowHeight} = this.props;
    const height = Math.min(maxHeight, this.state.boxes.length * rowHeight);
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
        <input type="button" value="Ok" onClick={() => this.props.onOk(this.checkedBoxes())}/>
        <input type="button" value="Cancel" onClick={() => this.props.onCancel()}/>
      </div>
    )
  }

  checkboxRenderer({index}){
      const box = this.state.boxes[index];
      return <Checkbox key={box.name} onChange={() => this.onChange(box)} {...box} />
  }
}

export default CheckboxGroup;
