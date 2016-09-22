import React from 'react'
import { shallow, mount } from 'enzyme'

import VirtualizedCheckbox from './VirtualizedCheckbox'

describe('VirtualizedCheckbox', () => {
  const names = []
  for (var i = 0; i < 100; i++) {
    names.push({name: `Name ${i}`, checked: true})
  }

  const fixture = (props) => (
    <VirtualizedCheckbox
      items={names}
      labelKey={'name'}
      onOk={(all, checked) => {
        allFlag = all
        checkedBoxes = checked
        canceledFlag = null
      }}
      onCancel={() => {
        allFlag = null
        checkedBoxes = null
        canceledFlag = true
      }}
      rowHeight={30}
      overscanRowCount={0}
      {...props}
    />
  )

  let allFlag = null
  let checkedBoxes = null
  let canceledFlag = null

  // have to insert a div with a height attribute as parent for VirtualizedCheckbox
  // otherwise boxes are not rendered
  let node = null
  beforeEach(() => {
    node = document.createElement('div')
    node.style.cssText = 'height: 360px'
    document.body.appendChild(node)
  })
  afterEach(() => {
    document.body.removeChild(node)
    allFlag = null
    checkedBoxes = null
    canceledFlag = null
  })

  describe('rendered children', () => {
    it('should fill the view', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(10)
    })

    it('should work if they do not fill the view', () => {
      const wrapper = mount(fixture({ items: names.slice(0, 5) }), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(1 + 5)
    })

    it('should conform to rowHeight prop', () => {
      const wrapper = mount(fixture({rowHeight: 60}), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(4)
    })

    it('should work without a filter box', () => {
      const wrapper = mount(fixture({rowHeight: 30, hasFilterBox: false}), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(11)
    })

    it('should work without buttons', () => {
      const wrapper = mount(fixture({rowHeight: 30, hasButtons: false}), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(11)
    })

    it('should work without buttons and filter box', () => {
      const wrapper = mount(fixture({rowHeight: 30, hasButtons: false, hasFilterBox: false}), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(12)
    })

    it('should change after a scroll event', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      wrapper.setProps({scrollTop: 200})
      wrapper.simulate('scroll')
      expect(wrapper.find({value: 'Name 3'}).length).toBe(0)
      expect(wrapper.find({value: 'Name 13'}).length).toBe(1)
    })
  })

  describe('checkedAll flag', () => {
    describe(' with all items checked on initialization', () => {
      it('should be true on initialization', () => {
        const wrapper = shallow(fixture())
        expect(wrapper.instance().checkedAll).toBe(true)
      })

      it('should be false when a checkbox is unchecked', () => {
        const wrapper = mount(fixture(), {attachTo: node})
        wrapper.find({value: 'Name 3'}).simulate('change')
        expect(wrapper.instance().checkedAll).toBe(false)
      })
    })

    describe(' with not all items checked on initialization', () => {
      it('should false on initialization', () => {
        const wrapper = shallow(fixture({ items: names.map((name, i) => ({ ...name, checked: i === 33 })) }))
        expect(wrapper.instance().checkedAll).toBe(false)
      })

      it('should be true when last unchecked box is checked', () => {
        const wrapper = mount(fixture({ items: names.map((name, i) => ({ ...name, checked: i !== 3 })) }), {attachTo: node})
        wrapper.find({value: 'Name 3'}).simulate('change')
        expect(wrapper.instance().checkedAll).toBe(true)
      })
    })
  })

  describe('onOk callback', () => {
    it('called with true and checked boxes if all boxes are checked', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      wrapper.find('[value="Ok"]').simulate('click')
      expect(allFlag).toBe(true)
      expect(checkedBoxes.length).toEqual(100)
    })

    it('called with false and checked boxes if not all boxes are checked', () => {
      const wrapper = mount(fixture({ items: names.map((name, i) => ({ ...name, checked: [33, 44].indexOf(i) > -1 })) }), {attachTo: node})
      wrapper.find('[value="Ok"]').simulate('click')
      expect(allFlag).toBe(false)
      expect(checkedBoxes.length).toEqual(2)
    })
  })

  describe('onCancel callback', () => {
    it('is called upon click on cancel Button', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      wrapper.find('[value="Cancel"]').simulate('click')
      expect(canceledFlag).toBe(true)
    })
  })

  describe('filter', () => {
    it('works when passed as prop', () => {
      const wrapper = mount(fixture({textFilter: 'Name 95'}), {attachTo: node})
      expect(wrapper.find({type: 'checkbox'}).length).toEqual(1)
    })

    it('works when changed in the text box', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      wrapper.find('#filter').simulate('change', {target: {value: 'Name 95'}})
      expect(wrapper.find({type: 'checkbox'}).length).toEqual(1)
    })

    it('hides (Select All) box when filter set', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      wrapper.find('#filter').simulate('change', {target: {value: 'Name 9'}})
      expect(wrapper.find({value: '(Select all)'}).length).toEqual(0)
    })

    it('shows (Select All) box when filter reset to empty string', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      wrapper.find('#filter').simulate('change', {target: {value: 'Name 95'}})
      wrapper.find('#filter').simulate('change', {target: {value: ''}})
      expect(wrapper.find({value: '(Select all)'}).length).toEqual(1)
    })

    it('filters returned values', () => {
      const wrapper = shallow(fixture({textFilter: 'Name 9'}))
      expect(wrapper.instance().checkedAll).toBe(false)
      expect(wrapper.instance().checkedBoxes.length).toBe(11)
    })
  })
})
