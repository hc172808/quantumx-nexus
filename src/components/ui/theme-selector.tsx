
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PaintBucket } from "lucide-react";
import { getAdminSettings } from "@/lib/admin/admin-settings";
import { useTheme } from "@/hooks/use-theme";

export function ThemeSelector() {
  const { setTheme } = useTheme();
  const adminSettings = getAdminSettings();
  
  // If user theme selection is disabled, return null
  if (!adminSettings.uiThemes.allowUserSelection) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <PaintBucket className="h-4 w-4 mr-2" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {adminSettings.uiThemes.availableThemes.map(theme => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setTheme(theme.id)}
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSelector;
