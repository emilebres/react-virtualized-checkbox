# React Virtualized Checkbox

![NPM version](https://img.shields.io/npm/v/react-virtualized-checkbox.svg?style=flat)
![NPM license](https://img.shields.io/npm/l/react-virtualized-checkbox.svg?style=flat)
![NPM total downloads](https://img.shields.io/npm/dt/react-virtualized-checkbox.svg?style=flat)
![NPM monthly downloads](https://img.shields.io/npm/dm/react-virtualized-checkbox.svg?style=flat)

### Demos available here: http://bvaughn.github.io/react-virtualized-checkbox/

![react-virtualized-checkbox example](https://cloud.githubusercontent.com/assets/29597/14285960/46d733a6-fb02-11e5-884a-e349eb462704.gif)

## Getting started

Install `react-virtualized-checkbox` using npm.

```shell
npm install react-virtualized-checkbox --save
```

ES6, CommonJS, and UMD builds are available with each distribution.
For example:

```js
import VirtualizedCheckbox from 'react-virtualized-checkbox'
```

Alternately you can load a global-friendly UMD build:

```html
<script src="path-to-react-virtualized-checkbox/dist/umd/react-virtualized-checkbox.js"></script>
```

## Simple Example

You pass _react-virtualized-checkbox_ an array of options. Here's a simple example:

```js
import React, { Component } from 'react'
import VirtualizedCheckbox from 'react-virtualized-checkbox'

class MyCheckbox extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const options = [
      { label: "One", value: 1 },
      { label: "Two", value: 2 },
      { label: "Three", value: 3 }
      // And so on...
    ]

    return (
      <VirtualizedCheckbox
        options={options}
        onOK={(checkedOptions) => this.setState({ checkedOptions })}
        onCancel={ () => this.setState({ checkedOptions: [] })}
      />
    )
  }
}
```

## React Virtualized Checkbox Props

| Property | Type | Description |
|:---|:---|:---|
| options | `PropTypes.array` | Options to choose from. Can be an array of strings or an array of objects. |
| onOk | `PropTypes.func` | Callback called when the _Ok_ button is clicked. Takes the selected option labels as arguments. |
| onCancel | `PropTypes.func` | Callback called when the _Cancel_ is clicked. |

The additional parameters introduced by _react-virtualized-checkbox_ are optional. They are:

| Property | Type | Description |
|:---|:---|:---|
| maxHeight | `PropTypes.number` | Max height of options menu; defaults to 300 pixels. |
| optionHeight | `PropTypes.number` | Option height; defaults to 30 pixels. |
| labelKey | `PropTypes.string` | Label key; defaults to 'label'. |
| valueKey | `PropTypes.string` | Value key; defaults to 'value'. |
