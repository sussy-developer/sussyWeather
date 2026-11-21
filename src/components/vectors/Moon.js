import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function Moon({
  width = 180,
  height = 180,
  size,
  moonColor,
  style,
  ...props
}) {
  const finalWidth = size || width;
  const finalHeight = size || height;

  return (
    <View style={[{ width: finalWidth, height: finalHeight }, styles.container, style]} {...props}>
      <Svg width={finalWidth} height={finalHeight} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="standaloneMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={moonColor || '#fef08a'} stopOpacity="1" />
            <Stop offset="100%" stopColor={moonColor ? moonColor : '#facc15'} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Path
          d="M 58 20 A 32 32 0 1 1 40 78 A 28 28 0 0 0 58 20 Z"
          fill="url(#standaloneMoonGrad)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
