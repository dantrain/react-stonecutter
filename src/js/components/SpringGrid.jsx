import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import simpleLayout from '../layouts/simple';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    itemHeight: React.PropTypes.number,
    gutterWidth: React.PropTypes.number.isRequired,
    gutterHeight: React.PropTypes.number.isRequired,
    fromCenter: React.PropTypes.bool,
    springConfig: React.PropTypes.object,
    component: React.PropTypes.string,
    layout: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      springConfig: { stiffness: 60, damping: 14 },
      component: 'div',
      layout: simpleLayout
    };
  },

  componentWillMount() {
    this.setState({ styles: this.getStyles(this.props) });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ styles: this.getStyles(nextProps) });
  },

  getStyles(props) {
    return this.doLayout(
      React.Children.toArray(props.children)
        .map(element => ({
          key: element.key,
          data: {
            element
          },
          style: {
            opacity: spring(1, props.springConfig),
            scale: spring(1, props.springConfig)
          }
        })), props);
  },

  doLayout(items, props) {
    const { positions, gridWidth, gridHeight } =
      this.props.layout(items.map(item => item.data.element.props), props);

    this.setState({ gridWidth, gridHeight });

    return positions.map((position, i) => ({
      ...items[i],
      style: {
        ...items[i].style,
        x: spring(position.x, this.props.springConfig),
        y: spring(position.y, this.props.springConfig)
      }
    }));
  },

  getCenterHorizontal() {
    const { columns, columnWidth, gutterWidth } = this.props;
    return (columns * columnWidth + (columns - 1) * gutterWidth - columnWidth) / 2;
  },

  getCenterVertical() {
    return this.state.gridHeight / 2;
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
        x: spring(this.getCenterHorizontal(), this.props.springConfig),
        y: spring(this.getCenterVertical(), this.props.springConfig)
      } : {}),
      opacity: spring(0, this.props.springConfig),
      scale: spring(0, this.props.springConfig)
    };
  },

  render() {
    const { columns, component, columnWidth, gutterWidth, style, ...rest } = this.props;

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
              width: this.state.gridWidth,
              height: this.state.gridHeight
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
