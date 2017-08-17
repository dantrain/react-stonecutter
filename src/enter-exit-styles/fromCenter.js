/* eslint-disable no-mixed-operators */
const enterExit = (itemProps, gridProps, gridState) => {
  const { columns, columnWidth, gutterWidth } = gridProps;

  return {
    translateX:
      (columns * columnWidth + (columns - 1) * gutterWidth - columnWidth) / 2,
    translateY: gridState.gridHeight / 2,
    scale: 0,
    opacity: 0
  };
};

export const enter = enterExit;
export const exit = enterExit;

export const entered = () => ({ scale: 1, opacity: 1 });
