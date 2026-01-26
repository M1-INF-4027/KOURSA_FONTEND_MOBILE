/**
 * Koursa - Avatar Components
 * Composants d'avatars pour utilisateurs
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { Colors } from '../../constants/colors';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  icon?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

const sizeConfig: Record<AvatarSize, { size: number; fontSize: number; iconSize: number }> = {
  small: { size: 32, fontSize: 12, iconSize: 16 },
  medium: { size: 44, fontSize: 16, iconSize: 22 },
  large: { size: 64, fontSize: 24, iconSize: 32 },
  xlarge: { size: 96, fontSize: 36, iconSize: 48 },
};

const getInitials = (name: string): string => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    Colors.primary,
    Colors.secondary,
    Colors.success,
    Colors.warning,
    Colors.info,
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
  ];

  if (!name) return colors[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  icon,
  size = 'medium',
  backgroundColor,
  textColor = Colors.text.inverse,
  style,
}) => {
  const config = sizeConfig[size];
  const bgColor = backgroundColor || (name ? getColorFromName(name) : Colors.background.secondary);

  const containerStyle: ViewStyle = {
    width: config.size,
    height: config.size,
    borderRadius: config.size / 2,
    backgroundColor: bgColor,
  };

  // If we have a source image
  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.avatar as any,
          containerStyle,
          style as any,
        ]}
      />
    );
  }

  // If we have a name, show initials
  if (name) {
    return (
      <View style={[styles.avatar, containerStyle, style]}>
        <Text
          style={{
            fontSize: config.fontSize,
            fontWeight: '600',
            color: textColor,
          }}
        >
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  // If we have an icon
  if (icon) {
    return (
      <View style={[styles.avatar, containerStyle, style]}>
        <Icon name={icon} size={config.iconSize} color={textColor} />
      </View>
    );
  }

  // Default: show user icon
  return (
    <View style={[styles.avatar, containerStyle, style]}>
      <Icon name="account" size={config.iconSize} color={Colors.text.tertiary} />
    </View>
  );
};

interface AvatarGroupProps {
  avatars: Array<{
    source?: ImageSourcePropType;
    name?: string;
  }>;
  max?: number;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'medium',
  style,
}) => {
  const config = sizeConfig[size];
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const overlap = config.size * 0.3;

  return (
    <View style={[styles.avatarGroup, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.avatarWrapper,
            {
              marginLeft: index === 0 ? 0 : -overlap,
              zIndex: displayAvatars.length - index,
            },
          ]}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
            style={styles.groupAvatar}
          />
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.avatarWrapper,
            {
              marginLeft: -overlap,
              zIndex: 0,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              styles.groupAvatar,
              {
                width: config.size,
                height: config.size,
                borderRadius: config.size / 2,
                backgroundColor: Colors.background.secondary,
              },
            ]}
          >
            <Text
              variant="caption"
              color="secondary"
              style={{ fontWeight: '600' }}
            >
              +{remaining}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  groupAvatar: {
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
});

export default Avatar;
