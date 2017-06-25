/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';

const enquire = typeof window !== 'undefined' ? require('enquire.js') : null;

export default (Grid, { maxWidth, minPadding = 0, defaultColumns = 4 } = {}) =>
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        columns: defaultColumns
      };
    }

    componentDidMount() {
      const { columnWidth, gutterWidth } = this.props;

      const breakpoints = [];
      const getWidth = i => i * (columnWidth + gutterWidth) - gutterWidth + minPadding;

      for (let i = 1; getWidth(i) <= maxWidth + columnWidth + gutterWidth; i++) {
        breakpoints.push(getWidth(i));
      }

      this.breakpoints = breakpoints
        .map((width, i, arr) =>
          [
            'screen',
            i > 0 && `(min-width: ${arr[i - 1]}px)`,
            i < arr.length - 1 && `(max-width: ${width}px)`
          ]
            .filter(Boolean)
            .join(' and ')
        )
        .map((breakpoint, i) => ({
          breakpoint,
          handler: () => this.setState({ columns: i })
        }));

      this.breakpoints.forEach(({ breakpoint, handler }) =>
        enquire.register(breakpoint, { match: handler })
      );
    }

    componentWillUnmount() {
      this.breakpoints.forEach(({ breakpoint, handler }) =>
        enquire.unregister(breakpoint, handler)
      );
    }

    render() {
      return <Grid {...this.props} {...this.state} />;
    }
  };
