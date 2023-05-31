import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Modal, Tabs, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getTabelData } from '@/services/swagger/authorizationManagementAPI';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import DeptSelectedAndShow from '@/pages/AuthorizationManagement/components/DeptSelectedAndShow';

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
  const [form] = Form.useForm();
  const [currentRow, setCurrentRow] = useState<AuthorizationManagementAPI.RoleListItem>();
  const [showAuthorizationModal, handleShowAuthorizationModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
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
      valueType: 'textarea',
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
        <Button
          type="primary"
          key="edit"
          onClick={() => {
            setModalTitle('编辑角色');
            setOpenModal(true);
            form.setFieldsValue(record);
          }}
        >
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
  const confirm = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setOpenModal(false);
    }, 2000);
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
        width={'80%'}
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
                <span style={{ fontSize: '18px' }}>
                  <Icon />
                  {currentRow?.name}-用户分配
                </span>
              ),
              key: id,
              children: <DeptSelectedAndShow />,
            };
          })}
        />
      </Drawer>

      {/*新增和编辑弹窗*/}
      <Modal
        title={modalTitle}
        open={openModal}
        onOk={confirm}
        confirmLoading={confirmLoading}
        onCancel={() => setOpenModal(false)}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色描述"
            name="desc"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Role;
