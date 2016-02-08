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
    springConfig: React.PropTypes.object,
    component: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      springConfig: { stiffness: 60, damping: 14 },
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
          key: element.key.substring(2),
          data: {
            element,
            index
          },
          style: {
            opacity: spring(1, props.springConfig),
            scale: spring(1, props.springConfig)
          }
        })), props);
  },

  doLayout(arr, props) {
    return props.itemHeight ?
      this.doLayoutSimple(arr, props) : this.doLayoutPinterest(arr, props);
  },

  doLayoutSimple(arr, props) {
    const { columnWidth, itemHeight, columns,
      gutterWidth, gutterHeight, springConfig } = props;

    const result = arr.map(d => {
      const column = d.data.index % columns;
      const row = Math.floor(d.data.index / columns);

      const x = column * columnWidth + column * gutterWidth;
      const y = row * itemHeight + row * gutterHeight;

      return {
        ...d,
        style: {
          ...d.style,
          x: spring(x, springConfig),
          y: spring(y, springConfig)
        }
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

      const height = d.data.element.props.itemHeight;

      if (!(height && typeof height === 'number')) {
        throw new Error(
          'Each child of TransitionMotionGrid must have an "itemHeight" prop of type number. ' +
          'Alternatively provide an "itemHeight" prop to TransitionMotionGrid if all ' +
          'items are of equal height.');
      }

      const x = column * columnWidth + column * gutterWidth;
      const y = columnHeights[column];

      columnHeights[column] += height + gutterHeight;

      return {
        ...d,
        style: {
          ...d.style,
          x: spring(x, springConfig),
          y: spring(y, springConfig)
        }
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

  willEnter(transitionStyle) {
    const { x, y } = transitionStyle.style;

    return {
      x: this.props.fromCenter ? this.getCenterHorizontal() : x.val,
      y: this.props.fromCenter ? this.getCenterVertical() : y.val,
      opacity: 0,
      scale: 0
    };
  },

  willLeave(transitionStyle) {
    return {
      ...transitionStyle.style,
      ...(this.props.fromCenter ? {
        x: this.getCenterHorizontal(),
        y: this.getCenterVertical()
      } : {}),
      opacity: spring(0, this.props.springConfig),
      scale: spring(0, this.props.springConfig)
    };
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
          }, interpolatedStyles.map(config => {
            const { style: { opacity, scale, x, y }, data } = config;
            const transform = `translate(${x}px, ${y}px) scale(${scale})`;

            return React.cloneElement(data.element, {
              style: {
                ...data.element.props.style,
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
