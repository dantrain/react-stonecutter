import React, { Component } from "react";
import shallowEqual from "shallowequal";
import omit from "lodash.omit";
import {
  buildTransform,
  positionToProperties
} from "../utils/transformHelpers";

export default class extends Component {
  componentDidMount() {
    this.itemIsMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps, this.props)) {
      requestAnimationFrame(() => {
        this.setEndStyle(nextProps, 2);
      });
    }
  }

  componentWillUnmount() {
    this.itemIsMounted = false;
    clearTimeout(this.leaveTimeout);
  }

  componentWillAppear(done) {
    this.setEndStyle(this.props, 2);
    done();
  }

  componentWillEnter(done) {
    clearTimeout(this.leaveTimeout);

    const { position, gridProps, gridState } = this.props;

    requestAnimationFrame(() => {
      this.setState(state => ({
        style: {
          ...state.style,
          ...positionToProperties(position),
          zIndex: 1,
          ...gridProps.enter(this.props, gridProps, gridState)
        }
      }));

      done();
    });
  }

  componentDidEnter() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.setEndStyle(this.props, 1);
      });
    });
  }

  componentWillLeave(done) {
    const { gridProps, gridState, duration } = this.props;

    requestAnimationFrame(() => {
      if (this.itemIsMounted) {
        this.setState(state => ({
          style: {
            ...state.style,
            zIndex: 0,
            ...gridProps.exit(this.props, gridProps, gridState)
          }
        }));

        this.leaveTimeout = setTimeout(done, duration);
      }
    });
  }

  state = {
    style: {
      zIndex: 2
    }
  };

  setEndStyle = (props, zIndex) => {
    clearTimeout(this.leaveTimeout);

    if (!this.itemIsMounted) return;

    const { position, gridProps, gridState } = props;

    this.setState(state => ({
      style: {
        ...state.style,
        zIndex,
        ...gridProps.entered(props, gridProps, gridState),
        ...positionToProperties(position)
      }
    }));
  };

  render() {
    const {
      transition,
      perspective,
      lengthUnit,
      angleUnit,
      children
    } = this.props;

    const item = React.Children.only(children);
    const Element = item.type;

    const { style } = this.state;
    const { translateX, translateY, opacity, zIndex } = style;

    if (
      typeof translateX === "undefined" ||
      typeof translateY === "undefined"
    ) {
      return null;
    }

    const transform = buildTransform(style, perspective, {
      length: lengthUnit,
      angle: angleUnit
    });

    const itemProps = omit(item.props, ["itemRect", "itemHeight"]);

    return (
      <Element
        {...itemProps}
        style={{
          ...itemProps.style,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex,
          opacity,
          transform,
          transition,
          WebkitTransform: transform,
          WebkitTransition: transition
        }}
      />
    );
  }
}
