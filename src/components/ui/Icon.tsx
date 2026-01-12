/**
 * Koursa UI - Icon Component
 * Wrapper pour les icones Lucide avec mapping des noms MaterialCommunityIcons
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import {
  User,
  UserCircle,
  Users,
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  X,
  XCircle,
  Construction,
  DoorOpen,
  Mail,
  Eye,
  EyeOff,
  FileText,
  Files,
  Filter,
  FlaskConical,
  Info,
  Lock,
  LogOut,
  Search,
  Pencil,
  Plus,
  GraduationCap,
  Send,
  LayoutDashboard,
  LucideIcon,
} from 'lucide-react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

// Mapping des noms MaterialCommunityIcons vers les composants Lucide
const iconMap: Record<string, LucideIcon> = {
  // Account / User icons
  'account': User,
  'account-outline': User,
  'account-circle': UserCircle,
  'account-circle-outline': UserCircle,
  'account-group': Users,
  'account-group-outline': Users,

  // Alert icons
  'alert': AlertTriangle,
  'alert-circle': AlertCircle,

  // Navigation
  'arrow-left': ArrowLeft,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,

  // Actions
  'bell-outline': Bell,
  'close': X,
  'check': Check,
  'check-circle': CheckCircle,
  'check-circle-outline': CheckCircle2,
  'close-circle': XCircle,
  'close-circle-outline': XCircle,
  'plus': Plus,
  'send': Send,
  'logout': LogOut,
  'filter-variant': Filter,
  'magnify': Search,
  'pencil': Pencil,

  // Document icons
  'file-document': FileText,
  'file-document-outline': FileText,
  'file-document-multiple': Files,
  'book-open-variant': BookOpen,

  // Time / Calendar
  'calendar': Calendar,
  'clock-outline': Clock,

  // Form icons
  'email-outline': Mail,
  'lock-outline': Lock,
  'lock-check-outline': Lock,
  'eye': Eye,
  'eye-off': EyeOff,
  'door': DoorOpen,

  // Info icons
  'information': Info,
  'construction': Construction,

  // Education
  'school': GraduationCap,
  'school-outline': GraduationCap,
  'flask': FlaskConical,

  // Dashboard
  'view-dashboard': LayoutDashboard,
  'view-dashboard-outline': LayoutDashboard,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000000',
  style,
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent size={size} color={color} style={style} />;
};

export default Icon;
