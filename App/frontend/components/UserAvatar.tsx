import React from 'react';
import { Camera } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCamera?: boolean;
  onCameraClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name = '', 
  size = 'md', 
  className = '', 
  showCamera = false,
  onCameraClick 
}) => {
  // Generate initials from name
  const getInitials = (fullName: string): string => {
    if (!fullName) return 'U';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Generate consistent color based on name
  const getAvatarColor = (fullName: string): string => {
    if (!fullName) return 'from-gray-400 to-gray-600';
    
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600', 
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-teal-400 to-teal-600',
      'from-orange-400 to-orange-600',
      'from-cyan-400 to-cyan-600'
    ];
    
    // Use name length and first character to determine color
    const colorIndex = (fullName.length + fullName.charCodeAt(0)) % colors.length;
    return colors[colorIndex];
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
      camera: 'w-6 h-6 -bottom-0.5 -right-0.5',
      cameraIcon: 'w-3 h-3'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-base',
      camera: 'w-7 h-7 -bottom-1 -right-1',
      cameraIcon: 'w-3.5 h-3.5'
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-xl',
      camera: 'w-8 h-8 -bottom-1 -right-1',
      cameraIcon: 'w-4 h-4'
    },
    xl: {
      container: 'w-24 h-24',
      text: 'text-2xl',
      camera: 'w-8 h-8 -bottom-1 -right-1',
      cameraIcon: 'w-4 h-4'
    }
  };

  const config = sizeConfig[size];
  const initials = getInitials(name);
  const gradientColor = getAvatarColor(name);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          ${config.container} 
          bg-gradient-to-br ${gradientColor} 
          rounded-full 
          flex items-center justify-center 
          text-white 
          font-bold 
          ${config.text}
          shadow-sm
          ring-2 ring-white
        `}
        title={name || 'User'}
      >
        {initials}
      </div>
      
      {showCamera && (
        <button
          onClick={onCameraClick}
          className={`
            absolute ${config.camera}
            bg-blue-600 
            rounded-full 
            flex items-center justify-center 
            text-white 
            hover:bg-blue-700 
            transition-colors
            shadow-sm
            ring-2 ring-white
          `}
          title="Change profile picture"
        >
          <Camera className={config.cameraIcon} />
        </button>
      )}
    </div>
  );
};

export default UserAvatar;