/**
 * Koursa UI - Toast Component
 * Notifications toast personnalisees
 */

import React, { useEffect, useRef, createContext, useContext, useState, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows, ZIndex } from '../../constants/spacing';
import { Text } from './Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top' | 'bottom';

interface ToastConfig {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastProps extends ToastConfig {
  onDismiss: () => void;
}

const getToastConfig = (type: ToastType) => {
  const configs = {
    success: {
      icon: 'check-circle',
      backgroundColor: Colors.success,
      borderColor: Colors.successDark,
    },
    error: {
      icon: 'alert-circle',
      backgroundColor: Colors.error,
      borderColor: Colors.errorDark,
    },
    warning: {
      icon: 'alert',
      backgroundColor: Colors.warning,
      borderColor: Colors.warningDark,
    },
    info: {
      icon: 'information',
      backgroundColor: Colors.info,
      borderColor: Colors.infoDark,
    },
  };
  return configs[type];
};

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 3000,
  position = 'top',
  action,
  onDismiss,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

  const config = getToastConfig(type);

  useEffect(() => {
    // Animation d'entree
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        position === 'top' ? styles.toastTop : styles.toastBottom,
        {
          backgroundColor: config.backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}>
      <View style={styles.toastContent}>
        <Icon name={config.icon} size={24} color={Colors.light} style={styles.toastIcon} />
        <View style={styles.toastText}>
          {title && (
            <Text variant="labelLarge" style={styles.toastTitle}>
              {title}
            </Text>
          )}
          <Text variant="bodySmall" style={styles.toastMessage}>
            {message}
          </Text>
        </View>
        {action && (
          <TouchableOpacity onPress={action.onPress} style={styles.toastAction}>
            <Text variant="labelLarge" style={styles.toastActionText}>
              {action.label}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={dismiss} style={styles.toastDismiss}>
          <Icon name="close" size={20} color={Colors.light} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Toast Provider Context
interface ToastContextType {
  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  hideToast: (id: string) => void;
  hideAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const showToast = useCallback((config: Omit<ToastConfig, 'id'>) => {
    const id = generateId();
    setToasts((prev) => [...prev, { ...config, id }]);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast({ type: 'success', message, title });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast({ type: 'error', message, title, duration: 5000 });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast({ type: 'warning', message, title });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast({ type: 'info', message, title });
  }, [showToast]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const hideAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideToast,
        hideAll,
      }}>
      {children}
      <SafeAreaView style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </SafeAreaView>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: ZIndex.toast,
    pointerEvents: 'box-none',
  },
  toast: {
    position: 'absolute',
    left: Spacing.base,
    right: Spacing.base,
    borderRadius: BorderRadius.md,
    ...Shadows.lg,
  },
  toastTop: {
    top: Spacing.xl,
  },
  toastBottom: {
    bottom: Spacing.xl,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  toastIcon: {
    marginRight: Spacing.sm,
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    color: Colors.light,
    marginBottom: 2,
  },
  toastMessage: {
    color: Colors.light,
    opacity: 0.95,
  },
  toastAction: {
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  toastActionText: {
    color: Colors.light,
    textDecorationLine: 'underline',
  },
  toastDismiss: {
    marginLeft: Spacing.xs,
    padding: Spacing.xs,
  },
});

export default Toast;
