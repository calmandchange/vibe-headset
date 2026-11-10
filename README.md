# vibe coding耳机口喷（vibe-headset）

**有线 EarPods + Windows：按线控说话 → 线控改字 → 线控回车发送**，vibe coding 时手不用回到键盘改 prompt。

> Wired EarPods inline remote on Windows: speak → edit → send your prompt, hands off the keyboard. Free & open source. #VibeCoding

和 [bluetooth-headset-vibe](https://github.com/starwaysl/bluetooth-headset-vibe) 的区别：本项目面向**有线**线控耳机（EarPods 等），基于 AutoHotkey，调用微信等输入法自带的语音输入，并附带设置界面和练习场。

## 默认按键

| 线控 | 动作 |
|------|------|
| **中间键** | 开/关语音输入（默认对应 Ctrl+Win，可改） |
| **上键单击** | 光标左移 |
| **下键单击** | 光标右移 |
| **上键长按** | 退格删除 |
| **下键长按** | 回车 |

以上均可在设置页修改。语音仍走系统/微信输入法快捷键，本工具负责把线控映射过去。

## 依赖

- Windows 10/11
- 带线控的有线耳机（如 EarPods 类三键线控）
- **微信输入法**或其它支持快捷键语音的输入法（默认组合键 Ctrl+Win，可在设置里对齐）
- 若从源码运行引擎：需 [AutoHotkey v2](https://www.autohotkey.com/)

## 安装三步

1. **运行引擎**  
   - 免安装：下载 Release 里的 `耳机语音助手.exe`，放到任意目录（建议与设置 exe 同目录），双击运行。  
   - 或源码：安装 AutoHotkey v2 后，双击 `app/耳机语音助手.ahk`。

2. **打开设置，配快捷键 / 开机启动**  
   - 运行同目录（或 `release/`）下的 `耳机语音助手设置.exe`，或托盘图标 →「设置…」。  
   - 把「语音输入快捷键」改成与微信/输入法里一致（默认 Ctrl+Win）。  
   - 需要的话勾选开机启动。配置保存在 `%APPDATA%\HeadsetVoice\config.ini`（不要把个人 config 提交进仓库）。

3. **打开练习场熟悉手感**  
   - 用浏览器打开 `practice/index.html`，或托盘菜单 →「练习场」。  
   - 练完上/下键单击与长按后，即可在 ChatGPT / Cursor 等输入框里实战。

## 演示

15 秒演示 GIF 待补：请放到 [`docs/demo.gif`](docs/demo.gif)。  
建议内容：说话上屏 → 线控挪光标 / 删错字 / 回车。

## 目录结构

```
.
├── app/
│   ├── 耳机语音助手.ahk   # 引擎源码（AHK v2）
│   └── settings.png       # 托盘/资源图标
├── settings-src/
│   ├── settings.py        # 设置页后端（pywebview）
│   ├── page.html          # 设置页 UI
│   └── 耳机语音助手设置.spec
├── practice/              # 本地练习场（纯前端）
├── release/               # 预编译 exe（可挂到 GitHub Releases）
│   ├── 耳机语音助手.exe
│   └── 耳机语音助手设置.exe
├── docs/                  # 演示素材（demo.gif 待补）
├── LICENSE                # MIT
└── README.md
```

## 配置说明

- 路径：`%APPDATA%\HeadsetVoice\config.ini`
- 引擎会监视该文件变更并热加载；用设置 exe 保存即可生效，一般不必手改。

## 从源码重打包设置页（可选）

```bat
cd settings-src
pip install pywebview pyinstaller
pyinstaller 耳机语音助手设置.spec
```

把生成的 exe 放到与引擎 exe 同一目录即可。

## 反馈

Issue / PR 欢迎。报 bug 时请尽量附上：耳机型号、Windows 版本、是否使用微信输入法。

## License

MIT © 2026 HeadsetVoice Contributors
