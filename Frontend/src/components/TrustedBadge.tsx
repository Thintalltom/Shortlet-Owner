import React from 'react';
import { StarIcon } from 'lucide-react';
interface TrustedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
}
export function TrustedBadge({
  size = 'md',
  showSubtext = false
}: TrustedBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2'
  };
  const iconSizes = {
    sm: 10,
    md: 13,
    lg: 16
  };
  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center rounded-full font-semibold bg-amber-50 text-amber-600 border border-amber-200 ${sizeClasses[size]}`}>

        <StarIcon
          size={iconSizes[size]}
          className="fill-amber-500 text-amber-500" />

        Trusted Agent
      </span>
      {showSubtext &&
      <span className="text-xs text-[#6B7280] ml-0.5">
          Phone confirmed & profile reviewed
        </span>
      }
    </div>);

}