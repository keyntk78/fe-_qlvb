// assets
import { IconSettings, IconBrowserCheck } from '@tabler/icons';

// constant
const icons = {
  IconSettings, IconBrowserCheck
};

// ==============================|| TEST MENU ITEMS ||============================== //

const test = {
  id: 'test',
  title: 'Hệ thống',
  type: 'group',
  children: [
    {
      id: 'role',
      title: 'Nhóm quyền',
      type: 'item',
      url: '/role/Role',
      icon: icons.IconBrowserCheck,
      breadcrumbs: false
    },
    {
      id: 'function',
      title: 'Chức năng',
      type: 'item',
      url: '/function/function',
      icon: icons.IconSettings,
      breadcrumbs: false
    }
    
  ]
};

export default test;
