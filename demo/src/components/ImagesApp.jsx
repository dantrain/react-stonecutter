import React from 'react';
import { SpringGrid, measureItems, layout } from '../../../src/index';

const Grid = measureItems(SpringGrid, { measureImages: true });

const membershipNumbers = [2, 5, 12, 14, 21, 22, 29,
  36, 50, 51, 59, 66, 67, 79, 85, 111, 314, 600, 908];

export default () => {
  const items = membershipNumbers
    .map(membershipNumber =>
      <li
        className="grid-item"
        key={membershipNumber}
      >
       <img src={`images/${membershipNumber}.png`}></img>
      </li>
    );

  return (
    <Grid
      className="grid"
      component="ul"
      columns={4}
      columnWidth={184}
      gutterWidth={10}
      gutterHeight={10}
      layout={layout.pinterest}
      enter={() => ({ opacity: 0 })}
      entered={() => ({ opacity: 1 })}
      exit={() => ({ opacity: 0 })}
      springConfig={{ stiffness: 60, damping: 14 }}
    >
      {items}
    </Grid>
  );
};
