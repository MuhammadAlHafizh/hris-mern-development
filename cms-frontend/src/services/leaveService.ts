import { LeaveRequest } from '../types';

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'Jane Manager',
    type: 'annual',
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    submittedAt: '2024-01-15T08:00:00Z',
    reviewedBy: 'John Admin',
    reviewedAt: '2024-01-16T08:00:00Z'
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Bob Employee',
    type: 'sick',
    startDate: '2024-01-22',
    endDate: '2024-01-23',
    daysw: 2,
    reason: 'Medical appointment',
    status: 'pending',
    submittedAt: '2024-01-20T08:00:00Z'
  }
];

export const leaveService = {
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockLeaveRequests), 500);
    });
  },

  async createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'submittedAt'>): Promise<LeaveRequest> {
    const newRequest: LeaveRequest = {
      ...data,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    };
    mockLeaveRequests.push(newRequest);
    return newRequest;
  },

  async updateLeaveRequest(id: string, data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const index = mockLeaveRequests.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Leave request not found');

    const updated = { ...mockLeaveRequests[index], ...data };
    mockLeaveRequests[index] = updated;
    return updated;
  },

  async approveLeaveRequest(id: string, reviewedBy: string): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: 'approved',
      reviewedBy,
      reviewedAt: new Date().toISOString()
    });
  },

  async rejectLeaveRequest(id: string, reviewedBy: string): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: 'rejected',
      reviewedBy,
      reviewedAt: new Date().toISOString()
    });
  }
};
