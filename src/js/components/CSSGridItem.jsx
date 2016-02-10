import React from 'react';
import isEqual from 'lodash.isequal';

export default React.createClass({

  getInitialState() {
    return {
      style: {
        scale: 0,
        opacity: 0
      }
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps, this.props)) {
      this.setEndStyle(nextProps);
    }
  },

  componentWillUnmount() {
    clearTimeout(this.leaveTimeout);
    clearTimeout(this.enterTimeout);
  },

  componentWillAppear(done) {
    this.setEndStyle(this.props);
    done();
  },

  componentWillEnter(done) {
    clearTimeout(this.leaveTimeout);

    this.setState({
      style: {
        ...this.props.position,
        ...this.props.gridProps.enter(
          this.props, this.props.gridProps, this.props.gridState)
      }
    });

    this.enterTimeout = setTimeout(() => {
      this.setEndStyle(this.props);
      done();
    }, 0);
  },

  componentWillLeave(done) {
    this.leaveTimeout = setTimeout(() => {
      this.setState({
        style: {
          ...this.state.style,
          ...this.props.gridProps.exit(
            this.props, this.props.gridProps, this.props.gridState)
        }
      });

      this.leaveTimeout = setTimeout(done, this.props.duration);
    }, 0);
  },

  setEndStyle(props) {
    this.setState({
      style: {
        ...props.position,
        scale: 1,
        opacity: 1
      }
    });
  },

  render() {
    const item = React.Children.only(this.props.children);
    const { style: { x, y, scale, opacity } } = this.state;
    const { style: itemStyle } = item.props;
    const { duration, easing } = this.props;

    const transform = `translate(${x}px, ${y}px) scale(${scale})`;

    const transition = ['opacity', 'transform'].map(prop =>
      `${prop} ${duration}ms ${easing}`).join(', ');

    return React.cloneElement(item, {
      style: {
        ...itemStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        opacity,
        transform,
        transition
      }
    });
  }

});
