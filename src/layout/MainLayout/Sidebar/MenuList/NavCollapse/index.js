import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const location = useLocation();
  // let isSelected;

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
  };

  const { pathname } = useLocation();
  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  // // Giới hạn useEffect
  const [effectCount, setEffectCount] = useState(0);

  // Sử dụng biến trạng thái để theo dõi tên đường dẫn hiện tại
  const [currentPathname, setCurrentPathname] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu tên đường dẫn thay đổi thì đặt lại effectCount
    if (pathname !== currentPathname) {
      setCurrentPathname(pathname);
      setEffectCount(0);
    }

    // Giới hạn useEffect tối đa 2 lần
    if (effectCount < 2) {
      setOpen(false);
      setSelected(null);
      if (menu.children) {
        menu.children.forEach((item) => {
          if (item.children?.length) {
            checkOpenForParent(item.children, menu.id);
          }
          if (item.url === pathname) {
            setSelected(menu.id);
            setOpen(true);
          }
        });
      }

      setEffectCount((prevCount) => prevCount + 1);
    }
  }, [pathname, menu.children, effectCount, currentPathname]);

  let isSelected;

  // menu collapse & item
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        isSelected = location?.pathname === item.url;
        return <NavItem key={item.id} item={item} level={level + 1} selected={isSelected} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? (
    <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 0.5,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
          display: 'flex',
          justifyContent: 'space-between'
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '80%' }}>
          <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
          <ListItemText
            primary={
              <Typography variant={selected === menu.id ? 'h5' : 'body1'} color="inherit" sx={{ my: 'auto' }}>
                {menu.title}
              </Typography>
            }
            secondary={
              menu.caption && (
                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                  {menu.caption}
                </Typography>
              )
            }
          />
        </div>
        {open ? (
          <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        ) : (
          <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1,
              background: theme.palette.primary.light
            }
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
};

export default NavCollapse;
