import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';
import { quartOut } from '../utils/easings';
import CSSGridItem from './CSSGridItem';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number,
    gutterHeight: React.PropTypes.number,
    easing: React.PropTypes.string,
    component: React.PropTypes.string,
    layout: React.PropTypes.func,
    enter: React.PropTypes.func,
    entered: React.PropTypes.func,
    exit: React.PropTypes.func,
    perspective: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      component: 'div',
      gutterWidth: 0,
      gutterHeight: 0,
      layout: simpleLayout,
      enter: simpleEnterExit.enter,
      entered: simpleEnterExit.entered,
      exit: simpleEnterExit.exit,
      easing: quartOut
    };
  },

  componentWillMount() {
    this.doLayout(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.doLayout(nextProps);
  },

  doLayout(props) {
    const { positions, gridWidth, gridHeight } =
      props.layout(React.Children.toArray(props.children)
        .map(item => ({
          ...item.props,
          key: item.key
        })), props);

    this.setState({ gridWidth, gridHeight, positions });
  },

  render() {
    const { component, style, children, duration, easing, units, ...rest } = this.props;
    const items = React.Children.toArray(children);
    const { positions, gridWidth, gridHeight } = this.state;

    const lengthUnit = units && units.length || 'px';

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
