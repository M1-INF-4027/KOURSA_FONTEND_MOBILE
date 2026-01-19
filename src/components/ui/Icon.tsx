/**
 * Koursa - Icon Component
 * Composant d'icone utilisant MaterialCommunityIcons
 */

import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: object;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.text.primary,
  style,
}) => {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default Icon;
