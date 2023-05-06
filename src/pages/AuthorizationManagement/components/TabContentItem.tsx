import React from 'react';
import { Button, Checkbox, message } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { rule } from '@/services/swagger/authorizationManagementAPI';

// 接收父组件传递的参数验证
export type TabContentItemProps = {
  title: string;
  userName?: string;
};

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

const options: Option[] = [
  { label: '普通角色', value: 'Apple' },
  { label: '典型库管理员', value: 'Pear' },
  { label: '部门流程审批人', value: 'Orange' },
  { label: '部门流程发起人', value: 'Orange1' },
  { label: '部门流程查看人', value: 'Orange2' },
  { label: '部门流程编辑人', value: 'Orange3' },
  { label: '部门流程删除人', value: 'Orange4' },
  { label: '系统管理员', value: 'Orange5' },
  { label: '百科管理员', value: 'Orange6' },
  { label: '党建管理员', value: 'Orange7' },
];

const getRoleOptions = async () => {
  const hide = message.loading('正在获取角色列表');
  try {
    await rule({ current: 1, pageSize: 10 });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('获取角色失败, 请重试!');
    return false;
  }
};

// 一进来就获取角色列表
getRoleOptions();

const TabContentItem: React.FC<TabContentItemProps> = (props) => {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <div>
      <div
        style={{
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '16px',
        }}
      >
        <div>
          {props.userName}-{props.title}
        </div>
        <Button type="primary" key="primary" onClick={() => {}} size={'small'}>
          保存
        </Button>
      </div>
      <Checkbox.Group
        style={{ display: 'flex', flexDirection: 'column' }}
        defaultValue={['Pear']}
        onChange={onChange}
      >
        {options.map((item) => {
          return (
            <Checkbox
              value={item.value}
              key={item.value}
              style={{ margin: '4px 0', fontSize: '16px' }}
            >
              {item.label}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
    </div>
  );
};

export default TabContentItem;
