import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Build as BuildIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// 模拟API调用
const fetchDashboardData = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    overview: {
      components: { total: 81, ai_generated: 0, last_updated: new Date().toISOString() },
      security: {
        vulnerabilities: { critical: 0, high: 0, medium: 3, low: 5 },
        total_vulnerabilities: 8,
        risk_level: 'medium'
      },
      build: { status: 'success', last_build: new Date().toISOString(), success_rate: 95.5 }
    },
    metrics: {
      commit_processing_time: { current: 9, previous: 77, improvement: 88.3 },
      ai_detection_accuracy: { current: 90, previous: 60, improvement: 50.0 },
      security_coverage: { current: 100, previous: 0, improvement: 100.0 },
      automation_level: { current: 95, previous: 30, improvement: 216.7 }
    }
  };
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    // 设置自动刷新
    const interval = setInterval(loadDashboardData, 30000); // 30秒刷新一次
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 性能趋势数据
  const performanceTrendData = [
    { name: '1月', 提交时间: 77, AI检测: 60, 安全覆盖: 0 },
    { name: '2月', 提交时间: 45, AI检测: 70, 安全覆盖: 50 },
    { name: '3月', 提交时间: 25, AI检测: 80, 安全覆盖: 75 },
    { name: '4月', 提交时间: 15, AI检测: 85, 安全覆盖: 90 },
    { name: '5月', 提交时间: 9, AI检测: 90, 安全覆盖: 100 },
  ];

  // 漏洞分布数据
  const vulnerabilityData = data ? [
    { name: '严重', value: data.overview.security.vulnerabilities.critical, color: '#dc2626' },
    { name: '高危', value: data.overview.security.vulnerabilities.high, color: '#ea580c' },
    { name: '中危', value: data.overview.security.vulnerabilities.medium, color: '#ca8a04' },
    { name: '低危', value: data.overview.security.vulnerabilities.low, color: '#65a30d' },
  ] : [];

  // 构建历史数据
  const buildHistoryData = [
    { name: '周一', 成功: 8, 失败: 1 },
    { name: '周二', 成功: 12, 失败: 0 },
    { name: '周三', 成功: 15, 失败: 2 },
    { name: '周四', 成功: 10, 失败: 1 },
    { name: '周五', 成功: 18, 失败: 0 },
    { name: '周六', 成功: 5, 失败: 0 },
    { name: '周日', 成功: 3, 失败: 0 },
  ];

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          加载仪表板数据...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* 页面标题和操作 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            数字溯源监控仪表板
          </Typography>
          <Typography variant="body1" color="text.secondary">
            最后更新: {lastUpdate.toLocaleString()}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          刷新数据
        </Button>
      </Box>

      {/* 系统状态警报 */}
      {data?.overview.security.risk_level === 'high' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>安全警报:</strong> 检测到严重安全漏洞，请立即处理！
        </Alert>
      )}

      {/* 关键指标卡片 */}
      <Grid container spacing={3} mb={4}>
        {/* SBOM组件统计 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    SBOM组件
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                    {data?.overview.components.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI生成: {data?.overview.components.ai_generated || 0} 个
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#dbeafe',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BuildIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 安全漏洞统计 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    安全漏洞
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                    {data?.overview.security.total_vulnerabilities || 0}
                  </Typography>
                  <Chip
                    label={data?.overview.security.risk_level || 'unknown'}
                    color={
                      data?.overview.security.risk_level === 'high' ? 'error' :
                      data?.overview.security.risk_level === 'medium' ? 'warning' : 'success'
                    }
                    size="small"
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#fee2e2',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SecurityIcon sx={{ color: '#dc2626', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 构建成功率 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    构建成功率
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#059669' }}>
                    {data?.overview.build.success_rate || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    状态: {data?.overview.build.status === 'success' ? '正常' : '异常'}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#d1fae5',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#059669', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 性能提升 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    性能提升
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#7c3aed' }}>
                    88%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    提交时间: 77s → 9s
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#ede9fe',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SpeedIcon sx={{ color: '#7c3aed', fontSize: 32 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 图表区域 */}
      <Grid container spacing={3} mb={4}>
        {/* 性能趋势图 */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                性能趋势分析
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="提交时间"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="AI检测"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="安全覆盖"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 漏洞分布饼图 */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                漏洞分布
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vulnerabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {vulnerabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 构建历史和最近活动 */}
      <Grid container spacing={3}>
        {/* 构建历史柱状图 */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                本周构建历史
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={buildHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="成功" fill="#059669" />
                    <Bar dataKey="失败" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 最近活动 */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                最近活动
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="SBOM生成完成"
                    secondary="2分钟前 • 81个组件"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="发现中危漏洞"
                    secondary="15分钟前 • 3个漏洞"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="部署到开发环境"
                    secondary="1小时前 • 成功"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="AI检测完成"
                    secondary="2小时前 • 0个AI文件"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;