// 题库：1-3 级日常句子；4-6 级为 X(Twitter) 上真实分享的 AI 提示词（src 记录作者与原帖；note: tr=英译中, adapt=节选/改写）
window.PROMPTS = [
{
"id": "s01",
"level": 1,
"text": "今天天气很好"
},
{
"id": "s02",
"level": 1,
"text": "我想喝一杯咖啡"
},
{
"id": "s03",
"level": 1,
"text": "明天早上九点开会"
},
{
"id": "s04",
"level": 1,
"text": "帮我打开这个文件"
},
{
"id": "s05",
"level": 1,
"text": "这个方案可以再改一下"
},
{
"id": "s06",
"level": 1,
"text": "周末我们去爬山吧"
},
{
"id": "s07",
"level": 1,
"text": "请把灯关掉"
},
{
"id": "s08",
"level": 1,
"text": "我已经到公司楼下了"
},
{
"id": "m01",
"level": 2,
"text": "你好，请问今天下午有空吗？我想约你聊一下项目进度。"
},
{
"id": "m02",
"level": 2,
"text": "这份报告写得不错，但是第三部分的数据需要再核对一遍。"
},
{
"id": "m03",
"level": 2,
"text": "如果明天下雨，我们就改成线上会议，好吗？"
},
{
"id": "m04",
"level": 2,
"text": "快递已经到了，放在门口的柜子里，记得去拿。"
},
{
"id": "m05",
"level": 2,
"text": "先别急着发布，等测试通过以后再说。"
},
{
"id": "m06",
"level": 2,
"text": "晚饭想吃什么？火锅、烧烤，还是简单点吃面？"
},
{
"id": "m07",
"level": 2,
"text": "我刚看了一下，服务器的内存占用有点高，需要排查。"
},
{
"id": "m08",
"level": 2,
"text": "谢谢你的帮忙，这周五我请你吃饭。"
},
{
"id": "l01",
"level": 3,
"text": "这次活动的目标是提高新用户的留存率。我们计划在第一周给新用户推送三条引导消息，分别介绍核心功能、常见问题和会员权益，然后根据点击数据调整内容。"
},
{
"id": "l02",
"level": 3,
"text": "我昨天把耳机的线控键改成了语音输入快捷键。现在只要按一下中间键就能说话，再按一下就结束，上键删除，下键回车，基本不用碰键盘了。"
},
{
"id": "l03",
"level": 3,
"text": "关于下个季度的预算，我建议把一部分市场费用转到产品研发上。原因有两个：第一，现有用户的反馈主要集中在功能缺失；第二，广告投放的转化率已经连续下降。"
},
{
"id": "l04",
"level": 3,
"text": "周六的聚会改到晚上七点，地点还是上次那家餐厅。人比较多，我已经订了一个包间，大家记得提前十分钟到，不要迟到。"
},
{
"id": "l05",
"level": 3,
"text": "读书最重要的不是读了多少本，而是有没有真正理解和思考。每读完一章，可以试着用自己的话总结一下，再想想它和自己的生活有什么联系。"
},
{
"id": "l06",
"level": 3,
"text": "早上出门前，先检查一下钥匙、手机和钱包。如果要坐地铁，最好提前看一下线路，避开高峰时段，这样能节省不少时间。"
},
{
"id": "x06",
"level": 4,
"text": "检查项目中的Python代码，修复报错并给出修改说明。",
"src": {
"user": "coder_onchain",
"url": "https://x.com/coder_onchain/status/2111066746069320181",
"note": ""
}
},
{
"id": "x15",
"level": 4,
"text": "列出管理层给过的guidance原话，每条标出处段落。",
"src": {
"user": "cultman8",
"url": "https://x.com/cultman8/status/2116755481897124303",
"note": ""
}
},
{
"id": "x10",
"level": 4,
"text": "HR问我期望薪资，我想让对方先报价，给我三种不得罪人的说法。",
"src": {
"user": "iJimmyChan",
"url": "https://x.com/iJimmyChan/status/2110889425521754248",
"note": ""
}
},
{
"id": "x21",
"level": 4,
"text": "我要做年终总结，但我没头绪，你能帮我整理下做这件事的框架么？",
"src": {
"user": "Edward913413",
"url": "https://x.com/Edward913413/status/2111724237362712599",
"note": "adapt"
}
},
{
"id": "x02",
"level": 4,
"text": "不熟悉的功能别从零写，先去GitHub找开源项目对比思路再动手。",
"src": {
"user": "btcup99",
"url": "https://x.com/btcup99/status/2114765270422298992",
"note": ""
}
},
{
"id": "x11",
"level": 4,
"text": "帮我写一段接受前再争取一次的话，语气客气、立场明确，150字以内。",
"src": {
"user": "iJimmyChan",
"url": "https://x.com/iJimmyChan/status/2110889425521754248",
"note": ""
}
},
{
"id": "x16",
"level": 4,
"text": "对照上季guidance，哪几项兑现了、哪几项没兑现？逐条引原文。",
"src": {
"user": "cultman8",
"url": "https://x.com/cultman8/status/2116755481897124303",
"note": ""
}
},
{
"id": "x20",
"level": 4,
"text": "我要做一个小红书文案助手，风格活泼多用emoji，帮我写个提示词。",
"src": {
"user": "Edward913413",
"url": "https://x.com/Edward913413/status/2111724237362712599",
"note": ""
}
},
{
"id": "x33",
"level": 4,
"text": "总结这个邮件往来，给我三个要点、一句话结论，再写一段两句话的回复。",
"src": {
"user": "robertcodesai",
"url": "https://x.com/robertcodesai/status/2116853287827673505",
"note": "tr"
}
},
{
"id": "x05",
"level": 4,
"text": "你是一名代码开发助手，修改代码后必须运行测试，不得擅自删除用户文件。",
"src": {
"user": "coder_onchain",
"url": "https://x.com/coder_onchain/status/2111066746069320181",
"note": ""
}
},
{
"id": "x12",
"level": 4,
"text": "我手上有两个offer，按钱、成长、稳定性帮我取舍，最后只给一个建议。",
"src": {
"user": "iJimmyChan",
"url": "https://x.com/iJimmyChan/status/2110889425521754248",
"note": "adapt"
}
},
{
"id": "x23",
"level": 4,
"text": "你来当面试官，一次只问一个问题，答完再追问，结束后指出我哪句答得最空。",
"src": {
"user": "AzrianoY1",
"url": "https://x.com/AzrianoY1/status/2117900889914794009",
"note": "adapt"
}
},
{
"id": "x32",
"level": 4,
"text": "请详细分析我所有的流量数据，并给我一份详细报告，告诉我接下来该做什么。",
"src": {
"user": "tejas3732",
"url": "https://x.com/tejas3732/status/2117611429037535606",
"note": "tr"
}
},
{
"id": "x09",
"level": 4,
"text": "扮演这家公司的HR，用最常见的压价话术跟我谈一轮，谈完指出我哪句答亏了。",
"src": {
"user": "iJimmyChan",
"url": "https://x.com/iJimmyChan/status/2110889425521754248",
"note": ""
}
},
{
"id": "x22",
"level": 4,
"text": "你是出版社的文学编辑，把这段翻译成适合90后读的中文，保留原文的幽默感。",
"src": {
"user": "RachelRifx",
"url": "https://x.com/RachelRifx/status/2111087263379751371",
"note": ""
}
},
{
"id": "x27",
"level": 5,
"text": "最多用三行回答。第一行给答案，第二行给主要原因，第三行说你有多确定，以及为什么。",
"src": {
"user": "signalaidaily",
"url": "https://x.com/signalaidaily/status/2117937651731075405",
"note": "tr"
}
},
{
"id": "x34",
"level": 5,
"text": "你现在是一名威士忌向导。给第一次品尝的人推荐三瓶酒，每瓶用一句话说说口感和价格。",
"src": {
"user": "tryharter",
"url": "https://x.com/tryharter/status/2118722330067194342",
"note": "tr"
}
},
{
"id": "x35",
"level": 5,
"text": "为职场新人写一份十五页的时间管理指南大纲，包含五节课、示例、练习和一份检查清单。",
"src": {
"user": "Rishialexx",
"url": "https://x.com/Rishialexx/status/2114640000293953996",
"note": "tr"
}
},
{
"id": "x04",
"level": 5,
"text": "你是做过ToB销售的人，用大白话写一页方案，不超过300字，结尾给三个客户会追问的点。",
"src": {
"user": "queenhntrc",
"url": "https://x.com/queenhntrc/status/2109828723453100374",
"note": ""
}
},
{
"id": "x28",
"level": 5,
"text": "像给十二岁的孩子讲一样解释这封邮件：他们想让我做什么，截止到什么时候，我应该怎么回复？",
"src": {
"user": "DaDDyWaRBuXx1",
"url": "https://x.com/DaDDyWaRBuXx1/status/2115474243387539657",
"note": "tr"
}
},
{
"id": "x31",
"level": 5,
"text": "用价值方程来吐槽我的落地页，找出阻止访客购买的原因，并给我一个按优先级排列的修改计划。",
"src": {
"user": "OmriBuilds",
"url": "https://x.com/OmriBuilds/status/2109941648754974829",
"note": "tr"
}
},
{
"id": "x26",
"level": 5,
"text": "用三个层次解释机器学习：像对十二岁的孩子、像对大学生、像对专家。然后给我三个问题来自测。",
"src": {
"user": "signalaidaily",
"url": "https://x.com/signalaidaily/status/2116893030011617580",
"note": "tr"
}
},
{
"id": "x29",
"level": 5,
"text": "给我一个看起来简单但需要仔细推理的问题。先别说答案，等我给出解法，再一步一步评价我的推理。",
"src": {
"user": "aetherfrontier",
"url": "https://x.com/aetherfrontier/status/2116879462776164758",
"note": "tr"
}
},
{
"id": "x08",
"level": 5,
"text": "我在上海做产品经理，五年经验，帮我估这个岗位在本地的薪资区间，写清楚你的判断依据和哪里不确定。",
"src": {
"user": "iJimmyChan",
"url": "https://x.com/iJimmyChan/status/2110889425521754248",
"note": "adapt"
}
},
{
"id": "x01",
"level": 5,
"text": "请向一个十岁的孩子解释区块链。使用生活中常见的比喻，不使用任何专业术语，并在最后附带两个互动提问。",
"src": {
"user": "StruggingX41995",
"url": "https://x.com/StruggingX41995/status/2110912718249361470",
"note": "adapt"
}
},
{
"id": "x38",
"level": 5,
"text": "根据你对我的了解，创造一个完全原创的魔法生物来代表我的性格，展示它的样子，并解释每个特征为什么适合我。",
"src": {
"user": "Smart04261410",
"url": "https://x.com/Smart04261410/status/2114012831687561246",
"note": "tr"
}
},
{
"id": "x36",
"level": 5,
"text": "帮我一步一步推理这个问题。先审查代码库，质疑假设，评估方案和取舍，然后在写代码之前推荐最简单实用的做法。",
"src": {
"user": "vinhnx",
"url": "https://x.com/vinhnx/status/2110584354300923967",
"note": "tr"
}
},
{
"id": "x30",
"level": 5,
"text": "假设你是一位在本地比较几家装修公司的顾客。根据这些评价，什么会让你转而打给竞争对手？给我三个最快的改进办法。",
"src": {
"user": "soul_zah",
"url": "https://x.com/soul_zah/status/2112651319286862070",
"note": "tr"
}
},
{
"id": "x19",
"level": 6,
"text": "生成9:16白底全身图：东方年轻女子，长黑发半束，银色花枝发簪，水滴形耳坠；白色交领上衣、浅青色长裙，外罩一层白色轻透长衫。",
"src": {
"user": "GrayNoteLab",
"url": "https://x.com/GrayNoteLab/status/2117142054115627457",
"note": ""
}
},
{
"id": "x37",
"level": 6,
"text": "检查我的Claude Code配置和你能看到的会话记录，一次只问我一个问题来了解我的工作流程和优先级，然后给出实用的改进建议。",
"src": {
"user": "billmque",
"url": "https://x.com/billmque/status/2114062329398829280",
"note": "tr"
}
},
{
"id": "x24",
"level": 6,
"text": "操作被拒时让按钮左右抖动，幅度递减并回到原位，每次点击只抖一次。沿用项目现有风格，尊重减少动画设置，连点时取消旧动画，不排队播放。",
"src": {
"user": "neuronxwhite",
"url": "https://x.com/neuronxwhite/status/2113479304038486039",
"note": "adapt"
}
},
{
"id": "x18",
"level": 6,
"text": "反推这张图的AI生图提示词，包括风格调性、画面视角、画面构图、场景内容、整体配色和背景描述等细节，增加摄影或渲染专业词汇，最后合成一段话输出。",
"src": {
"user": "hr_yueBing",
"url": "https://x.com/hr_yueBing/status/2118222469689381319",
"note": "adapt"
}
},
{
"id": "x14",
"level": 6,
"text": "你是一个只报官方原文的助理。每个数字后面写来源链接、发布时间和原文那一句。找不到官方原文，就只回答还没找到官方数据，不准估算，不准拿旧数据顶上。",
"src": {
"user": "Pengran1217",
"url": "https://x.com/Pengran1217/status/2117961123102351654",
"note": "adapt"
}
},
{
"id": "x17",
"level": 6,
"text": "下面是同一个商品的差评和中评，请你只做归类，先别给建议。把说的是同一个问题的放一组，按条数从多到少排，只列前三组。原话里没有的，不要猜，不要补。",
"src": {
"user": "Jeffrey33fu",
"url": "https://x.com/Jeffrey33fu/status/2117234048372281750",
"note": "adapt"
}
},
{
"id": "x25",
"level": 6,
"text": "先回答四个问题再改写我的需求：这一行里顶尖的人会做哪些我没提的事？他们会从哪份最原始的材料开始？具体用什么方法和工具？还有什么能证明结果是对的？",
"src": {
"user": "Fide_x_",
"url": "https://x.com/Fide_x_/status/2114154404844851703",
"note": "adapt"
}
},
{
"id": "x13",
"level": 6,
"text": "你是一个只看原文、不猜数的财报助理。用表格列出营收、经营利润、经营现金流、资本开支，每个数后面写出它在原文哪张表或哪一段。原文里没有的数字，写原文没有，不准估算。",
"src": {
"user": "Pengran1217",
"url": "https://x.com/Pengran1217/status/2115423890080223599",
"note": "adapt"
}
},
{
"id": "x03",
"level": 6,
"text": "你是一位B端报价顾问。根据下面的客户对话，输出客户真实目标、交付物清单、明确不做的范围、建议报价区间与依据，以及下一步要问的三个确认问题。只输出结构化结果，不要鸡汤。",
"src": {
"user": "Rogercpqvzi",
"url": "https://x.com/Rogercpqvzi/status/2118153285274399054",
"note": "adapt"
}
},
{
"id": "x07",
"level": 6,
"text": "我想讲一个打零工选城市的方法，你去找素材和相应的编排这个视频节奏。我希望这个视频能做成科普类的视频，不要有多余的英文和文字，画面文字突出重点、简洁，有设计感和视频感。",
"src": {
"user": "zstmfhy",
"url": "https://x.com/zstmfhy/status/2111016580272505175",
"note": ""
}
}
];
window.LEVELS = {"1": "短句", "2": "中句·带标点", "3": "长段落", "4": "AI 提示词·短", "5": "AI 提示词·中", "6": "AI 提示词·长"};
