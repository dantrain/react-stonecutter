
export const enter = () => {
  return {
    translateY: -500,
    opacity: 0
  };
};

export const exit = (itemProps, gridProps, gridState) => {
  return {
    translateY: gridState.gridHeight + 500,
    opacity: 0
  };
};
