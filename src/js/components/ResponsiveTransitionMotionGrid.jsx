import React from 'react';
import enquire from 'enquire.js';

export default React.createClass({

  propTypes: {
    defaultColumns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number.isRequired,
    maxWidth: React.PropTypes.number.isRequired,
    minPadding: React.PropTypes.number,
    children: React.PropTypes.element.isRequired
  },

  getDefaultProps() {
    return {
      minPadding: 0
    };
  },

  getInitialState() {
    return {
      columns: this.props.defaultColumns
    };
  },

  componentWillMount() {
    const { columnWidth, gutterWidth, maxWidth, minPadding } = this.props;

    const breakpoints = [];
    const getWidth = i => i * (columnWidth + gutterWidth) - gutterWidth + minPadding;

    for (let i = 1; getWidth(i) <= maxWidth + columnWidth + gutterWidth; i++) {
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
    const { columnWidth, gutterWidth } = this.props; // eslint-disable-line no-unused-vars

    return React.cloneElement(React.Children.only(this.props.children), {
      columns: this.state.columns,
      columnWidth,
      gutterWidth
    });
  }

});
