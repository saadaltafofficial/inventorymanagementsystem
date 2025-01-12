import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Signin from './components/Signin.jsx'
import Allitems from './components/Allitems.jsx'
import { AuthProvider } from './components/AuthContext.jsx'
import CreateItem from './components/CreateItem.jsx'
import AdminAccess from './components/AdminAccess.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Updateitem from './components/Updateitem.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>Not Found</div>,
  },
  {
    path: '/app',
    element: <App />,
    errorElement: <div>Not Found</div>,
  },
  {
    path: '/signin',
    element: <Signin />,
    errorElement: <div>Not Found</div>,
  },
  {
    path: '/allitems',
    element: <Allitems />,
    errorElement: <div>Not Found</div>,
  },
  {
    path: '/admin/createitem',
    element: <ProtectedRoute><CreateItem /></ProtectedRoute>,
    errorElement: <div>Not Found</div>,
  },
  {
    path: 'admin/updateitem/:itemId',
    element: <ProtectedRoute><Updateitem/></ProtectedRoute>,
    errorElement: <div>Not Found</div>,
  },
  {
    path: '/admin/allitems',
    element: <ProtectedRoute><AdminAccess /></ProtectedRoute>,
    errorElement: <div>Not Found</div>,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
