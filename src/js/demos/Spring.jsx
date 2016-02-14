import React from 'react';
import d3Array from 'd3-array';
import SpringGrid from '../components/SpringGrid';
import pinterestLayout from '../layouts/pinterest';
import { enter, entered, exit } from '../enter-exit-styles/foldDown';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

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
    const itemWidth = 10;

    const items = this.state.data.map(d => {
      const height = (d.letter.charCodeAt(0) % 3 + 1) * 5;

      return (
        <li
          className="grid-item"
          style={{ height: height + 'rem', width: itemWidth + 'rem' }}
          key={d.letter}
          itemRect={{ height }}
        >
          <h3>{d.letter.toUpperCase()} - {parseInt(d.number, 10)}</h3>
        </li>
      );
    });

    return (
      <div>
        <button
          onClick={this.handleShuffle}
        >Randomize</button>
        <SpringGrid
          className="grid"
          component="ul"
          columns={4}
          columnWidth={itemWidth}
          gutterWidth={0.5}
          gutterHeight={0.5}
          layout={pinterestLayout}
          enter={enter}
          entered={entered}
          exit={exit}
          perspective={60}
          units={{ length: 'rem' }}
          // springConfig={{ stiffness: 60, damping: 9, precision: 0.1 }}
        >
          {items}
        </SpringGrid>
      </div>
    );
  }
});
