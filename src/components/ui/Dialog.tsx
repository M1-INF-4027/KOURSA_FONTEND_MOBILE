/**
 * Koursa UI - Dialog Component
 * Boites de dialogue personnalisees
 */

import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Shadows, ZIndex } from '../../constants/spacing';
import { Text } from './Text';
import { Button } from './Button';
import { Icon } from './Icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DialogProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: React.ReactNode;
  dismissable?: boolean;
  style?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onDismiss,
  title,
  children,
  dismissable = true,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismissable ? onDismiss : undefined}
      statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={dismissable ? onDismiss : undefined}
        />
        <View style={[styles.container, style]}>
          {title && (
            <View style={styles.header}>
              <Text variant="h5" style={styles.title}>
                {title}
              </Text>
              {dismissable && (
                <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                  <Icon name="close" size={24} color={Colors.gray[500]} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Dialog Actions
interface DialogActionsProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.actions, style]}>{children}</View>;
};

// Alert Dialog predefinie
interface AlertDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  onDismiss,
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
  type = 'info',
}) => {
  const iconConfig = {
    info: { name: 'information', color: Colors.info },
    warning: { name: 'alert', color: Colors.warning },
    error: { name: 'alert-circle', color: Colors.error },
    success: { name: 'check-circle', color: Colors.success },
  };

  const config = iconConfig[type];

  const handleConfirm = () => {
    onConfirm?.();
    onDismiss();
  };

  const handleCancel = () => {
    onCancel?.();
    onDismiss();
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss} dismissable={false}>
      <View style={styles.alertContent}>
        <View style={[styles.alertIcon, { backgroundColor: `${config.color}20` }]}>
          <Icon name={config.name} size={40} color={config.color} />
        </View>
        <Text variant="h5" align="center" style={styles.alertTitle}>
          {title}
        </Text>
        <Text variant="body" color="secondary" align="center" style={styles.alertMessage}>
          {message}
        </Text>
      </View>
      <DialogActions>
        {cancelText && (
          <Button
            title={cancelText}
            onPress={handleCancel}
            variant="ghost"
            style={styles.alertButton}
          />
        )}
        <Button
          title={confirmText}
          onPress={handleConfirm}
          variant={type === 'error' ? 'danger' : 'primary'}
          style={styles.alertButton}
        />
      </DialogActions>
    </Dialog>
  );
};

// Confirm Dialog
interface ConfirmDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onDismiss,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  destructive = false,
}) => {
  return (
    <AlertDialog
      visible={visible}
      onDismiss={onDismiss}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onDismiss}
      type={destructive ? 'error' : 'warning'}
    />
  );
};

// Input Dialog
interface InputDialogProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
  submitText?: string;
  cancelText?: string;
  multiline?: boolean;
}

export const InputDialog: React.FC<InputDialogProps> = ({
  visible,
  onDismiss,
  title,
  placeholder,
  defaultValue = '',
  onSubmit,
  submitText = 'Envoyer',
  cancelText = 'Annuler',
  multiline = false,
}) => {
  const [value, setValue] = React.useState(defaultValue);
  const { TextInput } = require('react-native');

  React.useEffect(() => {
    if (visible) {
      setValue(defaultValue);
    }
  }, [visible, defaultValue]);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      onDismiss();
    }
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss} title={title}>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[400]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
        ]}
        autoFocus
      />
      <DialogActions>
        <Button
          title={cancelText}
          onPress={onDismiss}
          variant="ghost"
          style={styles.alertButton}
        />
        <Button
          title={submitText}
          onPress={handleSubmit}
          disabled={!value.trim()}
          style={styles.alertButton}
        />
      </DialogActions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: ZIndex.modal,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay.backdrop,
  },
  container: {
    width: SCREEN_WIDTH - Spacing['2xl'] * 2,
    maxWidth: 400,
    backgroundColor: Colors.light,
    borderRadius: BorderRadius.xl,
    ...Shadows.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  // Alert
  alertContent: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  alertIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  alertTitle: {
    marginBottom: Spacing.sm,
  },
  alertMessage: {
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.sm,
  },
  alertButton: {
    minWidth: 100,
  },
  // Input
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: Spacing.base,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default Dialog;
