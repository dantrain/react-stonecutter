import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';

const GridItem = React.createClass({

  componentWillAppear(done) {
    done();
  },

  componentWillEnter(done) {
    done();
  },

  componentWillLeave(done) {
    done();
  },

  render() {
    const item = React.Children.only(this.props.children);
    const { position: { x, y } } = this.props;
    const { style } = item.props;

    const scale = 1;
    const opacity = 1;

    const transform = `translate(${x}px, ${y}px) scale(${scale})`;

    return React.cloneElement(item, {
      style: {
        ...style,
        position: 'absolute',
        top: 0,
        left: 0,
        opacity,
        transform,
        WebkitTransform: transform,
        MsTransform: transform
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

  componentDidUpdate() {
    setTimeout(() => {
      console.log(document.querySelectorAll('.grid-item').length);
    }, 100);
  },

  doLayout(props) {
    const { positions, gridWidth, gridHeight } =
      props.layout(React.Children.toArray(props.children)
        .map(item => item.props), props);

    this.setState({ gridWidth, gridHeight, positions });
  },

  render() {
    const { component, style, children, ...rest } = this.props;

    const items = React.Children.toArray(children);

    const { positions, gridWidth, gridHeight } = this.state;

    console.log(`positions: ${positions.length}, items: ${items.length}`);

    const wrappedItems = items.map((item, i) =>
      <GridItem
        key={item.key}
        position={positions[i]}
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
