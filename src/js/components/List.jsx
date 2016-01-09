import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default React.createClass({

  getDefaultProps() {
    return {
      offset: 180,
      springConfigMotion: [200, 30],
      springConfigOpacity: [170, 26],
      springConfigNumber: [170, 26]
    };
  },

  getStyles() {
    return this.props.data.reduce((obj, d, i) => {
      obj[d.letter] = {
        index: i,
        opacity: spring(1, this.props.springConfigOpacity),
        y: spring(i * 40, this.props.springConfigMotion),
        x: spring(0, this.props.springConfigMotion),
        n: spring(d.number, this.props.springConfigNumber),
        ...d
      };
      return obj;
    }, {});
  },

  willEnter(key, d) {
    return {
      ...d,
      opacity: spring(0, this.props.springConfigOpacity),
      y: spring(d.index * 40, this.props.springConfigMotion),
      x: spring(-this.props.offset, this.props.springConfigMotion)
    };
  },

  willLeave(key, d, styles, currentInterpolatedStyle, currentSpeed) {
    if (currentSpeed[key].x < 10 && currentSpeed[key].x > 0) {
      return {
        ...d,
        opacity: 0,
        y: d.index * 40,
        x: this.props.offset
      };
    }

    return {
      ...d,
      opacity: spring(0, this.props.springConfigOpacity),
      y: spring(d.index * 40, this.props.springConfigMotion),
      x: spring(this.props.offset, this.props.springConfigMotion)
    };
  },

  render() {
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >
        {interpolatedStyles =>
          <ul>
            {Object.keys(interpolatedStyles).map(key => {
              const { letter, n, y, x, opacity } = interpolatedStyles[key];
              const transform = `translate(${x}px, ${y}px)`;

              return (
                <li
                  key={letter}
                  style={{
                    opacity,
                    transform,
                    WebkitTransform: transform
                  }}
                >{letter.toUpperCase()} - {parseInt(n, 10)}</li>);
            })}
          </ul>
        }
      </TransitionMotion>
    );
  }

});
