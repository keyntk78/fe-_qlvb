import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import ErrorPageRoutes from './ErrorPageRoutes';
import Congthongtin from './Congthongtin';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes, ErrorPageRoutes, Congthongtin]);
}
