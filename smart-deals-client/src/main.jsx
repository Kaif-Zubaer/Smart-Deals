import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css'
import Root from './layouts/Root.jsx';
import Home from './components/Home/Home.jsx';
import AllProducts from './components/AllProducts/AllProducts.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import MyProducts from './components/MyProducts/MyProducts.jsx';
import MyBids from './components/MyBids/MyBids.jsx';
import CreateProduct from './components/CreateProduct/CreateProduct.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Loading from './components/Loading/Loading.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: '/all-products',
        element: <AllProducts></AllProducts>,
      },
      {
        path: '/product-details/:id',
        loader: ({ params }) => fetch(`http://localhost:3000/products/${params.id}`),
        element: <PrivateRoute><ProductDetails></ProductDetails></PrivateRoute>,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: '/my-products',
        element: <PrivateRoute><MyProducts></MyProducts></PrivateRoute>,
      },
      {
        path: '/my-bids',
        loader: () => fetch('http://localhost:3000/products'),
        element: <PrivateRoute><MyBids></MyBids></PrivateRoute>,
        hydrateFallbackElement: <Loading></Loading>,
      },
      {
        path: '/create-product',
        element: <PrivateRoute><CreateProduct></CreateProduct></PrivateRoute>,
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/register',
        element: <Register></Register>,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
