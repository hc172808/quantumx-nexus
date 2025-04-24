
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { getAdminSettings } from "@/lib/admin/admin-settings";

interface ThemeColor {
  name: string;
  value: string;
}

const ThemeEditor = () => {
  const { toast } = useToast();
  const adminSettings = getAdminSettings();
  
  const [themeName, setThemeName] = useState("");
  const [allowUserSelection, setAllowUserSelection] = useState(adminSettings.uiThemes.allowUserSelection);
  const [selectedTab, setSelectedTab] = useState("create");
  
  const [colors, setColors] = useState<ThemeColor[]>([
    { name: "primary", value: "#8B5CF6" },
    { name: "secondary", value: "#D946EF" },
    { name: "accent", value: "#F97316" },
    { name: "background", value: "#FFFFFF" },
    { name: "text", value: "#333333" },
  ]);
  
  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index].value = value;
    setColors(newColors);
  };
  
  const handleCreateTheme = () => {
    if (!themeName) {
      toast({
        title: "Error",
        description: "Please enter a theme name",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would save to storage or backend
    toast({
      title: "Theme Created",
      description: `Theme "${themeName}" has been created.`,
    });
    
    // Reset form
    setThemeName("");
  };
  
  const handleToggleUserSelection = () => {
    setAllowUserSelection(!allowUserSelection);
    
    // In a real implementation, this would update settings
    toast({
      title: "Settings Updated",
      description: `User theme selection is now ${!allowUserSelection ? "enabled" : "disabled"}.`,
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Theme Editor</h1>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="create">Create Theme</TabsTrigger>
          <TabsTrigger value="manage">Manage Themes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Theme</CardTitle>
              <CardDescription>
                Customize colors to create a new theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="themeName">Theme Name</Label>
                  <Input
                    id="themeName"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="My Custom Theme"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Colors</h3>
                  
                  {colors.map((color, index) => (
                    <div key={color.name} className="grid grid-cols-3 gap-4 items-center">
                      <Label htmlFor={`color-${color.name}`} className="capitalize">
                        {color.name}
                      </Label>
                      <Input
                        id={`color-${color.name}`}
                        type="color"
                        value={color.value}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="col-span-1"
                      />
                      <Input
                        value={color.value}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="col-span-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTheme} className="ml-auto">
                Create Theme
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Themes</CardTitle>
              <CardDescription>
                Edit or delete existing themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminSettings.uiThemes.availableThemes.map((theme) => (
                  <div key={theme.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{theme.name}</p>
                      <p className="text-sm text-muted-foreground">{theme.id}</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Configure application-wide theme settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Allow User Theme Selection</Label>
                    <p className="text-sm text-muted-foreground">
                      Let users choose their preferred theme
                    </p>
                  </div>
                  <Switch 
                    checked={allowUserSelection} 
                    onCheckedChange={handleToggleUserSelection} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Default Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Set the default theme for all users
                    </p>
                  </div>
                  <select className="border rounded-md p-2">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    {adminSettings.uiThemes.availableThemes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeEditor;
