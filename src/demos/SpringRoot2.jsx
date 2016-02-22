import React from 'react';
import d3Array from 'd3-array';
import SpringGrid from '../components/SpringGrid';
import root2Layout from '../layouts/root2';
import { enter, entered, exit } from '../enter-exit-styles/simple';

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
      .map(letter => ({
        letter,
        number: Math.floor(Math.random() * 100)
      }));
  },

  render() {
    const itemWidth = 150;

    const items = this.state.data.map(d => {
      let height = itemWidth * (d.letter.charCodeAt(0) % 2 ? Math.sqrt(2) : 1 / Math.sqrt(2));
      let width = itemWidth;
      let doubleSize = false;

      if (d.letter.charCodeAt(0) % 6 === 0) {
        doubleSize = true;
        width *= 2;
        height = 150 * Math.sqrt(2);
      }

      return (
        <li
          className="grid-item"
          style={{ height, width }}
          key={d.letter}
          itemRect={{ height, width }}
          doubleSize={doubleSize}
        >
          <h3>{d.letter.toUpperCase()} - {parseInt(d.number, 10)}</h3>
          {doubleSize && <p>Big!</p>}
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
          columns={5}
          columnWidth={itemWidth}
          layout={root2Layout}
          enter={enter}
          entered={entered}
          exit={exit}
        >
          {items}
        </SpringGrid>
      </div>
    );
  }
});
