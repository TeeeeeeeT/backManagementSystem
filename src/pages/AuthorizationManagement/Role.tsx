import React, { useState } from 'react';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Drawer, Button, Tree, Tabs } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getTabelData } from '@/services/swagger/authorizationManagementAPI';
import { UserOutlined } from '@ant-design/icons';

const treeData: DataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: <span style={{ color: '#1890ff' }}>sss</span>, key: '0-0-1-0' }],
      },
    ],
  },
];

const Role: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<AuthorizationManagementAPI.RoleListItem>();
  const [showAuthorizationModal, handleShowAuthorizationModal] = useState<boolean>(false);
  const columns: ProColumns<AuthorizationManagementAPI.RoleListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        <Button
          type={'primary'}
          key="authorization"
          onClick={() => {
            handleShowAuthorizationModal(true);
            setCurrentRow(record);
          }}
        >
          授权
        </Button>,
        <Button type="primary" key="edit">
          编辑
        </Button>,
      ],
    },
  ];

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ProTable
          style={{ width: '60%' }}
          columns={columns}
          request={async () => await getTabelData('/api/getRoleList')}
        ></ProTable>
        <div style={{ width: '38%' }}>
          <Tree
            checkable
            defaultExpandedKeys={['0-0-0', '0-0-1']}
            defaultSelectedKeys={['0-0-0', '0-0-1']}
            defaultCheckedKeys={['0-0-0', '0-0-1']}
            onSelect={onSelect}
            onCheck={onCheck}
            treeData={treeData}
          />
        </div>
      </div>

      {/*  授权弹窗 */}
      <Drawer
        width={600}
        open={showAuthorizationModal}
        onClose={() => {
          setCurrentRow(undefined);
          handleShowAuthorizationModal(false);
        }}
      >
        <Tabs
          defaultActiveKey="2"
          items={[UserOutlined].map((Icon, i) => {
            const id = String(i + 1);
            return {
              label: (
                <span>
                  <Icon />
                  {currentRow?.name}-用户分配
                </span>
              ),
              key: id,
              children: <div>用户</div>,
            };
          })}
        />
      </Drawer>
    </PageContainer>
  );
};

export default Role;
