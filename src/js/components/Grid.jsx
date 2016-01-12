import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default React.createClass({

  getDefaultProps() {
    return {
      width: 200,
      height: 100,
      columns: 4,
      margin: 20,
      springConfig: [60, 14]
    };
  },

  getStyles() {
    const { data, width, height, columns, margin, springConfig } = this.props;

    return data.reduce((obj, d, i) => {
      const column = i % columns;
      const row = Math.floor(i / columns);

      const x = column * width + column * margin;
      const y = row * height + row * margin;

      obj[d.letter] = {
        index: i,
        opacity: spring(1, springConfig),
        size: spring(1, springConfig),
        x: spring(x, springConfig),
        y: spring(y, springConfig),
        n: spring(d.number, springConfig),
        ...d
      };

      return obj;
    }, {});
  },

  willEnter(key, d) {
    const { data, columns, width, height, margin, springConfig } = this.props;

    return {
      ...d,
      opacity: spring(0, springConfig),
      size: spring(0, springConfig),
      x: spring((columns * width + (columns - 1) * margin - width) / 2, springConfig),
      y: spring((Math.ceil(data.length / columns) * (height + margin) -
                  margin + height) / 2, springConfig)
    };
  },

  willLeave(key, d, styles, currentInterpolatedStyle, currentSpeed) {
    const { data, columns, width, height, margin, springConfig } = this.props;

    if (currentSpeed[key].opacity > -0.1 && currentSpeed[key].opacity !== 0) {
      return {
        ...d,
        opacity: 0,
        size: 0,
        x: (columns * width + (columns - 1) * margin - width) / 2,
        y: (Math.ceil(data.length / columns) * (height + margin) - margin + height) / 2
      };
    }

    return {
      ...d,
      opacity: spring(0, springConfig),
      size: spring(0, springConfig),
      x: spring((columns * width + (columns - 1) * margin - width) / 2, springConfig),
      y: spring((Math.ceil(data.length / columns) * (height + margin) -
                  margin + height) / 2, springConfig)
    };
  },

  render() {
    const { data, width, height, columns, margin } = this.props;

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
              width: columns * width +
                ((columns - 1) * margin),
              height: Math.ceil(data.length / columns) *
                (height + margin) - margin
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
                    width,
                    height,
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
