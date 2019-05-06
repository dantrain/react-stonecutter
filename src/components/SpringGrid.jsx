import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionMotion, spring } from "react-motion";
import stripStyle from "react-motion/lib/stripStyle";
import shallowEqual from "shallowequal";
import omit from "lodash.omit";
import {
  buildTransform,
  positionToProperties
} from "../utils/transformHelpers";
import { commonPropTypes, commonDefaultProps } from "../utils/commonProps";
import assertIsElement from "../utils/assertIsElement";

export default class extends Component {
  static propTypes = {
    ...commonPropTypes,
    springConfig: PropTypes.shape({
      stiffness: PropTypes.number,
      damping: PropTypes.number,
      precision: PropTypes.number
    })
  };

  static defaultProps = {
    ...commonDefaultProps,
    springConfig: { stiffness: 60, damping: 14, precision: 0.1 }
  };

  constructor(props) {
    super(props);
    this.state = this.doLayout(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps, this.props)) {
      this.setState(this.doLayout(nextProps));
    }
  }

  doLayout(props) {
    const items = React.Children.toArray(props.children).map(element => {
      assertIsElement(element);

      return {
        key: element.key,
        data: {
          element
        }
      };
    });

    const { positions, gridWidth, gridHeight } = props.layout(
      items.map(item => ({
        ...item.data.element.props,
        key: item.data.element.key
      })),
      props
    );

    const styles = positions.map((position, i) => ({
      ...items[i],
      style: {
        ...items[i].style,
        zIndex: 2,
        ...springify(
          props.entered(items[i].data.element.props, props, {
            gridWidth,
            gridHeight
          }),
          props.springConfig
        ),
        ...springify(positionToProperties(position), props.springConfig)
      }
    }));

    return { styles, gridWidth, gridHeight };
  }

  willEnter = transitionStyle => {
    const { gridWidth, gridHeight } = this.state;
    const { enter } = this.props;

    return {
      ...stripStyle(transitionStyle.style),
      zIndex: 1,
      ...enter(transitionStyle.data.element.props, this.props, {
        gridWidth,
        gridHeight
      })
    };
  };

  willLeave = transitionStyle => {
    const { exit, springConfig } = this.props;
    const { gridWidth, gridHeight } = this.state;

    const exitStyle = exit(transitionStyle.data.element.props, this.props, {
      gridWidth,
      gridHeight
    });

    return {
      ...transitionStyle.style,
      zIndex: 0,
      ...springify(exitStyle, springConfig)
    };
  };

  render() {
    const {
      component: Parent,
      style,
      perspective,
      lengthUnit,
      angleUnit,
      ...rest
    } = omit(this.props, [
      "itemHeight",
      "measured",
      "columns",
      "columnWidth",
      "gutterWidth",
      "gutterHeight",
      "layout",
      "enter",
      "entered",
      "exit",
      "springConfig",
      "duration",
      "easing"
    ]);

    const { styles, gridWidth, gridHeight } = this.state;

    return (
      <TransitionMotion
        styles={styles}
        willEnter={this.willEnter}
        willLeave={this.willLeave}
      >
        {interpolatedStyles => (
          <Parent
            style={{
              position: "relative",
              ...style,
              width: `${gridWidth}${lengthUnit}`,
              height: `${gridHeight}${lengthUnit}`
            }}
            {...rest}
          >
            {interpolatedStyles.map(config => {
              const {
                style: { opacity, zIndex },
                data
              } = config;
              const Child = data.element.type;

              const transform = buildTransform(config.style, perspective, {
                length: lengthUnit,
                angle: angleUnit
              });

              const itemProps = omit(data.element.props, [
                "itemRect",
                "itemHeight"
              ]);

              return (
                <Child
                  key={data.element.key}
                  {...itemProps}
                  style={{
                    ...itemProps.style,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex,
                    opacity,
                    transform,
                    WebkitTransform: transform,
                    msTransform: transform
                  }}
                />
              );
            })}
          </Parent>
        )}
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
