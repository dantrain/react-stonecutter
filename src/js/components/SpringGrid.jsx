import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import stripStyle from 'react-motion/lib/stripStyle';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    itemHeight: React.PropTypes.number,
    gutterWidth: React.PropTypes.number.isRequired,
    gutterHeight: React.PropTypes.number.isRequired,
    springConfig: React.PropTypes.object,
    component: React.PropTypes.string,
    layout: React.PropTypes.func,
    enter: React.PropTypes.func,
    exit: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      springConfig: { stiffness: 60, damping: 14 },
      component: 'div',
      layout: simpleLayout,
      enter: simpleEnterExit.enter,
      exit: simpleEnterExit.exit
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

  willEnter(transitionStyle) {
    const { gridWidth, gridHeight } = this.state;

    return {
      ...stripStyle(transitionStyle.style),
      ...this.props.enter(transitionStyle.data.element.props, this.props, {
        gridWidth, gridHeight
      })
    };
  },

  willLeave(transitionStyle) {
    const { gridWidth, gridHeight } = this.state;
    const exitStyle = this.props.exit(transitionStyle.data.element.props, this.props, {
      gridWidth, gridHeight
    });

    return {
      ...transitionStyle.style,
      ...Object.keys(exitStyle).reduce((obj, key) => {
        obj[key] = spring(exitStyle[key], this.props.springConfig);
        return obj;
      }, {})
    };
  },

  render() {
    const { component, style, ...rest } = this.props;

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
