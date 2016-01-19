import React from 'react';
import { TransitionMotion, spring } from 'react-motion';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number,
    columnWidth: React.PropTypes.number,
    itemHeight: React.PropTypes.number,
    gutterWidth: React.PropTypes.number,
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

  componentWillMount() {
    this.setState({ styles: this.getStyles(this.props) });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ styles: this.getStyles(nextProps) });
  },

  containsNonDigit: /\D/,

  getStyles(props) {
    return this.doLayout(
        React.Children.toArray(props.children)
          .map((element, index) => ({
            element,
            index,
            opacity: spring(1, props.springConfig),
            scale: spring(1, props.springConfig)
          })), props)
      .reduce((obj, d) => {
        const key = d.element.key.substring(2);

        if (!this.containsNonDigit.test(key)) {
          throw new Error(
            'Each child of TransitionMotionGrid must have a unique non-number "key" prop.');
        }

        obj[key] = d;

        return obj;
      }, {});
  },

  doLayout(arr, props) {
    return props.itemHeight ?
      this.doLayoutSimple(arr, props) : this.doLayoutPinterest(arr, props);
  },

  doLayoutSimple(arr, props) {
    const { columnWidth, itemHeight, columns,
      gutterWidth, gutterHeight, springConfig } = props;

    const result = arr.map(d => {
      const column = d.index % columns;
      const row = Math.floor(d.index / columns);

      const x = column * columnWidth + column * gutterWidth;
      const y = row * itemHeight + row * gutterHeight;

      return {
        ...d,
        x: spring(x, springConfig),
        y: spring(y, springConfig)
      };
    });

    this.setState({ height: Math.ceil(arr.length / columns) *
      (itemHeight + gutterHeight) - gutterHeight });

    return result;
  },

  doLayoutPinterest(arr, props) {
    const { columns, columnWidth, gutterWidth, gutterHeight, springConfig } = props;

    const columnHeights = [];
    for (let i = 0; i < columns; i++) { columnHeights.push(0); }

    const result = arr.map(d => {
      const column = columnHeights.indexOf(Math.min.apply(null, columnHeights));

      const height = d.element.props.height;

      if (!(height && typeof height === 'number')) {
        throw new Error(
          'Each child of TransitionMotionGrid must have a "height" prop of type number. ' +
          'Alternatively provide an "itemHeight" prop to TransitionMotionGrid if all ' +
          'items are of equal height.');
      }

      const x = column * columnWidth + column * gutterWidth;
      const y = columnHeights[column];

      columnHeights[column] += height + gutterHeight;

      return {
        ...d,
        x: spring(x, springConfig),
        y: spring(y, springConfig)
      };
    });

    this.setState({ height: Math.max.apply(null, columnHeights) - gutterHeight });

    return result;
  },

  getCenterHorizontal() {
    const { columns, columnWidth, gutterWidth } = this.props;
    return (columns * columnWidth + (columns - 1) * gutterWidth - columnWidth) / 2;
  },

  getCenterVertical() {
    return this.state.height / 2;
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
        ...(this.props.fromCenter ? {
          x: this.getCenterHorizontal(),
          y: this.getCenterVertical()
        } : {})
      };
    }

    return this.willEnter(key, d);
  },

  render() {
    const { springConfig, children, columns, component, // eslint-disable-line no-unused-vars
      columnWidth, itemHeight, gutterWidth, style, ...rest } = this.props;

    return (
      <TransitionMotion
        styles={this.state.styles}
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
              height: this.state.height
            },
            ...rest
          }, Object.keys(interpolatedStyles).map(key => {
            const { element, x, y, opacity, scale } = interpolatedStyles[key];
            const transform = `translate(${x}px, ${y}px) scale(${scale})`;

            return React.cloneElement(element, {
              style: {
                ...element.props.style,
                position: 'absolute',
                top: 0,
                left: 0,
                width: columnWidth,
                ...(itemHeight ? { height: itemHeight } : {}),
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
