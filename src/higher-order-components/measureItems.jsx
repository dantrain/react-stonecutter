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

  componentDidMount() {
    this.measureElements();
  },

  componentDidUpdate() {
    this.measureElements();
  },

  measureElements() {
    if (this._elementsToMeasureContainer) {
      const elements = this._elementsToMeasureContainer.children;

      if (elements.length) {
        const newRects = Array.from(elements).reduce((acc, el) => {
          acc[el.dataset.stonecutterkey] = el.getBoundingClientRect();
          return acc;
        }, {});

        this.setState({
          rects: {
            ...this.state.rects,
            ...newRects
          }
        });
      }
    }
  },

  render() {
    const { component } = this.props;

    const [newElements, existingElements] = partition(
      React.Children.toArray(this.props.children),
      element => !this.state.rects[element.key]);

    const elementsToMeasure = newElements.map(element =>
      React.cloneElement(element, {
        'style': {
          ...element.props.style,
          width: this.props.columnWidth
        },
        'data-stonecutterkey': element.key
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
            },
            ref: el => { this._elementsToMeasureContainer = el; }
          }, elementsToMeasure)}
      </span>
    );
  }

});
