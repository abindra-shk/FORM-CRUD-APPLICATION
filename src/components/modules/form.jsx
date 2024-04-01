import React, { useState, useRef, useEffect } from 'react';
import defaultProfilePicture from '../../assets/profile.png';

export function Form({ onFormSubmit, selectedEntry }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    dob: '',
    address: {
      city: '',
      district: '',
      province: '',
      country: 'Nepal',
    },
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [profilePicturePreview, setProfilePicturePreview] = useState(defaultProfilePicture);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null); 

  useEffect(() => {
    if (selectedEntry) {
      // Populate form data with selected entry when editing
      setFormData(selectedEntry);
      
      // If selectedEntry has a profile picture, set the preview
      if (selectedEntry.profilePicture) {
        // Check if the profile picture is a file object or a URL
        if (typeof selectedEntry.profilePicture === 'object') {
          // If it's a file object, use FileReader to read and set the preview
          const reader = new FileReader();
          reader.onload = () => {
            setProfilePicturePreview(reader.result);
          };
          reader.readAsDataURL(selectedEntry.profilePicture);
        } else {
          // If it's a filename, set the preview using the default profile picture
          // or any other placeholder you might have
          setProfilePicturePreview(defaultProfilePicture);
          
          // Optionally, you can load the profile picture from a URL if it's provided
          // For example:
          // setProfilePicturePreview(selectedEntry.profilePicture);
        }
      } else {
        // If no profile picture, set default preview
        setProfilePicturePreview(defaultProfilePicture);
      }
    }
  }, [selectedEntry]);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(name, value);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      profilePicture: file,
    }));
 
    if (file && !file.name.endsWith('.png')) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        profilePicture: 'Please upload a PNG file only.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        profilePicture: '',
      }));
  
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formEntry = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dob: formData.dob,
      address: {
        city: formData.address.city,
        district: formData.address.district,
        province: formData.address.province,
        country: formData.address.country,
      },
      profilePicture: formData.profilePicture ? formData.profilePicture.name : null,
    };

    let updatedEntries;
    if (selectedEntry) {
      // Editing existing entry
      const existingEntries = JSON.parse(localStorage.getItem('formEntries')) || [];
      updatedEntries = existingEntries.map(entry => {
        if (entry.name === selectedEntry.name) {
          return formEntry; // Replace existing entry with updated data
        }
        return entry;
      });
    } else {
      // Adding new entry
      const existingEntries = JSON.parse(localStorage.getItem('formEntries')) || [];
      updatedEntries = [...existingEntries, formEntry];
    }

    localStorage.setItem('formEntries', JSON.stringify(updatedEntries));

    setErrors({});
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      dob: '',
      address: {
        city: '',
        district: '',
        province: '',
        country: 'Nepal',
      },
      profilePicture: null,
    });
    setProfilePicturePreview(defaultProfilePicture);
    setSuccessMessage('Form submitted successfully!');
    onFormSubmit();

    setTimeout(() => {
      setSuccessMessage('');
      fileInputRef.current.value = null;
    }, 3000);
  };
  

  const validateForm = () => {
    const errors = {};
  
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!/^\d{7,}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be at least 7 digits.';
    }
  
    if (formData.profilePicture && !formData.profilePicture.name.endsWith('.png')) {
      errors.profilePicture = 'Please upload a PNG file only.';
    }
  
    return errors;
  };
  

  const validateField = (name, value) => {
    let fieldError = '';

    switch (name) {
      case 'name':
        fieldError = value.trim() ? '' : 'Name is required.';
        break;
      case 'email':
        fieldError = value.trim() ? (/^\S+@\S+\.\S+$/.test(value) ? '' : 'Invalid email format.') : 'Email is required.';
        break;
      case 'phoneNumber':
        if (!value.trim()) {
            fieldError = 'Phone number is required.';
          } else if (!/^\d*$/.test(value)) {
            fieldError = 'Phone number must contain only digits.';
          } else if (value.length < 7) {
            fieldError = 'Phone number must be at least 7 digits.';
          }
          break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };

  return (
    <div className="flex w-full justify-center">
      <form className="w-3/5 flex flex-col items-start p-5 my-5 border border-black">
        <div className='w-full flex'>
            <div className='w-1/2 flex flex-col items-start'>
                <label className="flex flex-col mb-4 h-12 ">
                    <div className='flex'>
                        <span className="block font-bold mb-1 mx-1">Name:<span className="text-red-500 mr-1">*</span></span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className="w-100 h-8 px-3 py-2 mr-2 border rounded-md border-black"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mx-1'>
                        {errors.name && <span className="text-red-500">{errors.name}</span>}
                    </div>
                </label>
                <label className="flex flex-col mb-4 h-12 ">
                    <div className='flex'>
                        <span className="font-bold block mb-1 mx-1">Email:<span className="text-red-500 mr-1">*</span></span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-100 h-8 px-3 py-2 mr-2 border rounded-md border-black"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mx-1'>
                        {errors.email && <span className="text-red-500">{errors.email}</span>}
                    </div>
                </label>
                <label className="flex flex-col mb-4 h-12 ">
                    <div className='flex'>
                        <span className="font-bold block mb-1 mx-1">Phone Number:<span className="text-red-500 mr-1">*</span></span>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            className="w-100 h-8 px-3 py-2 mr-2 border rounded-md border-black"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            pattern="[0-9]*"
                        />
                    </div>
                    <div className='mx-1'>
                        {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber}</span>}
                    </div>
                </label>
                <label className="flex mb-4 h-12 ">
                    <div className='flex'>
                        <span className="font-bold block mb-1 mx-1">Date of Birth:</span>
                        <input
                            type="date"
                            name="dob"
                            className="w-100 h-8 px-3 py-2 border rounded-md border-black"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>
                </label>
            </div>
            <div className='w-1/2 flex justify-center'>
                <div className="flex flex-col justify-center">
                    <img src={profilePicturePreview} alt="Profile Preview" className="border rounded-3xl border-gray-500 object-fill w-48 h-48" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
            </div>
        </div>
        
        <label className="flex flex-col mb-4  justify-center">
          <span className="font-bold block mb-2 mx-1">Address:</span>
          <div className="flex flex-col">
            <div className="flex">
              <label className="flex mb-2 mr-5 items-center">
                <span className="block mr-2">City:</span>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="w-32 h-8 px-3 py-2 border rounded-md border-black"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                />
              </label>
              <label className="flex mb-2 items-center">
                <span className="block mr-2">District:</span>
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  className="w-32 h-8 px-3 py-2 border rounded-md border-black"
                  value={formData.address.district}
                  onChange={handleAddressChange}
                />
              </label>
            </div>
            <div className="flex">
              <label className="flex mb-2 mr-5 items-center">
                <span className="block mr-2">Province:</span>
                <select
                  name="province"
                  className=" px-2 py-1 border rounded-md border-black"
                  value={formData.address.province}
                  onChange={handleAddressChange}
                >
                  <option value="">Select Province</option>
                  {[...Array(7).keys()].map((province) => (
                    <option key={province + 1} value={province + 1}>
                      Province {province + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex mb-2 items-center">
                <span className="block mr-2">Country:</span>
                <input
                  type="text"
                  name="country"
                  value="Nepal"
                  className="w-32 h-8 px-3 py-2 border rounded-md border-black"
                  disabled
                />
              </label>
            </div>
          </div>
        </label>
        <label className="flex flex-col mb-4  justify-center">
          <span className="font-bold block mb-1 mx-1">Profile Picture:</span>
          <input
            type="file"
            accept="image/png"
            className="w-100 h-100 px-3 py-2 border rounded-md border-black"
            onChange={handleFileChange}
          />
          {errors.profilePicture && <span className="text-red-500">{errors.profilePicture}</span>}
        </label>
   
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {successMessage && <span className="text-green-500">{successMessage}</span>}
      </form>
    </div>
  );
}
