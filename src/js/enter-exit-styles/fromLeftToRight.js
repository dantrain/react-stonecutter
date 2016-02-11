
export const enter = () => {
  return {
    translateX: -500,
    opacity: 0
  };
};

export const exit = (itemProps, gridProps, gridState) => {
  return {
    translateX: gridState.gridWidth + 500,
    opacity: 0
  };
};
