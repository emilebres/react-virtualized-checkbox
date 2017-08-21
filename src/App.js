import React, { Component } from 'react';
import VirtualizedCheckboxExample from './VirtualizedCheckbox.example';
import cityData from './data/cities.js';
import './App.css';

class Application extends Component {
  render() {
    return (
      <div>
        <header className="header">
          <h1 className="container">React Virtualized Checkbox</h1>
          <div className="container">
            Checkbox group component powered by react-virtualized
          </div>
          <div className="container">
            Docs and code on{' '}
            <a
              className="headerLink"
              href="https://github.com/emilebres/react-virtualized-checkbox/"
            >
              GitHub
            </a>.
          </div>
        </header>
        <section className="container">
          <VirtualizedCheckboxExample cityData={cityData} />
        </section>
      </div>
    );
  }
}

export default Application;
