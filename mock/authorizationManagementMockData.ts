import { Request, Response } from 'express';
import moment from 'moment';
import { parse } from 'url';

// mock 权限管理DataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: AuthorizationManagementAPI.UserListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      name: i % 2 === 0 ? '张三' : '李四',
      account: 'chenxdgeasgeagea2@csg.cn',
      dept: '研发部',
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query as unknown as API.PageParams &
    API.RuleListItem & {
      sorter: any;
      filter: any;
    };

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      (Object.keys(sorter) as Array<keyof API.RuleListItem>).forEach((key) => {
        let nextSort = next?.[key] as number;
        let preSort = prev?.[key] as number;
        if (sorter[key] === 'descend') {
          if (preSort - nextSort > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }
          return;
        }
        if (preSort - nextSort > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }
  if (params.filter) {
    const filter = JSON.parse(params.filter as any) as {
      [key: string]: string[];
    };
    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return (Object.keys(filter) as Array<keyof AuthorizationManagementAPI.UserListItem>).some(
          (key) => {
            if (!filter[key]) {
              return true;
            }
            if (filter[key].includes(`${item[key]}`)) {
              return true;
            }
            return false;
          },
        );
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data?.name?.includes(params.name || ''));
  }
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, account, name, dept, key } = body;
  console.log('body', body);
  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.key) === -1);
      break;
    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule: API.RuleListItem = {
          key: tableListDataSource.length,
          href: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          name,
          owner: '曲丽丽',
          desc,
          callNo: Math.floor(Math.random() * 1000),
          status: Math.floor(Math.random() * 10) % 2,
          updatedAt: moment().format('YYYY-MM-DD'),
          createdAt: moment().format('YYYY-MM-DD'),
          progress: Math.ceil(Math.random() * 100),
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;
    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.key === key) {
            newRule = { ...item, dept, name, account };
            return { ...item, dept, name, account };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    case 'put':

    default:
      break;
  }

  const result = {
    success: true,
    code: 200,
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

// function updateRuleStatus(req: Request, res: Response) {
//   const { key, status } = req.body;
//   tableListDataSource = tableListDataSource.map((item) => {
//     if (item.key === key) {
//       item.status = status;
//     }
//     return item;
//   });
//   return res.json({ status: 'ok' });
// }

function getRoleList(req: Request, res: Response, u: string) {
  const result = {
    data: [
      {
        value: '1',
        label: '超级管理员',
        desc: '拥有所有权限',
      },
      {
        value: '2',
        label: '管理员',
        desc: '拥有部分权限',
      },
      {
        value: '3',
        label: '普通用户',
        desc: '拥有部分权限',
      },
      {
        value: '4',
        label: '知识管理员',
        desc: '拥有部分权限',
      },
      {
        value: '5',
        label: '知识编辑员',
        desc: '拥有部分权限',
      },
      {
        value: '6',
        label: '知识查看员',
        desc: '拥有部分权限',
      },
    ],
    total: 3,
    success: true,
  };

  return res.json(result);
}

export default {
  'GET /api/getUserAuthMgData': getRule,
  'POST /api/rule': postRule,
  'get /api/getRoleList': getRoleList,
  'PUT /api/updateUserMessage': postRule,
};
