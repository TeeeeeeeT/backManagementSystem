import React, { useState } from 'react';
import { FormattedMessage } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Drawer, Tabs, Button, Modal, Form, Input, message } from 'antd';
import { rule, updateRule } from '@/services/swagger/authorizationManagementAPI';
import TabContentItem from '@/pages/AuthorizationManagement/components/TabContentItem';

const User: React.FC = () => {
  const [form] = Form.useForm();
  const [currentRow, setCurrentRow] = useState<AuthorizationManagementAPI.UserListItem>();
  const [showAuthorizationModal, handleShowAuthorizationModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
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
            setOpenEditModal(true);
            setCurrentRow(record);
            form.setFieldsValue(record);
          }}
        >
          编辑
        </Button>,
      ],
    },
  ];

  const handleOk = async () => {
    setConfirmLoading(true);
    const hide = message.loading('正在更新');
    try {
      await updateRule({
        key: currentRow?.key,
        name: currentRow?.name,
        dept: currentRow?.dept,
        account: currentRow?.account,
      });
      hide();
      setOpenEditModal(false);
      setConfirmLoading(false);
      message.success('更新 successful');
      return true;
    } catch (error) {
      hide();
      message.error('更新 failed, please try again!');
      setOpenEditModal(false);
      setConfirmLoading(false);
      return false;
    }
  };
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    setCurrentRow(allValues);
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer>
      <ProTable<AuthorizationManagementAPI.UserListItem, API.PageParams>
        headerTitle="查询表格"
        columns={columns}
        request={rule}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              form.resetFields();
              setOpenEditModal(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
      />

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

      {/*编辑对话框*/}
      <Modal
        title="编辑用户"
        open={openEditModal}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpenEditModal(false)}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onValuesChange={handleFormValuesChange}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="登录账号"
            name="account"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="当前部门" name="dept">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default User;
