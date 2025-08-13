import React from 'react';
import { useData } from '../../contexts/DataContext';
import { X, Award, Calendar, ExternalLink, Hash, Building } from 'lucide-react';

interface ViewCertificationModalProps {
  certificationId: string;
  onClose: () => void;
}

export function ViewCertificationModal({ certificationId, onClose }: ViewCertificationModalProps) {
  const { certifications } = useData();
  const certification = certifications.find(c => c.id === certificationId);

  if (!certification) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring_soon':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'expiring_soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Certification Details</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-xl inline-block mb-4">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{certification.name}</h4>
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium border rounded-full ${getStatusColor(certification.status)}`}>
              {getStatusText(certification.status)}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {certification.issuer && (
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Issued by</div>
                  <div className="font-medium text-gray-900">{certification.issuer}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Issue Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(certification.issuedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Expiry Date</div>
                  <div className="font-medium text-gray-900">
                    {new Date(certification.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {certification.status === 'expiring_soon' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-800">
                  This certification expires in {getDaysUntilExpiry(certification.expiryDate)} days.
                  Consider renewing it soon to maintain your credentials.
                </div>
              </div>
            )}

            {certification.credentialId && (
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Credential ID</div>
                  <div className="font-medium text-gray-900 font-mono">{certification.credentialId}</div>
                </div>
              </div>
            )}

            {certification.verificationUrl && (
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Verification</div>
                  <a
                    href={certification.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Verify Certificate
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {certification.status === 'expiring_soon' && (
              <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Renew Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}