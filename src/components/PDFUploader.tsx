import React from 'react'

interface PDFUploaderProps {
  setUploadedPDF: (file: File | null) => void
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ setUploadedPDF }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setUploadedPDF(file)
    } else {
      alert('Please upload a valid PDF file.')
      setUploadedPDF(null)
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor="pdf-upload" className="block mb-2 font-semibold">
        Upload PDF Sample
      </label>
      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
  )
}

export default PDFUploader