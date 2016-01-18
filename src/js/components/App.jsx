import React from 'react';
import d3Array from 'd3-array';
import enquire from 'enquire.js';
import TransitionMotionGrid from './TransitionMotionGrid';

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default React.createClass({

  getDefaultProps() {
    return {
      minItems: 10,
      columnWidth: 200,
      gutters: 15,
      minPadding: 100,
      maxWidth: 1160
    };
  },

  getInitialState() {
    return {
      data: this.generateData(),
      columns: 4
    };
  },

  componentWillMount() {
    const { columnWidth, gutters, maxWidth, minPadding } = this.props;

    const breakpoints = [];
    const getWidth = i => i * (columnWidth + gutters) - gutters + minPadding;

    for (let i = 1; getWidth(i) <= maxWidth + getWidth(1); i++) {
      breakpoints.push(getWidth(i));
    }

    this.breakpoints = breakpoints.map((width, i, arr) => [
      'screen',
      (i > 0 && '(min-width: ' + arr[i - 1] + 'px)'),
      (i < arr.length - 1 && '(max-width: ' + width + 'px)')
    ].filter(Boolean).join(' and '));

    this.breakpoints.forEach((breakpoint, i) => enquire.register(breakpoint, {
      match: () => this.setState({ columns: i })
    }));
  },

  componentWillUnmount() {
    this.breakpoints.forEach(breakpoint => enquire.unregister(breakpoint));
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
        >Randomize</button>
        <TransitionMotionGrid
          className="grid"
          component="ul"
          columns={this.state.columns}
          columnWidth={this.props.columnWidth}
          gutterWidth={this.props.gutters}
          gutterHeight={this.props.gutters}
          fromCenter
        >
          {items}
        </TransitionMotionGrid>
      </div>
    );
  }
});
