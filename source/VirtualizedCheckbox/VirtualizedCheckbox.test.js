import React from 'react'
import { shallow, mount } from 'enzyme'

import VirtualizedCheckbox from './VirtualizedCheckbox'

describe('VirtualizedCheckbox', () => {
  const names = []
  for (var i = 0; i < 100; i++) {
    names.push({name: `Name ${i}`, checked: true})
  }

  // have to insert a div with a height attribute as parent for VirtualizedCheckbox
  // otherwise boxes are not rendered
  let node = null
  beforeEach(() => {
    node = document.createElement('div')
    node.style.cssText = 'height: 330px'
    document.body.appendChild(node)
  })
  afterEach(() => {
    document.body.removeChild(node)
  })

  let allFlag = null
  let checkedBoxes = null
  let canceledFlag

  const fixture = (props) => (
    <VirtualizedCheckbox
      options={names}
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

  describe('rendered children', () => {
    it('should fill the view', () => {
      const wrapper = mount(fixture(), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(10)
    })

    it('should work if they do not fill the view', () => {
      const wrapper = mount(fixture({ options: names.slice(0, 5) }), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(1 + 5)
    })

    it('should conform to rowHeight prop', () => {
      const wrapper = mount(fixture({rowHeight: 60}), {attachTo: node})
      expect(wrapper.find('[type="checkbox"]').length).toEqual(5)
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
    describe(' with all options checked on initialization', () => {
      it('should be true on initialization', () => {
        const wrapper = mount(fixture(), {attachTo: node})
        expect(wrapper.state('checkedAll')).toBe(true)
      })

      it('should be false when a checkbox is unchecked', () => {
        const wrapper = mount(fixture(), {attachTo: node})
        wrapper.find({value: 'Name 3'}).simulate('change')
        expect(wrapper.state('checkedAll')).toBe(false)
      })
    })

    describe(' with not all options checked on initialization', () => {
      it('should false on initialization', () => {
        const wrapper = shallow(fixture({ options: names.map((name, i) => ({ ...name, checked: i === 33 })) }))
        expect(wrapper.state('checkedAll')).toBe(false)
      })

      it('should be true when last unchecked box is checked', () => {
        const wrapper = mount(fixture({ options: names.map((name, i) => ({ ...name, checked: i !== 3 })) }), {attachTo: node})
        wrapper.find({value: 'Name 3'}).simulate('change')
        expect(wrapper.state('checkedAll')).toBe(true)
      })
    })
  })

  describe('onOk callback', () => {
    it('called with true and checked boxes if all boxes are checked', () => {
      const wrapper = mount(fixture())
      wrapper.find('[value="Ok"]').simulate('click')
      expect(allFlag).toBe(true)
      expect(checkedBoxes.length).toEqual(100)
    })

    it('called with false and checked boxes if not all boxes are checked', () => {
      const wrapper = mount(fixture({ options: names.map((name, i) => ({ ...name, checked: [33, 44].indexOf(i) > -1 })) }))
      wrapper.find('[value="Ok"]').simulate('click')
      expect(allFlag).toBe(false)
      expect(checkedBoxes.length).toEqual(2)
    })
  })

  describe('onCancel callback', () => {
    it('is called upon click on cancel Button', () => {
      const wrapper = mount(fixture())
      wrapper.find('[value="Cancel"]').simulate('click')
      expect(canceledFlag).toBe(true)
    })
  })
})
