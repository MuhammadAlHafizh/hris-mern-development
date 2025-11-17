import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/admin/user';
import { Position } from './pages/admin/position';
import { AnnualLeave } from './pages/admin/annual-leave';
import { Announcements } from "./pages/admin/announcements";
import { StaffAttendance } from './pages/staff/attendance';
import { AdminAttendance } from './pages/admin/attandance';
import { StaffLeave } from './pages/staff/leave'; // Fixed import - using named import
import { Reports } from './pages/Reports';
import { ToastContainer } from 'react-toastify';
import { AdminLeave } from './pages/admin/leave';
import 'react-toastify/dist/ReactToastify.css';

// Import leave management page if it exists, otherwise you'll need to create it
// import { LeaveManagementPage } from './pages/admin/leave-management';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 transition-colors duration-200">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />

                    <Routes>
                        {/* Halaman login */}
                        <Route path="/login" element={<Login />} />

                        {/* Semua route admin di bawah /administration */}
                        <Route
                            path="/administration/*"
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }
                        >
                            {/* Route untuk semua role */}
                            <Route path="dashboard" element={<Dashboard />} />

                            {/* Attendance - admin/manager ke AdminAttendance, staff ke StaffAttendance */}
                            <Route
                                path="attendance"
                                element={<AttendancePage />}
                            />

                            {/* Route hanya untuk admin dan manager */}
                            <Route
                                path="users"
                                element={
                                    <ProtectedRoute requiredRoles={['admin', 'manager']}>
                                        <Users />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="positions"
                                element={
                                    <ProtectedRoute requiredRoles={['admin', 'manager']}>
                                        <Position />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="annual-leave"
                                element={
                                    <ProtectedRoute requiredRoles={['admin', 'manager']}>
                                        <AnnualLeave />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="announcements"
                                element={
                                    <ProtectedRoute requiredRoles={['admin', 'manager']}>
                                        <Announcements />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Leave untuk semua role - akan diarahkan ke halaman sesuai role */}
                            <Route
                                path="leave"
                                element={<LeavePage />}
                            />

                            <Route
                                path="admin-leave"
                                element={<AdminLeave />}
                            />

                            {/* Reports dengan sub-routes */}
                            <Route
                                path="reports/*"
                                element={
                                    <ProtectedRoute>
                                        <Reports />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Default redirect */}
                            <Route path="" element={<Navigate to="/administration/dashboard" replace />} />
                        </Route>

                        {/* Redirect root ke dashboard admin */}
                        <Route path="/" element={<Navigate to="/administration/dashboard" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

const AttendancePage = () => {
    const { user } = useAuth();

    if (user?.role === 'admin' || user?.role === 'manager') {
        return <AdminAttendance />;
    } else {
        return <StaffAttendance />;
    }
};

const LeavePage = () => {
    // const { user } = useAuth();

    // For now, all roles use StaffLeave since LeaveManagementPage doesn't exist
    // Once you create LeaveManagementPage, you can uncomment the conditional logic
    return <StaffLeave />;

    /*
    // Uncomment this once you have LeaveManagementPage component:
    if (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'hr') {
        return <LeaveManagementPage />;
    } else {
        return <StaffLeave />;
    }
    */
};

export default App;
