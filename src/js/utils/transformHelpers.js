
const properties = [
  { name: 'translateX', unit: 'px' },
  { name: 'translateY', unit: 'px' },
  { name: 'skew', unit: 'deg' },
  { name: 'scale' },
  { name: 'rotate', unit: 'deg' }
];

export const transformDefaults = {
  scale: 1,
  rotate: 0,
  skew: 0
};

export const buildTransform = style => {
  const arr = [];

  properties.forEach(prop => {
    if (typeof style[prop.name] !== 'undefined') {
      arr.push(prop.name + '(' + style[prop.name] +
                (prop.unit || '') + ')');
    }
  });

  return arr.join(' ');
};
