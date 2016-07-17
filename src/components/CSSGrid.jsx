import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import shallowEqual from 'shallowequal';
import { commonPropTypes, commonDefaultProps } from '../utils/commonProps';
import { cubicOut } from '../utils/easings';
import CSSGridItem from './CSSGridItem';

export default React.createClass({

  propTypes: {
    ...commonPropTypes,
    duration: React.PropTypes.number.isRequired,
    easing: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      ...commonDefaultProps,
      easing: cubicOut
    };
  },

  componentWillMount() {
    this.setState(this.doLayout(this.props));
  },

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps, this.props)) {
      this.setState(this.doLayout(nextProps));
    }
  },

  doLayout(props) {
    const { positions, gridWidth, gridHeight } =
      props.layout(React.Children.toArray(props.children)
        .map(item => ({
          ...item.props,
          key: item.key
        })), props);

    return { gridWidth, gridHeight, positions };
  },

  render() {
    /* eslint-disable no-unused-vars */
    const { component, style, children, duration, easing, lengthUnit,
      itemHeight, measured, columns, columnWidth, gutterWidth, gutterHeight,
      layout, enter, entered, exit, perspective, springConfig, angleUnit, ...rest } = this.props;
    /* eslint-enable no-unused-vars */

    const items = React.Children.toArray(children);
    const { positions, gridWidth, gridHeight } = this.state;

    const transition = ['opacity', 'transform'].map(prop =>
      `${prop} ${duration}ms ${easing}`).join(', ');

    const wrappedItems = items.map((item, i) =>
      <CSSGridItem
        key={item.key}
        position={positions[i]}
        {...this.props}
        transition={transition}
        gridProps={this.props}
        gridState={this.state}
      >
        {item}
      </CSSGridItem>);

    return (
      <ReactTransitionGroup
        component={component}
        style={{
          position: 'relative',
          ...style,
          width: `${gridWidth}${lengthUnit}`,
          height: `${gridHeight}${lengthUnit}`
        }}
        {...rest}
      >
        {wrappedItems}
      </ReactTransitionGroup>
    );
  }

});
