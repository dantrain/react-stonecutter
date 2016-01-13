import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    itemHeight: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number.isRequired,
    gutterHeight: React.PropTypes.number.isRequired,
    fromCenter: React.PropTypes.bool,
    springConfig: React.PropTypes.array,
    component: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      springConfig: [60, 14],
      component: 'div'
    };
  },

  containsNonDigit: /\D/,

  getStyles() {
    const { columnWidth, itemHeight, columns,
      gutterWidth, gutterHeight, springConfig } = this.props;

    return React.Children.toArray(this.props.children)
      .reduce((obj, element, index) => {
        const key = element.key.substring(2);

        if (!this.containsNonDigit.test(key)) {
          throw new Error(
            'Each child of TransitionMotionGrid must have a unique non-number "key" prop.');
        }

        const column = index % columns;
        const row = Math.floor(index / columns);

        const x = column * columnWidth + column * gutterWidth;
        const y = row * itemHeight + row * gutterHeight;

        obj[key] = {
          element,
          index,
          opacity: spring(1, springConfig),
          scale: spring(1, springConfig),
          x: spring(x, springConfig),
          y: spring(y, springConfig)
        };

        return obj;
      }, {});
  },

  getCenterHorizontal() {
    const { columns, columnWidth, gutterWidth } = this.props;
    return (columns * columnWidth + (columns - 1) * gutterWidth - columnWidth) / 2;
  },

  getCenterVertical() {
    const { columns, itemHeight, gutterHeight, children } = this.props;
    return (Math.ceil(React.Children.count(children) / columns) *
      (itemHeight + gutterHeight) - gutterHeight + itemHeight) / 2;
  },

  willEnter(key, d) {
    return {
      ...d,
      opacity: spring(0, this.props.springConfig),
      scale: spring(0, this.props.springConfig),
      ...(this.props.fromCenter ? {
        x: spring(this.getCenterHorizontal(), this.props.springConfig),
        y: spring(this.getCenterVertical(), this.props.springConfig)
      } : {})
    };
  },

  willLeave(key, d, styles, currentInterpolatedStyle, currentSpeed) {
    if (currentSpeed[key].opacity > -0.1 && currentSpeed[key].opacity !== 0) {
      return {
        ...d,
        opacity: 0,
        scale: 0,
        x: this.getCenterHorizontal(),
        y: this.getCenterVertical()
      };
    }

    return this.willEnter(key, d);
  },

  render() {
    const { springConfig, children, columns, component, // eslint-disable-line no-unused-vars
      columnWidth, itemHeight, gutterWidth, gutterHeight, style, ...rest } = this.props;

    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles =>
          React.createElement(component, {
            style: {
              position: 'relative',
              ...style,
              width: columns * columnWidth +
                ((columns - 1) * gutterWidth),
              height: Math.ceil(React.Children.count(children) /
                columns) * (itemHeight + gutterHeight) - gutterHeight
            },
            ...rest
          }, Object.keys(interpolatedStyles).map(key => {
            const { element, x, y, opacity, scale } = interpolatedStyles[key];
            const transform = `translate(${x}px, ${y}px) scale(${scale})`;

            return React.cloneElement(element, {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: columnWidth,
                height: itemHeight,
                opacity,
                transform,
                WebkitTransform: transform,
                MsTransform: transform
              }
            });
          }))}
      </TransitionMotion>
    );
  }

});
