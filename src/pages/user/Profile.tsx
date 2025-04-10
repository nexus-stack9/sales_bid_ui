
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = useIsMobile();
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <div className="flex flex-col items-center p-4 bg-background border rounded-lg">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
            
            <div className="bg-background border rounded-lg">
              <button 
                className={`w-full text-left px-4 py-3 ${activeTab === 'profile' ? 'bg-muted font-medium' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile Settings
              </button>
              <button 
                className={`w-full text-left px-4 py-3 ${activeTab === 'security' ? 'bg-muted font-medium' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
              <button 
                className={`w-full text-left px-4 py-3 ${activeTab === 'billing' ? 'bg-muted font-medium' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                Billing Info
              </button>
              <button 
                className={`w-full text-left px-4 py-3 ${activeTab === 'notifications' ? 'bg-muted font-medium' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Mobile view tabs */}
            <div className="md:hidden mb-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Profile settings */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address
                    </label>
                    <Textarea
                      id="address"
                      placeholder="Enter your address"
                      defaultValue="123 Main St, New York, NY 10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a little about yourself"
                      defaultValue="I'm a passionate collector of vintage electronics and rare items."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Security tab */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Update your password and security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">Two-factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="2fa">Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast({ title: "Password updated" })}>
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Billing tab */}
            {activeTab === 'billing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your payment methods and billing details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Payment Methods</h3>
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-muted rounded-md p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <Button variant="outline" className="w-full mt-2">Add Payment Method</Button>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="font-medium">Billing Address</h3>
                    <div className="space-y-1">
                      <p>John Doe</p>
                      <p>123 Main St</p>
                      <p>New York, NY 10001</p>
                      <p>United States</p>
                    </div>
                    <Button variant="outline" className="mt-2">Edit Address</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Notifications tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control what notifications you receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your account activity
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auction-updates">Auction Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when auctions you're watching are updated
                        </p>
                      </div>
                      <Switch id="auction-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="bid-alerts">Bid Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when you're outbid
                        </p>
                      </div>
                      <Switch id="bid-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and special offers
                        </p>
                      </div>
                      <Switch id="marketing" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => toast({ title: "Notification preferences updated" })}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
