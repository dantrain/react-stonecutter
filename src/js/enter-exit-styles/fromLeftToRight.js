
export const enter = () => {
  return {
    x: -500,
    opacity: 0
  };
};

export const exit = (itemProps, gridProps, gridState) => {
  return {
    x: gridState.gridWidth + 500,
    opacity: 0
  };
};
