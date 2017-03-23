import React, { Component } from 'react';
import debounce from 'debounce';
import { commonDefaultProps } from '../utils/commonProps';

const imagesLoaded = typeof window !== 'undefined' ? require('imagesloaded') : null;

export default (Grid, { measureImages, background } = {}) => class extends Component {

  static defaultProps = {
    component: commonDefaultProps.component
  };

  constructor(props) {
    super(props);

    this.rects = {};
    this.loading = {};
    this.retryTimeouts = {};

    this.state = {
      rects: {}
    };
  }

  componentDidMount() {
    this.updateRectsDebounced = debounce(this.updateRects, 20);
    this.measureElements();
  }

  componentDidUpdate() {
    this.measureElements();
  }

  componentWillUnmount() {
    Object.keys(this.retryTimeouts).forEach((key) => {
      clearTimeout(this.retryTimeouts[key]);
    });
  }

  measureElements = () => {
    if (this.elementsToMeasureContainer) {
      const elements = this.elementsToMeasureContainer.children;

      if (elements.length) {
        if (measureImages) {
          Array.from(elements)
            .filter(el => !this.loading[el.dataset.stonecutterkey])
            .forEach((el) => {
              this.loading[el.dataset.stonecutterkey] = true;

              imagesLoaded(el, { background }, () => {
                this.measureElementWithImages(el, 5);
              });
            });
        } else {
          this.rects = Array.from(elements).reduce((acc, el) => {
            acc[el.dataset.stonecutterkey] = el.getBoundingClientRect();
            return acc;
          }, {});

          this.updateRects();
        }
      }
    }
  };

  measureElementWithImages = (el, retries) => {
    const clientRect = el.getBoundingClientRect();

    if (clientRect && clientRect.height > 0) {
      this.rects[el.dataset.stonecutterkey] = clientRect;
      delete this.loading[el.dataset.stonecutterkey];
      this.updateRectsDebounced();
    } else if (retries > 0) {
      clearTimeout(this.retryTimeouts[el.dataset.stonecutterkey]);
      this.retryTimeouts[el.dataset.stonecutterkey] =
        setTimeout(this.measureElement, 20, el, --retries);
    }
  };

  updateRects = () => {
    this.setState({
      rects: {
        ...this.state.rects,
        ...this.rects
      }
    });

    this.rects = {};
  };

  render() {
    const { component } = this.props;

    const children = React.Children.toArray(this.props.children);
    const newElements = children.filter(element => !this.state.rects[element.key]);
    const existingElements = children.filter(element => this.state.rects[element.key]);

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
            ref: (el) => { this.elementsToMeasureContainer = el; }
          }, elementsToMeasure)}
      </span>
    );
  }

};
