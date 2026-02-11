import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  BugReport as BugIcon,
  Shield as ShieldIcon,
  Gavel as LicenseIcon,
  Link as ChainIcon,
} from '@mui/icons-material';

// 模拟安全数据
const mockSecurityData = {
  vulnerabilities: [
    {
      id: 'CVE-2023-1234',
      severity: 'HIGH',
      title: '跨站脚本攻击漏洞',
      package: 'lodash',
      version: '4.17.20',
      fixed_version: '4.17.21',
      description: '在lodash库中发现XSS漏洞，可能导致代码注入攻击',
      published_date: '2023-05-15'
    },
    {
      id: 'CVE-2023-5678',
      severity: 'MEDIUM',
      title: '原型污染漏洞',
      package: 'minimist',
      version: '1.2.5',
      fixed_version: '1.2.6',
      description: '原型污染可能导致应用程序行为异常',
      published_date: '2023-06-20'
    },
    {
      id: 'CVE-2023-9999',
      severity: 'LOW',
      title: '信息泄露风险',
      package: 'debug',
      version: '4.3.3',
      fixed_version: '4.3.4',
      description: '可能泄露敏感调试信息',
      published_date: '2023-07-10'
    }
  ],
  licenseViolations: [
    {
      package: 'some-gpl-package',
      version: '1.0.0',
      license: 'GPL-3.0',
      violation: '与企业许可证政策冲突'
    }
  ],
  maliciousPackages: [],
  supplyChainRisks: [
    {
      package: 'old-unmaintained-lib',
      risk: 'HIGH',
      reason: '包已超过2年未更新，存在供应链风险'
    }
  ]
};

const SecurityCenter = () => {
  const [securityData, setSecurityData] = useState(mockSecurityData);
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return <ErrorIcon />;
      case 'HIGH': return <WarningIcon />;
      case 'MEDIUM': return <WarningIcon />;
      case 'LOW': return <CheckCircleIcon />;
      default: return <CheckCircleIcon />;
    }
  };

  const handleVulnClick = (vuln) => {
    setSelectedVuln(vuln);
    setDialogOpen(true);
  };

  const runSecurityScan = async () => {
    setLoading(true);
    // 模拟扫描过程
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoading(false);
  };

  // 统计数据
  const stats = {
    total: securityData.vulnerabilities.length,
    critical: securityData.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    high: securityData.vulnerabilities.filter(v => v.severity === 'HIGH').length,
    medium: securityData.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
    low: securityData.vulnerabilities.filter(v => v.severity === 'LOW').length,
  };

  return (
    <Box>
      {/* 页面标题 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            安全中心
          </Typography>
          <Typography variant="body1" color="text.secondary">
            漏洞扫描和安全风险分析
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SecurityIcon />}
          onClick={runSecurityScan}
          disabled={loading}
        >
          {loading ? '扫描中...' : '运行安全扫描'}
        </Button>
      </Box>

      {/* 安全状态警报 */}
      {stats.critical > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>严重安全警报:</strong> 发现 {stats.critical} 个严重漏洞，需要立即处理！
        </Alert>
      )}

      {stats.high > 0 && stats.critical === 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>安全警告:</strong> 发现 {stats.high} 个高危漏洞，建议尽快修复。
        </Alert>
      )}

      {stats.total === 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <strong>安全状态良好:</strong> 未发现已知安全漏洞。
        </Alert>
      )}

      {/* 扫描进度 */}
      {loading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              正在执行安全扫描...
            </Typography>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              正在检查漏洞数据库和恶意软件特征...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* 安全统计卡片 */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                {stats.critical}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                严重漏洞
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ea580c' }}>
                {stats.high}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                高危漏洞
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ca8a04' }}>
                {stats.medium}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                中危漏洞
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#65a30d' }}>
                {stats.low}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                低危漏洞
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 安全分析结果 */}
      <Grid container spacing={3}>
        {/* 漏洞列表 */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                <BugIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                发现的漏洞
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>漏洞ID</TableCell>
                      <TableCell>严重程度</TableCell>
                      <TableCell>影响组件</TableCell>
                      <TableCell>修复版本</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {securityData.vulnerabilities.map((vuln, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {vuln.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getSeverityIcon(vuln.severity)}
                            label={vuln.severity}
                            color={getSeverityColor(vuln.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {vuln.package}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              v{vuln.version}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={vuln.fixed_version}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => handleVulnClick(vuln)}
                          >
                            查看详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 其他安全问题 */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* 许可证违规 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <LicenseIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    许可证合规
                  </Typography>
                  {securityData.licenseViolations.length > 0 ? (
                    <List dense>
                      {securityData.licenseViolations.map((violation, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={violation.package}
                            secondary={`${violation.license} - ${violation.violation}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        所有许可证合规
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 恶意软件检测 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <ShieldIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    恶意软件检测
                  </Typography>
                  {securityData.maliciousPackages.length > 0 ? (
                    <List dense>
                      {securityData.maliciousPackages.map((pkg, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <ErrorIcon color="error" />
                          </ListItemIcon>
                          <ListItemText
                            primary={pkg.name}
                            secondary={pkg.reason}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        未检测到恶意软件
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 供应链风险 */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <ChainIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    供应链风险
                  </Typography>
                  {securityData.supplyChainRisks.length > 0 ? (
                    <List dense>
                      {securityData.supplyChainRisks.map((risk, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary={risk.package}
                            secondary={risk.reason}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box display="flex" alignItems="center">
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        供应链风险较低
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* 漏洞详情对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          漏洞详情: {selectedVuln?.id}
        </DialogTitle>
        <DialogContent>
          {selectedVuln && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    严重程度
                  </Typography>
                  <Chip
                    icon={getSeverityIcon(selectedVuln.severity)}
                    label={selectedVuln.severity}
                    color={getSeverityColor(selectedVuln.severity)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    发布日期
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVuln.published_date}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    漏洞标题
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVuln.title}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    详细描述
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVuln.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    受影响组件
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVuln.package} v{selectedVuln.version}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    修复版本
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedVuln.fixed_version}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>关闭</Button>
          <Button variant="contained" color="primary">
            查看修复建议
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityCenter;