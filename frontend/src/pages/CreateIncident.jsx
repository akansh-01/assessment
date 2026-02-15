import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncident } from '../services/api';

const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database'];
const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];

const CreateIncident = () => {
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          title: '',
          service: '',
          severity: 'SEV4',
          status: 'OPEN',
          owner: '',
          summary: '',
     });
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          try {
               await createIncident(formData);
               navigate('/');
          } catch (err) {
               console.error(err);
               setError('Failed to create incident. Please check your inputs.');
          } finally {
               setLoading(false);
          }
     };

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
               <h2 className="text-xl font-bold mb-6 text-gray-800">Create New Incident</h2>

               {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                         {error}
                    </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                         <input
                              type="text"
                              name="title"
                              required
                              className="input"
                              placeholder="e.g. API Latency Spike"
                              value={formData.title}
                              onChange={handleChange}
                         />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                         <select
                              name="service"
                              required
                              className="input"
                              value={formData.service}
                              onChange={handleChange}
                         >
                              <option value="">Select Service</option>
                              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                         <div className="flex gap-4">
                              {SEVERITIES.map(sev => (
                                   <label key={sev} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                             type="radio"
                                             name="severity"
                                             value={sev}
                                             checked={formData.severity === sev}
                                             onChange={handleChange}
                                             className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className={`badge badge-${sev.toLowerCase()}`}>{sev}</span>
                                   </label>
                              ))}
                         </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                         <select
                              name="status"
                              className="input"
                              value={formData.status}
                              onChange={handleChange}
                         >
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (Optional)</label>
                         <input
                              type="text"
                              name="owner"
                              className="input"
                              placeholder="e.g. jane@team.com"
                              value={formData.owner}
                              onChange={handleChange}
                         />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                         <textarea
                              name="summary"
                              rows="4"
                              className="input"
                              placeholder="Describe the incident..."
                              value={formData.summary}
                              onChange={handleChange}
                         />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                         <button
                              type="button"
                              onClick={() => navigate('/')}
                              className="btn btn-secondary"
                         >
                              Cancel
                         </button>
                         <button
                              type="submit"
                              disabled={loading}
                              className="btn btn-primary"
                         >
                              {loading ? 'Creating...' : 'Create Incident'}
                         </button>
                    </div>
               </form>
          </div>
     );
};

export default CreateIncident;
