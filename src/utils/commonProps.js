import React from 'react';
import simpleLayout from '../layouts/simple';
import * as simpleEnterExit from '../enter-exit-styles/simple';

export const commonPropTypes = {
  columns: React.PropTypes.number.isRequired,
  columnWidth: React.PropTypes.number.isRequired,
  gutterWidth: React.PropTypes.number,
  gutterHeight: React.PropTypes.number,
  component: React.PropTypes.string,
  layout: React.PropTypes.func,
  enter: React.PropTypes.func,
  entered: React.PropTypes.func,
  exit: React.PropTypes.func,
  perspective: React.PropTypes.number,
  lengthUnit: React.PropTypes.string,
  angleUnit: React.PropTypes.string
};

export const commonDefaultProps = {
  lengthUnit: 'px',
  angleUnit: 'deg',
  component: 'div',
  gutterWidth: 0,
  gutterHeight: 0,
  layout: simpleLayout,
  enter: simpleEnterExit.enter,
  entered: simpleEnterExit.entered,
  exit: simpleEnterExit.exit
};
