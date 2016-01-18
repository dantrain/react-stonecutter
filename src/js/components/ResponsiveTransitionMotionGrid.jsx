import React from 'react';
import enquire from 'enquire.js';
import TransitionMotionGrid from './TransitionMotionGrid';

const { columns, ...childPropTypes } = TransitionMotionGrid.propTypes; // eslint-disable-line no-unused-vars

export default React.createClass({

  propTypes: {
    ...childPropTypes,
    columnWidth: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number.isRequired,
    maxWidth: React.PropTypes.number.isRequired,
    minPadding: React.PropTypes.number
  },

  getDefaultProps() {
    return { minPadding: 0 };
  },

  getInitialState() {
    return { columns: 4 };
  },

  componentWillMount() {
    const { columnWidth, gutterWidth, maxWidth, minPadding } = this.props;

    const breakpoints = [];
    const getWidth = i => i * (columnWidth + gutterWidth) - gutterWidth + minPadding;

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

  render() {
    const { maxWidth, minPadding, ...rest } = this.props; // eslint-disable-line no-unused-vars

    return (
      <TransitionMotionGrid
        {...rest}
        columns={this.state.columns}
      >
        {this.props.children}
      </TransitionMotionGrid>
    );
  }

});
