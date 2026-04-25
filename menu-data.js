// 菜单数据文件：以后加菜、改价格、换图片，主要改这里。
// 图片建议放到 images 文件夹，然后写 image: "images/xxx.jpg"
// 如果图片不存在，页面会自动显示“暂无图片”。

window.MENU_DATA = [
  {
    id: "cold",
    name: "凉菜",
    dishes: [
      {
        id: "cold_paihuanggua",
        name: "拍黄瓜",
        desc: "蒜香清爽，开胃必点",
        price: 12,
        image: "images/paihuanggua.jpg",
        tag: "清爽",
        favorite: true
      },
      {
        id: "cold_koushuiji",
        name: "口水鸡",
        desc: "麻辣鲜香，适合想吃点辣",
        price: 28,
        image: "images/koushuiji.jpg",
        tag: "微辣",
        favorite: false
      },
      {
        id: "cold_liangbanmuer",
        name: "凉拌木耳",
        desc: "酸辣爽口，低负担",
        price: 16,
        image: "images/liangbanmuer.jpg",
        tag: "爽口",
        favorite: false
      }
    ]
  },
  {
    id: "hot",
    name: "热菜",
    dishes: [
      {
        id: "hot_fanqiechaodan",
        name: "番茄炒蛋",
        desc: "家常口味，不容易出错",
        price: 22,
        image: "images/fanqiechaodan.jpg",
        tag: "家常",
        favorite: true
      },
      {
        id: "hot_gongbaojiding",
        name: "宫保鸡丁",
        desc: "甜辣口，下饭很稳",
        price: 32,
        image: "images/gongbaojiding.jpg",
        tag: "下饭",
        favorite: true
      },
      {
        id: "hot_hongshaopaigu",
        name: "红烧排骨",
        desc: "今晚硬菜，适合奖励自己",
        price: 48,
        image: "images/hongshaopaigu.jpg",
        tag: "硬菜",
        favorite: false
      },
      {
        id: "hot_qingchaoshishu",
        name: "清炒时蔬",
        desc: "清淡一点，搭配肉菜刚好",
        price: 20,
        image: "images/qingchaoshishu.jpg",
        tag: "清淡",
        favorite: false
      }
    ]
  },
  {
    id: "staple",
    name: "主食",
    dishes: [
      {
        id: "staple_mifan",
        name: "米饭",
        desc: "一碗香喷喷白米饭",
        price: 3,
        image: "images/mifan.jpg",
        tag: "主食",
        favorite: true
      },
      {
        id: "staple_congyoubanmian",
        name: "葱油拌面",
        desc: "香而不腻，简单满足",
        price: 18,
        image: "images/congyoubanmian.jpg",
        tag: "面食",
        favorite: false
      },
      {
        id: "staple_jiaozi",
        name: "饺子",
        desc: "12 个，适合不想配菜时",
        price: 26,
        image: "images/jiaozi.jpg",
        tag: "饱腹",
        favorite: false
      }
    ]
  },
  {
    id: "soup",
    name: "汤饮",
    dishes: [
      {
        id: "soup_zicaidanhua",
        name: "紫菜蛋花汤",
        desc: "热乎乎，暖胃",
        price: 12,
        image: "images/zicaidanhua.jpg",
        tag: "热汤",
        favorite: true
      },
      {
        id: "drink_suanmeitang",
        name: "酸梅汤",
        desc: "解腻，冰镇更好喝",
        price: 10,
        image: "images/suanmeitang.jpg",
        tag: "饮品",
        favorite: false
      }
    ]
  }
];
