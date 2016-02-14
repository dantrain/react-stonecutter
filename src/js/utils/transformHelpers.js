
const properties = [
  { name: 'translateX', unit: 'px' },
  { name: 'translateY', unit: 'px' },
  { name: 'perspective', unit: 'px' },
  { name: 'skew', unit: 'deg' },
  { name: 'skewX', unit: 'deg' },
  { name: 'skewY', unit: 'deg' },
  { name: 'scale' },
  { name: 'scaleX' },
  { name: 'scaleY' },
  { name: 'scaleZ' },
  { name: 'rotate', unit: 'deg' },
  { name: 'rotateX', unit: 'deg' },
  { name: 'rotateY', unit: 'deg' }
];

export const buildTransform = (style, perspective) => {
  const arr = [];

  properties.forEach(prop => {
    if (prop.name === 'perspective') {
      if (typeof perspective !== 'undefined') {
        arr.push('perspective(' + perspective + prop.unit + ')');
      }
    } else if (typeof style[prop.name] !== 'undefined') {
      arr.push(prop.name + '(' + style[prop.name] +
                (prop.unit || '') + ')');
    }
  });

  return arr.join(' ');
};
