import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, Plus, Calendar } from 'lucide-react';

interface AddCertificationModalProps {
  onClose: () => void;
  employeeId: string;
}

export function AddCertificationModal({ onClose, employeeId }: AddCertificationModalProps) {
  const { addCertification } = useData();
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issuedDate: '',
    expiryDate: '',
    credentialId: '',
    verificationUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.issuedDate || !formData.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Determine status based on expiry date
    const today = new Date();
    const expiryDate = new Date(formData.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'active' | 'expired' | 'expiring_soon' = 'active';
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry <= 30) {
      status = 'expiring_soon';
    }

    addCertification({
      name: formData.name.trim(),
      employeeId,
      issuedDate: formData.issuedDate,
      expiryDate: formData.expiryDate,
      status,
      issuer: formData.issuer.trim() || undefined,
      credentialId: formData.credentialId.trim() || undefined,
      verificationUrl: formData.verificationUrl.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Certification</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certification Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., AWS Certified Developer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuing Organization
            </label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Amazon Web Services"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credential ID
            </label>
            <input
              type="text"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., AWS-DEV-2023-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification URL
            </label>
            <input
              type="url"
              value={formData.verificationUrl}
              onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}