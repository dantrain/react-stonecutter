import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import SpringGrid from '../src/components/SpringGrid';
import CSSGrid from '../src/components/CSSGrid';

configure({ adapter: new Adapter() });

chai.use(chaiEnzyme());
const { expect } = chai;

describe('Grid components common features', function() {
  const grids = [
    { name: 'SpringGrid', component: SpringGrid },
    { name: 'CSSGrid', component: CSSGrid }
  ];

  grids.forEach(function({ name, component: Grid }) {
    describe(`<${name} />`, function() {
      it('Renders children', function() {
        const wrapper = shallow(<div>
          <Grid columns={4} columnWidth={150} duration={2000}>
            <span className="item" />
            <span className="item" />
          </Grid>
        </div>);

        expect(wrapper)
          .to.have.exactly(2)
          .descendants('.item');
      });

      it('Can change tag name', function() {
        const wrapper = shallow(<Grid component="ul" columns={4} columnWidth={150} duration={2000} />);

        expect(wrapper).to.have.tagName('ul');
      });
    });
  });
});
