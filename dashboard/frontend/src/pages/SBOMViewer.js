import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
  AccountTree as TreeIcon,
  Security as SecurityIcon,
  SmartToy as AIIcon,
  License as LicenseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import ForceGraph2D from 'react-force-graph-2d';

// 模拟SBOM数据
const mockSBOMData = {
  components: [
    {
      name: '@angular/core',
      version: '20.3.16',
      type: 'library',
      licenses: ['MIT'],
      ai_generated: false,
      risk_level: 'low',
      description: 'Angular核心框架',
      dependencies: ['@angular/common', 'rxjs']
    },
    {
      name: '@ionic/angular',
      version: '8.0.0',
      type: 'library',
      licenses: ['MIT'],
      ai_generated: false,
      risk_level: 'low',
      description: 'Ionic Angular组件库',
      dependencies: ['@angular/core']
    },
    {
      name: 'rxjs',
      version: '7.8.1',
      type: 'library',
      licenses: ['Apache-2.0'],
      ai_generated: false,
      risk_level: 'low',
      description: '响应式编程库',
      dependencies: []
    },
    {
      name: 'test-ai-component',
      version: '1.0.0',
      type: 'file',
      licenses: [],
      ai_generated: true,
      risk_level: 'medium',
      description: 'AI生成的测试组件',
      dependencies: ['@angular/core']
    },
    {
      name: 'lodash',
      version: '4.17.21',
      type: 'library',
      licenses: ['MIT'],
      ai_generated: false,
      risk_level: 'medium',
      description: '实用工具库',
      dependencies: []
    }
  ],
  dependencyGraph: {
    nodes: [
      { id: '@angular/core', group: 'framework', size: 20 },
      { id: '@ionic/angular', group: 'ui', size: 15 },
      { id: 'rxjs', group: 'utility', size: 12 },
      { id: 'test-ai-component', group: 'ai', size: 8 },
      { id: 'lodash', group: 'utility', size: 10 }
    ],
    links: [
      { source: '@ionic/angular', target: '@angular/core' },
      { source: '@angular/core', target: 'rxjs' },
      { source: 'test-ai-component', target: '@angular/core' }
    ]
  }
};

const SBOMViewer = () => {
  const [components, setComponents] = useState(mockSBOMData.components);
  const [filteredComponents, setFilteredComponents] = useState(mockSBOMData.components);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    type: 'all',
    riskLevel: 'all',
    aiGenerated: 'all',
    license: 'all'
  });
  const [showAIOnly, setShowAIOnly] = useState(false);

  // 过滤和搜索逻辑
  useEffect(() => {
    let filtered = components;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 类型过滤
    if (filters.type !== 'all') {
      filtered = filtered.filter(comp => comp.type === filters.type);
    }

    // 风险等级过滤
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(comp => comp.risk_level === filters.riskLevel);
    }

    // AI生成过滤
    if (filters.aiGenerated !== 'all') {
      const isAI = filters.aiGenerated === 'true';
      filtered = filtered.filter(comp => comp.ai_generated === isAI);
    }

    // 仅显示AI生成组件
    if (showAIOnly) {
      filtered = filtered.filter(comp => comp.ai_generated);
    }

    setFilteredComponents(filtered);
    setPage(0); // 重置页码
  }, [searchTerm, filters, showAIOnly, components]);

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
    setDialogOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getNodeColor = (node) => {
    switch (node.group) {
      case 'framework': return '#3b82f6';
      case 'ui': return '#8b5cf6';
      case 'utility': return '#10b981';
      case 'ai': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // 统计信息
  const stats = {
    total: components.length,
    aiGenerated: components.filter(c => c.ai_generated).length,
    highRisk: components.filter(c => c.risk_level === 'high').length,
    libraries: components.filter(c => c.type === 'library').length,
    files: components.filter(c => c.type === 'file').length
  };

  return (
    <Box>
      {/* 页面标题 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            SBOM管理中心
          </Typography>
          <Typography variant="body1" color="text.secondary">
            软件物料清单可视化分析
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => {
              const dataStr = JSON.stringify(mockSBOMData, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'sbom-export.json';
              link.click();
            }}
          >
            导出SBOM
          </Button>
        </Box>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总组件数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {stats.aiGenerated}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI生成组件
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626' }}>
                {stats.highRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                高风险组件
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                {stats.libraries}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                第三方库
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                {stats.files}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                源码文件
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI组件警告 */}
      {stats.aiGenerated > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>AI透明度:</strong> 检测到 {stats.aiGenerated} 个AI生成的组件，已自动标记并可追溯。
        </Alert>
      )}

      {/* 标签页 */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="组件列表" icon={<FilterIcon />} />
            <Tab label="依赖关系图" icon={<TreeIcon />} />
          </Tabs>
        </Box>

        {/* 组件列表标签页 */}
        {currentTab === 0 && (
          <CardContent>
            {/* 搜索和过滤器 */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="搜索组件名称或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>类型</InputLabel>
                  <Select
                    value={filters.type}
                    label="类型"
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <MenuItem value="all">全部</MenuItem>
                    <MenuItem value="library">第三方库</MenuItem>
                    <MenuItem value="file">源码文件</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>风险等级</InputLabel>
                  <Select
                    value={filters.riskLevel}
                    label="风险等级"
                    onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                  >
                    <MenuItem value="all">全部</MenuItem>
                    <MenuItem value="high">高风险</MenuItem>
                    <MenuItem value="medium">中风险</MenuItem>
                    <MenuItem value="low">低风险</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>AI生成</InputLabel>
                  <Select
                    value={filters.aiGenerated}
                    label="AI生成"
                    onChange={(e) => setFilters({...filters, aiGenerated: e.target.value})}
                  >
                    <MenuItem value="all">全部</MenuItem>
                    <MenuItem value="true">是</MenuItem>
                    <MenuItem value="false">否</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAIOnly}
                      onChange={(e) => setShowAIOnly(e.target.checked)}
                    />
                  }
                  label="仅AI组件"
                />
              </Grid>
            </Grid>

            {/* 组件表格 */}
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>组件名称</TableCell>
                    <TableCell>版本</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>许可证</TableCell>
                    <TableCell>AI生成</TableCell>
                    <TableCell>风险等级</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredComponents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((component, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {component.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {component.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={component.version} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={component.type}
                            size="small"
                            color={component.type === 'library' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>
                          {component.licenses.map((license, idx) => (
                            <Chip
                              key={idx}
                              label={license}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          {component.ai_generated ? (
                            <Chip
                              icon={<AIIcon />}
                              label="AI生成"
                              size="small"
                              color="warning"
                            />
                          ) : (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="人工编写"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={component.risk_level}
                            size="small"
                            color={getRiskColor(component.risk_level)}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="查看详情">
                            <IconButton
                              size="small"
                              onClick={() => handleComponentClick(component)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredComponents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="每页行数:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count} 条`}
            />
          </CardContent>
        )}

        {/* 依赖关系图标签页 */}
        {currentTab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              组件依赖关系图
            </Typography>
            <Box
              sx={{
                height: 600,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: '#fafafa'
              }}
            >
              <ForceGraph2D
                graphData={mockSBOMData.dependencyGraph}
                nodeAutoColorBy="group"
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.id;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  const textWidth = ctx.measureText(label).width;
                  const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                  ctx.fillStyle = getNodeColor(node);
                  ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = 'white';
                  ctx.fillText(label, node.x, node.y);
                }}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}
                onNodeClick={(node) => {
                  const component = components.find(c => c.name === node.id);
                  if (component) {
                    handleComponentClick(component);
                  }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              点击节点查看组件详情 • 蓝色: 框架 • 紫色: UI组件 • 绿色: 工具库 • 橙色: AI生成
            </Typography>
          </CardContent>
        )}
      </Card>

      {/* 组件详情对话框 */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">组件详情</Typography>
            {selectedComponent?.ai_generated && (
              <Chip
                icon={<AIIcon />}
                label="AI生成"
                color="warning"
                size="small"
              />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedComponent && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  组件名称
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedComponent.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  版本
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedComponent.version}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  描述
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedComponent.description}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  类型
                </Typography>
                <Chip
                  label={selectedComponent.type}
                  color={selectedComponent.type === 'library' ? 'primary' : 'secondary'}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  风险等级
                </Typography>
                <Chip
                  label={selectedComponent.risk_level}
                  color={getRiskColor(selectedComponent.risk_level)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  许可证
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedComponent.licenses.map((license, idx) => (
                    <Chip
                      key={idx}
                      label={license}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  依赖关系
                </Typography>
                <Box>
                  {selectedComponent.dependencies.length > 0 ? (
                    selectedComponent.dependencies.map((dep, idx) => (
                      <Chip
                        key={idx}
                        label={dep}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      无依赖
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SBOMViewer;