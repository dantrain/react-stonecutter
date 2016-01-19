import React from 'react';
import TransitionMotionGrid from './TransitionMotionGrid';
import partition from 'lodash.partition';

export default React.createClass({

  getDefaultProps() {
    return {
      component: 'div'
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
      element => !this.state.heights[element.key.substring(2)]);

    const elementsToMeasure = newElements.map((element, index, arr) =>
      React.cloneElement(element, {
        'style': {
          width: this.props.columnWidth
        },
        'data-key': element.key.substring(2),
        'ref': el => {
          if (el) {
            newHeights[el.dataset.key] = el.clientHeight;

            if (index === arr.length - 1) {
              this.setState({
                heights: {
                  ...this.state.heights,
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
        height: this.state.heights[element.key.substring(2)]
      })
    );

    return (
      <div>
        {React.createElement(component, {
          style: {
            width: 0,
            height: 0,
            visibility: 'hidden'
          }
        }, elementsToMeasure)}
        {measuredElements.length &&
          <TransitionMotionGrid
            {...this.props}
            columns={4}
          >
            {measuredElements}
          </TransitionMotionGrid>
        }
      </div>
    );
  }

});
