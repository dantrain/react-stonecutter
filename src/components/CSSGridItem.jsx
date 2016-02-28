import React from 'react';
import isEqual from 'lodash.isequal';
import { buildTransform, defaultUnits, positionToProperties } from '../utils/transformHelpers';

export default React.createClass({

  getInitialState() {
    return {
      style: {
        zIndex: 2
      }
    };
  },

  componentDidMount() {
    this._isMounted = true;
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setEndStyle(nextProps, 2);
    }
  },

  componentWillUnmount() {
    this._isMounted = false;
    clearTimeout(this.leaveTimeout);
  },

  componentWillAppear(done) {
    this.setEndStyle(this.props, 2);
    done();
  },

  componentWillEnter(done) {
    clearTimeout(this.leaveTimeout);
    const { position, gridProps, gridState } = this.props;

    requestAnimationFrame(() => {
      this.setState({
        style: {
          ...this.state.style,
          ...positionToProperties(position),
          zIndex: 1,
          ...gridProps.enter(this.props, gridProps, gridState)
        }
      });

      done();
    });
  },

  componentDidEnter() {
    this.setEndStyle(this.props, 1);
  },

  componentWillLeave(done) {
    this.remove = done;
    const { gridProps, gridState } = this.props;

    requestAnimationFrame(() => {
      if (this._isMounted) {
        this.setState({
          style: {
            ...this.state.style,
            zIndex: 0,
            ...gridProps.exit(this.props, gridProps, gridState)
          }
        });

        this.leaveTimeout = setTimeout(done, this.props.duration);
      }
    });
  },

  setEndStyle(props, zIndex) {
    clearTimeout(this.leaveTimeout);

    if (this.remove) {
      this.remove();
      this.remove = null;
      return;
    }

    const { position, gridProps, gridState } = props;

    requestAnimationFrame(() => {
      this.setState({
        style: {
          ...this.state.style,
          zIndex,
          ...gridProps.entered(props, gridProps, gridState),
          ...positionToProperties(position)
        }
      });
    });
  },

  render() {
    const item = React.Children.only(this.props.children);
    const { style: itemStyle } = item.props;
    const { transition, perspective, units } = this.props;

    const { style: { translateX, translateY, opacity, zIndex } } = this.state;

    if (typeof translateX === 'undefined' || typeof translateY === 'undefined') {
      return null;
    }

    const transform = buildTransform(this.state.style, perspective, {
      ...defaultUnits,
      ...units
    });

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
