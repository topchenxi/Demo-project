define(['app'], function(app) {
  //组件菜单
  app.constant('menus', [{
    'id': 1,
    'name': 'base',
    'items': [{
      "id": 0,
      "name": "Class",
      "url": "Class",
      "desc": "提供 OOP 实现",
      "isFinish": true
    }, {
      "id": 1,
      "name": "Base",
      "url": "Base",
      "desc": "抽出每个组件的公共方法,规范组件开发方式",
      "isFinish": true
    }, {
      "id": 2,
      "name": "event",
      "url": "event",
      "desc": "为组件添加发布/通知设计模式",
      "isFinish": true
    }]
  }, {
    'id': 1,
    'name': "util",
    'items': [{
        "id": 1,
        "name": "cookie",
        "url": "cookie",
        "desc": "提供cookie操作方法",
        "isFinish": true
      }, {
        "id": 2,
        "name": "template",
        "url": "template",
        "desc": "模板渲染,一些ajax，ui控件的渲染",
        "isFinish": true
      }, {
        "id": 3,
        "name": "upload",
        "url": "upload",
        "desc": "上传，提供h5与falsh方式",
        "isFinish": true
      }, {
        "id": 4,
        "name": "md5",
        "url": "md5",
        "desc": "加密",
        "isFinish": true
      }, {
        "id": 5,
        "name": "validation",
        "url": "validation",
        "desc": "表单验证",
        "isFinish": true
      }, {
        "id": 6,
        "name": "delayload",
        "url": "delayload",
        "desc": "延迟加载",
        "isFinish": false
      }, {
        "id": 7,
        "name": "highcharts",
        "url": "highcharts",
        "desc": "图表库",
        "isFinish": true
      }, {
        "id": 8,
        "name": "umeditor",
        "url": "umeditor",
        "desc": "编辑器",
        "isFinish": true
      },
      // {
      //   "id" : 9,
      //"name":
      //   "url" : "rq",
      //   "desc" : "生成二维码",
      //   "isFinish" : false
      // },
      // {
      //   "id" : 10,
      //"name":
      //   "url" : "browser",
      //   "desc" : "浏览器升级提示",
      //   "isFinish" : false
      // },
      // {
      //   "id" : 13,
      //   "name":"req",
      //   "url" : "req",
      //   "desc" : "获取路径的参数",
      //   "isFinish" : true
      // },
      {
        "id": 15,
        "name": "tools",
        "url": "tools",
        "desc": "工具函数",
        "isFinish": true
      }
    ]
  }, {
    'id': 3,
    'name': "ui",
    'items': [

      // {
      //   "id" : 1,
      //   "name":"tab",
      //   "url" : "tab",
      //   "desc" : "选项卡",
      //   "isFinish" : false
      // },
      {
        "id": 2,
        "name": "calendar",
        "url": "calendar",
        "desc": "日历",
        "isFinish": true
      },
      // {
      //   "id" : 3,
      //   "name": "seaImg",
      //   "url" : "seaImg",
      //   "desc" : "看图模式的幻灯片",
      //   "isFinish" : true
      // },
      {
        "id": 4,
        "name": "layer",
        "url": "layer",
        "desc": "弹窗",
        "isFinish": true
      }, {
        "id": 5,
        "name": "superslide",
        "url": "superslide",
        "desc": "幻灯片",
        "isFinish": true
      }, {
        "id": 6,
        "name": "jqzoom",
        "url": "jqzoom",
        "desc": "放大镜",
        "isFinish": true
      }, {
        "id": 7,
        "name": "webupload",
        "url": "webupload",
        "desc": "上传控件",
        "isFinish": true
      }, {
        "id": 8,
        "name": "selectCategory",
        "url": "selectCategory",
        "desc": "类目选择器",
        "isFinish": true
      }
    ]
  }]);

  //css
  app.constant('css', [{
    'id': 1,
    'name': '基本样式',
    'items': [{
      'id': 11,
      'name': '样式统一',
      'url': 'reset',
      'desc': '统一元素在各个浏览默认效果'
    }, {
      'id': 12,
      'name': '文字排版',
      'url': 'type',
      'desc': '文字排版'
    }, {
      'id': 13,
      'name': '辅助类',
      'url': 'assist',
      'desc': '一些明确功能的css'
    }]
  }, {
    'id': 2,
    'name': '布局',
    'items': [{
      'id': 21,
      'name': '网格',
      'url': 'grid'
    }, {
      'id': 22,
      'name': '布局系统',
      'url': 'layout'
    }]
  }, {
    'id': 3,
    'name': 'HTML',
    'items': [{
      'id': 31,
      'name': '按钮',
      'url': 'btn'
    }, {
      'id': 32,
      'name': '表格',
      'url': 'table'
    }, {
      'id': 33,
      'name': '表单',
      'url': 'form'
    }]
  }, {
    'id': 4,
    'name': '组件',
    'items': [{
      'id': 41,
      'name': '分页',
      'url': 'pagination'
    }, {
      'id': 42,
      'name': '面包屑',
      'url': 'breadcrumbs'
    }, {
      'id': 43,
      'name': '选项卡头部',
      'url': 'tab'
    }, {
      'id': 44,
      'name': '进度条',
      'url': 'progress'
    }, {
      'id': 45,
      'name': '提示信息',
      'url': 'hint'
    }]
  }]);

  // bolg
  app.constant('blog', [
    {
      'id': 1,
      'name': '只言片语',
      'items': [{
        'id': 14,
        'name': 'javascript编码规范',
        'url': 'javascript',
        'desc': 'javascript编码规范'
      }, {
        'id': 15,
        'name': 'css编码规范',
        'url': 'css',
        'desc': 'css编码规范'
      }, {
        'id': 11,
        'name': '前端代码规范',
        'url': 'standard',
        'desc': '开发规范'
      }, {
        'id': 12,
        'name': '前端开发方式',
        'url': 'structure',
        'desc': '代码组织'
      }, {
        'id': 13,
        'name': '开发模板',
        'url': 'dev',
        'desc': '代码组织'
      }]
    }
  ]);
});