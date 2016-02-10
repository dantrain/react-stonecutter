import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';

const timeout = 600;

const GridItem = React.createClass({

  getInitialState() {
    return {
      isLeaving: false,
      style: {
        scale: 1,
        opacity: 1
      }
    };
  },

  componentWillMount() {
    this.setEndStyle(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.setEndStyle(nextProps);
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
      isLeaving: false,
      style: {
        ...this.props.position,
        ...this.props.gridProps.enter(
          this.props, this.props.gridProps, this.props.gridState)
      }
    });

    this.enterTimeout = setTimeout(() => {
      this.setEndStyle(this.props);
    }, 0);

    done();
  },

  componentWillLeave(done) {
    this.leaveTimeout = setTimeout(() => {
      this.setState({
        isLeaving: true,
        style: {
          ...this.state.style,
          ...this.props.gridProps.exit(
            this.props, this.props.gridProps, this.props.gridState)
        }
      });

      this.leaveTimeout = setTimeout(done, timeout);
    }, 0);
  },

  setEndStyle(props) {
    if (!this.state.isLeaving) {
      this.setState({
        style: {
          ...props.position,
          scale: 1,
          opacity: 1
        }
      });
    }
  },

  render() {

    const item = React.Children.only(this.props.children);
    const { style: { x, y, scale, opacity } } = this.state;
    const { style: itemStyle } = item.props;

    const transform = `translate(${x}px, ${y}px) scale(${scale})`;

    return React.cloneElement(item, {
      ref: el => this.el = el,
      style: {
        ...itemStyle,
        position: 'absolute',
        top: 0,
        left: 0,
        opacity,
        transform,
        // WebkitTransform: transform,
        // MsTransform: transform,
        transition: `opacity ${timeout}ms ease-out, transform ${timeout}ms ease-out`
      }
    });
  }

});

export default React.createClass({

  propTypes: {
    columns: React.PropTypes.number.isRequired,
    columnWidth: React.PropTypes.number.isRequired,
    gutterWidth: React.PropTypes.number.isRequired,
    gutterHeight: React.PropTypes.number.isRequired,
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
      exit: simpleEnterExit.exit
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
    const { component, style, children, enter, exit, ...rest } = this.props;
    const items = React.Children.toArray(children);
    const { positions, gridWidth, gridHeight } = this.state;

    const wrappedItems = items.map((item, i) =>
      <GridItem
        key={item.key}
        position={positions[i]}
        gridProps={this.props}
        gridState={this.state}
      >
        {item}
      </GridItem>);

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
