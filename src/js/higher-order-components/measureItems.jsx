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
      rects: {}
    };
  },

  render() {
    const { component } = this.props;
    const newRects = {};

    const [newElements, existingElements] = partition(
      React.Children.toArray(this.props.children),
      element => !this.state.rects[element.key]);

    const elementsToMeasure = newElements.map((element, index, arr) =>
      React.cloneElement(element, {
        style: {
          ...element.props.style,
          width: this.props.columnWidth
        },
        ref: el => {
          if (el) {
            newRects[element.key] = el.getBoundingClientRect();

            if (index === arr.length - 1) {
              this.setState({
                rects: {
                  ...this.state.rects,  // Memory leak here?
                  ...newRects
                }
              });
            }
          }
        }
      })
    );

    const measuredElements = existingElements.map(element =>
      React.cloneElement(element, {
        itemRect: this.state.rects[element.key]
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
