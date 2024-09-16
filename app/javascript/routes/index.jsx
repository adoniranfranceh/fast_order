import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import { 
  CollaboratorsPage,
  CustomersPage,
  CustomerDetailsPage,
  DashboardPage,
  OrdersPage,
  OrderDetails,
  ProfilePage,
  ProfileDetails,
  NotFoundPage,
  DisabledAccountPage,
} from '../components/index.js';

import MyNavbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext/index.jsx';

const AppRoutes = () => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const isProfileComplete = currentUser.profile;

  if (currentUser.status !== 'active') {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<DisabledAccountPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/editar/perfil" element={<ProfilePage />} />

        {!isProfileComplete ? (
          <Route path="*" element={<Navigate to="/editar/perfil" replace />} />
        ) : (
          <>
            <Route path="/perfil/:id" element={<ProfileDetails />} />
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<CustomersPage />} />
            <Route path="/cliente/:id" element={<CustomerDetailsPage />} />
            <Route path="/pedidos" element={<OrdersPage />} />
            <Route path="/pedido/:id" element={<OrderDetails />} />

            {currentUser?.role === 'admin' && (
              <>
                <Route path="/dashboard/" element={<DashboardPage />} />
                <Route path="/colaboradores/" element={<CollaboratorsPage />} />
              </>
            )}

            <Route path="*" element={<NotFoundPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
