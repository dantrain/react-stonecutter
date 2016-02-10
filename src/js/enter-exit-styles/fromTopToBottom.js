
export const enter = () => {
  return {
    y: -500,
    opacity: 0
  };
};

export const exit = (itemProps, gridProps, gridState) => {
  return {
    y: gridState.gridHeight + 500,
    opacity: 0
  };
};
