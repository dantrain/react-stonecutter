import React from 'react';
import d3Array from 'd3-array';
import TransitionMotionGrid from './TransitionMotionGrid';

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
    const items = this.state.data.map(d => {
      const height = (d.letter.charCodeAt(0) % 3) * 50 + 100;

      return (
        <li
          className="grid-item"
          style={{ height }}
          key={d.letter}
          height={height}
        >
          {d.letter.toUpperCase()} - {parseInt(d.number, 10)}
        </li>
      );
    });


    return (
      <div>
        <button
          onClick={this.handleShuffle}
        >Shuffle</button>
        <TransitionMotionGrid
          className="grid"
          component="ul"
          columns={4}
          columnWidth={200}
          gutterWidth={15}
          gutterHeight={15}
          fromCenter
        >
          {items}
        </TransitionMotionGrid>
      </div>
    );
  }
});
