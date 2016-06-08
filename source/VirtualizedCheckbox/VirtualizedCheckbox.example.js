import React, { Component } from 'react';
import CheckboxGroup from './CheckboxGroup';
import styles from './VirtualizedCheckbox.example.css'


export default class VirtualizedCheckboxExample extends Component {

  static propTypes = {
    cityData: PropTypes.array.isRequired,
  }

  constructor(props){
    super(props);

    this.state = {
      result:[''],
    };
  }

  render() {
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
            boxes={boxes}
            onOk={(args) => this.setState({result:args})}
            onCancel={() => this.setState({result: ["checkbox selections canceled"]})}
          />
        </div>
        <div>
          Results: {...this.state.result}
        </div>
      </div>
    );
  }
}
