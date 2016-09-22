# React Virtualized Checkbox

### Demo available here: http://emilebres.github.io/react-virtualized-checkbox/

![react-virtualized-checkbox-demo](https://cloud.githubusercontent.com/assets/6179178/15900554/2e509cac-2da0-11e6-8c3a-a7b261eca06b.gif)
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

You pass _react-virtualized-checkbox_ an array of items. Here's a simple example:

```js
import React, { Component } from 'react'
import VirtualizedCheckbox from 'react-virtualized-checkbox'

class MyCheckbox extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    const items = [
      { label: "One", value: 1 },
      { label: "Two", value: 2 },
      { label: "Three", value: 3 }
      // And so on...
    ]

    return (
      <VirtualizedCheckbox
        items={items}
        onOK={(checkedItems) => this.setState({ checkedItems })}
        onCancel={ () => this.setState({ checkedItems: [] })}
      />
    )
  }
}
```

## React Virtualized Checkbox Props

| Property | Type | Description |
|:---|:---|:---|
| items | `PropTypes.array` | Items to choose from; can be an array of strings or an array of objects. |
| labelKey | `PropTypes.string` | Label key; defaults to 'label'. |
| valueKey | `PropTypes.string` | Value key; defaults to 'value'. |
| onOk | `PropTypes.func` | Callback called when the _Ok_ button is clicked; takes the selected items as arguments. |
| onCancel | `PropTypes.func` | Callback called when the _Cancel_ button is clicked. |
| onChange | `PropTypes.func` | Callback called when a checkbox is clicked. |
| rowHeight | `PropTypes.number` | Row height; defaults to 30 pixels. |
| hasButtons | `PropTypes.bool` | If the _Ok_ and _Cancel_ buttons are displayed; defaults to true |
| hasFilterBox | `PropTypes.bool` | If the text filter box is displayed; defaults to true |
