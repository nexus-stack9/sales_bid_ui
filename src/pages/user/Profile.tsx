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
import { User, LogOut, Home, Briefcase, Gavel, Package, Heart, Truck, Calendar, CreditCard, MapPin } from 'lucide-react';
import Cookies from 'js-cookie';
import { updateProfile, getProfileDetails, getUserIdFromToken, getUserOrders } from '@/services/crudService';
import { addUserAddress, updateUserAddress, deleteUserAddress } from '@/services/addressService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

// Define the Order interface based on the API response
interface Order {
  order_id: number;
  product_id: number;
  user_id: number;
  seller_id: number;
  winning_bid_id: number;
  order_status: string;
  order_date: string;
  delivered_date: string | null;
  final_price: string;
  condition: string;
  name: string;
  description: string;
  image_path: string;
  quantity: number;
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  count: number;
}

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  const setProfileDataFromDetails = (data: ProfileDetails) => {
    const addresses =
      Array.isArray(data.profile.addresses)
        ? data.profile.addresses
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
    if (profileDetails && !isEditing) {
      setProfileDataFromDetails(profileDetails);
    }
  }, [profileDetails, isEditing]);

  // Fetch orders when the orders tab is selected
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (activeTab === 'orders') {
        try {
          setOrdersLoading(true);
          const userId = getUserIdFromToken();
          if (!userId) {
            navigate('/auth/signin');
            return;
          }
          
          const ordersData: OrdersResponse = await getUserOrders(userId);
          if (ordersData.success) {
            setUserOrders(ordersData.data);
          } else {
            toast({
              variant: "destructive",
              title: "Failed to load orders",
              description: "There was an error loading your orders."
            });
          }
        } catch (error) {
          console.error('Error fetching user orders:', error);
          toast({
            variant: "destructive",
            title: "Failed to load orders",
            description: "There was an error loading your orders."
          });
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchUserOrders();
  }, [activeTab, toast, navigate]);

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
        setProfileDataFromDetails(data);
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
    { id: 'address', label: 'My Addresses', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: Package },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid': 
      case 'order_placed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'active': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'paid': 
      case 'order_placed': return <CreditCard className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const OrdersContent = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>
            View your recent purchases and their status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {userOrders.map((order) => (
                <div key={order.order_id} className="p-4 md:p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <img 
                        src={order.image_path} 
                        alt={order.name} 
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                          <h4 className="font-semibold text-base md:text-lg truncate">{order.name}</h4>
                          <Badge className={`${getStatusColor(order.order_status)} text-xs flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.order_status)}
                            {formatStatus(order.order_status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{order.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Ordered: {formatDate(order.order_date)}</span>
                          </div>
                          {order.delivered_date && (
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              <span>Delivered: {formatDate(order.delivered_date)}</span>
                            </div>
                          )}
                          <div>
                            <span>Condition: {order.condition}</span>
                          </div>
                          <div>
                            <span>Quantity: {order.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-lg font-semibold">${order.final_price}</div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(`/orders/${order.order_id}`)} 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          View Details
                        </Button>
                        {order.order_status === 'shipped' && (
                          <Button size="sm" className="text-xs">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!ordersLoading && userOrders.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">When you make purchases, they will appear here.</p>
            <Button onClick={() => navigate('/auctions')}>Browse Auctions</Button>
          </CardContent>
        </Card>
      )}
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
                if (profileDetails) setProfileDataFromDetails(profileDetails);
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
              if (profileDetails) setProfileDataFromDetails(profileDetails);
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
            <div key={addr.addressId} className="p-4 border rounded-lg flex justify-between items-center">
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

        <Separator />

        <div className="space-y-4 pt-4">
          <h3 className="font-semibold text-lg">{editingId ? "Edit Address" : "Add New Address"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label (Home/Office)</Label>
              <Input
                id="label"
                placeholder="e.g., Home, Office"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                placeholder="Street address"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleSave} className="sm:flex-1">
              {editingId ? "Update" : "Add"} Address
            </Button>
            <Button variant="outline" onClick={autofillFromLocation} className="sm:flex-1">
              Autofill from Location
            </Button>
            {editingId && (
              <Button variant="outline" onClick={handleCancelEdit} className="sm:flex-1">
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
      case 'orders':
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
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <nav className="flex flex-col space-y-1 sticky top-24">
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
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 mt-4" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            )}
          </aside>

          <main className="min-h-screen">
            {renderContent()}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;