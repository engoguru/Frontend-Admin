import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaImage, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const API_URL = 'http://localhost:5002';

const getBanners = async () => {
  const { data } = await axios.get(`${API_URL}/banner/getAll`);
  return data.banners;
};

const createBanner = async (formData) => {
  const { data } = await axios.post(`${API_URL}/banner/create`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
  return data;
};

const updateBanner = async (id, formData) => {
  const { data } = await axios.put(`${API_URL}/banner/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true,
  });
  return data;
};

const deleteBanner = async (id) => {
  const { data } = await axios.delete(`${API_URL}/banner/delete/${id}`, {
    withCredentials: true,
  });
  return data;
};

const CATEGORIES = ['Apparel', 'Nutrition', 'Equipment'];

const BannerEditor = ({ category, banner, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(!banner);
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    offer: banner?.offer || '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(banner?.bannerImage?.url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    if (banner) {
      // If a banner exists, revert to its original state
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        offer: banner.offer || '',
      });
      setFile(null);
      setPreview(banner.bannerImage.url);
      setIsEditing(false);
    } else {
      // If creating a new one, just clear the form
      setFormData({ title: '', subtitle: '', offer: '' });
      setFile(null);
      setPreview('');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || (!file && !banner)) {
      toast.warn('Title and Image are required.');
      return;
    }

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('subtitle', formData.subtitle);
    submissionData.append('offer', formData.offer);
    submissionData.append('category', category);
    if (file) {
      submissionData.append('bannerImage', file);
    }

    setIsSubmitting(true);
    try {
      await onSave(submissionData, banner?._id);
      if (!banner) handleCancel(); // Reset form only if it was a create operation
      setIsEditing(false); // Exit editing mode on success
    } catch (error) {
      // Error toast is handled in the parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing && banner) {
    return (
      <div className="relative group">
        <img src={banner.bannerImage.url} alt={banner.title} className="w-full h-64 object-fit rounded-t-lg" />
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{banner.title}</h3>
          <p className="text-gray-600 text-sm truncate">{banner.subtitle}</p>
          {banner.offer && <p className="text-green-600 font-semibold mt-1">{banner.offer}</p>}
        </div>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white p-2 rounded-full shadow-lg hover:bg-yellow-600"><FaEdit /></button>
          <button onClick={() => onDelete(banner._id)} className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"><FaTrash /></button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex-grow space-y-4">
        <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current.click()}>
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-center text-gray-400">
              <FaImage size={40} className="mx-auto" />
              <p>Click to upload image</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        <input type="text" name="title" placeholder="Title (Required)" value={formData.title} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <input type="text" name="subtitle" placeholder="Subtitle" value={formData.subtitle} onChange={handleInputChange} className="border p-2 rounded w-full" />
        <input type="text" name="offer" placeholder="Offer (e.g., 50% OFF)" value={formData.offer} onChange={handleInputChange} className="border p-2 rounded w-full" />
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        {banner && <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"><FaTimes className="inline-block mr-1" /> Cancel</button>}
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400">
          {isSubmitting ? 'Saving...' : 'Save Banner'}
        </button>
      </div>
    </form>
  );
};

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      toast.error('Failed to fetch banners.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const categorizedBanners = React.useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      acc[category] = banners.find(b => b.category === category) || null;
      return acc;
    }, {});
  }, [banners]);

  const handleSave = async (formData, bannerId) => {
    try {
      if (bannerId) {
        await updateBanner(bannerId, formData);
        toast.success('Banner updated successfully!');
      } else {
        await createBanner(formData);
        toast.success('Banner created successfully!');
      }
      fetchBanners(); // Refetch all banners to update the UI
    } catch (error) {
      const errorMessage = error.response?.data?.message || (bannerId ? 'Failed to update banner.' : 'Failed to create banner.');
      toast.error(errorMessage);
      console.error(error);
      throw error; // Re-throw to prevent form state change on failure
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(bannerId);
        toast.success('Banner deleted successfully!');
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete banner.');
        console.error(error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Homepage Banners</h1>
      </div>

      {isLoading ? (
        <p>Loading banner settings...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">{category} Banner</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[520px]">
                <BannerEditor
                  category={category}
                  banner={categorizedBanners[category]}
                  onSave={handleSave}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banners;