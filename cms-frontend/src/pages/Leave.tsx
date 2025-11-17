// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Check, X, Clock, Calendar } from 'lucide-react';
// import { LeaveRequest } from '../types';
// import { leaveService } from '../services/leaveService';
// import { Card } from '../components/UI/Card';
// import { Button } from '../components/UI/Button';
// import { Modal } from '../components/UI/Modal';
// import { Table, TableHeader, TableBody, TableRow, TableHeadCell, TableCell } from '../components/UI/Table';

// export const Leave: React.FC = () => {
//     const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedStatus, setSelectedStatus] = useState<string>('all');
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         employeeId: '',
//         employeeName: '',
//         type: 'annual' as 'annual' | 'sick' | 'personal' | 'emergency',
//         startDate: '',
//         endDate: '',
//         reason: '',
//         status: 'pending' as 'pending' | 'approved' | 'rejected'
//     });

//     useEffect(() => {
//         loadLeaveRequests();
//     }, []);

//     const loadLeaveRequests = async () => {
//         try {
//             setLoading(true);
//             const data = await leaveService.getLeaveRequests();
//             setLeaveRequests(data);
//         } catch (error) {
//             console.error('Failed to load leave requests:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculateDays = (startDate: string, endDate: string): number => {
//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         const diffTime = Math.abs(end.getTime() - start.getTime());
//         return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     };

//     const handleCreateLeaveRequest = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const days = calculateDays(formData.startDate, formData.endDate);
//             await leaveService.createLeaveRequest({
//                 ...formData,
//                 days
//             });
//             await loadLeaveRequests();
//             setIsCreateModalOpen(false);
//             resetForm();
//         } catch (error) {
//             console.error('Failed to create leave request:', error);
//         }
//     };

//     const handleApproveLeave = async (id: string) => {
//         try {
//             await leaveService.approveLeaveRequest(id, 'John Admin');
//             await loadLeaveRequests();
//         } catch (error) {
//             console.error('Failed to approve leave request:', error);
//         }
//     };

//     const handleRejectLeave = async (id: string) => {
//         try {
//             await leaveService.rejectLeaveRequest(id, 'John Admin');
//             await loadLeaveRequests();
//         } catch (error) {
//             console.error('Failed to reject leave request:', error);
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             employeeId: '',
//             employeeName: '',
//             type: 'annual',
//             startDate: '',
//             endDate: '',
//             reason: '',
//             status: 'pending'
//         });
//     };

//     const filteredLeaveRequests = leaveRequests.filter(request => {
//         const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             request.reason.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
//         return matchesSearch && matchesStatus;
//     });

//     const getStatusBadgeColor = (status: string) => {
//         switch (status) {
//             case 'approved': return 'bg-green-100 text-green-800 ';
//             case 'rejected': return 'bg-red-100 text-red-800  ';
//             default: return 'bg-yellow-100 text-yellow-800  ';
//         }
//     };

//     const getTypeBadgeColor = (type: string) => {
//         switch (type) {
//             case 'annual': return 'bg-blue-100 text-blue-800  ';
//             case 'sick': return 'bg-red-100 text-red-800  ';
//             case 'personal': return 'bg-purple-100 text-purple-800  ';
//             default: return 'bg-orange-100 text-orange-800  ';
//         }
//     };

//     const pendingCount = leaveRequests.filter(r => r.status === 'pending').length;
//     const approvedCount = leaveRequests.filter(r => r.status === 'approved').length;
//     const rejectedCount = leaveRequests.filter(r => r.status === 'rejected').length;

//     return (
//         <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-black">Leave Management</h1>
//                     <p className="mt-2 text-gray-600 ">
//                         Manage employee leave requests and approvals
//                     </p>
//                 </div>
//                 <Button onClick={() => setIsCreateModalOpen(true)}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     New Leave Request
//                 </Button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <Card className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-yellow-100  rounded-lg mx-auto mb-3">
//                         <Clock className="h-6 w-6 text-yellow-600 " />
//                     </div>
//                     <div className="text-2xl font-bold text-black">{pendingCount}</div>
//                     <div className="text-sm text-gray-600 ">Pending</div>
//                 </Card>
//                 <Card className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-green-100  rounded-lg mx-auto mb-3">
//                         <Check className="h-6 w-6 text-green-600 " />
//                     </div>
//                     <div className="text-2xl font-bold text-black">{approvedCount}</div>
//                     <div className="text-sm text-gray-600 ">Approved</div>
//                 </Card>
//                 <Card className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-red-100  rounded-lg mx-auto mb-3">
//                         <X className="h-6 w-6 text-red-600 " />
//                     </div>
//                     <div className="text-2xl font-bold text-black">{rejectedCount}</div>
//                     <div className="text-sm text-gray-600 ">Rejected</div>
//                 </Card>
//                 <Card className="text-center">
//                     <div className="flex items-center justify-center w-12 h-12 bg-blue-100  rounded-lg mx-auto mb-3">
//                         <Calendar className="h-6 w-6 text-blue-600 " />
//                     </div>
//                     <div className="text-2xl font-bold text-black">{leaveRequests.length}</div>
//                     <div className="text-sm text-gray-600 ">Total Requests</div>
//                 </Card>
//             </div>

//             <Card>
//                 <div className="flex flex-col sm:flex-row gap-4 mb-6">
//                     <div className="relative flex-1">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Search leave requests..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="pl-10 pr-4 py-2 w-full border border-gray-300  rounded-lg focus:border-transparent "
//                         />
//                     </div>
//                     <select
//                         value={selectedStatus}
//                         onChange={(e) => setSelectedStatus(e.target.value)}
//                         className="px-4 py-2 border border-gray-300  rounded-lg focus:border-transparent "
//                     >
//                         <option value="all">All Status</option>
//                         <option value="pending">Pending</option>
//                         <option value="approved">Approved</option>
//                         <option value="rejected">Rejected</option>
//                     </select>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center items-center py-12">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     </div>
//                 ) : (
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHeadCell>Employee</TableHeadCell>
//                                 <TableHeadCell>Type</TableHeadCell>
//                                 <TableHeadCell>Start Date</TableHeadCell>
//                                 <TableHeadCell>End Date</TableHeadCell>
//                                 <TableHeadCell>Days</TableHeadCell>
//                                 <TableHeadCell>Status</TableHeadCell>
//                                 <TableHeadCell>Actions</TableHeadCell>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {filteredLeaveRequests.map((request) => (
//                                 <TableRow key={request.id}>
//                                     <TableCell>
//                                         <div>
//                                             <div className="font-medium">{request.employeeName}</div>
//                                             <div className="text-sm text-gray-500 ">
//                                                 {request.reason}
//                                             </div>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(request.type)}`}>
//                                             {request.type}
//                                         </span>
//                                     </TableCell>
//                                     <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
//                                     <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
//                                     <TableCell>{request.days} days</TableCell>
//                                     <TableCell>
//                                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
//                                             {request.status}
//                                         </span>
//                                     </TableCell>
//                                     <TableCell>
//                                         {request.status === 'pending' && (
//                                             <div className="flex space-x-2">
//                                                 <Button
//                                                     size="sm"
//                                                     variant="ghost"
//                                                     onClick={() => handleApproveLeave(request.id)}
//                                                     className="text-green-600 hover:text-green-700"
//                                                 >
//                                                     <Check className="h-4 w-4" />
//                                                 </Button>
//                                                 <Button
//                                                     size="sm"
//                                                     variant="ghost"
//                                                     onClick={() => handleRejectLeave(request.id)}
//                                                     className="text-red-600 hover:text-red-700"
//                                                 >
//                                                     <X className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 )}
//             </Card>

//             {/* Create Leave Request Modal */}
//             <Modal
//                 isOpen={isCreateModalOpen}
//                 onClose={() => {
//                     setIsCreateModalOpen(false);
//                     resetForm();
//                 }}
//                 title="Create New Leave Request"
//             >
//                 <form onSubmit={handleCreateLeaveRequest} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 text-black mb-2">
//                             Employee Name
//                         </label>
//                         <input
//                             type="text"
//                             value={formData.employeeName}
//                             onChange={(e) => setFormData({ ...formData, employeeName: e.target.value, employeeId: Date.now().toString() })}
//                             className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:border-transparent "
//                             required
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 text-black mb-2">
//                             Leave Type
//                         </label>
//                         <select
//                             value={formData.type}
//                             onChange={(e) => setFormData({ ...formData, type: e.target.value as 'annual' | 'sick' | 'personal' | 'emergency' })}
//                             className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:border-transparent "
//                         >
//                             <option value="annual">Annual Leave</option>
//                             <option value="sick">Sick Leave</option>
//                             <option value="personal">Personal Leave</option>
//                             <option value="emergency">Emergency Leave</option>
//                         </select>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 text-black mb-2">
//                                 Start Date
//                             </label>
//                             <input
//                                 type="date"
//                                 value={formData.startDate}
//                                 onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:border-transparent "
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 text-black mb-2">
//                                 End Date
//                             </label>
//                             <input
//                                 type="date"
//                                 value={formData.endDate}
//                                 onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:border-transparent "
//                                 required
//                             />
//                         </div>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 text-black mb-2">
//                             Reason
//                         </label>
//                         <textarea
//                             value={formData.reason}
//                             onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                             rows={3}
//                             className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:border-transparent "
//                             required
//                         />
//                     </div>
//                     <div className="flex justify-end space-x-3 pt-4">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => {
//                                 setIsCreateModalOpen(false);
//                                 resetForm();
//                             }}
//                         >
//                             Cancel
//                         </Button>
//                         <Button type="submit">
//                             Create Request
//                         </Button>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     );
// };
