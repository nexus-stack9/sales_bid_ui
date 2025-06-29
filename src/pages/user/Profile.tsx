
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, User, Shield, CreditCard, Bell, LogOut, Mail, Phone, MapPin, Calendar, Check, Lock, CreditCard as CreditCardIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { updatePassword, updateProfile, getProfileDetails, getUserIdFromToken } from '@/services/crudService';

// Define the ProfileDetails interface once
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
    address: ""
  });
  
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  
  // Fetch profile details on component mount
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setIsLoading(true);
        const userId = getUserIdFromToken();
        const data = await getProfileDetails(userId);
        
        // Initialize addresses array
        if (!data.profile.addresses) {
          data.profile.addresses = [];
          
          // If there's an address in the root, add it as the primary
          if (data.profile.address) {
            data.profile.addresses.push({
              addressId: 1,
              label: "Home",
              street: data.profile.address.street || "",
              city: data.profile.address.city || "",
              state: data.profile.address.state || "",
              postalCode: data.profile.address.postalCode || "",
              country: data.profile.address.country || "",
              isPrimary: true
            });
          }
          
          // Add a default work address if needed
          data.profile.addresses.push({
            addressId: data.profile.addresses.length + 1,
            label: "Work",
            street: "123 Office Street",
            city: "Business City",
            state: "BZ",
            postalCode: "54321",
            country: "USA",
            isPrimary: data.profile.addresses.length === 0 // Make primary if no other addresses
          });
        }
        
        setProfileDetails(data);
        
        // Get primary address or first address
        const primaryAddress = data.profile.addresses.find(addr => addr.isPrimary) || 
                             data.profile.addresses[0];
        
        // Update the form data with the fetched details
        setProfileData({
          firstName: data.profile.user.firstName || "",
          lastName: data.profile.user.lastName || "",
          email: data.profile.user.email || "",
          phone: data.profile.user.phone || "",
          address: primaryAddress ? 
            [
              primaryAddress.street,
              primaryAddress.city,
              primaryAddress.state,
              primaryAddress.postalCode,
              primaryAddress.country
            ].filter(Boolean).join(", ") : ""
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
  }, [toast]);
  
  const handleSaveProfile = async () => {
    try {
      // Use the updateProfile service function
      await updateProfile(profileData);
      
      // Disable editing mode after successful update
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
      console.error('Error updating profile:', error);
    }
  };
  
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleLogout = () => {
    // Remove the auth token from cookies
    Cookies.remove('authToken');
    
    // Show a success toast
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to home page
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profileDetails) {
      return `${profileDetails.profile.user.firstName.charAt(0)}${profileDetails.profile.user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'JD';
  };

  // Return blue gradient background for avatar
  const getAvatarColor = () => {
    return 'bg-gradient-to-br from-blue-500 to-indigo-600';
  };

  // Profile content component
  const renderProfileContent = () => (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b">
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>
          {isEditing ? "Edit your personal details below." : "Your personal details are shown below."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    First Name
                  </label>
                  <Input 
                    id="firstName" 
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "text-black font-semibold bg-slate-50" : ""} rounded-md`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "text-black font-semibold bg-slate-50" : ""} rounded-md`}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    Last Name
                  </label>
                  <Input 
                    id="lastName" 
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "text-black font-semibold bg-slate-50" : ""} rounded-md`}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    Phone Number
                  </label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "text-black font-semibold bg-slate-50" : ""} rounded-md`}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label htmlFor="address" className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                Primary Address
              </label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className={`${!isEditing ? "text-black font-semibold bg-slate-50" : ""} rounded-md`}
              />
            </div>
            
            {profileDetails && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium mb-4 text-lg flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">User Role</p>
                    <p className="font-semibold text-black">{profileDetails.profile.user.role}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Account Status</p>
                    <p className="font-semibold text-black flex items-center">
                      {profileDetails.profile.user.isActive ? 
                        <><span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>Active</> : 
                        <><span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>Inactive</>}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-semibold text-black">{new Date(profileDetails.profile.user.createdAt).toLocaleDateString()}</p>
                  </div>
                  {profileDetails.profile.paymentMethod && profileDetails.profile.paymentMethod.cardNumber && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Payment Card</p>
                      <p className="font-semibold text-black">•••• •••• •••• {profileDetails.profile.paymentMethod.cardNumber.slice(-4)}</p>
                      <p className="text-xs text-muted-foreground">Expires: {profileDetails.profile.paymentMethod.expiryDate}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-slate-100 to-slate-50 border-t py-4">
        {!isLoading && (
          isEditing ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveProfile} className="px-6">Save Changes</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="px-6">
              Update Profile
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );

  // Security content component
  const SecurityContent = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    const encryptPassword = (password: string) => {
      const secretKey = import.meta.env.VITE_SECRET_KEY;
      return CryptoJS.AES.encrypt(password, secretKey).toString();
    };
    
    const handleUpdatePassword = async () => {
      // Basic validation
      if (!currentPassword) {
        toast({
          variant: "destructive",
          title: "Current password required",
          description: "Please enter your current password."
        });
        return;
      }
      
      if (!newPassword) {
        toast({
          variant: "destructive",
          title: "New password required",
          description: "Please enter a new password."
        });
        return;
      }
      
      // Password strength validation (optional)
      if (newPassword.length < 8) {
        toast({
          variant: "destructive",
          title: "Password too short",
          description: "New password must be at least 8 characters long."
        });
        return;
      }
      
      setIsUpdatingPassword(true);
      
      try {
        // Encrypt passwords before sending to API
        const encryptedCurrentPassword = encryptPassword(currentPassword);
        const encryptedNewPassword = encryptPassword(newPassword);
        
        // Call the updatePassword API with encrypted passwords
        await updatePassword({
          currentPassword: encryptedCurrentPassword,
          newPassword: encryptedNewPassword
        });
        
        // Clear the form
        setCurrentPassword('');
        setNewPassword('');
        
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated."
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "There was an error updating your password. Please check your current password and try again."
        });
        console.error('Error updating password:', error);
      } finally {
        setIsUpdatingPassword(false);
      }
    };
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Update your password and security preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <Input 
              id="newPassword" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-md"
            />
          </div>

        </CardContent>
        <CardFooter className="bg-gradient-to-r from-slate-100 to-slate-50 border-t py-4">
          <Button 
            onClick={handleUpdatePassword}
            disabled={isUpdatingPassword}
            className="px-6"
          >
            {isUpdatingPassword ? (
              <>
                <span className="mr-2">Updating...</span>
                <span className="animate-spin">⟳</span>
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Billing content component
  const BillingContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>
          Manage your payment methods and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Payment Methods</h3>
          {profileDetails && profileDetails.profile.paymentMethod && profileDetails.profile.paymentMethod.cardNumber ? (
            <div className="border rounded-lg p-5 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Card ending in {profileDetails.profile.paymentMethod.cardNumber.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground">Expires {profileDetails.profile.paymentMethod.expiryDate}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-md">Edit</Button>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-slate-50">
              <p className="text-muted-foreground">No payment methods found</p>
            </div>
          )}
          <Button variant="outline" className="w-full mt-2 rounded-md">Add Payment Method</Button>
        </div>
        <div className="space-y-4 pt-6 mt-2 border-t">
          <h3 className="font-medium text-lg">Billing Address</h3>
          {profileDetails && profileDetails.profile.address ? (
            <div className="space-y-2 bg-slate-50 p-5 rounded-lg">
              <p className="font-medium">{profileDetails.profile.user.firstName} {profileDetails.profile.user.lastName}</p>
              <p>{profileDetails.profile.address.street}</p>
              <p>{profileDetails.profile.address.city}, {profileDetails.profile.address.state} {profileDetails.profile.address.postalCode}</p>
              <p>{profileDetails.profile.address.country}</p>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg bg-slate-50">
              <p className="text-muted-foreground">No billing address found</p>
            </div>
          )}
          <Button variant="outline" className="mt-2 rounded-md">Edit Address</Button>
        </div>
      </CardContent>
    </Card>
  );



  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-72 space-y-6">
            <div className="flex flex-col items-center p-6 bg-white border rounded-xl shadow-sm">
              <div className={`h-28 w-28 mb-4 rounded-full flex items-center justify-center text-2xl font-bold shadow-md ${getAvatarColor()} text-white`}>
                {getUserInitials()}
              </div>
              <h3 className="text-xl font-bold">
                {profileDetails ? 
                  `${profileDetails.profile.user.firstName} ${profileDetails.profile.user.lastName}` : 
                  ''}
              </h3>
              <p className="text-sm text-muted-foreground">
                {profileDetails ? profileDetails.profile.user.email : ''}
              </p>
              
              {/* Logout button for desktop */}
              <Button 
                variant="outline" 
                className="mt-6 w-full flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors" 
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
            
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <button 
                className={`w-full text-left px-6 py-4 flex items-center transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50'}`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="mr-3 h-5 w-5" />
                Profile Settings
              </button>
              <button 
                className={`w-full text-left px-6 py-4 flex items-center transition-colors ${activeTab === 'security' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50'}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-3 h-5 w-5" />
                Security
              </button>
              <button 
                className={`w-full text-left px-6 py-4 flex items-center transition-colors ${activeTab === 'billing' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-50'}`}
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Billing Info
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Mobile view - Accordion */}
            {isMobile ? (
              <div className="md:hidden mb-6">
                <div className="flex flex-col items-center p-6 bg-white border rounded-xl shadow-sm mb-6">
                  <div className={`h-24 w-24 mb-4 rounded-full flex items-center justify-center text-xl font-bold shadow-md ${getAvatarColor()} text-white`}>
                    {getUserInitials()}
                  </div>
                  <h3 className="text-xl font-bold">
                    {profileDetails ? 
                      `${profileDetails.profile.user.firstName} ${profileDetails.profile.user.lastName}` : 
                      ''}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {profileDetails ? profileDetails.profile.user.email : ''}
                  </p>
                </div>
                
                <Accordion type="single" collapsible defaultValue="profile" className="bg-white border rounded-xl shadow-sm mb-6">
                  <AccordionItem value="profile" className="border-b">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50">
                      <div className="flex items-center">
                        <User className="mr-3 h-5 w-5" />
                        <span>Profile Settings</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {renderProfileContent()}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="security" className="border-b">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50">
                      <div className="flex items-center">
                        <Shield className="mr-3 h-5 w-5" />
                        <span>Security</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <SecurityContent />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="billing">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-50">
                      <div className="flex items-center">
                        <CreditCard className="mr-3 h-5 w-5" />
                        <span>Billing Info</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <BillingContent />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center rounded-md mb-4" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              /* Desktop view - Tabs */
              <div>
                {activeTab === 'profile' && renderProfileContent()}
                {activeTab === 'security' && <SecurityContent />}
                {activeTab === 'billing' && <BillingContent />}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
