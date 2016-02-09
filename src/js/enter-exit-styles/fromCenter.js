
const enterExit = (itemProps, gridProps, gridState) => {
  const { columns, columnWidth, gutterWidth } = gridProps;

  return {
    x: (columns * columnWidth + (columns - 1) * gutterWidth - columnWidth) / 2,
    y: gridState.gridHeight / 2,
    scale: 0,
    opacity: 0
  };
};

export const enter = enterExit;
export const exit = enterExit;
