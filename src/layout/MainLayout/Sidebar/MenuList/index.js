import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { menuSelector, reportSelector } from 'store/selectors';

import Icons from '../../../../utils/icons';
import NavCollapse from './NavCollapse';
import Dashboard from '../../../../menu-items/dashboard';
import NavItem from './NavItem';
import { useLocation } from 'react-router';
import { IconClipboardData, IconFileReport } from '@tabler/icons';

const MenuList = () => {
  const menuData = useSelector(menuSelector);
  const reports = useSelector(reportSelector);
  const { pathname } = useLocation();

  const createMenu = (menu, parentId = 0) => {
    const menuItems = menu.filter((item) => item.parentId === parentId);
    return menuItems.map((item) => {
      const menuItem = {
        id: `menu-${item.menuId}`,
        title: item.nameMenu.replace(/-/g, ''),
        type: item.levelMenu === 1 ? 'collapse' : 'item',
        url: item.link,
        icon: item.icon === '' ? item.icon : Icons[item.icon] || item.icon,
        urlHuongDan: item.urlHuongDan || ''
      };

      const children = createMenu(menuData, item.menuId);
      if (children.length > 0) {
        delete menuItem.url;
        menuItem.children = children;
        if (menuItem.type !== 'collapse') {
          menuItem.type = 'collapse';
        }
      }

      return menuItem;
    });
  };

  let isSelected;

  const transformedMenuData = createMenu(menuData);

  if (reports && reports.length > 0) {
    // Tạo menu cha "Reports" và đưa các report vào bên trong nó
    const reportMenu = {
      id: 'menu-report',
      title: 'Thống kê',
      type: 'collapse',
      icon: IconClipboardData,
      children: reports.map((report) => ({
        id: `menu-${report.reportId}`,
        title: report.name,
        type: 'item',
        url: report.url,
        icon: IconFileReport
      }))
    };

    transformedMenuData.push(reportMenu); // Đưa menu cha "Reports" vào cuối mảng
  }

  transformedMenuData.unshift(Dashboard);
  const menu = { items: transformedMenuData };

  const navItems = menu.items.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={1} />;
      case 'item':
        isSelected = item.url === pathname ? true : false;
        return <NavItem key={item.id} item={item} level={1} selected={isSelected} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });
  return <>{navItems}</>;
};

export default MenuList;
