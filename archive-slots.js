/* 档案字段拆分 —— 由 _dev/split-worn.js 生成，2026-11-09
   worn=穿戴 → 「身着…」；body=身体特征 → 外貌；carries=随身物 → 「随身带着…」；abstract=抽象属性 → 不进提示词
   撤销：删掉 index.html 里的 script 标签 */
(function () {
  if (typeof KW_DB === 'undefined') return;
  var SLOTS = {
  "老人": {
    "worn": "深色粗布棉袄，旧布鞋，腰系布带",
    "body": "",
    "carries": "一根木手杖",
    "abstract": ""
  },
  "老者": {
    "worn": "灰白长袍，宽袖，布鞋，旧玉牌",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "少年": {
    "worn": "洗得发白的衬衫，短裤，旧帆布鞋",
    "body": "",
    "carries": "单肩背布包",
    "abstract": ""
  },
  "少女": {
    "worn": "浅色连衣裙或校服，白色帆布鞋，发绳",
    "body": "",
    "carries": "细带挎包",
    "abstract": ""
  },
  "孩童": {
    "worn": "彩色小背心，短裤，小布鞋",
    "body": "",
    "carries": "玩具",
    "abstract": ""
  },
  "旅人": {
    "worn": "灰褐色斗篷，旧皮靴",
    "body": "",
    "carries": "帆布行囊，水囊，绳索",
    "abstract": ""
  },
  "工匠": {
    "worn": "深色工作围裙，卷起的袖口，粗布裤，护目镜",
    "body": "",
    "carries": "工具袋",
    "abstract": ""
  },
  "琴师": {
    "worn": "素色交领长衫，宽袖，玉簪",
    "body": "",
    "carries": "琴囊，香炉",
    "abstract": ""
  },
  "乞丐": {
    "worn": "破旧打满补丁的衣袍，草绳束腰，赤脚或破鞋",
    "body": "",
    "carries": "一只旧碗",
    "abstract": ""
  },
  "掌柜": {
    "worn": "绸缎长衫，马褂，圆口布鞋，腰间钱袋",
    "body": "",
    "carries": "算盘",
    "abstract": ""
  },
  "僧人": {
    "worn": "灰色僧袍，袈裟，布鞋，念珠",
    "body": "",
    "carries": "钵盂",
    "abstract": ""
  },
  "古风侠客": {
    "worn": "白色或深蓝长袍，皮质护腕，腰间悬玉佩，发束银冠，长靴踏风",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "仙侠修士": {
    "worn": "青衫白袍层叠，腰间悬剑，玉簪束发",
    "body": "",
    "carries": "手持拂尘",
    "abstract": ""
  },
  "赛博改造人": {
    "worn": "外露仿生义肢，全身模块化装甲板，数据线缆缠绕",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "暗黑骑士": {
    "worn": "漆黑全身板甲，尖刺护肩，残破披风，骷髅纹章",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "二次元少女": {
    "worn": "水手服或JK制服，蝴蝶结发饰，过膝袜",
    "body": "",
    "carries": "斜挎学生包",
    "abstract": ""
  },
  "写实人物": {
    "worn": "日常便装或职业装束，面料质感真实可辨，配饰低调简约不张扬",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "蒸汽朋克角色": {
    "worn": "皮质背带交错，黄铜齿轮装饰满身，怀表链垂挂",
    "body": "",
    "carries": "蒸汽背包轰鸣",
    "abstract": ""
  },
  "哥特角色": {
    "worn": "黑色蕾丝高领礼服，银质十字架项链，红宝石戒指，蝙蝠纹章袖扣",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "水墨人物": {
    "worn": "宽袍大袖以墨色浓淡渐变，山石花鸟点缀其间",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "概念角色": {
    "worn": "机能风装备体系，异形装甲外壳，符文纹身",
    "body": "",
    "carries": "能量武器蓄势",
    "abstract": ""
  },
  "忍者": {
    "worn": "黑色夜行衣紧身，手里剑囊袋",
    "body": "",
    "carries": "短刀，烟雾弹，锁链镰刀",
    "abstract": ""
  },
  "精灵": {
    "worn": "绿叶与藤蔓编织的服饰，藤蔓护腕，月光石吊坠",
    "body": "",
    "carries": "精灵长弓",
    "abstract": ""
  },
  "机器人": {
    "worn": "钛合金外壳覆盖，外露电路与冷却管线，能量核心发出幽蓝光芒",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "魔法师": {
    "worn": "华丽织金法袍，元素护符，魔力指环",
    "body": "",
    "carries": "上古魔力法杖，魔法书悬浮",
    "abstract": ""
  },
  "龙骑士": {
    "worn": "龙翼披风，龙晶吊坠垂于胸前",
    "body": "龙鳞铠甲覆盖全身",
    "carries": "龙枪巨盾",
    "abstract": ""
  },
  "街头少年": {
    "worn": "宽松连帽卫衣，破洞牛仔裤，棒球帽反戴，板鞋，耳机挂脖",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "旗袍美人": {
    "worn": "丝绸旗袍绣花鸟图案，珍珠耳坠摇曳，玉镯，发簪步摇轻颤",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "维京战士": {
    "worn": "毛皮披肩，锁子甲，牛角头盔，符文护身符",
    "body": "",
    "carries": "圆盾绘图腾",
    "abstract": ""
  },
  "未来战士": {
    "worn": "动力外骨骼装甲，纳米装甲涂层泛光",
    "body": "",
    "carries": "能量步枪，战术背包",
    "abstract": ""
  },
  "猎人": {
    "worn": "兽皮披风裹身，兽骨项链，迷彩伪装斗篷",
    "body": "",
    "carries": "复合弓，猎刀",
    "abstract": ""
  },
  "骷髅亡灵": {
    "worn": "古老锈蚀板甲覆骨，残破裹尸布为披风，骨制肩甲，魂匣项链",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "火焰法师": {
    "worn": "火焰符文法袍，熔岩水晶吊坠，火焰护腕",
    "body": "",
    "carries": "凤凰羽毛法杖",
    "abstract": ""
  },
  "精灵弓箭手": {
    "worn": "绿叶藤蔓编织的轻甲，月光石护符",
    "body": "",
    "carries": "精灵长弓铭刻符文，魔法箭袋",
    "abstract": ""
  },
  "兽人战士": {
    "worn": "兽皮战裙，骨制护甲，战利品骷髅挂饰，部落图腾纹身",
    "body": "",
    "carries": "巨型战斧",
    "abstract": ""
  },
  "天使": {
    "worn": "金色圣光铠甲",
    "body": "洁白羽翼层层展开",
    "carries": "圣剑燃烧圣火",
    "abstract": "神圣光环"
  },
  "恶魔": {
    "worn": "巨大弯角，熔岩纹路",
    "body": "漆黑鳞甲，恶魔翅膀",
    "carries": "地狱火链",
    "abstract": ""
  },
  "吸血鬼": {
    "worn": "黑色高领礼服，银质十字架，红宝石戒指，蝙蝠纹章",
    "body": "",
    "carries": "古堡钥匙",
    "abstract": ""
  },
  "矮人铁匠": {
    "worn": "皮质铁匠围裙，防火手套，矿石项链",
    "body": "",
    "carries": "巨锤，铁砧，符文锻造锤",
    "abstract": ""
  },
  "幽灵鬼魂": {
    "worn": "半透明灵体，残破的生前衣物",
    "body": "",
    "carries": "锁链拖曳",
    "abstract": ""
  },
  "狼人": {
    "worn": "灰色皮毛覆盖全身，撕裂的人类衣物残片，银制镣铐断裂",
    "body": "利爪",
    "carries": "",
    "abstract": ""
  },
  "骑士": {
    "worn": "抛光钢制板甲配家族纹章，飘逸披风，羽饰头盔",
    "body": "",
    "carries": "佩剑，鸢盾",
    "abstract": ""
  },
  "剑士": {
    "worn": "轻便战斗服饰，护臂，飘逸衣袖，皮革绑带",
    "body": "",
    "carries": "腰间佩剑，剑鞘",
    "abstract": ""
  },
  "刺客": {
    "worn": "暗色兜帽斗篷，袖剑护腕，匕首鞘，暗色皮甲",
    "body": "",
    "carries": "绳镖，烟雾弹",
    "abstract": ""
  },
  "驯兽师": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "武士": {
    "worn": "传统武士甲胄，兜盔，袴，丝绸腰带，家纹",
    "body": "",
    "carries": "太刀与胁差",
    "abstract": ""
  },
  "圣骑士": {
    "worn": "银金相间的闪亮板甲，圣徽吊坠，光辉披风",
    "body": "",
    "carries": "战锤或圣剑",
    "abstract": ""
  },
  "牧师": {
    "worn": "白金色牧师袍，圣徽，念珠",
    "body": "",
    "carries": "圣典，香炉，法杖",
    "abstract": ""
  },
  "德鲁伊": {
    "worn": "树叶树皮织成的自然长袍，动物图腾，苔藓藤蔓装饰",
    "body": "鹿角头饰",
    "carries": "木杖",
    "abstract": ""
  },
  "萨满": {
    "worn": "灵性面具，兽皮，仪式彩绘",
    "body": "羽毛兽骨装饰的部落长袍",
    "carries": "图腾法杖，战鼓",
    "abstract": ""
  },
  "术士": {
    "worn": "绘有神秘符号的暗色长袍，契约护符",
    "body": "",
    "carries": "魔法书",
    "abstract": ""
  },
  "武僧": {
    "worn": "朴素僧袍，念珠，赤足，头带，武带",
    "body": "",
    "carries": "禅杖",
    "abstract": ""
  },
  "吟游诗人": {
    "worn": "色彩华丽的服饰，羽饰帽，腰间佩剑",
    "body": "",
    "carries": "鲁特琴或曼陀林，乐器，行囊",
    "abstract": ""
  },
  "盗贼": {
    "worn": "暗色皮甲，钱袋，兜帽",
    "body": "",
    "carries": "开锁工具，匕首，攀爬工具，小型弩",
    "abstract": ""
  },
  "赏金猎人": {
    "worn": "磨损的战术装备，护甲背心",
    "body": "",
    "carries": "爆能枪或左轮，抓捕装备，通缉令，绳索",
    "abstract": ""
  },
  "机械师": {
    "worn": "工作服，工具腰带，护目镜",
    "body": "",
    "carries": "扳手工具，机械零件，图纸",
    "abstract": ""
  },
  "炼金术士": {
    "worn": "绘有符号的炼金长袍，护目镜",
    "body": "",
    "carries": "药剂瓶，蒸馏器，研钵，贤者之石",
    "abstract": ""
  },
  "占星师": {
    "worn": "缀满星象图案的飘逸长袍，夜色斗篷",
    "body": "",
    "carries": "星盘，星图，水晶球",
    "abstract": ""
  },
  "预言家": {
    "worn": "飘逸长袍",
    "body": "",
    "carries": "水晶球，预言卷轴，法杖",
    "abstract": ""
  },
  "人鱼": {
    "worn": "贝壳胸饰，珍珠饰品，珊瑚配饰",
    "body": "虹彩鱼尾鳞片，飘逸长发",
    "carries": "",
    "abstract": ""
  },
  "龙人": {
    "worn": "龙纹铠甲",
    "body": "鳞片龙皮，犄角，翅膀，尾巴，利爪",
    "carries": "",
    "abstract": ""
  },
  "半人马": {
    "worn": "人身马躯，部落铠甲，狂野鬃毛",
    "body": "马尾马腿",
    "carries": "弓箭，长矛",
    "abstract": ""
  },
  "鹰身女妖": {
    "worn": "覆羽的肢体",
    "body": "鸟翼与利爪，锋利爪钩，狂野羽毛",
    "carries": "",
    "abstract": ""
  },
  "哥布林": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "地精": {
    "worn": "尖顶帽，护目镜，工具腰带，彩色衣物",
    "body": "长胡须",
    "carries": "机械小玩意",
    "abstract": ""
  },
  "巨魔": {
    "worn": "破旧衣物，巨掌",
    "body": "庞大肌肉身躯，疣状皮肤，獠牙",
    "carries": "粗制木棒",
    "abstract": ""
  },
  "食人魔": {
    "worn": "兽皮衣物，巨掌，厚甲残片",
    "body": "巨大肌肉身躯",
    "carries": "粗制巨棒或大锤",
    "abstract": ""
  },
  "石像鬼": {
    "worn": "灰色石质身躯",
    "body": "雕刻翅膀，犄角头颅，利爪",
    "carries": "",
    "abstract": ""
  },
  "木乃伊": {
    "worn": "亚麻绷带，古埃及护符，法老服饰，黄金死亡面具",
    "body": "",
    "carries": "石棺，象形文字",
    "abstract": ""
  },
  "僵尸": {
    "worn": "破旧衣物，腐烂血肉",
    "body": "苍白皮肤",
    "carries": "",
    "abstract": ""
  },
  "女巫": {
    "worn": "女巫帽，飘逸长袍，护符",
    "body": "",
    "carries": "坩埚，扫帚，魔法书，水晶球，药剂瓶",
    "abstract": ""
  },
  "猫咪": {
    "worn": "柔软绒毛，粉嫩肉垫",
    "body": "蓬松尾巴",
    "carries": "",
    "abstract": ""
  },
  "狗狗": {
    "worn": "项圈",
    "body": "柔软毛发，摇摆尾巴",
    "carries": "",
    "abstract": ""
  },
  "小鸟": {
    "worn": "",
    "body": "色彩柔和的羽毛，小巧翅膀，纤细脚爪",
    "carries": "",
    "abstract": ""
  },
  "兔子": {
    "worn": "柔软绒毛",
    "body": "长耳朵，绒球尾巴",
    "carries": "胡萝卜或绿叶菜",
    "abstract": ""
  },
  "动物": {
    "worn": "自然的动物特征",
    "body": "柔软毛发或羽毛",
    "carries": "",
    "abstract": ""
  },
  "剑圣": {
    "worn": "银边白袍，玉簪",
    "body": "",
    "carries": "符文长剑，皮革剑鞘",
    "abstract": ""
  },
  "枪手": {
    "worn": "长皮风衣，宽檐帽，子弹带，皮手套，旧皮靴",
    "body": "",
    "carries": "腰间双左轮",
    "abstract": ""
  },
  "角斗士": {
    "worn": "青铜角斗士铠甲，皮革绑带，护臂，凉鞋，桂冠",
    "body": "",
    "carries": "短剑与盾牌，渔网三叉戟",
    "abstract": ""
  },
  "将军": {
    "worn": "缀满勋章肩章的华丽军服，礼服大衣，马靴，手套，绶带",
    "body": "",
    "carries": "腰间佩剑",
    "abstract": ""
  },
  "皇帝": {
    "worn": "金龙刺绣龙袍，龙冠，玉带，层叠丝绸",
    "body": "",
    "carries": "华贵权杖，传国玉玺",
    "abstract": ""
  },
  "皇后": {
    "worn": "凤凰刺绣凤袍，金凤冠，玉珠首饰，层叠罗裙，绣花鞋",
    "body": "",
    "carries": "团扇",
    "abstract": ""
  },
  "公主": {
    "worn": "华美舞裙或宫廷礼服，皇冠，珍珠项链，丝质手套，缎面鞋，皇家披风",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "王子": {
    "worn": "金边皇家礼服，皇家徽章胸针，披风，锃亮皮靴，印章戒指",
    "body": "",
    "carries": "腰间佩剑",
    "abstract": ""
  },
  "国王": {
    "worn": "貂皮镶边王袍，金冠，华丽披风，宝石戒指",
    "body": "",
    "carries": "权杖，礼仪佩剑",
    "abstract": ""
  },
  "贵族": {
    "worn": "维多利亚或文艺复兴华服，蕾丝领巾，天鹅绒外套，宝石胸针",
    "body": "",
    "carries": "手杖，怀表",
    "abstract": ""
  },
  "商人": {
    "worn": "华美商人服饰，毛皮镶边大衣，丝绸腰带，商戒",
    "body": "",
    "carries": "钱袋，账本，天平",
    "abstract": ""
  },
  "农夫": {
    "worn": "粗布衣裳，草帽，背带裤，皮靴，日晒围裙",
    "body": "",
    "carries": "干草叉或锄头，布袋",
    "abstract": ""
  },
  "渔夫": {
    "worn": "防水油布外套，宽檐雨帽，胶靴",
    "body": "",
    "carries": "渔网，钓竿，渔具箱，盘绕绳索",
    "abstract": ""
  },
  "铁匠": {
    "worn": "皮革打铁围裙，厚重手套",
    "body": "",
    "carries": "铁锤，铁砧，火钳，风箱，煤灰，金属锭",
    "abstract": ""
  },
  "裁缝": {
    "worn": "裁缝围裙，颈挂软尺，顶针",
    "body": "",
    "carries": "针线，剪刀，布匹卷，针插",
    "abstract": ""
  },
  "厨师": {
    "worn": "白色厨师服，厨师帽，围裙，厨房巾",
    "body": "",
    "carries": "刀具组，锅铲，试味勺，铜锅",
    "abstract": ""
  },
  "医生": {
    "worn": "白大褂，颈挂听诊器，名牌，内穿手术服",
    "body": "",
    "carries": "病历夹，笔灯",
    "abstract": ""
  },
  "学者": {
    "worn": "朴素学者长袍，老花镜",
    "body": "",
    "carries": "成摞书籍，卷轴，鹅毛笔与墨水瓶，手稿袋",
    "abstract": ""
  },
  "教授": {
    "worn": "正式学术着装，粗花呢外套带肘部补丁，领带，眼镜",
    "body": "",
    "carries": "粉笔，讲义，公文包",
    "abstract": ""
  },
  "科学家": {
    "worn": "白大褂，护目镜，手套",
    "body": "",
    "carries": "记录板，试管，显微镜，烧杯，数据平板",
    "abstract": ""
  },
  "工程师": {
    "worn": "安全帽，反光背心，工作手套，工具腰带",
    "body": "",
    "carries": "图纸，测量工具，平板",
    "abstract": ""
  },
  "宇航员": {
    "worn": "白色宇航服带任务徽章，面罩头盔，操控手套，系绳，靴子",
    "body": "",
    "carries": "氧气背包",
    "abstract": ""
  },
  "飞行员": {
    "worn": "飞行服，飞行夹克，飞行帽带护目镜，围巾，飞行手套，徽章",
    "body": "",
    "carries": "降落伞",
    "abstract": ""
  },
  "船长": {
    "worn": "海军船长制服，船长帽，金边大衣，手套",
    "body": "",
    "carries": "黄铜望远镜，罗盘，哨子",
    "abstract": ""
  },
  "水手": {
    "worn": "条纹水手衫，帆布裤，绳索腰带，水手帽，靴子",
    "body": "",
    "carries": "小刀，盘绕绳索",
    "abstract": ""
  },
  "海盗": {
    "worn": "三角帽，眼罩，破旧大衣，木腿或铁钩",
    "body": "",
    "carries": "弯刀，火枪，藏宝图，金币",
    "abstract": ""
  },
  "牛仔": {
    "worn": "宽檐牛仔帽，皮马甲，方巾，牛仔裤，带马刺的靴子",
    "body": "",
    "carries": "套索，左轮手枪",
    "abstract": ""
  },
  "警长": {
    "worn": "警长帽，星形警徽，皮马甲，靴子，方巾",
    "body": "",
    "carries": "腰间左轮，手铐",
    "abstract": ""
  },
  "侦探": {
    "worn": "风衣，软呢帽，徽章，手套",
    "body": "",
    "carries": "放大镜，笔记本，烟斗",
    "abstract": ""
  },
  "特工": {
    "worn": "优雅黑西装，领带，耳机，墨镜，腕表",
    "body": "",
    "carries": "暗藏装备，公文包",
    "abstract": ""
  },
  "间谍": {
    "worn": "伪装衣物",
    "body": "",
    "carries": "隐藏相机，加密文件，开锁工具，消音手枪，伪装工具包",
    "abstract": ""
  },
  "黑客": {
    "worn": "连帽衫",
    "body": "",
    "carries": "多块屏幕，发光键盘，线缆，能量饮料，黑客工具",
    "abstract": ""
  },
  "程序员": {
    "worn": "休闲科技装束",
    "body": "",
    "carries": "笔记本电脑，多块显示器，咖啡杯，代码编辑器，机械键盘",
    "abstract": ""
  },
  "电竞选手": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "主播": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "模特": {
    "worn": "高定时装，T台高跟鞋，个性配饰，精心打理的发型",
    "body": "",
    "carries": "设计师手袋",
    "abstract": ""
  },
  "明星": {
    "worn": "设计师红毯礼服，璀璨珠宝，墨镜",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "舞者": {
    "worn": "飘逸舞衣，芭蕾舞鞋或舞服，缎带，优雅长裙，演出妆容",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "音乐家": {
    "worn": "优雅演出服",
    "body": "",
    "carries": "乐器（小提琴，钢琴，吉他），乐谱，琴弓",
    "abstract": ""
  },
  "画家": {
    "worn": "沾满颜料的罩衫，贝雷帽，沾满颜料的手",
    "body": "",
    "carries": "调色盘，画笔，画架，画布",
    "abstract": ""
  },
  "雕塑家": {
    "worn": "围裙，沾灰衣物",
    "body": "",
    "carries": "凿子，锤子，黏土，大理石料，雕塑工具，模型",
    "abstract": ""
  },
  "建筑师": {
    "worn": "安全帽，眼镜",
    "body": "",
    "carries": "图纸卷，绘图工具，比例模型，测量工具，设计平板",
    "abstract": ""
  },
  "设计师": {
    "worn": "时尚现代装束",
    "body": "",
    "carries": "设计平板，色卡，速写本，作品集，触控笔，情绪板",
    "abstract": ""
  },
  "摄影师": {
    "worn": "相机背带，摄影背心",
    "body": "",
    "carries": "专业相机，镜头包，存储卡，三脚架，摄影装备",
    "abstract": ""
  },
  "记者": {
    "worn": "记者证，职业装束，采访证",
    "body": "",
    "carries": "笔记本，笔，录音笔，相机，话筒",
    "abstract": ""
  },
  "律师": {
    "worn": "正式西装，领带，眼镜，职业装束",
    "body": "",
    "carries": "公文包，法律文件，法律书籍",
    "abstract": ""
  },
  "法官": {
    "worn": "法官袍，正式法庭装束",
    "body": "",
    "carries": "法槌，法律书籍，正义天平",
    "abstract": ""
  },
  "政治家": {
    "worn": "正式西装，领带，国旗徽章，职业装束",
    "body": "",
    "carries": "演讲稿，话筒",
    "abstract": ""
  },
  "士兵": {
    "worn": "军装，头盔，战术背心，军靴，军牌，迷彩",
    "body": "",
    "carries": "步枪，背包",
    "abstract": ""
  },
  "军官": {
    "worn": "带军衔的军官制服，勋章，大檐帽，手套",
    "body": "",
    "carries": "佩枪，指挥棒",
    "abstract": ""
  },
  "狙击手": {
    "worn": "吉利服，迷彩",
    "body": "",
    "carries": "狙击步枪，瞄准镜，两脚架，观察手装备，远程装备",
    "abstract": ""
  },
  "侦察兵": {
    "worn": "轻便战术装备，迷彩",
    "body": "",
    "carries": "望远镜，电台，军刀，野战背包，侦察装备",
    "abstract": ""
  },
  "医疗兵": {
    "worn": "红十字徽章，战斗装备，头盔",
    "body": "",
    "carries": "医疗包，绷带，医疗用品",
    "abstract": ""
  },
  "矿工": {
    "worn": "带矿灯的矿工帽，工作服，手套，靴子，安全装备",
    "body": "",
    "carries": "镐头",
    "abstract": ""
  },
  "伐木工": {
    "worn": "格子法兰绒衬衫，背带裤，工作手套，靴子，羊毛帽",
    "body": "",
    "carries": "斧头，锯子",
    "abstract": ""
  },
  "小丑": {
    "worn": "五彩小丑服，超大号鞋，红鼻头，涂彩脸，假发",
    "body": "",
    "carries": "道具，气球",
    "abstract": ""
  },
  "魔术师": {
    "worn": "高顶礼帽，斗篷",
    "body": "燕尾服或魔术师装束",
    "carries": "魔杖，扑克牌，兔子，魔术道具",
    "abstract": ""
  },
  "浪人": {
    "worn": "破旧和服，腰间太刀，斗笠，撕裂的袴，草鞋，风霜佩刀",
    "body": "",
    "carries": "行囊",
    "abstract": ""
  },
  "相扑手": {
    "worn": "传统相扑腰带，发髻，仪式围裙",
    "body": "肌肉贲张的身躯",
    "carries": "盐袋",
    "abstract": ""
  },
  "拳击手": {
    "worn": "拳击手套，缠手带，短裤，拳击鞋，护齿，战袍，发带",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "考古学家": {
    "worn": "卡其色工装夹克，宽檐探险帽，旧靴",
    "body": "",
    "carries": "皮制挎包，手铲与毛刷，绳索攀爬装备",
    "abstract": ""
  },
  "调香师": {
    "worn": "精致工坊装束，丝质手套",
    "body": "",
    "carries": "精油玻璃瓶，香水瓶，黄铜蒸馏器，干花，配方笔记",
    "abstract": ""
  },
  "珠宝匠": {
    "worn": "工匠围裙，珠宝放大镜",
    "body": "",
    "carries": "镊子，金丝，宝石，抛光布，工作台工具，放大灯",
    "abstract": ""
  },
  "钟表匠": {
    "worn": "工匠背心，钟表放大镜",
    "body": "",
    "carries": "微型螺丝刀，齿轮弹簧，怀表，工作台，镊子",
    "abstract": ""
  },
  "酿酒师": {
    "worn": "皮制围裙",
    "body": "",
    "carries": "木酒桶，酿造缸，啤酒花与谷物袋，铜锅，品酒杯，地窖工具",
    "abstract": ""
  },
  "药剂师": {
    "worn": "药剂师长袍",
    "body": "",
    "carries": "玻璃药瓶架，研钵与杵，干草药，称量秤，处方簿，药水瓶",
    "abstract": ""
  },
  "兽医": {
    "worn": "白色兽医袍",
    "body": "",
    "carries": "听诊器，动物医疗工具，绷带，检查台，宠物笼，病历",
    "abstract": ""
  },
  "消防员": {
    "worn": "防火战斗服，带面罩的头盔，反光条，手套，靴子",
    "body": "",
    "carries": "氧气瓶，消防斧，水带",
    "abstract": ""
  },
  "图书管理员": {
    "worn": "开襟毛衣或馆员装束，老花镜",
    "body": "",
    "carries": "成摞书籍，目录卡，印章，书车",
    "abstract": ""
  },
  "天文学家": {
    "worn": "天文台装束",
    "body": "",
    "carries": "望远镜，星图，天体图，笔记本，红光手电，星盘",
    "abstract": ""
  },
  "植物学家": {
    "worn": "多口袋野外背心，帽子",
    "body": "",
    "carries": "放大镜，植物压标本，标本瓶，笔记本，采集袋",
    "abstract": ""
  },
  "化学家": {
    "worn": "白色实验服，护目镜，手套",
    "body": "",
    "carries": "试管，烧杯，锥形瓶，化学试剂瓶，元素周期表",
    "abstract": ""
  },
  "历史学家": {
    "worn": "学者装束，老花镜",
    "body": "",
    "carries": "古代手稿，羽毛笔与墨水，档案盒，历史地图，书籍",
    "abstract": ""
  },
  "外交官": {
    "worn": "正式外交西装，领带，国旗徽章，礼服，手套",
    "body": "",
    "carries": "外交公文包，文件",
    "abstract": ""
  },
  "会计师": {
    "worn": "正式商务装，眼镜",
    "body": "",
    "carries": "账本，计算器，电子表格，笔，台灯，文件",
    "abstract": ""
  },
  "调酒师": {
    "worn": "调酒师背心，吧巾",
    "body": "",
    "carries": "摇酒器，调酒杯，调酒工具，酒瓶，装饰盘，量酒器",
    "abstract": ""
  },
  "花艺师": {
    "worn": "花艺围裙",
    "body": "",
    "carries": "鲜花，花泥，剪刀，缎带，包装纸，洒水壶，花瓶",
    "abstract": ""
  },
  "木匠": {
    "worn": "木匠围裙，耳后夹铅笔",
    "body": "",
    "carries": "锤子，锯子，凿子，卷尺，木板，工作台",
    "abstract": ""
  },
  "书法家": {
    "worn": "飘逸儒袍",
    "body": "",
    "carries": "毛笔，砚台，宣纸，墨锭，笔架，印章，卷轴",
    "abstract": ""
  },
  "棋手": {
    "worn": "得体着装，眼镜",
    "body": "",
    "carries": "棋盘，棋子，棋钟，棋谱笔记，台灯",
    "abstract": ""
  },
  "流浪诗人": {
    "worn": "旧旅行斗篷，围巾，旧靴",
    "body": "",
    "carries": "诗稿挎包，羽毛笔与墨水，破旧笔记本，手杖",
    "abstract": ""
  },
  "贵族千金": {
    "worn": "优雅维多利亚长裙，蕾丝手套，珍珠项链，珠宝胸针",
    "body": "羽毛帽",
    "carries": "丝扇，阳伞",
    "abstract": ""
  },
  "部落酋长": {
    "worn": "部落盛装，羽冠，骨制项链，兽皮斗篷，战彩，图腾符号",
    "body": "",
    "carries": "仪式权杖",
    "abstract": ""
  },
  "星际海盗": {
    "worn": "旧太空装甲，破旧太空斗篷，义眼",
    "body": "",
    "carries": "等离子弯刀，激光手枪，喷气背包，掠夺袋",
    "abstract": ""
  },
  "游侠": {
    "worn": "皮制游侠装，兜帽斗篷",
    "body": "",
    "carries": "长弓，箭袋，猎刀，睡袋，追踪工具",
    "abstract": ""
  },
  "佣兵": {
    "worn": "旧战斗装，带疤铠甲，钱袋，破斗篷，弹药带",
    "body": "",
    "carries": "阔剑，战损盾牌",
    "abstract": ""
  },
  "女骑士": {
    "worn": "锃亮钢制板甲，飘逸披风，羽饰头盔，护手",
    "body": "",
    "carries": "长剑，纹章鸢盾",
    "abstract": ""
  },
  "圣女": {
    "worn": "飘逸白金色长袍，圣徽，念珠",
    "body": "",
    "carries": "金色权杖",
    "abstract": ""
  },
  "修女": {
    "worn": "传统修女服，头巾，念珠，十字架吊坠，朴素装束",
    "body": "",
    "carries": "祈祷书",
    "abstract": ""
  },
  "隐士": {
    "worn": "朴素旧袍，破斗篷，麻绳腰带，旧草鞋",
    "body": "",
    "carries": "手杖，葫芦水壶",
    "abstract": ""
  },
  "贤者": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "占卜师": {
    "worn": "彩色神秘长袍，披肩，神秘珠宝",
    "body": "",
    "carries": "水晶球，塔罗牌，蜡烛，熏香",
    "abstract": ""
  },
  "驱魔人": {
    "worn": "深色教士袍，护身符，银十字",
    "body": "",
    "carries": "圣水，十字架，圣经，仪式工具",
    "abstract": ""
  },
  "阴阳师": {
    "worn": "传统阴阳师袍",
    "body": "",
    "carries": "纸符，木杖，仪式铃，式神卷轴，罗盘",
    "abstract": ""
  },
  "剑客": {
    "worn": "素净行装，斗笠，布缠手，旧靴",
    "body": "",
    "carries": "腰间长剑，行囊",
    "abstract": ""
  },
  "刀客": {
    "worn": "皮甲，护臂，布腰带，旧斗篷",
    "body": "",
    "carries": "弯刀，刀鞘，行装",
    "abstract": ""
  },
  "镖师": {
    "worn": "实用行装，旧斗篷，结实靴",
    "body": "",
    "carries": "阔刀或弯刀，镖旗，绳索，钱袋",
    "abstract": ""
  },
  "捕快": {
    "worn": "官差制服，官帽，靴子",
    "body": "",
    "carries": "佩刀，令牌，镣铐，拘票文书",
    "abstract": ""
  },
  "军师": {
    "worn": "儒袍",
    "body": "",
    "carries": "羽扇，沙盘地图，兵法卷轴，棋盘，笔墨，罗盘",
    "abstract": ""
  },
  "说书人": {
    "worn": "传统说书装束",
    "body": "",
    "carries": "折扇，醒木，茶杯，小桌，故事卷轴",
    "abstract": ""
  },
  "龙裔战士": {
    "worn": "",
    "body": "龙鳞皮肤，犄角，尾巴，利爪，龙鳞甲",
    "carries": "龙纹武器",
    "abstract": ""
  },
  "半精灵": {
    "worn": "优雅精灵皮甲，尖耳，森林斗篷，精灵珠宝",
    "body": "飘逸长发",
    "carries": "长弓",
    "abstract": ""
  },
  "半兽人": {
    "worn": "部落甲，毛皮斗篷，战彩",
    "body": "肌肉发达，獠牙下颚，微绿皮肤",
    "carries": "战斧",
    "abstract": ""
  },
  "暗精灵": {
    "worn": "暗色优雅甲，黑斗篷，幽光眼眸，银发",
    "body": "",
    "carries": "双匕首",
    "abstract": ""
  },
  "树精": {
    "worn": "叶藤衣裳，苔藓发丝，幽光眼眸，花冠",
    "body": "树皮纹理皮肤",
    "carries": "木杖",
    "abstract": ""
  },
  "石巨人": {
    "worn": "巨大石躯，雕刻符文，青苔裂纹，发光核心，巨拳",
    "body": "",
    "carries": "古老建筑",
    "abstract": ""
  },
  "树人": {
    "worn": "巨大树躯，枝干手臂，叶冠，青苔，幽光眼眸，树根足",
    "body": "树皮皮肤",
    "carries": "",
    "abstract": ""
  },
  "狐妖": {
    "worn": "飘逸长袍，幽光眼眸，狐面具，优雅珠宝",
    "body": "狐耳狐尾",
    "carries": "",
    "abstract": ""
  },
  "猫妖": {
    "worn": "紧身暗色衣，幽光眼眸，铃铛项圈",
    "body": "猫耳猫尾，利爪",
    "carries": "",
    "abstract": ""
  },
  "蛇妖": {
    "worn": "蛇形下身，飘逸长袍，幽光眼眸，蛇形珠宝",
    "body": "鳞甲皮肤",
    "carries": "",
    "abstract": ""
  },
  "鱼人": {
    "worn": "鳍，鳃，蹼手，珍珠饰，珊瑚甲",
    "body": "鳞甲皮肤",
    "carries": "水生装备，三叉戟",
    "abstract": ""
  },
  "蜥蜴人": {
    "worn": "部落甲，部落纹身，爬行眼眸",
    "body": "鳞甲皮肤，尾巴，利爪",
    "carries": "骨制武器",
    "abstract": ""
  },
  "牛头人": {
    "worn": "牛首，魁梧身躯，巨角，部落甲，毛皮斗篷，蹄足",
    "body": "",
    "carries": "巨斧",
    "abstract": ""
  },
  "狮鹫骑士": {
    "worn": "轻甲，防风镜，羽饰斗篷",
    "body": "",
    "carries": "狮鹫鞍，长矛，骑具，空中挽具",
    "abstract": ""
  },
  "独角兽骑士": {
    "worn": "银白铠甲，飘逸披风，圣徽",
    "body": "",
    "carries": "独角兽鞍，发光长矛",
    "abstract": ""
  },
  "凤凰骑士": {
    "worn": "绯金铠甲，凤凰纹章，凤凰羽披风",
    "body": "",
    "carries": "焰尖长剑",
    "abstract": ""
  },
  "花妖": {
    "worn": "花瓣衣裳，绽放发丝，花饰珠宝，叶翼，露珠点缀",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "鸟人": {
    "worn": "轻甲，羽饰斗篷",
    "body": "羽翼，爪足",
    "carries": "天空装备",
    "abstract": ""
  },
  "蛙人": {
    "worn": "绿肤，蹼手，大眼，水生装备，荷叶点缀，部落纹身",
    "body": "",
    "carries": "长矛",
    "abstract": ""
  },
  "铁傀儡": {
    "worn": "巨大铁躯，铆接甲板，发光核心，重拳，古老符文，铁甲",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "雷神": {
    "worn": "威严神甲，雷电纹章，风暴斗篷，发光符文",
    "body": "",
    "carries": "战锤",
    "abstract": ""
  },
  "月神": {
    "worn": "银色飘逸长袍，月牙冠，月长石珠宝，星光纱",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "海妖": {
    "worn": "贝壳饰，幽光眼眸，珍珠珠宝",
    "body": "虹彩鳞片，飘逸长发",
    "carries": "",
    "abstract": ""
  },
  "凤凰使者": {
    "worn": "绯金长袍，凤凰羽，焰纹，光辉之翼，余烬点缀",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "太阳神": {
    "worn": "金色神甲，太阳冠，太阳纹章",
    "body": "",
    "carries": "金权杖",
    "abstract": ""
  },
  "战神": {
    "worn": "战损神甲，战疤，血红披风",
    "body": "",
    "carries": "巨剑，战利品",
    "abstract": ""
  },
  "死神": {
    "worn": "暗色兜帽斗篷，幽光眼眸，骷髅特征",
    "body": "",
    "carries": "镰刀，魂灯",
    "abstract": ""
  },
  "冥王": {
    "worn": "暗色王袍，黑曜石王冠",
    "body": "",
    "carries": "灵魂权杖",
    "abstract": ""
  },
  "爱神": {
    "worn": "优雅神袍，心形纹章，玫瑰点缀",
    "body": "",
    "carries": "金弓",
    "abstract": ""
  },
  "命运女神": {
    "worn": "飘逸神秘长袍，发光符文，天象符号",
    "body": "",
    "carries": "命运之线，纺车",
    "abstract": ""
  },
  "丰收女神": {
    "worn": "飘逸金袍，麦穗冠，丰收纹章，花饰",
    "body": "",
    "carries": "丰饶之角",
    "abstract": ""
  },
  "风神": {
    "worn": "飘逸风袍，风纹章，羽饰，轻盈斗篷，风暴纹章",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "火神": {
    "worn": "绯红神甲，火冠",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "山神": {
    "worn": "土石长袍，山冠，古老纹章，苔藓点缀",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "河神": {
    "worn": "流水长袍，河冠，水生纹章，珍珠点缀，波浪纹",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "星神": {
    "worn": "星光长袍，星冠，发光星座，宇宙纹章，星纱",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "龙神": {
    "worn": "龙冠，龙纹章",
    "body": "龙鳞神袍",
    "carries": "",
    "abstract": ""
  },
  "麒麟": {
    "worn": "独角，飘逸鬃毛，蹄足，祥瑞纹章",
    "body": "鳞甲身躯",
    "carries": "",
    "abstract": ""
  },
  "玄武": {
    "worn": "龟甲，古老纹章，苔藓点缀",
    "body": "暗鳞",
    "carries": "",
    "abstract": ""
  },
  "天狗": {
    "worn": "红面，长鼻，天狗袍",
    "body": "羽翼",
    "carries": "团扇，山间装备",
    "abstract": ""
  },
  "赛车手": {
    "worn": "赛车服，头盔，手套，赛车靴，赞助装备",
    "body": "",
    "carries": "方向盘，方格旗",
    "abstract": ""
  },
  "网红": {
    "worn": "潮流时装",
    "body": "",
    "carries": "环形灯，智能手机，相机，品牌周边，社交媒体装备",
    "abstract": ""
  },
  "博主": {
    "worn": "时尚休闲装",
    "body": "",
    "carries": "笔记本，相机，笔记本，咖啡，写作工具",
    "abstract": ""
  },
  "健身教练": {
    "worn": "运动装，训练手套",
    "body": "",
    "carries": "哨子，秒表，水壶，毛巾，健身器材",
    "abstract": ""
  },
  "钢琴家": {
    "worn": "优雅演出服，领结",
    "body": "",
    "carries": "三角钢琴，乐谱，琴凳，舞台灯光",
    "abstract": ""
  },
  "小提琴家": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "吉他手": {
    "worn": "摇滚装，背带",
    "body": "",
    "carries": "电吉他或木吉他，拨片，音箱，舞台装备",
    "abstract": ""
  },
  "鼓手": {
    "worn": "摇滚装，耳机",
    "body": "",
    "carries": "鼓组，鼓棒，镲片，舞台装备，鼓凳",
    "abstract": ""
  },
  "指挥家": {
    "worn": "优雅演出服，领结，白手套",
    "body": "燕尾服",
    "carries": "指挥棒，乐谱，指挥台",
    "abstract": ""
  },
  "作曲家": {
    "worn": "优雅装束",
    "body": "",
    "carries": "钢琴，乐谱，作曲笔记，羽毛笔或钢笔，节拍器",
    "abstract": ""
  },
  "小说家": {
    "worn": "舒适写作装，老花镜",
    "body": "",
    "carries": "打字机或笔记本，手稿，咖啡，笔记本",
    "abstract": ""
  },
  "诗人": {
    "worn": "",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "美食家": {
    "worn": "优雅用餐装",
    "body": "",
    "carries": "笔记本，笔，酒杯，品鉴勺",
    "abstract": ""
  },
  "品酒师": {
    "worn": "优雅装束，品酒围裙",
    "body": "",
    "carries": "酒杯，酒瓶，品鉴笔记，开瓶器",
    "abstract": ""
  },
  "茶艺师": {
    "worn": "优雅茶服",
    "body": "",
    "carries": "茶具，茶壶，茶杯，茶叶，竹筅，茶桌",
    "abstract": ""
  },
  "策展人": {
    "worn": "优雅装束，眼镜",
    "body": "",
    "carries": "展览目录，展馆地图，记录板，艺术品",
    "abstract": ""
  },
  "收藏家": {
    "worn": "优雅装束，手套",
    "body": "",
    "carries": "放大镜，目录",
    "abstract": ""
  },
  "法医": {
    "worn": "白色实验服，手套",
    "body": "",
    "carries": "显微镜，证物袋，法医工具，记录板，实验室设备",
    "abstract": ""
  },
  "心理医生": {
    "worn": "专业装束，眼镜",
    "body": "",
    "carries": "笔记本，笔，书籍，治疗工具",
    "abstract": ""
  },
  "化妆师": {
    "worn": "",
    "body": "",
    "carries": "化妆箱，刷具，调色盘，镜子，化妆椅，化妆品，影棚灯光",
    "abstract": ""
  },
  "漫画家": {
    "worn": "",
    "body": "",
    "carries": "画桌，墨笔，漫画纸，网点纸，参考书，数位板，绘画工具",
    "abstract": ""
  },
  "插画师": {
    "worn": "",
    "body": "",
    "carries": "画布，画笔，调色盘，数位板，速写本，画材，画架",
    "abstract": ""
  },
  "动画师": {
    "worn": "",
    "body": "",
    "carries": "绘图板，透写台，参考帧，电脑，分镜，动画工具",
    "abstract": ""
  },
  "创业者": {
    "worn": "商务休闲装",
    "body": "",
    "carries": "笔记本，商业计划书，咖啡，演示材料，手机",
    "abstract": ""
  },
  "投资人": {
    "worn": "正式商务装，眼镜",
    "body": "",
    "carries": "金融图表，笔记本，文件，计算器",
    "abstract": ""
  },
  "经济学家": {
    "worn": "专业装束，眼镜",
    "body": "",
    "carries": "图表，报告，笔记本，书籍",
    "abstract": ""
  },
  "数据分析师": {
    "worn": "专业装束，眼镜",
    "body": "",
    "carries": "电脑，图表，仪表盘，报告",
    "abstract": ""
  },
  "无人机飞行员": {
    "worn": "科技装束，护目镜，飞行装备",
    "body": "",
    "carries": "无人机，遥控器，平板，安全设备",
    "abstract": ""
  },
  "摩托车手": {
    "worn": "皮骑行服，头盔，手套，靴子，骑行装备，护目镜",
    "body": "",
    "carries": "摩托车",
    "abstract": ""
  },
  "卡车司机": {
    "worn": "休闲工装，帽子，手套",
    "body": "",
    "carries": "卡车钥匙，行车日志，咖啡，公路装备",
    "abstract": ""
  },
  "领航员": {
    "worn": "航海装束",
    "body": "",
    "carries": "罗盘，六分仪，海图，望远镜，航海日志，导航工具",
    "abstract": ""
  },
  "特警": {
    "worn": "战术装备，头盔，防弹背心，耳麦，战术靴，手套",
    "body": "",
    "carries": "步枪，盾牌",
    "abstract": ""
  },
  "刑警": {
    "worn": "专业装束，警徽",
    "body": "",
    "carries": "笔记本，手铐，证物袋，案卷，放大镜",
    "abstract": ""
  },
  "保镖": {
    "worn": "黑色西装，耳麦，墨镜，防护装备，正式装束",
    "body": "",
    "carries": "隐蔽武器，对讲机",
    "abstract": ""
  },
  "私家侦探": {
    "worn": "风衣，软呢帽，徽章",
    "body": "",
    "carries": "笔记本，相机，放大镜，乔装装备",
    "abstract": ""
  },
  "摔跤手": {
    "worn": "摔跤紧身衣，冠军腰带，摔跤靴，护膝，擂台装备",
    "body": "",
    "carries": "",
    "abstract": ""
  },
  "击剑手": {
    "worn": "击剑服，面罩，手套，护胸，击剑鞋",
    "body": "",
    "carries": "花剑或重剑",
    "abstract": ""
  },
  "登山家": {
    "worn": "头盔，保暖层，护目镜",
    "body": "冰爪",
    "carries": "攀岩装备，冰镐，绳索，背包",
    "abstract": ""
  },
  "探险家": {
    "worn": "卡其装，帽子",
    "body": "",
    "carries": "远征装备，背包，罗盘，地图，砍刀，望远镜",
    "abstract": ""
  },
  "潜水员": {
    "worn": "潜水服，面镜，脚蹼，湿衣，潜水电脑",
    "body": "",
    "carries": "氧气瓶，水下装备",
    "abstract": ""
  }
};
  var n = 0;
  for (var name in SLOTS) {
    var c = KW_DB.character && KW_DB.character.categories && KW_DB.character.categories[name];
    if (!c) continue;
    c.zh = c.zh || {};
    var s = SLOTS[name];
    if (s.worn) { c.zh.worn = s.worn; c.zh.detail = s.worn; }
    if (s.carries) c.zh.carries = s.carries;
    if (s.body) c.zh.body = s.body;
    n++;
  }
  window.__archiveSlotCount = n;
})();