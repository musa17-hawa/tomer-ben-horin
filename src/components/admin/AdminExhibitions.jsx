import React, { useState, useEffect } from 'react';
import { 
  createExhibition, 
  getAllExhibitions, 
  updateExhibition, 
  deleteExhibition 
} from '../../services/exhibitionService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
<<<<<<< HEAD
import { uploadImageToImgBB } from '../../firebase/config';
=======
>>>>>>> d50b4b1 (committs)

const AdminExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'upcoming',
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      const data = await getAllExhibitions();
      setExhibitions(data);
    } catch (err) {
      setError('Failed to load exhibitions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return null;
<<<<<<< HEAD
    return await uploadImageToImgBB(file);
=======
    const storageRef = ref(storage, `exhibitions/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
>>>>>>> d50b4b1 (committs)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = formData.imageUrl;
      
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const exhibitionData = {
        ...formData,
        imageUrl,
        image: undefined // Remove the file object before saving
      };

      if (editingId) {
        await updateExhibition(editingId, exhibitionData);
      } else {
        await createExhibition(exhibitionData);
      }

      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        status: 'upcoming',
        image: null
      });
      setEditingId(null);
      await loadExhibitions();
    } catch (err) {
      setError('Failed to save exhibition');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exhibition) => {
    setFormData({
      ...exhibition,
      image: null
    });
    setEditingId(exhibition.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exhibition?')) {
      try {
        setLoading(true);
        await deleteExhibition(id);
        await loadExhibitions();
      } catch (err) {
        setError('Failed to delete exhibition');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Exhibitions</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            {editingId ? 'Update Exhibition' : 'Add Exhibition'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exhibitions.map((exhibition) => (
          <div key={exhibition.id} className="bg-white p-4 rounded-lg shadow-md">
            {exhibition.imageUrl && (
              <img
                src={exhibition.imageUrl}
                alt={exhibition.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-lg font-semibold">{exhibition.title}</h3>
            <p className="text-gray-600">{exhibition.location}</p>
            <p className="text-sm text-gray-500">
              {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 capitalize">{exhibition.status}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(exhibition)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exhibition.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminExhibitions; 