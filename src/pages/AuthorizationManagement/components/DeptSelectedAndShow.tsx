import React, { useState } from 'react';
import { Col, List, Row } from 'antd';
import { rule } from '@/services/swagger/authorizationManagementAPI';
import { ProColumns, ProTable } from '@ant-design/pro-components';
// 引入上级文件夹中的style.less样式文件
import '../style.less';

const DeptSelectedAndShow: React.FC = () => {
  // 添加样式pro-table-padding
  const listData: string[] = [
    '总经理室',
    '财务部',
    '人事部',
    '行政部',
    '市场部',
    '销售部',
    '技术部',
    '研发部',
    '生产部',
    '采购部',
    '仓储部',
    '物流部',
    '质检部',
    '售后服务部',
    '客服部',
    '安全保卫部',
    '法务部',
    '监察部',
    '审计部',
    '党群工作部',
  ];
  const columns: ProColumns<AuthorizationManagementAPI.UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '登录账号',
      search: false,
      dataIndex: 'account',
      valueType: 'textarea',
      align: 'center',
    },
  ];
  const [selectedRows, setSelectedRows] = useState<AuthorizationManagementAPI.UserListItem[]>([]);

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <List
            bordered
            dataSource={listData}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col span={18}>
          <ProTable
            columns={columns}
            request={rule}
            search={{
              labelWidth: 'auto',
              span: 8,
              className: 'pro-table-search',
            }}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </Col>
      </Row>
      <Row>
        <ul
          style={{ width: '100%', display: 'flex', alignItems: 'center', border: '1px solid grey' }}
        >
          {selectedRows.map((item) => (
            <li key={item.key} style={{ margin: '10px' }}>
              {item.name}
            </li>
          ))}
        </ul>
      </Row>
    </div>
  );
};

export default DeptSelectedAndShow;
