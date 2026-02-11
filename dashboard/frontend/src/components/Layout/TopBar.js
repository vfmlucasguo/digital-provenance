import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Refresh as RefreshIcon,
  CloudDone as CloudDoneIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const TopBar = ({ onSidebarToggle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // 模拟通知数据
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'SBOM生成完成',
      message: '检测到81个组件，0个AI生成文件',
      time: '2分钟前'
    },
    {
      id: 2,
      type: 'warning',
      title: '安全扫描警告',
      message: '发现3个中危漏洞需要关注',
      time: '15分钟前'
    },
    {
      id: 3,
      type: 'info',
      title: '构建成功',
      message: '部署到开发环境完成',
      time: '1小时前'
    }
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 左侧区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle sidebar"
            onClick={onSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            数字溯源监控中心
          </Typography>

          {/* 系统状态指示器 */}
          <Box sx={{ ml: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={<CloudDoneIcon />}
              label="系统正常"
              color="success"
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<SecurityIcon />}
              label="安全扫描: 活跃"
              color="primary"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* 右侧区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 刷新按钮 */}
          <Tooltip title="刷新数据">
            <IconButton color="inherit" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* 通知按钮 */}
          <Tooltip title="通知">
            <IconButton color="inherit" onClick={handleNotificationOpen}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* 用户菜单 */}
          <Button
            onClick={handleProfileMenuOpen}
            sx={{
              ml: 1,
              textTransform: 'none',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
            startIcon={
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#3b82f6' }}>
                U
              </Avatar>
            }
          >
            <Box sx={{ textAlign: 'left', ml: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                管理员
              </Typography>
              <Typography variant="caption" color="text.secondary">
                系统管理员
              </Typography>
            </Box>
          </Button>
        </Box>

        {/* 通知菜单 */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 350, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6">通知中心</Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleNotificationClose}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
            <Button size="small" color="primary">
              查看所有通知
            </Button>
          </Box>
        </Menu>

        {/* 用户菜单 */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose}>个人资料</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>系统设置</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>帮助文档</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>退出登录</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;