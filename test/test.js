import React from 'react';
import { shallow } from 'enzyme';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import SpringGrid from '../src/components/SpringGrid';

chai.use(chaiEnzyme());
const expect = chai.expect;

describe('<SpringGrid />', function() {

  it('Renders children', function() {
    const wrapper = shallow(
      <div>
        <SpringGrid
          columns={4}
          columnWidth={150}
        >
          <span className="item"></span>
          <span className="item"></span>
        </SpringGrid>
      </div>
    );

    expect(wrapper).to.have.exactly(2).descendants('.item');
  });

});
