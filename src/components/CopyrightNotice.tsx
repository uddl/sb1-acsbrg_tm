import React from 'react'

const CopyrightNotice: React.FC = () => {
  return (
    <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="text-lg font-semibold mb-2">Copyright Notice</h3>
      <p>
        This PDF sample is protected by copyright law. Unauthorized reproduction,
        distribution, or use of this material is strictly prohibited. This sample
        is provided for preview purposes only and may not be shared or distributed
        without explicit permission from the publisher. The watermark on the PDF
        serves as a visual reminder of these restrictions.
      </p>
    </div>
  )
}

export default CopyrightNotice