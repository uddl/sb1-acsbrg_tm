import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Users } from 'lucide-react';

interface PDF {
  _id: string;
  title: string;
  file: string;
}

interface User {
  _id: string;
  username: string;
}

const PublisherDashboard: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPDFs();
    fetchUsers();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pdf/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('title', title);

    try {
      await axios.post('http://localhost:5000/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('PDF uploaded successfully');
      setTitle('');
      setSelectedFile(null);
      fetchPDFs();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF');
    }
  };

  const assignPDF = async (pdfId: string, userId: string) => {
    try {
      await axios.post('http://localhost:5000/api/pdf/assign', { pdfId, userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('PDF assigned successfully');
    } catch (error) {
      console.error('Error assigning PDF:', error);
      alert('Failed to assign PDF');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Publisher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Upload PDF</h2>
          <form onSubmit={handleUpload} className="mb-4">
            <input
              type="text"
              placeholder="PDF Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
              required
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-2 p-2 border rounded w-full"
              required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              <Upload className="inline-block mr-2" />
              Upload PDF
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Uploaded PDFs</h2>
          <ul>
            {pdfs.map((pdf) => (
              <li key={pdf._id} className="mb-2 p-2 border rounded">
                <FileText className="inline-block mr-2" />
                {pdf.title}
                <select
                  onChange={(e) => assignPDF(pdf._id, e.target.value)}
                  className="ml-2 p-1 border rounded"
                >
                  <option value="">Assign to user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PublisherDashboard;