import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PDFViewer from './PDFViewer';
import { FileText } from 'lucide-react';

interface PDF {
  _id: string;
  title: string;
  file: string;
}

const UserDashboard: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchAssignedPDFs();
  }, []);

  const fetchAssignedPDFs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pdf/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPdfs(response.data);
    } catch (error) {
      console.error('Error fetching assigned PDFs:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Assigned PDFs</h2>
          <ul>
            {pdfs.map((pdf) => (
              <li
                key={pdf._id}
                className="mb-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedPDF(pdf)}
              >
                <FileText className="inline-block mr-2" />
                {pdf.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-2">PDF Viewer</h2>
          {selectedPDF ? (
            <PDFViewer file={selectedPDF.file} />
          ) : (
            <p>Select a PDF to view</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;