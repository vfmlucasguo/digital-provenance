import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  AccountTree as SBOMIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

const menuItems = [
  {
    text: '总览仪表板',
    icon: <DashboardIcon />,
    path: '/dashboard',
    description: '系统概览和关键指标'
  },
  {
    text: 'SBOM管理',
    icon: <SBOMIcon />,
    path: '/sbom',
    description: '软件物料清单查看器'
  },
  {
    text: '安全中心',
    icon: <SecurityIcon />,
    path: '/security',
    description: '漏洞扫描和安全分析'
  },
  {
    text: '构建历史',
    icon: <BuildIcon />,
    path: '/builds',
    description: 'CI/CD构建记录'
  },
  {
    text: '系统设置',
    icon: <SettingsIcon />,
    path: '/settings',
    description: '配置和偏好设置'
  },
];

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 280 : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 80,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          color: 'white',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* 头部Logo区域 */}
      <Box
        sx={{
          p: open ? 3 : 2,
          display: 'flex',
          alignItems: 'center',
          minHeight: 64,
        }}
      >
        <ShieldIcon sx={{ color: '#3b82f6', fontSize: 32, mr: open ? 2 : 0 }} />
        {open && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              数字溯源
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              企业级CI/CD平台
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: '#334155' }} />

      {/* 系统状态指示器 */}
      {open && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                mr: 1,
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              系统运行正常
            </Typography>
          </Box>
          <Chip
            label="v2.0"
            size="small"
            sx={{
              backgroundColor: '#1e40af',
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
        </Box>
      )}

      <Divider sx={{ borderColor: '#334155' }} />

      {/* 导航菜单 */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  backgroundColor: isActive ? '#3b82f6' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? '#2563eb' : '#334155',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : '#94a3b8',
                    minWidth: open ? 40 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'white' : '#e2e8f0',
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: isActive ? '#bfdbfe' : '#64748b',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* 底部信息 */}
      {open && (
        <Box sx={{ p: 2, borderTop: '1px solid #334155' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUpIcon sx={{ color: '#10b981', fontSize: 16, mr: 1 }} />
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              性能提升 88%
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
            最后更新: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;