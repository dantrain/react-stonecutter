import React from 'react';
import partition from 'lodash.partition';
import debounce from 'lodash.debounce';
const imagesLoaded = typeof window !== 'undefined' ? require('imagesloaded') : null;

export default (Grid, { measureImages, background } = {}) => React.createClass({

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

  componentWillMount() {
    this._rects = {};
    this._loading = {};
  },

  componentDidMount() {
    this._updateRectsDebounced = debounce(this.updateRects, 20);
    this.measureElements();
  },

  componentDidUpdate() {
    this.measureElements();
  },

  measureElements() {
    if (this._elementsToMeasureContainer) {
      const elements = this._elementsToMeasureContainer.children;

      if (elements.length) {
        if (measureImages) {
          Array.from(elements)
            .filter(el => !this._loading[el.dataset.stonecutterkey])
            .forEach(el => {
              this._loading[el.dataset.stonecutterkey] = true;

              imagesLoaded(el, { background }, () => {
                this._rects[el.dataset.stonecutterkey] = el.getBoundingClientRect();
                delete this._loading[el.dataset.stonecutterkey];

                this._updateRectsDebounced();
              });
            });
        } else {
          this._rects = Array.from(elements).reduce((acc, el) => {
            acc[el.dataset.stonecutterkey] = el.getBoundingClientRect();
            return acc;
          }, {});

          this.updateRects();
        }
      }
    }
  },

  updateRects() {
    this.setState({
      rects: {
        ...this.state.rects,
        ...this._rects
      }
    });

    this._rects = {};
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
        {measuredElements.length > 0 &&
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
