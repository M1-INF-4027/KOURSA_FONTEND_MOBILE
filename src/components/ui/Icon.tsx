/**
 * Koursa - Icon Component
 * Composant d'icone utilisant lucide-react-native
 */

import React from 'react';
import { ViewStyle } from 'react-native';
import {
  User,
  UserCircle,
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  X,
  Mail,
  Eye,
  EyeOff,
  FileText,
  Home,
  Info,
  KeyRound,
  LogOut,
  MapPin,
  Menu,
  Pencil,
  Plus,
  GraduationCap,
  Users,
  Search,
  Settings,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  Filter,
  BookOpen,
  ClipboardList,
  UserCheck,
  UserPlus,
  UserPen,
  Phone,
  Building,
  Building2,
  Hash,
  CircleDot,
  Circle,
  Star,
  Heart,
  Send,
  MessageCircle,
  Camera,
  Image,
  Download,
  Upload,
  Share2,
  Copy,
  ExternalLink,
  MoreVertical,
  MoreHorizontal,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  XCircle,
  MinusCircle,
  PlusCircle,
  HelpCircle,
  Lock,
  Unlock,
  Shield,
  Award,
  Target,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  Folder,
  FolderOpen,
  File,
  FileCheck,
  FilePlus,
  FileMinus,
  List,
  Grid,
  Layout,
  Layers,
  Loader,
  DatabaseZap,
  BadgeCheck,
  CircleCheck,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';

// Mapping des noms d'icones MaterialCommunityIcons vers Lucide
const iconMap: Record<string, LucideIcon> = {
  // User icons
  'account': User,
  'account-circle': UserCircle,
  'account-circle-outline': UserCircle,
  'account-outline': User,
  'account-group': Users,
  'account-group-outline': Users,
  'account-multiple': Users,
  'account-multiple-outline': Users,
  'account-check': UserCheck,
  'account-plus': UserPlus,
  'account-edit': UserPen,
  'account-badge': BadgeCheck,
  'account-badge-outline': BadgeCheck,

  // Alert icons
  'alert': AlertTriangle,
  'alert-circle': AlertCircle,
  'alert-circle-outline': AlertCircle,
  'alert-outline': AlertTriangle,

  // Navigation icons
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'menu': Menu,

  // Action icons
  'check': Check,
  'check-circle': CheckCircle,
  'check-circle-outline': CheckCircle,
  'close': X,
  'close-circle': XCircle,
  'close-circle-outline': XCircle,
  'plus': Plus,
  'plus-circle': PlusCircle,
  'plus-circle-outline': PlusCircle,
  'minus-circle': MinusCircle,
  'minus-circle-outline': MinusCircle,
  'pencil': Pencil,
  'pencil-outline': Pencil,
  'delete': Trash2,
  'delete-outline': Trash2,
  'trash-can': Trash2,
  'trash-can-outline': Trash2,

  // Communication icons
  'bell': Bell,
  'bell-outline': Bell,
  'email': Mail,
  'email-outline': Mail,
  'phone': Phone,
  'phone-outline': Phone,
  'message': MessageCircle,
  'message-outline': MessageCircle,
  'send': Send,
  'send-outline': Send,

  // View icons
  'eye': Eye,
  'eye-outline': Eye,
  'eye-off': EyeOff,
  'eye-off-outline': EyeOff,

  // Document icons
  'file-document': FileText,
  'file-document-outline': FileText,
  'clipboard-list': ClipboardList,
  'clipboard-list-outline': ClipboardList,
  'book-open': BookOpen,
  'book-open-outline': BookOpen,

  // Location icons
  'map-marker': MapPin,
  'map-marker-outline': MapPin,
  'home': Home,
  'home-outline': Home,
  'office-building': Building,
  'office-building-outline': Building,
  'domain': Building2,
  'domain-outline': Building2,

  // Time icons
  'clock': Clock,
  'clock-outline': Clock,
  'clock-check': CircleCheck,
  'clock-check-outline': CircleCheck,
  'calendar': Calendar,
  'calendar-outline': Calendar,
  'calendar-check': CalendarCheck,
  'calendar-check-outline': CalendarCheck,

  // Info icons
  'information': Info,
  'information-outline': Info,
  'help-circle': HelpCircle,
  'help-circle-outline': HelpCircle,

  // Security icons
  'lock': Lock,
  'lock-outline': Lock,
  'lock-open': Unlock,
  'lock-open-outline': Unlock,
  'lock-reset': KeyRound,
  'shield': Shield,
  'shield-outline': Shield,

  // Auth icons
  'logout': LogOut,
  'login': LogOut, // Using same icon, mirrored in usage

  // Education icons
  'school': GraduationCap,
  'school-outline': GraduationCap,

  // Search and filter
  'magnify': Search,
  'search': Search,
  'filter': Filter,
  'filter-outline': Filter,

  // Settings
  'cog': Settings,
  'cog-outline': Settings,
  'settings': Settings,

  // File operations
  'content-save': Save,
  'content-save-outline': Save,
  'download': Download,
  'download-outline': Download,
  'upload': Upload,
  'upload-outline': Upload,
  'refresh': RefreshCw,
  'sync': RefreshCw,

  // Share and copy
  'share': Share2,
  'share-outline': Share2,
  'share-variant': Share2,
  'share-variant-outline': Share2,
  'content-copy': Copy,
  'open-in-new': ExternalLink,

  // More options
  'dots-vertical': MoreVertical,
  'dots-horizontal': MoreHorizontal,

  // Media icons
  'camera': Camera,
  'camera-outline': Camera,
  'image': Image,
  'image-outline': Image,

  // Misc icons
  'star': Star,
  'star-outline': Star,
  'heart': Heart,
  'heart-outline': Heart,
  'circle': Circle,
  'circle-outline': Circle,
  'record-circle': CircleDot,
  'record-circle-outline': CircleDot,
  'pound': Hash,
  'numeric': Hash,

  // Achievement icons
  'trophy': Award,
  'trophy-outline': Award,
  'medal': Award,
  'medal-outline': Award,
  'target': Target,
  'lightning-bolt': Zap,
  'flash': Zap,

  // Analytics icons
  'chart-line': Activity,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'chart-bar': BarChart2,
  'chart-pie': PieChart,

  // Folder and file icons
  'folder': Folder,
  'folder-outline': Folder,
  'folder-open': FolderOpen,
  'folder-open-outline': FolderOpen,
  'file': File,
  'file-outline': File,
  'file-check': FileCheck,
  'file-check-outline': FileCheck,
  'file-plus': FilePlus,
  'file-plus-outline': FilePlus,
  'file-remove': FileMinus,
  'file-remove-outline': FileMinus,

  // View layout icons
  'view-list': List,
  'format-list-bulleted': List,
  'view-grid': Grid,
  'view-module': Grid,
  'view-dashboard': Layout,
  'layers': Layers,
  'layers-outline': Layers,

  // Loading
  'loading': Loader,

  // Database
  'database': DatabaseZap,
  'database-off': DatabaseZap,
  'database-outline': DatabaseZap,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = Colors.text.primary,
  style,
  strokeWidth = 2,
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    // Fallback to HelpCircle if icon not found
    console.warn(`Icon "${name}" not found in mapping, using fallback`);
    return (
      <HelpCircle
        size={size}
        color={color}
        style={style}
        strokeWidth={strokeWidth}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      style={style}
      strokeWidth={strokeWidth}
    />
  );
};

export default Icon;
