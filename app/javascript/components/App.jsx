import React from 'react';
import AppRoutes from '../routes/';
import { AuthProvider } from '../context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;
