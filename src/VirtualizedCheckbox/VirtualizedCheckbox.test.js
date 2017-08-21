import React from 'react';
import { mount } from 'enzyme';

import VirtualizedCheckbox from './VirtualizedCheckbox';

describe('VirtualizedCheckbox', () => {
  const names = [];
  for (var i = 0; i < 100; i++) {
    names.push({ name: `Name ${i}`, checked: true });
  }

  const fixture = props =>
    <VirtualizedCheckbox
      items={names}
      labelKey={'name'}
      onOk={(checked, all, textFilter) => {
        allFlag = all;
        checkedBoxes = checked;
        canceledFlag = null;
      }}
      onCancel={() => {
        allFlag = null;
        checkedBoxes = null;
        canceledFlag = true;
      }}
      rowHeight={30}
      overscanRowCount={0}
      height={360}
      width={300}
      {...props}
    />;

  let allFlag = null;
  let checkedBoxes = null;
  let canceledFlag = null;

  // have to insert a div with a height attribute as parent for VirtualizedCheckbox
  // otherwise boxes are not rendered
  let node = null;
  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });
  afterEach(() => {
    document.body.removeChild(node);
    allFlag = null;
    checkedBoxes = null;
    canceledFlag = null;
  });

  describe('rendered children', () => {
    it('should fill the view', () => {
      const wrapper = mount(fixture(), { attachTo: node });
      // 10 in the view + 10 overscan
      expect(wrapper.find('[type="checkbox"]').length).toEqual(10 + 10);
    });

    it('should work if they do not fill the view', () => {
      const wrapper = mount(fixture({ items: names.slice(0, 5) }), {
        attachTo: node
      });
      expect(wrapper.find('[type="checkbox"]').length).toEqual(1 + 5);
    });

    it('should conform to rowHeight prop', () => {
      const wrapper = mount(fixture({ rowHeight: 60 }), { attachTo: node });
      // 4 in the view + 10 overscan
      expect(wrapper.find('[type="checkbox"]').length).toEqual(4 + 10);
    });

    it('should work without a filter box', () => {
      const wrapper = mount(fixture({ rowHeight: 30, hasFilterBox: false }), {
        attachTo: node
      });
      // 11 in the view + 10 overscan
      expect(wrapper.find('[type="checkbox"]').length).toEqual(11 + 10);
    });

    it('should work without buttons', () => {
      const wrapper = mount(
        fixture({ rowHeight: 30, hasOkButton: false, hasCancelButton: false }),
        {
          attachTo: node
        }
      );
      // 11 in the view + 10 overscan
      expect(wrapper.find('[type="checkbox"]').length).toEqual(11 + 10);
    });

    it('should work without buttons and filter box', () => {
      const wrapper = mount(
        fixture({
          rowHeight: 30,
          hasOkButton: false,
          hasCancelButton: false,
          hasFilterBox: false
        }),
        { attachTo: node }
      );
      // 12 in the view + 10 overscan
      expect(wrapper.find('[type="checkbox"]').length).toEqual(12 + 10);
    });
  });

  describe('onOk callback', () => {
    it('called with true and checked boxes if all boxes are checked', () => {
      const wrapper = mount(fixture(), { attachTo: node });
      wrapper.find('[value="Ok"]').simulate('click');
      expect(allFlag).toBe(true);
      expect(checkedBoxes.length).toEqual(100);
    });

    it('called with false and checked boxes if not all boxes are checked', () => {
      const wrapper = mount(
        fixture({
          items: names.map((name, i) => ({
            ...name,
            checked: [33, 44].indexOf(i) > -1
          }))
        }),
        { attachTo: node }
      );
      wrapper.find('[value="Ok"]').simulate('click');
      expect(allFlag).toBe(false);
      expect(checkedBoxes.length).toEqual(2);
    });
  });

  describe('onCancel callback', () => {
    it('is called upon click on cancel Button', () => {
      const wrapper = mount(fixture(), { attachTo: node });
      wrapper.find('[value="Cancel"]').simulate('click');
      expect(canceledFlag).toBe(true);
    });
  });

  describe('filter', () => {
    it('works when passed as prop', () => {
      const wrapper = mount(fixture({ textFilter: 'Name 95' }), {
        attachTo: node
      });
      // the Name 95 checkbox and the (Select all)
      expect(wrapper.find({ type: 'checkbox' }).length).toEqual(1 + 1);
    });

    it('works when changed in the text box', () => {
      const wrapper = mount(fixture(), { attachTo: node });
      wrapper
        .find('#filter')
        .simulate('change', { target: { value: 'Name 95' } });
      console.log(wrapper.debug());
      // the Name 95 checkbox and the (Select all)
      expect(wrapper.find({ type: 'checkbox' }).length).toEqual(1 + 1);
    });

    it('show (Select all search results) box when filter set', () => {
      const wrapper = mount(fixture(), { attachTo: node });
      wrapper
        .find('#filter')
        .simulate('change', { target: { value: 'Name 9' } });
      expect(
        wrapper.find({ value: '(Select all search results)' }).length
      ).toEqual(1);
    });

    it('shows (Select All) box when filter reset to empty string', () => {
      const wrapper = mount(fixture(), { attachTo: node });
      wrapper
        .find('#filter')
        .simulate('change', { target: { value: 'Name 95' } });
      wrapper.find('#filter').simulate('change', { target: { value: '' } });
      expect(wrapper.find({ value: '(Select all)' }).length).toEqual(1);
    });
  });
});
