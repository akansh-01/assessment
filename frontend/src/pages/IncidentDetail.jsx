import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, updateIncident } from '../services/api';
import { format } from 'date-fns';

const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];

const IncidentDetail = () => {
     const { id } = useParams();
     const navigate = useNavigate();
     const [incident, setIncident] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const [saving, setSaving] = useState(false);

     useEffect(() => {
          const fetchIncident = async () => {
               try {
                    const data = await getIncidentById(id);
                    setIncident(data);
               } catch (err) {
                    console.error(err);
                    setError('Failed to load incident details.');
               } finally {
                    setLoading(false);
               }
          };
          fetchIncident();
     }, [id]);

     const handleChange = (e) => {
          const { name, value } = e.target;
          setIncident(prev => ({ ...prev, [name]: value }));
     };

     const handleSave = async () => {
          setSaving(true);
          try {
               await updateIncident(id, incident);
               navigate('/'); // Go back to list or stay? usually stay or show toast. I'll navigate for simplicity.
          } catch (err) {
               console.error(err);
               alert('Failed to save changes.');
          } finally {
               setSaving(false);
          }
     };

     if (loading) return <div className="p-8 text-center text-gray-500">Loading incident details...</div>;
     if (error) return <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>;
     if (!incident) return <div className="p-4 text-gray-500">Incident not found.</div>;

     return (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div>
                         <h2 className="text-2xl font-bold text-gray-900">{incident.title}</h2>
                         <p className="text-sm text-gray-500 mt-1">ID: {incident.id}</p>
                    </div>
                    <div className={`badge badge-${incident.status.toLowerCase()} px-3 py-1 text-sm`}>
                         {incident.status}
                    </div>
               </div>

               <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                              <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                                   {incident.service}
                              </div>
                              {/* If service is editable, replace with select, but wireframe implies mostly read-only except status/severity */}
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Occurred At</label>
                              <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-700">
                                   {incident.createdAt ? format(new Date(incident.createdAt), 'MMMM dd, yyyy HH:mm') : '-'}
                              </div>
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                              <select
                                   name="severity"
                                   className="input"
                                   value={incident.severity}
                                   onChange={handleChange}
                              >
                                   {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                              <select
                                   name="status"
                                   className="input"
                                   value={incident.status}
                                   onChange={handleChange}
                              >
                                   {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                         </div>

                         <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                              <input
                                   type="text"
                                   name="owner"
                                   className="input"
                                   value={incident.owner || ''}
                                   onChange={handleChange}
                                   placeholder="Assign to..."
                              />
                         </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                         <textarea
                              name="summary"
                              rows="6"
                              className="input"
                              value={incident.summary || ''}
                              onChange={handleChange}
                              placeholder="Detailed description of the incident..."
                         />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                         <button
                              onClick={() => navigate('/')}
                              className="btn btn-secondary"
                              disabled={saving}
                         >
                              Cancel
                         </button>
                         <button
                              onClick={handleSave}
                              disabled={saving}
                              className="btn btn-primary"
                         >
                              {saving ? 'Saving...' : 'Save Changes'}
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default IncidentDetail;
