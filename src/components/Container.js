import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Container = ({ style, ...props }) => (
  <View style={[{ flex: 1, padding: 10, backgroundColor: 'white' }, style]} {...props}>
    {props.children}
  </View>
);
