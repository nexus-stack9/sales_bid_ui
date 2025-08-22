import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Shield, CreditCard, Bell, LogOut, Home, Briefcase, Gavel, Heart, Clock, TrendingUp, TrendingDown, Award, AlertTriangle, Trophy } from 'lucide-react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { updatePassword, updateProfile, getProfileDetails, getUserIdFromToken, getUserBids, getUserWishlist, Bid, WishlistItem } from '@/services/crudService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Define the ProfileDetails interface
interface ProfileDetails {
  profile: {
    user: {
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: string;
      isActive: boolean;
      createdAt: string;
    };
    address: {
      addressId: number;
      label: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isPrimary: boolean;
    } | null;
    addresses?: Array<{
      addressId: number;
      label: string;
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      isPrimary: boolean;
    }>;
    paymentMethod: {
      cardNumber: string;
      expiryDate: string;
    } | null;
  };
  message: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setIsLoading(true);
        const userId = getUserIdFromToken();
        if (!userId) {
          navigate('/auth/signin');
          return;
        }
        const data = await getProfileDetails(userId);
        
        setProfileDetails(data);
        
        const primaryAddress = data.profile.addresses?.find(addr => addr.isPrimary) || data.profile.addresses?.[0];
        const addressString = primaryAddress
          ? `${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state} ${primaryAddress.postalCode}`
          : "";

        setProfileData({
          firstName: data.profile.user.firstName || "",
          lastName: data.profile.user.lastName || "",
          email: data.profile.user.email || "",
          phone: data.profile.user.phone || "",
          address: addressString,
        });
      } catch (error) {
        console.error('Error fetching profile details:', error);
        toast({
          variant: "destructive",
          title: "Failed to load profile",
          description: "There was an error loading your profile details."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileDetails();
  }, [toast, navigate]);
  
  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      // Refetch data to show updated info
      const userId = getUserIdFromToken();
      if (userId) {
        const data = await getProfileDetails(userId);
        setProfileDetails(data);
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
      console.error('Error updating profile:', error);
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleLogout = () => {
    Cookies.remove('authToken');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const getUserInitials = () => {
    const firstName = profileDetails?.profile?.user?.firstName || '';
    const lastName = profileDetails?.profile?.user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const menuItems = [
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'mybids', label: 'My Bids', icon: Gavel },
    { id: 'watchlist', label: 'Watchlist', icon: Heart },
    { id: 'security', label: 'Password & Security', icon: Shield },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent />;
      case 'mybids':
        return <MyBidsContent />;
      case 'watchlist':
        return <WatchlistContent />;
      case 'security':
        return <SecurityContent />;
      case 'billing':
        return <BillingContent />;
      case 'notifications':
        return <NotificationsContent />;
      default:
        return <ProfileContent />;
    }
  };

  const ProfileContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Public profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{profileDetails?.profile.user.firstName} {profileDetails?.profile.user.lastName}</h3>
            <p className="text-sm text-muted-foreground">{profileDetails?.profile.user.role}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={profileData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={profileData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={profileData.email} onChange={(e) => handleInputChange('email', e.target.value)} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={profileData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} disabled={!isEditing} />
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="address">Primary Address</Label>
            <Textarea id="address" value={profileData.address} onChange={(e) => handleInputChange('address', e.target.value)} disabled={!isEditing} />
          </div>
        <div className="space-y-2">
          <Label>Your Addresses</Label>
          <div className="space-y-4">
            {profileDetails?.profile.addresses?.map(addr => (
              <div key={addr.addressId} className="border p-4 rounded-md flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary p-3 rounded-full">
                    {addr.label.toLowerCase() === 'home' ? <Home className="h-5 w-5 text-secondary-foreground" /> : <Briefcase className="h-5 w-5 text-secondary-foreground" />}
                  </div>
                  <div>
                    <p className="font-medium flex items-center">
                      {addr.label} {addr.isPrimary && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Primary</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.postalCode}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  );

  const MyBidsContent = () => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [isLoadingBids, setIsLoadingBids] = useState(true);

    useEffect(() => {
      const fetchBids = async () => {
        try {
          setIsLoadingBids(true);
          const userId = getUserIdFromToken();
          if (userId) {
            const userBids = await getUserBids(userId);
            setBids(userBids);
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch your bids.',
          });
        } finally {
          setIsLoadingBids(false);
        }
      };
      fetchBids();
    }, []);

    const getTimeLeft = (endDate: string) => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) return "Ended";
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) return `${days}d ${hours}h`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    };

    const getStatusBadge = (status: string, bidAmount: string, maxBidAmount: string) => {
      const isWinning = parseFloat(bidAmount) >= parseFloat(maxBidAmount);
      const computedStatus = status === 'active' ? (isWinning ? 'winning' : 'losing') : status;
  
      switch (computedStatus) {
        case 'winning':
          return <Badge className="bg-green-500">Winning</Badge>;
        case 'losing':
          return <Badge variant="destructive">Outbid</Badge>;
        case 'ended':
          return <Badge variant="secondary">Ended</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    };

    if (isLoadingBids) {
      return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Bids</CardTitle>
          <CardDescription>Here are the auctions you've bid on.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bids.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bids.map(bid => (
                <Card key={bid.bid_id} className="overflow-hidden">
                  <img src={bid.image_path.split(',')[0]} alt={bid.product_name} className="w-full h-32 object-cover" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold line-clamp-2">{bid.product_name}</h4>
                      {getStatusBadge(bid.status, bid.bid_amount, bid.max_bid_amount)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <p>Your Bid: <span className="font-medium text-primary">₹{parseFloat(bid.bid_amount).toLocaleString()}</span></p>
                      <p>Highest Bid: <span className="font-medium">₹{parseFloat(bid.max_bid_amount).toLocaleString()}</span></p>
                      <p className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {getTimeLeft(bid.auction_end)}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => navigate(`/auctions/${bid.product_id}`)}>View Auction</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gavel className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">You haven't placed any bids yet.</h3>
              <p className="mt-2 text-muted-foreground">
                Start bidding on auctions to see them here.
              </p>
              <Button className="mt-6" onClick={() => navigate('/auctions')}>Browse Auctions</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const WatchlistContent = () => {
    const [watchlist, setWatchlist] = useState<WishlistItem[]>([]);
    const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);

    useEffect(() => {
      const fetchWatchlist = async () => {
        try {
          setIsLoadingWatchlist(true);
          const userId = getUserIdFromToken();
          if (userId) {
            const userWatchlist = await getUserWishlist(userId);
            setWatchlist(userWatchlist);
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to fetch your watchlist.',
          });
        } finally {
          setIsLoadingWatchlist(false);
        }
      };
      fetchWatchlist();
    }, []);

    if (isLoadingWatchlist) {
      return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Watchlist</CardTitle>
          <CardDescription>Items you are keeping an eye on.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map(item => (
                <Card key={item.wishlist_id} className="overflow-hidden">
                  <img src={item.image_path.split(',')[0]} alt={item.product_name} className="w-full h-32 object-cover" />
                  <CardContent className="p-4">
                    <h4 className="font-semibold line-clamp-2">{item.product_name}</h4>
                    <div className="text-sm text-muted-foreground mt-2">
                      <p>Current Bid: <span className="font-medium text-primary">₹{parseFloat(item.current_bid).toLocaleString()}</span></p>
                      <p className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {item.time_left}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => navigate(`/auctions/${item.product_id}`)}>View Auction</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Your watchlist is empty.</h3>
              <p className="mt-2 text-muted-foreground">
                Add items to your watchlist to track them here.
              </p>
              <Button className="mt-6" onClick={() => navigate('/auctions')}>Browse Auctions</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const SecurityContent = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    const encryptPassword = (password: string) => {
      const secretKey = import.meta.env.VITE_SECRET_KEY;
      return CryptoJS.AES.encrypt(password, secretKey).toString();
    };
    
    const handleUpdatePassword = async () => {
      if (!currentPassword || !newPassword) {
        toast({ variant: "destructive", title: "Please fill in all fields." });
        return;
      }
      if (newPassword.length < 8) {
        toast({ variant: "destructive", title: "Password too short", description: "New password must be at least 8 characters long." });
        return;
      }
      
      setIsUpdatingPassword(true);
      try {
        await updatePassword({
          currentPassword: encryptPassword(currentPassword),
          newPassword: encryptPassword(newPassword)
        });
        setCurrentPassword('');
        setNewPassword('');
        toast({ title: "Password updated successfully" });
      } catch (error) {
        toast({ variant: "destructive", title: "Update failed", description: "Please check your current password." });
        console.error('Error updating password:', error);
      } finally {
        setIsUpdatingPassword(false);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const BillingContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Update your billing details and address.</CardDescription>
      </CardHeader>
      <CardContent>
        {profileDetails?.profile.paymentMethod?.cardNumber ? (
          <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">Visa ending in {profileDetails.profile.paymentMethod.cardNumber.slice(-4)}</p>
              <p className="text-sm text-muted-foreground">Expires {profileDetails.profile.paymentMethod.expiryDate}</p>
            </div>
            <Button variant="outline">Edit</Button>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No payment method on file.</p>
            <Button variant="link">Add payment method</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Update Payment Method</Button>
      </CardFooter>
    </Card>
  );

  const NotificationsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive emails about your account activity.
            </span>
          </Label>
          <Switch id="email-notifications" defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
            <span>Push Notifications</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive push notifications on your devices.
            </span>
          </Label>
          <Switch id="push-notifications" />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <Label htmlFor="promotional-emails" className="flex flex-col space-y-1">
            <span>Promotional Emails</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive emails about new products, features, and promotions.
            </span>
          </Label>
          <Switch id="promotional-emails" defaultChecked />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-8">
            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </header>
        
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-8">
          <aside>
            {isMobile ? (
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <nav className="flex flex-col space-y-1">
                {menuItems.map(item => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            )}
          </aside>

          <main>
            {renderContent()}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
