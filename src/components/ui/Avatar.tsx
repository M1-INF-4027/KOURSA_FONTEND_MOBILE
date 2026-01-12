/**
 * Koursa UI - Avatar Component
 * Composant avatar personnalise
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { AvatarSizes, BorderRadius } from '../../constants/spacing';
import { Text } from './Text';
import { Icon } from './Icon';

type AvatarSize = keyof typeof AvatarSizes;

interface AvatarProps {
  size?: AvatarSize;
  source?: ImageSourcePropType;
  initials?: string;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'base',
  source,
  initials,
  icon,
  color = Colors.primary,
  style,
}) => {
  const avatarSize = AvatarSizes[size];
  const fontSize = avatarSize * 0.4;
  const iconSize = avatarSize * 0.5;

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: color,
  };

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.image, containerStyle, style]}
        resizeMode="cover"
      />
    );
  }

  if (initials) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <Text
          style={[
            styles.initials,
            { fontSize, color: Colors.light },
          ]}>
          {initials.toUpperCase().slice(0, 2)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle, style]}>
      <Icon name={icon || 'account'} size={iconSize} color={Colors.light} />
    </View>
  );
};

// Avatar Group
interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'md',
  style,
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const avatarSize = AvatarSizes[size];
  const overlap = avatarSize * 0.3;

  return (
    <View style={[styles.group, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupItem,
            { marginLeft: index === 0 ? 0 : -overlap, zIndex: displayAvatars.length - index },
          ]}>
          <Avatar {...avatar} size={size} />
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.groupItem,
            { marginLeft: -overlap, zIndex: 0 },
          ]}>
          <View
            style={[
              styles.container,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: Colors.gray[300],
              },
            ]}>
            <Text style={[styles.remaining, { fontSize: avatarSize * 0.35 }]}>
              +{remaining}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '600',
  },
  // Group
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    borderWidth: 2,
    borderColor: Colors.light,
    borderRadius: 999,
  },
  remaining: {
    color: Colors.gray[600],
    fontWeight: '600',
  },
});

export default Avatar;
