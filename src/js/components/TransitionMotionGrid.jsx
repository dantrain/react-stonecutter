import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default React.createClass({

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    margin: React.PropTypes.number.isRequired,
    columns: React.PropTypes.number.isRequired
  },

  getDefaultProps() {
    return {
      springConfig: [60, 14],
      component: 'div'
    };
  },

  getStyles() {
    const { width, height, columns, margin, springConfig } = this.props;
    const containsNonDigit = /\D/;

    const children = React.Children.toArray(this.props.children);

    return children.reduce((obj, element, i) => {
      const key = element.key.substring(2);

      if (!containsNonDigit.test(key)) {
        throw new Error(
          'Each child of TransitionMotionGrid must have a unique non-number "key" prop.');
      }

      const column = i % columns;
      const row = Math.floor(i / columns);

      const x = column * width + column * margin;
      const y = row * height + row * margin;

      obj[key] = {
        element,
        index: i,
        opacity: spring(1, springConfig),
        size: spring(1, springConfig),
        x: spring(x, springConfig),
        y: spring(y, springConfig)
      };

      return obj;
    }, {});
  },

  getCenterHorizontal() {
    const { columns, width, margin } = this.props;
    return (columns * width + (columns - 1) * margin - width) / 2;
  },

  getCenterVertical() {
    const { columns, height, margin, children } = this.props;
    return (Math.ceil(React.Children.count(children) / columns) *
      (height + margin) - margin + height) / 2;
  },

  willEnter(key, d) {
    return {
      ...d,
      opacity: spring(0, this.props.springConfig),
      size: spring(0, this.props.springConfig),
      x: spring(this.getCenterHorizontal(), this.props.springConfig),
      y: spring(this.getCenterVertical(), this.props.springConfig)
    };
  },

  willLeave(key, d, styles, currentInterpolatedStyle, currentSpeed) {
    if (currentSpeed[key].opacity > -0.1 && currentSpeed[key].opacity !== 0) {
      return {
        ...d,
        opacity: 0,
        size: 0,
        x: this.getCenterHorizontal(),
        y: this.getCenterVertical()
      };
    }

    return {
      ...d,
      opacity: spring(0, this.props.springConfig),
      size: spring(0, this.props.springConfig),
      x: spring(this.getCenterHorizontal(), this.props.springConfig),
      y: spring(this.getCenterVertical(), this.props.springConfig)
    };
  },

  render() {
    const { springConfig, children, // eslint-disable-line no-unused-vars
      width, height, columns, margin, component, style, ...rest } = this.props;

    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles =>
          React.createElement(component, {
            style: {
              ...style,
              width: columns * width +
                ((columns - 1) * margin),
              height: Math.ceil(React.Children.count(children) /
                columns) * (height + margin) - margin
            },
            ...rest
          }, Object.keys(interpolatedStyles).map(key => {
            const { element, x, y, opacity, size } = interpolatedStyles[key];
            const transform = `translate(${x}px, ${y}px) scale(${size})`;

            return React.cloneElement(element, {
              style: {
                width,
                height,
                opacity,
                transform,
                WebkitTransform: transform
              }
            });
          }))}
      </TransitionMotion>
    );
  }

});
