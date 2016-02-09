import React from 'react';
import d3Array from 'd3-array';
import makeResponsive from '../higher-order-components/makeResponsive';
import measureItems from '../higher-order-components/measureItems';
import SpringGrid from '../components/SpringGrid';
import pinterestLayout from '../layouts/pinterest';
import * as fromCenter from '../enter-exit-styles/fromCenter';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const ipsum = `Hashtag hoodie food truck XOXO gastropub asymmetrical.
Viral actually sartorial thundercats fixie next level. Ethical skateboard
put a bird on it bespoke, brunch small batch photo booth fashion axe
actually cronut poutine fanny pack microdosing church-key. Post-ironic
90's pug, master cleanse keytar normcore aesthetic viral crucifix selvage
gastropub. Echo park yr organic typewriter blog. Health goth literally
cornhole microdosing fanny pack, bespoke kinfolk heirloom ennui viral
dreamcatcher. Offal VHS helvetica meh.`;

const ResponsiveGrid = makeResponsive(
  measureItems(SpringGrid), {
    maxWidth: 1920,
    minPadding: 100
  }
);

export default React.createClass({

  getDefaultProps() {
    return {
      minItems: 10
    };
  },

  getInitialState() {
    return {
      data: this.generateData()
    };
  },

  handleShuffle() {
    this.setState({
      data: this.generateData()
    });
  },

  generateData() {
    return d3Array.shuffle(alphabet)
      .slice(0, this.props.minItems +
        Math.floor(Math.random() * (26 - this.props.minItems)))
      .sort()
      .map(letter => {
        return {
          letter,
          number: Math.floor(Math.random() * 100)
        };
      });
  },

  render() {
    const items = this.state.data.map(d => {
      const content = ipsum.slice(0, (d.letter.charCodeAt(0) % 3 + 1) * 50);

      return (
        <li
          className="grid-item"
          key={d.letter}
          style={{ width: 200 }}
        >
          <h3>{d.letter.toUpperCase()} - {parseInt(d.number, 10)}</h3>
          <p>{content}</p>
        </li>
      );
    });

    return (
      <div>
        <button
          onClick={this.handleShuffle}
        >Randomize</button>
        <ResponsiveGrid
          className="grid"
          component="ul"
          columnWidth={200}
          gutterWidth={10}
          gutterHeight={10}
          layout={pinterestLayout}
          enter={fromCenter.enter}
          exit={fromCenter.exit}
          // springConfig={{ stiffness: 60, damping: 9 }}
        >
          {items}
        </ResponsiveGrid>
      </div>
    );
  }
});
