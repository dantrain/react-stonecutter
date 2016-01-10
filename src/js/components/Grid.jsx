import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default React.createClass({

  getDefaultProps() {
    return {
      width: 300,
      height: 150,
      columns: 3,
      margin: 20,
      springConfigMotion: [200, 30],
      springConfigOpacity: [170, 26],
      springConfigScale: [170, 26],
      springConfigNumber: [200, 30]
    };
  },

  getStyles() {
    return this.props.data.reduce((obj, d, i) => {
      const column = i % this.props.columns;
      const row = Math.floor(i / this.props.columns);

      const x = column * this.props.width + column * this.props.margin;
      const y = row * this.props.height + row * this.props.margin;

      obj[d.letter] = {
        index: i,
        opacity: spring(1, this.props.springConfigOpacity),
        size: spring(1, this.props.springConfigScale),
        x: spring(x, this.props.springConfigMotion),
        y: spring(y, this.props.springConfigMotion),
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
      size: spring(0, this.props.springConfigScale)
    };
  },

  willLeave(key, d, styles, currentInterpolatedStyle, currentSpeed) {
    if (currentSpeed[key].x < 10 && currentSpeed[key].x > 0) {
      return {
        ...d,
        opacity: 0,
        size: 0
      };
    }

    return {
      ...d,
      opacity: spring(0, this.props.springConfigOpacity),
      size: spring(0, this.props.springConfigScale)
    };
  },

  render() {
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles =>
          <ul
            className="grid"
            style={{
              width: this.props.columns * this.props.width +
                ((this.props.columns - 1) * this.props.margin),
              height: Math.ceil(this.props.data.length / this.props.columns) *
                (this.props.height + this.props.margin) - this.props.margin
            }}
          >
            {Object.keys(interpolatedStyles).map(key => {
              const { letter, n, y, x, opacity, size } = interpolatedStyles[key];
              const transform = `translate(${x}px, ${y}px) scale(${size})`;

              return (
                <li
                  className="grid-item"
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
