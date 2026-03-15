/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Events } from './pages/Events';
import { Shop } from './pages/Shop';

export default function App() {
  return (
    <Router>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#18181b', // zinc-900
            color: '#f4f4f5', // zinc-100
            border: '1px solid #27272a', // zinc-800
          },
          success: {
            iconTheme: {
              primary: '#f59e0b', // amber-500
              secondary: '#18181b',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="events" element={<Events />} />
          <Route path="shop" element={<Shop />} />
        </Route>
      </Routes>
    </Router>
  );
}
