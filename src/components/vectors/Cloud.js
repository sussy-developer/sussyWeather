import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function Cloud({
  width = 240,
  height = 140,
  color,
  style,
  ...props
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 60"
      style={style}
      {...props}
    >
      <Defs>
        <LinearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color || '#adadad85'} stopOpacity="1" />
          <Stop offset="100%" stopColor={color ? color : '#9dabc14f'} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M25 48 L78 48 A12 12 0 0 0 90 36 A13 13 0 0 0 78 23 A22 22 0 0 0 38 18 A16 16 0 0 0 12 34 A14 14 0 0 0 25 48 Z"
        fill="url(#cloudGrad)"
      />
    </Svg>
  );
}
