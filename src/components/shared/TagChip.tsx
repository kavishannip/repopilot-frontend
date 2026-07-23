'use client';

import React from 'react';
import { Chip } from '@wso2/oxygen-ui';
import { getCategoryStyle, cn } from '@/lib/utils';

interface TagChipProps {
  label: string;
  category?: string;
  className?: string;
  size?: 'small' | 'medium';
  icon?: React.ReactElement;
  onClick?: () => void;
}

export default function TagChip({
  label,
  category,
  className,
  size = 'small',
  icon,
  onClick,
}: TagChipProps) {
  const style = getCategoryStyle(category);

  return (
    <Chip
      label={label}
      size={size}
      icon={icon}
      onClick={onClick}
      className={cn(
        'font-medium transition-all duration-200 border hover:scale-[1.03]',
        style.bg,
        style.text,
        style.border,
        className
      )}
      sx={{
        borderRadius: '6px',
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1.2,
        },
      }}
    />
  );
}
