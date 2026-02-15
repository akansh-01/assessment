import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIncidents } from '../services/api';
import useDebounce from '../hooks/useDebounce';
import { format } from 'date-fns';
import { Search, Plus, ArrowUp, ArrowDown, Filter } from 'lucide-react';

const SEVERITIES = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
const STATUSES = ['OPEN', 'MITIGATED', 'RESOLVED'];
const SERVICES = ['Auth', 'Payments', 'Backend', 'Frontend', 'Database'];

const IncidentList = () => {
     const [incidents, setIncidents] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     // Filters
     const [search, setSearch] = useState('');
     const [service, setService] = useState('');
     const [severity, setSeverity] = useState(''); // Could be multi-select, but simple select for now based on API simplicity
     const [status, setStatus] = useState('');

     // Pagination
     const [page, setPage] = useState(0); // 0-indexed typically for Spring Data Pageable
     const [size, setSize] = useState(10);
     const [totalPages, setTotalPages] = useState(0);

     // Sorting
     const [sortField, setSortField] = useState('createdAt');
     const [sortDirection, setSortDirection] = useState('desc');

     const debouncedSearch = useDebounce(search, 500);

     useEffect(() => {
          const fetchData = async () => {
               setLoading(true);
               setError(null);
               try {
                    const params = {
                         page,
                         size,
                         sort: `${sortField},${sortDirection}`,
                         title: debouncedSearch || undefined, // assuming 'title' filter or generic 'search'
                         service: service || undefined,
                         severity: severity || undefined,
                         status: status || undefined,
                    };

                    const data = await getIncidents(params);
                    // Assuming Spring Data Page implementation: { content: [], totalPages: 0, number: 0 }
                    // Adjust if backend returns differently
                    if (data && data.content) {
                         setIncidents(data.content);
                         setTotalPages(data.totalPages);
                    } else {
                         // Fallback or custom structure
                         setIncidents(data.incidents || []);
                         setTotalPages(data.totalPages || 0);
                    }

               } catch (err) {
                    console.error("Failed to fetch incidents", err);
                    setError("Failed to load incidents. Please try again.");
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, [page, size, sortField, sortDirection, debouncedSearch, service, severity, status]);

     const handleSort = (field) => {
          if (sortField === field) {
               setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          } else {
               setSortField(field);
               setSortDirection('asc');
          }
     };

     const clearFilters = () => {
          setSearch('');
          setService('');
          setSeverity('');
          setStatus('');
          setPage(0);
     };

     const SortIcon = ({ field }) => {
          if (sortField !== field) return <div className="w-4 h-4" />;
          return sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
     };

     return (
          <div className="space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Incident Tracker</h1>
                    <Link to="/create" className="btn btn-primary gap-2">
                         <Plus size={18} /> New Incident
                    </Link>
               </div>

               <div className="bg-white p-4 rounded-lg shadow space-y-4">
                    <div className="flex flex-wrap gap-4 items-center">
                         <div className="flex-1 min-w-[200px] relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                   type="text"
                                   placeholder="Search incidents..."
                                   className="input pl-10"
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                              />
                         </div>

                         <select
                              className="input w-auto min-w-[140px]"
                              value={service}
                              onChange={(e) => setService(e.target.value)}
                         >
                              <option value="">All Services</option>
                              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>

                         <select
                              className="input w-auto min-w-[140px]"
                              value={severity}
                              onChange={(e) => setSeverity(e.target.value)}
                         >
                              <option value="">All Severities</option>
                              {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>

                         <select
                              className="input w-auto min-w-[140px]"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                         >
                              <option value="">All Statuses</option>
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>

                         {(search || service || severity || status) && (
                              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                   Clear Filters
                              </button>
                         )}
                    </div>
               </div>

               {error ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200">
                         {error}
                    </div>
               ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                         {loading ? (
                              <div className="p-8 text-center text-gray-500">Loading incidents...</div>
                         ) : (
                              <>
                                   <div className="overflow-x-auto">
                                        <table className="table w-full">
                                             <thead>
                                                  <tr>
                                                       <th>Title</th>
                                                       <th onClick={() => handleSort('service')} className="cursor-pointer hover:bg-gray-100 flex items-center gap-1">
                                                            Service <SortIcon field="service" />
                                                       </th>
                                                       <th onClick={() => handleSort('severity')} className="cursor-pointer hover:bg-gray-100">
                                                            <div className="flex items-center gap-1">Severity <SortIcon field="severity" /></div>
                                                       </th>
                                                       <th onClick={() => handleSort('status')} className="cursor-pointer hover:bg-gray-100">
                                                            <div className="flex items-center gap-1">Status <SortIcon field="status" /></div>
                                                       </th>
                                                       <th onClick={() => handleSort('createdAt')} className="cursor-pointer hover:bg-gray-100">
                                                            <div className="flex items-center gap-1">Created At <SortIcon field="createdAt" /></div>
                                                       </th>
                                                       <th>Owner</th>
                                                       <th>Actions</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {incidents.length > 0 ? (
                                                       incidents.map((incident) => (
                                                            <tr key={incident.id} className="hover:bg-gray-50 transition-colors">
                                                                 <td className="font-medium text-gray-900">{incident.title}</td>
                                                                 <td>{incident.service}</td>
                                                                 <td>
                                                                      <span className={`badge badge-${incident.severity.toLowerCase()}`}>
                                                                           {incident.severity}
                                                                      </span>
                                                                 </td>
                                                                 <td>
                                                                      <span className={`badge badge-${incident.status.toLowerCase()}`}>
                                                                           {incident.status}
                                                                      </span>
                                                                 </td>
                                                                 <td className="text-gray-500">
                                                                      {incident.createdAt ? format(new Date(incident.createdAt), 'MM/dd/yyyy HH:mm') : '-'}
                                                                 </td>
                                                                 <td className="text-gray-500">{incident.owner || '-'}</td>
                                                                 <td>
                                                                      <Link to={`/incidents/${incident.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                                           Edit
                                                                      </Link>
                                                                 </td>
                                                            </tr>
                                                       ))
                                                  ) : (
                                                       <tr>
                                                            <td colSpan="7" className="text-center py-8 text-gray-500">
                                                                 No incidents found matching your criteria.
                                                            </td>
                                                       </tr>
                                                  )}
                                             </tbody>
                                        </table>
                                   </div>

                                   <div className="flex items-center justify-between p-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-500">
                                             Page {page + 1} of {totalPages || 1}
                                        </div>
                                        <div className="flex gap-2">
                                             <button
                                                  className="btn btn-secondary py-1 px-3 text-sm"
                                                  disabled={page === 0}
                                                  onClick={() => setPage(p => Math.max(0, p - 1))}
                                             >
                                                  Previous
                                             </button>
                                             <button
                                                  className="btn btn-secondary py-1 px-3 text-sm"
                                                  disabled={page >= totalPages - 1}
                                                  onClick={() => setPage(p => p + 1)}
                                             >
                                                  Next
                                             </button>
                                        </div>
                                   </div>
                              </>
                         )}
                    </div>
               )}
          </div>
     );
};

export default IncidentList;
