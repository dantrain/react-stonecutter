import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group-plus';
import shallowEqual from 'shallowequal';
import omit from 'lodash.omit';
import { commonPropTypes, commonDefaultProps } from '../utils/commonProps';
import { cubicOut } from '../utils/easings';
import assertIsElement from '../utils/assertIsElement';
import CSSGridItem from './CSSGridItem';

export default class extends Component {
  static propTypes = {
    ...commonPropTypes,
    duration: PropTypes.number.isRequired,
    easing: PropTypes.string
  };

  static defaultProps = {
    ...commonDefaultProps,
    easing: cubicOut
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
    const { positions, gridWidth, gridHeight } = props.layout(
      React.Children.toArray(props.children).map((item) => {
        assertIsElement(item);

        return {
          ...item.props,
          key: item.key
        };
      }),
      props
    );

    return { gridWidth, gridHeight, positions };
  }

  render() {
    const {
      component,
      style,
      children,
      duration,
      easing,
      lengthUnit,
      ...rest
    } = omit(this.props, [
      'itemHeight',
      'measured',
      'columns',
      'columnWidth',
      'gutterWidth',
      'gutterHeight',
      'layout',
      'enter',
      'entered',
      'exit',
      'perspective',
      'springConfig',
      'angleUnit'
    ]);

    const items = React.Children.toArray(children);
    const { positions, gridWidth, gridHeight } = this.state;

    const transition = ['opacity', 'transform']
      .map(prop => `${prop} ${duration}ms ${easing}`)
      .join(', ');

    const wrappedItems = items.map((item, i) => (
      <CSSGridItem
        key={item.key}
        position={positions[i]}
        {...this.props}
        transition={transition}
        gridProps={this.props}
        gridState={this.state}
      >
        {item}
      </CSSGridItem>
    ));

    return (
      <TransitionGroup
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
      </TransitionGroup>
    );
  }
}
