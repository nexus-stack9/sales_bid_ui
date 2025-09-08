import { useState } from 'react';
// import { useRouter } from 'next/router';
import { FaCheck, FaSpinner, FaArrowLeft, FaTimes } from 'react-icons/fa';
import Layout from '@/components/layout/Layout';
import  sellerService  from "@/services/sellerService.ts";
import  fileService  from "@/services/fileService.ts";
import { useNavigate } from 'react-router-dom';
import { ToastService } from "@/services/ToasterService";
import { uploadMultipleFiles,updateSellerPath } from '@/services/crudService';




const SellerRegistrationPage = () => {

  const navigate = useNavigate();
//   const router = useRouter();
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    dob: '',
    profilePicture: null,

    // Address Information
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    status: 'pending',
    
    // Business Information
    businessType: 'individual',
    businessName: '',
    gstNumber: '',
    
    // Product Information
    itemsCategory: '',
    businessDescription: '',
    
    // KYC Verification
    panNumber: '',
    aadhaarNumber: '',
    panCard: null,
    aadhaarFront: null,
    aadhaarBack: null,
    
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    bankProof: null,
    
    // Terms
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    "Art & Collectibles",
    "Jewelry & Watches",
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports Memorabilia",
    "Antiques",
    "Vehicles",
    "Toys & Games",
    "Other"
  ];

  const totalSteps = 6;

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      // Optional: profile picture not required, but you can enforce type/size here if needed
    }
    
    if (step === 2) {
      if (formData.businessType === 'business' && !formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      // Address validations
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = 'Postal code is required';
      } else if (!/^[0-9]{5,6}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Invalid postal code';
      }
      if (!formData.country.trim()) newErrors.country = 'Country is required';
    }
    
    if (step === 3) {
      if (!formData.itemsCategory) newErrors.itemsCategory = 'Category is required';
      if (!formData.businessDescription.trim()) {
        newErrors.businessDescription = 'Description is required';
      } else if (formData.businessDescription.length < 50) {
        newErrors.businessDescription = 'Description must be at least 50 characters';
      }
    }
    
    if (step === 4) {
      if (!formData.panNumber) {
        newErrors.panNumber = 'PAN is required';
      } else if (!validatePAN(formData.panNumber)) {
        newErrors.panNumber = 'Invalid PAN format';
      }
      
      if (!formData.aadhaarNumber) {
        newErrors.aadhaarNumber = 'Aadhaar is required';
      } else if (!validateAadhaar(formData.aadhaarNumber)) {
        newErrors.aadhaarNumber = 'Aadhaar must be 12 digits';
      }
      
      if (!formData.panCard) newErrors.panCard = 'PAN card image is required';
      if (!formData.aadhaarFront) newErrors.aadhaarFront = 'Aadhaar front image is required';
      if (!formData.aadhaarBack) newErrors.aadhaarBack = 'Aadhaar back image is required';
    }
    
    if (step === 5) {
      if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required';
      } else if (!/^[0-9]{9,18}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = 'Invalid account number';
      }
      if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC code is required';
      } else if (!validateIFSC(formData.ifscCode)) {
        newErrors.ifscCode = 'Invalid IFSC format';
      }
      if (!formData.bankProof) newErrors.bankProof = 'Bank proof is required';
    }
    
    if (step === 6 && !formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateStep(6)) return;

  setIsSubmitting(true);
  setApiError('');

  try {
    // Step 1: Prepare seller data (exclude files for now)
    const { profilePicture, panCard, aadhaarFront, aadhaarBack, bankProof, ...rest } = formData;

    const submissionData = {
      ...rest,
      profilePicturePath: undefined,
      pan_card_path: undefined,
      aadhaar_front_path: undefined,
      aadhaar_back_path: undefined,
      bank_proof_path: undefined,
    };

    // Step 2: Create seller record (no files yet)
    const response = await sellerService.createSeller(submissionData);

    if (!response.success || !response.data?.id) {
      ToastService.error('Failed To Register Seller!');
      return;
    }

    const sellerId = response.data.vendor_id; // backend must return seller id
    const basePath = `seller/${sellerId}`;

    // Collect all selected files + map their paths
    const files = [];
const filePathMap = {};

      const filePathPrefix = "https://pub-a9806e1f673d447a94314a6d53e85114.r2.dev";

    if (profilePicture) {
      files.push(profilePicture);
      filePathMap['profilePicturePath'] = `${filePathPrefix}/${basePath}/profile/${profilePicture.name}`;
    }
    if (panCard) {
      files.push(panCard);
      filePathMap['pan_card_path'] = `${filePathPrefix}/${basePath}/pan/${panCard.name}`;
    }
    if (aadhaarFront) {
      files.push(aadhaarFront);
      filePathMap['aadhaar_front_path'] = `${filePathPrefix}/${basePath}/adhar/${aadhaarFront.name}`;
    }
    if (aadhaarBack) {
      files.push(aadhaarBack);
      filePathMap['aadhaar_back_path'] = `${filePathPrefix}/${basePath}/adhar/${aadhaarBack.name}`;
    }
    if (bankProof) {
      files.push(bankProof);
      filePathMap['bank_proof_path'] = `${filePathPrefix}/${basePath}/bank/${bankProof.name}`;
    }

    // Step 3: Upload all files using multi-file API
    if (files.length > 0) {
      const uploadRes = await uploadMultipleFiles(files, basePath);

      if (!uploadRes.success) {
        ToastService.error('Seller created but file upload failed!');
      }
    }

    // Step 4: Update seller record with file paths
    
    console.log(response)

    await updateSellerPath(response);

    ToastService.success('Seller Details Sent For Approval');
    navigate('/sellers');
  } catch (error) {
    console.error('Registration error:', error);
    setApiError(error.message || 'Something went wrong. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-1">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date of Birth*</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.dob ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Business & Address Information</h4>
            <div>
              <label className="block text-gray-700 mb-1">I am a*</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="individual"
                    checked={formData.businessType === 'individual'}
                    onChange={handleChange}
                    className="text-gray-800 focus:ring-gray-800"
                  />
                  <span>Individual Seller</span>
                </label>
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="businessType"
                    value="business"
                    checked={formData.businessType === 'business'}
                    onChange={handleChange}
                    className="text-gray-800 focus:ring-gray-800"
                  />
                  <span>Business Account</span>
                </label>
              </div>
            </div>

            {formData.businessType === 'business' && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Business Name*</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                      errors.businessName ? 'border-red-500' : ''
                    }`}
                    required={formData.businessType === 'business'}
                  />
                  {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Address Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Address Line 1*</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.addressLine1 ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">City*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.city ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">State*</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.state ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Postal Code*</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.postalCode ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Country*</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.country ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Product Information</h4>
            <div>
              <label className="block text-gray-700 mb-1">What types of items will you be selling?*</label>
              <select
                name="itemsCategory"
                value={formData.itemsCategory}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                  errors.itemsCategory ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {errors.itemsCategory && <p className="mt-1 text-sm text-red-600">{errors.itemsCategory}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Business Description*</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                  errors.businessDescription ? 'border-red-500' : ''
                }`}
                required
                placeholder="Describe your business and products..."
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.businessDescription}</p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">KYC Verification</h4>
            <div>
              <label className="block text-gray-700 mb-1">PAN Number*</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                  errors.panNumber ? 'border-red-500' : ''
                }`}
                placeholder="ABCDE1234F"
                required
              />
              {errors.panNumber && <p className="mt-1 text-sm text-red-600">{errors.panNumber}</p>}
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Aadhaar Number*</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                  errors.aadhaarNumber ? 'border-red-500' : ''
                }`}
                placeholder="123412341234"
                required
              />
              {errors.aadhaarNumber && <p className="mt-1 text-sm text-red-600">{errors.aadhaarNumber}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-1">PAN Card Image*</label>
                <input
                  type="file"
                  name="panCard"
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.panCard ? 'border-red-500' : ''
                  }`}
                  accept="image/*,.pdf"
                  required
                />
                {errors.panCard && <p className="mt-1 text-sm text-red-600">{errors.panCard}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Aadhaar Front*</label>
                <input
                  type="file"
                  name="aadhaarFront"
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.aadhaarFront ? 'border-red-500' : ''
                  }`}
                  accept="image/*,.pdf"
                  required
                />
                {errors.aadhaarFront && <p className="mt-1 text-sm text-red-600">{errors.aadhaarFront}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Aadhaar Back*</label>
                <input
                  type="file"
                  name="aadhaarBack"
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.aadhaarBack ? 'border-red-500' : ''
                  }`}
                  accept="image/*,.pdf"
                  required
                />
                {errors.aadhaarBack && <p className="mt-1 text-sm text-red-600">{errors.aadhaarBack}</p>}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Account Holder Name*</label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.accountHolderName ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.accountHolderName && (
                  <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Account Number*</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.accountNumber ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.accountNumber && <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-1">Bank Name*</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.bankName ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.bankName && <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">IFSC Code*</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                    errors.ifscCode ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.ifscCode && <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-1">Cancelled Cheque/Passbook*</label>
              <input
                type="file"
                name="bankProof"
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent ${
                  errors.bankProof ? 'border-red-500' : ''
                }`}
                required
                accept="image/*,.pdf"
              />
              {errors.bankProof && <p className="mt-1 text-sm text-red-600">{errors.bankProof}</p>}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Terms and Conditions</h4>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className={`focus:ring-gray-800 h-4 w-4 text-gray-800 border-gray-300 rounded ${
                    errors.agreeTerms ? 'border-red-500' : ''
                  }`}
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-gray-800 hover:text-gray-800">Terms of Service</a>, 
                  <a href="#" className="text-gray-800 hover:text-gray-800"> Seller Agreement</a>, and 
                  <a href="#" className="text-gray-800 hover:text-gray-800"> Privacy Policy</a>*
                </label>
                {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <FaCheck className="text-green-600 text-4xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
            <p className="mb-6">Your seller account is being reviewed. We'll contact you soon.</p>
            <button
              onClick={() => router.push('/seller')}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Return to Seller Page
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className=" mx-auto px-4 py-8">
      <button 
  onClick={() => navigate('/sellers')}
  className="flex items-center text-gray-800 mb-6 hover:text-purple-800"
>
  <FaArrowLeft className="mr-2" /> Back to Sellers
</button>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Seller Registration</h1>
          <p className="text-gray-600 mb-6">Complete the form below to become a seller on our platform</p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of 7
              </span>
              <span className="text-sm font-medium text-gray-800">
                {Math.round((currentStep / 7) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gray-800 h-2.5 rounded-full" 
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center">
                <FaTimes className="mr-2" />
                {apiError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition"
                  disabled={isSubmitting}
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gray-800 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-lg transition"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (

                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-lg transition flex items-center justify-center"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    // Optional: file size/type checks for profile picture before submit
                    const pic = formData.profilePicture;
                    if (pic && pic.size > 5 * 1024 * 1024) { // 5MB
                      e.preventDefault();
                      ToastService.error('Profile picture must be under 5MB');
                      return;
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SellerRegistrationPage;