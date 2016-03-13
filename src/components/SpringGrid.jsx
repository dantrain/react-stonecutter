import React from 'react';
import { TransitionMotion, spring } from 'react-motion';
import stripStyle from 'react-motion/lib/stripStyle';
import { buildTransform, positionToProperties } from '../utils/transformHelpers';
import isEqual from 'lodash.isequal';
import { commonPropTypes, commonDefaultProps } from '../utils/commonProps';

export default React.createClass({

  propTypes: {
    ...commonPropTypes,
    springConfig: React.PropTypes.shape({
      stiffness: React.PropTypes.number,
      damping: React.PropTypes.number,
      precision: React.PropTypes.number
    })
  },

  getDefaultProps() {
    return {
      ...commonDefaultProps,
      springConfig: { stiffness: 60, damping: 14, precision: 0.1 }
    };
  },

  componentWillMount() {
    this.setState(this.doLayout(this.props));
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setState(this.doLayout(nextProps));
    }
  },

  doLayout(props) {
    const items = React.Children.toArray(props.children)
      .map(element => ({
        key: element.key,
        data: {
          element
        }
      }));

    const { positions, gridWidth, gridHeight } =
      props.layout(items.map(item => ({
        ...item.data.element.props,
        key: item.data.element.key
      })), props);

    const styles = positions.map((position, i) => ({
      ...items[i],
      style: {
        ...items[i].style,
        zIndex: 2,
        ...springify(this.props.entered(items[i].data.element.props,
          this.props, { gridWidth, gridHeight }), props.springConfig),
        ...springify(positionToProperties(position), props.springConfig)
      }
    }));

    return { styles, gridWidth, gridHeight };
  },

  willEnter(transitionStyle) {
    const { gridWidth, gridHeight } = this.state;

    return {
      ...stripStyle(transitionStyle.style),
      zIndex: 1,
      ...this.props.enter(transitionStyle.data.element.props,
        this.props, { gridWidth, gridHeight })
    };
  },

  willLeave(transitionStyle) {
    const { gridWidth, gridHeight } = this.state;
    const exitStyle = this.props.exit(transitionStyle.data.element.props,
      this.props, { gridWidth, gridHeight });

    return {
      ...transitionStyle.style,
      zIndex: 0,
      ...springify(exitStyle, this.props.springConfig)
    };
  },

  render() {
    const { component, style, perspective, units, ...rest } = this.props;

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
              width: `${this.state.gridWidth}${units.length}`,
              height: `${this.state.gridHeight}${units.length}`
            },
            ...rest
          }, interpolatedStyles.map(config => {
            const { style: { opacity, zIndex }, data } = config;

            const transform = buildTransform(config.style, perspective, units);

            return React.cloneElement(data.element, {
              style: {
                ...data.element.props.style,
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex,
                opacity,
                transform,
                WebkitTransform: transform,
                msTransform: transform
              }
            });
          }))}
      </TransitionMotion>
    );
  }

});

function springify(style, springConfig) {
  return Object.keys(style).reduce((obj, key) => {
    obj[key] = spring(style[key], springConfig);
    return obj;
  }, {});
}
