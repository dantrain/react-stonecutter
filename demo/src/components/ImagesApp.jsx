import React from 'react';
import { SpringGrid, measureItems, layout } from '../../../src/index';

const Grid = measureItems(SpringGrid);

const membershipNumbers = [2, 5, 12, 14, 21, 22, 29,
  36, 50, 51, 59, 66, 67, 79, 85, 111, 314, 600, 908];

export default () => {
  const items = membershipNumbers
    .map(membershipNumber =>
      <li
        className="grid-item"
        key={membershipNumber}
        style={{
          width: 170
        }}
      >
       <img src={`images/${membershipNumber}.png`}></img>
      </li>
    );

  return (
    <Grid
      className="grid"
      component="ul"
      columns={4}
      columnWidth={170}
      gutterWidth={10}
      gutterHeight={10}
      layout={layout.pinterest}
      springConfig={{ stiffness: 170, damping: 26 }}
    >
      {items}
    </Grid>
  );
};
