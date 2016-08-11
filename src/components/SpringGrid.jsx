import React, { Component } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import stripStyle from 'react-motion/lib/stripStyle';
import shallowEqual from 'shallowequal';
import omit from 'lodash.omit';
import { buildTransform, positionToProperties } from '../utils/transformHelpers';
import { commonPropTypes, commonDefaultProps } from '../utils/commonProps';

export default class extends Component {

  static propTypes = {
    ...commonPropTypes,
    springConfig: React.PropTypes.shape({
      stiffness: React.PropTypes.number,
      damping: React.PropTypes.number,
      precision: React.PropTypes.number
    })
  };

  static defaultProps = {
    ...commonDefaultProps,
    springConfig: { stiffness: 60, damping: 14, precision: 0.1 }
  };

  componentWillMount() {
    this.setState(this.doLayout(this.props));
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps, this.props)) {
      this.setState(this.doLayout(nextProps));
    }
  }

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
        ...springify(props.entered(items[i].data.element.props,
          props, { gridWidth, gridHeight }), props.springConfig),
        ...springify(positionToProperties(position), props.springConfig)
      }
    }));

    return { styles, gridWidth, gridHeight };
  }

  willEnter = (transitionStyle) => {
    const { gridWidth, gridHeight } = this.state;

    return {
      ...stripStyle(transitionStyle.style),
      zIndex: 1,
      ...this.props.enter(transitionStyle.data.element.props,
        this.props, { gridWidth, gridHeight })
    };
  };

  willLeave = (transitionStyle) => {
    const { gridWidth, gridHeight } = this.state;
    const exitStyle = this.props.exit(transitionStyle.data.element.props,
      this.props, { gridWidth, gridHeight });

    return {
      ...transitionStyle.style,
      zIndex: 0,
      ...springify(exitStyle, this.props.springConfig)
    };
  };

  render() {
    const { component, style, perspective, lengthUnit,
            angleUnit, ...rest } = omit(this.props, ['itemHeight', 'measured',
              'columns', 'columnWidth', 'gutterWidth', 'gutterHeight', 'layout',
              'enter', 'entered', 'exit', 'springConfig', 'duration', 'easing']);

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
              width: `${this.state.gridWidth}${lengthUnit}`,
              height: `${this.state.gridHeight}${lengthUnit}`
            },
            ...rest
          }, interpolatedStyles.map(config => {
            const { style: { opacity, zIndex }, data } = config;

            const transform = buildTransform(config.style, perspective, {
              length: lengthUnit, angle: angleUnit
            });

            const itemProps = omit(data.element.props, ['itemRect', 'itemHeight']);

            return React.createElement(data.element.type, {
              key: data.element.key,
              ...itemProps,
              style: {
                ...itemProps.style,
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

}

function springify(style, springConfig) {
  return Object.keys(style).reduce((obj, key) => {
    obj[key] = spring(style[key], springConfig);
    return obj;
  }, {});
}
