
export const enter = () => {
  return {
    skew: 90,
    rotate: 45,
    scale: 0,
    opacity: 0
  };
};

export const exit = () => {
  return {
    skew: -90,
    rotate: -45,
    scale: 0,
    opacity: 0
  };
};
