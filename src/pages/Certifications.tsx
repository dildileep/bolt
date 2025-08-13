import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { AddCertificationModal } from '../components/Certifications/AddCertificationModal';
import { ViewCertificationModal } from '../components/Certifications/ViewCertificationModal';
import { Award, Calendar, AlertTriangle, CheckCircle, Clock, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export function Certifications() {
  const { user } = useAuth();
  const { certifications, deleteCertification } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingCert, setViewingCert] = useState<string | null>(null);

  const userCertifications = certifications.filter(c => c.employeeId === user?.id);
  const activeCerts = userCertifications.filter(c => c.status === 'active');
  const expiringSoon = userCertifications.filter(c => c.status === 'expiring_soon');
  const expired = userCertifications.filter(c => c.status === 'expired');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expiring_soon':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'expired':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Award className="w-5 h-5 text-gray-400" />;
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

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteCertification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      deleteCertification(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Certifications</h1>
          <p className="text-gray-600 mt-1">
            Track your professional certifications and renewal dates
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Certification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCerts.length}</p>
              <p className="text-sm font-medium text-gray-600">Active Certifications</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{expiringSoon.length}</p>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{expired.length}</p>
              <p className="text-sm font-medium text-gray-600">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Soon Alert */}
      {expiringSoon.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">Certifications Expiring Soon</h3>
          </div>
          <div className="space-y-3">
            {expiringSoon.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between bg-white p-4 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{cert.name}</h4>
                  <p className="text-sm text-gray-600">
                    Expires on {new Date(cert.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-yellow-800">
                    {getDaysUntilExpiry(cert.expiryDate)} days left
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Renew Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Certifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            All Certifications ({userCertifications.length})
          </h3>
        </div>
        
        {userCertifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {userCertifications.map((cert) => (
              <div key={cert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{cert.name}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      {cert.issuer && (
                        <div className="text-sm text-gray-500 mt-1">
                          Issued by: {cert.issuer}
                        </div>
                      )}
                      {cert.status === 'expiring_soon' && (
                        <div className="text-sm text-yellow-600 mt-2">
                          Expires in {getDaysUntilExpiry(cert.expiryDate)} days
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium border rounded-full ${getStatusColor(cert.status)}`}>
                        {getStatusIcon(cert.status)}
                        <span className="ml-2">{getStatusText(cert.status)}</span>
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setViewingCert(cert.id)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications yet</h3>
            <p className="text-gray-600 mb-6">
              Add your professional certifications to track renewal dates and maintain compliance.
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Certification</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Certification Modal */}
      {showAddModal && (
        <AddCertificationModal
          onClose={() => setShowAddModal(false)}
          employeeId={user!.id}
        />
      )}

      {/* View Certification Modal */}
      {viewingCert && (
        <ViewCertificationModal
          certificationId={viewingCert}
          onClose={() => setViewingCert(null)}
        />
      )}
    </div>
  );
}