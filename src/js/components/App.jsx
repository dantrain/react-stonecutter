import React from 'react';
import d3Array from 'd3-array';
import List from './List';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default React.createClass({

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
      .slice(0, 3 + Math.floor(Math.random() * 23))
      .sort()
      .map(letter => {
        return {
          letter,
          number: Math.floor(Math.random() * 100)
        };
      });
  },

  render() {
    return (
      <div>
        <button
          onClick={this.handleShuffle}
        >Shuffle</button>
        <List
          data={this.state.data}
        />
      </div>
    );
  }
});
