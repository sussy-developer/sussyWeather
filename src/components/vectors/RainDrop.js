import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function RainDrop({
  size = 40,
  color = '#4fc3f7',
  style,
  ...props
}) {
  return (
    <Svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 24 36"
      fill="none"
      style={style}
      {...props}
    >
      <Path
        d="M12 2 C12 2, 3 16, 3 24 C3 28.97 7.03 33 12 33 C16.97 33 21 28.97 21 24 C21 16, 12 2, 12 2 Z"
        fill={color}
      />
    </Svg>
  );
}
