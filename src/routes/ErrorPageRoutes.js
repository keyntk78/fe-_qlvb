// import { lazy } from 'react';

// project imports
// import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ErrorPage from 'views/error/ErrorPage';
import NotFoundPage from 'views/error/NotFound';

// login option 3 routing
// const ErrorPage = Loadable(lazy(() => import('views/errorpage/ErrorPage')));

// ============================== AUTHENTICATION ROUTING ============================== //

const ErrorPageRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '500',
      element: <ErrorPage />
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]
};

export default ErrorPageRoutes;
