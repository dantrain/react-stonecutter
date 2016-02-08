import React from 'react';
import enquire from 'enquire.js';

export default (Grid, { maxWidth, minPadding = 0, defaultColumns = 4 } = {}) =>
  React.createClass({

    getDefaultProps() {
      return {
        minPadding: 0
      };
    },

    getInitialState() {
      return {
        columns: defaultColumns
      };
    },

    componentWillMount() {
      const { columnWidth, gutterWidth } = this.props;

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
      return <Grid {...this.props} {...this.state} />;
    }

  });
