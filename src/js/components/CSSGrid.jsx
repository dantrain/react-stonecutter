import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';
import CSSGridItem from './CSSGridItem';

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number.isRequired,
    gutterHeight: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    easing: React.PropTypes.string,
    component: React.PropTypes.string,
    layout: React.PropTypes.func,
    enter: React.PropTypes.func,
    exit: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      component: 'div',
      layout: simpleLayout,
      enter: simpleEnterExit.enter,
      exit: simpleEnterExit.exit,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
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
        .map(item => item.props), props);

    this.setState({ gridWidth, gridHeight, positions });
  },

  render() {
    const { component, style, children, enter, exit, duration, easing, ...rest } = this.props;
    const items = React.Children.toArray(children);
    const { positions, gridWidth, gridHeight } = this.state;

    const wrappedItems = items.map((item, i) =>
      <CSSGridItem
        key={item.key}
        position={positions[i]}
        enter={enter}
        exit={exit}
        duration={duration}
        easing={easing}
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
          width: gridWidth,
          height: gridHeight
        }}
        {...rest}
      >
        {wrappedItems}
      </ReactTransitionGroup>
    );
  }

});
