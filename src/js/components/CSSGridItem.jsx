import React from 'react';
import isEqual from 'lodash.isequal';
import { transformDefaults, buildTransform } from '../utils/transformHelpers';

export default React.createClass({

  getInitialState() {
    return {
      style: {
        // ...transformDefaults,
        opacity: 1,
        zIndex: 2
      }
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setEndStyle(nextProps, 2);
    }
  },

  componentWillUnmount() {
    clearTimeout(this.leaveTimeout);
    clearTimeout(this.enterTimeout);
  },

  componentWillAppear(done) {
    this.setEndStyle(this.props, 2);
    done();
  },

  componentWillEnter(done) {
    clearTimeout(this.leaveTimeout);

    this.setState({
      style: {
        ...this.state.style,
        ...this.props.position,
        zIndex: 1,
        ...this.props.gridProps.enter(
          this.props, this.props.gridProps, this.props.gridState)
      }
    });

    this.enterTimeout = setTimeout(() => {
      this.setEndStyle(this.props, 1);
      done();
    }, 17);
  },

  componentWillLeave(done) {
    this.remove = done;

    this.leaveTimeout = setTimeout(() => {
      this.setState({
        style: {
          ...this.state.style,
          zIndex: 0,
          ...this.props.gridProps.exit(
            this.props, this.props.gridProps, this.props.gridState)
        }
      });

      this.leaveTimeout = setTimeout(done, this.props.duration);
    }, 0);
  },

  setEndStyle(props, zIndex) {
    clearTimeout(this.leaveTimeout);

    if (this.remove) {
      this.remove();
      this.remove = null;
    }

    this.setState({
      style: {
        ...this.state.style,
        ...props.position,
        zIndex,
        ...transformDefaults,
        opacity: 1
      }
    });
  },

  render() {
    const item = React.Children.only(this.props.children);
    const { style: itemStyle } = item.props;
    const { transition } = this.props;

    const { style: { translateX, translateY, opacity, zIndex } } = this.state;

    if (typeof translateX === 'undefined' || typeof translateY === 'undefined') {
      return null;
    }

    const transform = buildTransform(this.state.style);

    return React.cloneElement(item, {
      style: {
        ...itemStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex,
        opacity,
        transform,
        transition
      }
    });
  }

});
