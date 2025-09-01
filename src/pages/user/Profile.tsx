import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, LogOut, Home, Briefcase, Gavel,Package, Heart } from 'lucide-react';
import Cookies from 'js-cookie';
import { updateProfile, getProfileDetails, getUserIdFromToken } from '@/services/crudService';
import { addUserAddress, updateUserAddress, deleteUserAddress } from '@/services/addressService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge";

import { toast } from "@/components/ui/use-toast";

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

  const setProfileDataFromDetails = (data: ProfileDetails) => {
    // Support both addresses (array) and address (object)
    const addresses =
      Array.isArray(data.profile.addresses)
        ? data.profile.addresses
        // : data.profile.address
        //   ? [data.profile.address]
          : [];

    const primaryAddress = addresses.find(addr => addr.isPrimary) || addresses[0];
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
  };

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
        // Patch response to always have addresses array
        const addresses =
          Array.isArray(data.profile.addresses)
            ? data.profile.addresses
            : data.profile.address
              ? [data.profile.address]
              : [];
        setProfileDetails({
          ...data,
          profile: {
            ...data.profile,
            addresses
          }
        });
        setProfileDataFromDetails({
          ...data,
          profile: {
            ...data.profile,
            addresses
          }
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

  useEffect(() => {
    // Sync form fields with profileDetails when not editing
    if (profileDetails && !isEditing) {
      setProfileDataFromDetails(profileDetails);
    }
  }, [profileDetails, isEditing]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
      const userId = getUserIdFromToken();
      if (userId) {
        const data = await getProfileDetails(userId);
        setProfileDetails(data);
        setProfileDataFromDetails(data); // <-- update form after save
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
    { id: 'address', label: 'My Addresses', icon: Gavel },
    { id: 'OrdersContent', label: 'My Orders', icon: Heart },
  ];

  interface Bid {
  id: string;
  itemName: string;
  imageUrl: string;
  bidAmount: number;
  status: 'active' | 'won' | 'lost' | 'paid' | 'shipped';
  endTime: Date;
  paymentDeadline?: Date;
  orderId?: string;
}

  const sampleBids: Bid[] = [
  {
    id: '1',
    itemName: 'Vintage Rolex Submariner 1970',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=300&fit=crop',
    bidAmount: 12500,
    status: 'won',
    endTime: new Date(Date.now() - 3600000),
    paymentDeadline: new Date(Date.now() + 43200000) // 12 hours from now
  },
  {
    id: '2',
    itemName: 'Classic Ferrari Model Collection',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=300&fit=crop',
    bidAmount: 3200,
    status: 'paid',
    endTime: new Date(Date.now() - 86400000),
    orderId: 'ORD-2024-001'
  },
  {
    id: '3',
    itemName: 'Art Deco Diamond Ring',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
    bidAmount: 8750,
    status: 'active',
    endTime: new Date(Date.now() + 7200000)
  }
];

const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-gradient-success text-success-foreground shadow-success animate-pulse-glow';
      case 'paid': return 'bg-primary text-primary-foreground';
      case 'active': return 'bg-accent text-accent-foreground';
      case 'lost': return 'bg-muted text-muted-foreground';
      case 'shipped': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

const OrdersContent = () => (
<div className="space-y-6">
<Card className="bg-gradient-card shadow-elegant border-0 animate-fade-in">
<CardHeader className="p-4 sm:p-6">
<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
<Package className="h-5 w-5" />
Recent Orders
</CardTitle>
</CardHeader>
<CardContent className="p-4 sm:p-6 pt-0">
<div className="space-y-3 sm:space-y-4">
{sampleBids
.filter(bid => bid.status === 'paid' || bid.status === 'shipped')
.map((order) => (
<div key={order.id} className="flex items-center justify-between p-3 sm:p-4 bg-background rounded-lg border">
<div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
<img src={order.imageUrl} alt={order.itemName} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0" />
<div className="min-w-0 flex-1">
<h4 className="font-medium text-sm sm:text-base truncate">{order.itemName}</h4>
<p className="text-xs sm:text-sm text-muted-foreground">Order #{order.orderId}</p>
</div>
</div>
<div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
<Badge className={`${getStatusColor(order.status)} text-xs`}>
{order.status.toUpperCase()}
</Badge>
<Button onClick={() => navigate(`/my-orders/${order.orderId}`)} variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
Track
</Button>
</div>
</div>
))}
</div>
</CardContent>
</Card>
</div>
);

  // ============== Profile Content ==============
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
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                if (profileDetails) setProfileDataFromDetails(profileDetails); // Reset form on cancel
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save</Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              setIsEditing(true);
              if (profileDetails) setProfileDataFromDetails(profileDetails); // Reset form on edit
            }}
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  // ============== Address Content ==============
 const [addressFormData, setAddressFormData] = useState({
  label: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
});
const [addressEditingId, setAddressEditingId] = useState<number | null>(null);

const autofillAddressForm = () => {
  if (!navigator.geolocation) {
    toast({ variant: "destructive", title: "Geolocation not supported" });
    return;
  }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      const street =
        data.address.road ||
        data.address.suburb ||
        data.address.city_district ||
        data.address.neighbourhood ||
        data.address.pedestrian ||
        data.address.village ||
        "";
      const autofilled = {
        label: "",
        street,
        city: data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || data.address.state_district || "",
        postalCode: data.address.postcode || "",
        country: data.address.country || "",
      };
      setAddressFormData(autofilled);
      toast({ title: "Address autofilled" });
      console.log("FormData after autofill:", autofilled);
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "Failed to fetch location" });
    }
  });
};

const handleAddressSave = async () => {
  try {
    const userId = getUserIdFromToken();
    const addressDataWithUserId = { ...addressFormData, userId };
    if (addressEditingId) {
      await updateUserAddress(addressEditingId, addressDataWithUserId);
      toast({ title: "Address updated" });
    } else {
      await addUserAddress(addressDataWithUserId);
      toast({ title: "Address added" });
    }
    setAddressFormData({ label: "", street: "", city: "", state: "", postalCode: "", country: "" });
    setAddressEditingId(null);
    if (userId) {
      const data = await getProfileDetails(userId);
      setProfileDetails(data);
    }
  } catch (error) {
    console.error(error);
    toast({ variant: "destructive", title: "Failed to save address" });
  }
};

const handleAddressEdit = (addr: any) => {
  setAddressFormData({
    label: addr.label || "",
    street: addr.street || "",
    city: addr.city || "",
    state: addr.state || "",
    postalCode: addr.postalCode || "",
    country: addr.country || "",
  });
  setAddressEditingId(addr.addressId);
};

const handleAddressCancelEdit = () => {
  setAddressFormData({ label: "", street: "", city: "", state: "", postalCode: "", country: "" });
  setAddressEditingId(null);
};

const handleAddressDelete = async (id: number) => {
  try {
    await deleteUserAddress(id);
    toast({ title: "Address deleted" });
    setProfileDetails((prev) =>
      prev
        ? {
            ...prev,
            profile: {
              ...prev.profile,
              addresses: prev.profile.addresses?.filter((a: any) => a.addressId !== id),
            },
          }
        : prev
    );
  } catch (err) {
    console.error(err);
    toast({ variant: "destructive", title: "Failed to delete address" });
  }
};

  const AddressContent = ({
    formData,
    setFormData,
    editingId,
    setEditingId,
    autofillFromLocation,
    handleSave,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    profileDetails,
  }: {
    formData: typeof addressFormData;
    setFormData: typeof setAddressFormData;
    editingId: typeof addressEditingId;
    setEditingId: typeof setAddressEditingId;
    autofillFromLocation: () => void;
    handleSave: () => void;
    handleEdit: (addr: any) => void;
    handleDelete: (id: number) => void;
    handleCancelEdit: () => void;
    profileDetails: ProfileDetails | null;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>My Addresses</CardTitle>
        <CardDescription>Manage your saved addresses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {profileDetails?.profile.addresses?.map(addr => (
            <div key={addr.addressId} className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {addr.label} {addr.isPrimary && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">Primary</span>}
                </p>
                <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(addr)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.addressId)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t pt-4">
          <h3 className="font-semibold">{editingId ? "Edit Address" : "Add New Address"}</h3>
          <Input
            placeholder="Label (Home/Office)"
            value={formData.label}
            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
          />
          <Input
            placeholder="Street"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
          />
          <Input
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          />
          <Input
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
          />
          <Input
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
          />
          <Input
            placeholder="Country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
          />

          <div className="flex gap-3">
            <Button onClick={handleSave}>{editingId ? "Update" : "Add"} Address</Button>
            <Button variant="outline" onClick={autofillFromLocation}>Autofill from Location</Button>
            {editingId && (
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  // ============== Render ==============
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent />;
      case 'address':
        return (
          <AddressContent
            formData={addressFormData}
            setFormData={setAddressFormData}
            editingId={addressEditingId}
            setEditingId={setAddressEditingId}
            autofillFromLocation={autofillAddressForm}
            handleSave={handleAddressSave}
            handleEdit={handleAddressEdit}
            handleDelete={handleAddressDelete}
            handleCancelEdit={handleAddressCancelEdit}
            profileDetails={profileDetails}
          />
        );
      case 'OrdersContent':
        return <OrdersContent />;  
      default:
        return <ProfileContent />;
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
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

