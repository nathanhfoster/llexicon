import React from 'react'
import { Item } from '@rossbulat/nav'
import renderer from 'react-test-renderer'
import icon from './img/ross.png'
describe('testing navigation', () => {
 it('renders correctly', () => {
   const item = renderer
    .create(
       <Item 
         link="https://rossbulat.co" 
         text="My Homepage" 
         icon={icon} />
     ).toJSON();
  expect(item).toMatchSnapshot();
 });
});
