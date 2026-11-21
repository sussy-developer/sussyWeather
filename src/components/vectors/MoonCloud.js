import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function MoonCloud({
  width = 240,
  height = 170,
  cloudColor,
  moonColor,
  style,
  ...props
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 110 85"
      style={style}
      {...props}
    >
      <Defs>
        <LinearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={moonColor || '#fef08a'} stopOpacity="1" />
          <Stop offset="100%" stopColor={moonColor ? moonColor : '#facc15'} stopOpacity="1" />
        </LinearGradient>

        <LinearGradient id="nightCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={cloudColor || '#e2e8f0'} stopOpacity="1" />
          <Stop offset="100%" stopColor={cloudColor ? cloudColor : '#94a3b8'} stopOpacity="1" />
        </LinearGradient>

        <LinearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#fef08a" stopOpacity="0.7" />
        </LinearGradient>
      </Defs>

      <Path
        d="M 90 14 Q 90 18 94 18 Q 90 18 90 22 Q 90 18 86 18 Q 90 18 90 14 Z"
        fill="url(#starGrad)"
      />
      <Path
        d="M 44 20 Q 44 23 47 23 Q 44 23 44 26 Q 44 23 41 23 Q 44 23 44 20 Z"
        fill="url(#starGrad)"
      />

      <Path
        d="M 68 14 A 17 17 0 1 1 53 43 A 14 14 0 0 0 68 14 Z"
        fill="url(#moonGrad)"
      />

      <Path
        d="M25 68 L78 68 A12 12 0 0 0 90 56 A13 13 0 0 0 78 43 A22 22 0 0 0 38 38 A16 16 0 0 0 12 54 A14 14 0 0 0 25 68 Z"
        fill="url(#nightCloudGrad)"
      />
    </Svg>
  );
}
