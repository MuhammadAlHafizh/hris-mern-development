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
import { Leave } from './pages/Leave';
import { StaffAttendance } from './pages/staff/attendance';
import { AdminAttendance } from './pages/admin/attandance';
import { Reports } from './pages/Reports';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

                            {/* Leave untuk semua role */}
                            <Route path="leave" element={<Leave />} />

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

export default App;
