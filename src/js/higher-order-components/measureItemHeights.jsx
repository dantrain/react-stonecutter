import React from 'react';
import partition from 'lodash.partition';

export default Grid => React.createClass({

  getDefaultProps() {
    return {
      component: 'span'
    };
  },

  getInitialState() {
    return {
      heights: {}
    };
  },

  render() {
    const { component } = this.props;
    const newHeights = {};

    const [newElements, existingElements] = partition(
      React.Children.toArray(this.props.children),
      element => !this.state.heights[element.key]);

    const elementsToMeasure = newElements.map((element, index, arr) =>
      React.cloneElement(element, {
        style: {
          ...element.props.style,
          width: this.props.columnWidth
        },
        ref: el => {
          if (el) {
            newHeights[element.key] = el.clientHeight;

            if (index === arr.length - 1) {
              this.setState({
                heights: {
                  ...this.state.heights,  // Memory leak here?
                  ...newHeights
                }
              });
            }
          }
        }
      })
    );

    const measuredElements = existingElements.map(element =>
      React.cloneElement(element, {
        itemHeight: this.state.heights[element.key]
      })
    );

    return (
      <span>
        {measuredElements.length &&
          <Grid
            {...this.props}
          >
            {measuredElements}
          </Grid>}
        {elementsToMeasure.length > 0 &&
          React.createElement(component, {
            style: {
              width: 0,
              height: 0,
              padding: 0,
              margin: 0,
              overflow: 'hidden',
              visibility: 'hidden'
            }
          }, elementsToMeasure)}
      </span>
    );
  }

});
