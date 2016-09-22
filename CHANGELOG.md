Changelog
------------
###2.0.0
##Breaking changes
`options` prop is now called `items`.
onOk callback now takes the checked objects as arguments (labelKey and valueKey).
onOk callback now takes a third argument: the text filter value.
##Changes
An onChange callback can be passed as prop. It is called when a checkbox is clicked.
hasFilterBox and hasButtons are new props which determine respectively if
VirtualizedCheckbox displays a filter box and buttons

###1.0.6
Added a textbox to filter the checkboxes

###1.0.5
Added a value attribute to the checkboxes

###1.0.4
Added an all boolean on the onOk callback

###1.0.3
Made component usable inside a resizable box

####1.0.2
Made #ALL# box checked at initialization if necessary

##### 1.0.1
Modified height props.

##### 1.0.0
Initial release.
