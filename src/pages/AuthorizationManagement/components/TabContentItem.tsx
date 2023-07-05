import React, { useEffect, useState } from 'react';
import { Button, Checkbox, message } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { getRoleList } from '@/services/swagger/authorizationManagementAPI';

// 接收父组件传递的参数验证
export type TabContentItemProps = {
  title: string;
  titleKeyword?: string;
  userName?: string;
};

const TabContentItem: React.FC<TabContentItemProps> = (props) => {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    console.log('checked = ', checkedValues);
  };
  let [options, setOptions] = useState<AuthorizationManagementAPI.RoleListItem[]>([]);
  const getRoleOptions = async () => {
    const hide = message.loading('正在获取角色列表');
    try {
      // 把返回来的数据赋值给options
      setOptions((await getRoleList()).data || []);
      hide();
      message.success(`获取${props.titleKeyword}成功!`);
      return true;
    } catch (error) {
      hide();
      message.error(`获取${props.titleKeyword}失败, 请重试!`);
      return false;
    }
  };
  useEffect(() => {
    getRoleOptions();
  }, [props.title]);

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
              value={item.roleId}
              key={item.roleId}
              style={{ margin: '4px 0', fontSize: '16px' }}
            >
              {item.name}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
    </div>
  );
};

export default TabContentItem;
