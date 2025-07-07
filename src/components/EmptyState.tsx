import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  showButton?: boolean;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  showButton = false,
  buttonText = 'Browse Auctions',
  buttonHref = '/auctions',
  className = '',
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{description}</p>
      {showButton && (
        <Button asChild>
          <a href={buttonHref}>
            {buttonText}
          </a>
        </Button>
      )}
    </div>
  );
}
