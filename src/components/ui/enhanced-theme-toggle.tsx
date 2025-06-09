
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface EnhancedThemeToggleProps {
  showLabel?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export function EnhancedThemeToggle({ 
  showLabel = false, 
  variant = 'default',
  className 
}: EnhancedThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Vaalea', icon: Sun },
    { value: 'dark', label: 'Tumma', icon: Moon },
    { value: 'system', label: 'Järjestelmän mukaan', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={cn("h-9 w-9", className)}
            title="Vaihda teemaa"
          >
            <CurrentIcon className="h-4 w-4" />
            <span className="sr-only">Vaihda teemaa</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className="flex items-center space-x-2"
              >
                <Icon className="h-4 w-4" />
                <span>{themeOption.label}</span>
                {theme === themeOption.value && (
                  <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex items-center space-x-2",
            showLabel ? "px-3 py-2" : "h-9 w-9 p-0",
            className
          )}
          title="Vaihda teemaa"
        >
          <CurrentIcon className="h-4 w-4" />
          {showLabel && <span className="hidden sm:inline">{currentTheme.label}</span>}
          <span className="sr-only">Vaihda teemaa</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
