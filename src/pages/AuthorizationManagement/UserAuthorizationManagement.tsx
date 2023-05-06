import React, { useState } from 'react';
import { Drawer, Tabs } from 'antd';
import { ProColumns } from '@ant-design/pro-components';
import TabContentItem from '@/pages/AuthorizationManagement/components/TabContentItem';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { rule } from '@/services/swagger/authorizationManagementAPI';

const UserAuthorizationManagement: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<AuthorizationManagementAPI.UserListItem>();
  const [showAuthorizationModal, handleShowAuthorizationModal] = useState<boolean>(false);

  const columns: ProColumns<AuthorizationManagementAPI.UserListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '登录账号',
      dataIndex: 'account',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'dept',
      valueType: 'textarea',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        <a
          key="authorization"
          onClick={() => {
            handleShowAuthorizationModal(true);
            setCurrentRow(record);
          }}
        >
          授权
        </a>,
        <a key="edit" href="src/pages">
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable headerTitle="查询表格" columns={columns} request={rule} />

      {/*授权弹窗*/}
      <Drawer
        width={600}
        open={showAuthorizationModal}
        onClose={() => {
          setCurrentRow(undefined);
          handleShowAuthorizationModal(false);
        }}
        closable={false}
      >
        {/*写一个tabs标签页，分别是用户信息、角色信息、权限信息*/}
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{ background: 'black', padding: '0px 20px' }}
          items={[
            {
              key: '1',
              label: '角色分配',
              children: (
                <TabContentItem title="角色分配" userName={currentRow?.name}></TabContentItem>
              ),
            },
            {
              key: '2',
              label: '岗位分配',
              children: (
                <TabContentItem title="岗位分配" userName={currentRow?.name}></TabContentItem>
              ),
            },
            {
              key: '3',
              label: '群组分配',
              children: (
                <TabContentItem title="群组分配" userName={currentRow?.name}></TabContentItem>
              ),
            },
          ]}
        ></Tabs>
      </Drawer>
    </PageContainer>
  );
};

export default UserAuthorizationManagement;
