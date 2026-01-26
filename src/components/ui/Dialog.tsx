/**
 * Koursa - Dialog Components
 * Composants de dialogues et modales
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from './Text';
import { Icon } from './Icon';
import { Button } from './Button';
import { Input } from './Input';
import { Colors } from '../../constants/colors';

interface DialogProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  style?: ViewStyle;
}

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  showCloseButton = true,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback
          onPress={closeOnBackdrop ? onClose : undefined}
        >
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.dialog, style]}>
                {(title || showCloseButton) && (
                  <View style={styles.header}>
                    {title && (
                      <Text variant="h4" color="primary" style={styles.title}>
                        {title}
                      </Text>
                    )}
                    {showCloseButton && (
                      <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                      >
                        <Icon name="close" size={24} color={Colors.text.secondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View style={styles.content}>{children}</View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  type?: AlertType;
  title: string;
  message: string;
  buttonText?: string;
}

const alertConfig: Record<AlertType, { icon: string; color: string; bgColor: string }> = {
  info: {
    icon: 'information',
    color: Colors.info,
    bgColor: Colors.infoLight,
  },
  success: {
    icon: 'check-circle',
    color: Colors.success,
    bgColor: Colors.successLight,
  },
  warning: {
    icon: 'alert',
    color: Colors.warning,
    bgColor: Colors.warningLight,
  },
  error: {
    icon: 'alert-circle',
    color: Colors.error,
    bgColor: Colors.errorLight,
  },
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  visible,
  onClose,
  type = 'info',
  title,
  message,
  buttonText = 'OK',
}) => {
  const config = alertConfig[type];

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      closeOnBackdrop={false}
    >
      <View style={styles.alertContent}>
        <View
          style={[
            styles.alertIconContainer,
            { backgroundColor: config.bgColor },
          ]}
        >
          <Icon name={config.icon} size={32} color={config.color} />
        </View>
        <Text variant="h4" color="primary" style={styles.alertTitle}>
          {title}
        </Text>
        <Text variant="body" color="secondary" style={styles.alertMessage}>
          {message}
        </Text>
        <Button
          variant="primary"
          fullWidth
          onPress={onClose}
          style={styles.alertButton}
        >
          {buttonText}
        </Button>
      </View>
    </Dialog>
  );
};

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'primary',
  loading = false,
}) => {
  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      closeOnBackdrop={false}
    >
      <View style={styles.confirmContent}>
        <Text variant="h4" color="primary" style={styles.confirmTitle}>
          {title}
        </Text>
        <Text variant="body" color="secondary" style={styles.confirmMessage}>
          {message}
        </Text>
        <View style={styles.confirmButtons}>
          <Button
            variant="ghost"
            onPress={onClose}
            disabled={loading}
            style={styles.confirmButton}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onPress={onConfirm}
            loading={loading}
            style={styles.confirmButton}
          >
            {confirmText}
          </Button>
        </View>
      </View>
    </Dialog>
  );
};

interface InputDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  submitText?: string;
  cancelText?: string;
  multiline?: boolean;
  loading?: boolean;
}

export const InputDialog: React.FC<InputDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  placeholder,
  defaultValue = '',
  submitText = 'Valider',
  cancelText = 'Annuler',
  multiline = false,
  loading = false,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = () => {
    onSubmit(value);
  };

  const handleClose = () => {
    setValue(defaultValue);
    onClose();
  };

  return (
    <Dialog
      visible={visible}
      onClose={handleClose}
      title={title}
      closeOnBackdrop={false}
    >
      <View style={styles.inputContent}>
        <Input
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          containerStyle={styles.inputField}
        />
        <View style={styles.inputButtons}>
          <Button
            variant="ghost"
            onPress={handleClose}
            disabled={loading}
            style={styles.inputButton}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={loading}
            disabled={!value.trim()}
            style={styles.inputButton}
          >
            {submitText}
          </Button>
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
    marginLeft: 12,
  },
  content: {
    padding: 20,
  },
  alertContent: {
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  alertTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  alertMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  alertButton: {
    marginTop: 8,
  },
  confirmContent: {
    alignItems: 'center',
  },
  confirmTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  confirmMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputContent: {},
  inputField: {
    marginBottom: 16,
  },
  inputButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputButton: {
    marginLeft: 8,
  },
});

export default Dialog;
