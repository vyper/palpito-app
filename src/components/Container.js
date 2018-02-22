import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Container = ({ style, ...props }) => (
  <View style={[{flex: 1}, style]} {...props}>
    {props.children}
  </View>
);
