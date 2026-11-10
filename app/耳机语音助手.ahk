#Requires AutoHotkey v2.0
#SingleInstance Force
InstallKeybdHook
Persistent
;@Ahk2Exe-SetName 耳机语音助手
;@Ahk2Exe-SetDescription 有线耳机线控 → 语音输入
;@Ahk2Exe-SetVersion 1.0.0

global APP := "耳机语音助手"
global CFGDIR := A_AppData "\HeadsetVoice"
global INI := CFGDIR "\config.ini"
DirCreate CFGDIR

global ACTIONS := Map("无","", "退格删除","{Backspace}", "Delete删除","{Delete}", "回车","{Enter}"
    , "光标左移","{Left}", "光标右移","{Right}", "光标上移","{Up}", "光标下移","{Down}"
    , "Ctrl+退格(删词)","^{Backspace}", "Ctrl+左(跳词)","^{Left}", "Ctrl+右(跳词)","^{Right}")
global ACTNAMES := ["无","退格删除","Delete删除","回车","光标左移","光标右移","光标上移","光标下移","Ctrl+退格(删词)","Ctrl+左(跳词)","Ctrl+右(跳词)"]
global KEYS := ["(无)","Space","Enter","Tab","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"]
Loop 26
    KEYS.Push(Chr(64+A_Index))
Loop 10
    KEYS.Push(String(A_Index-1))
global MODES := ["单击开始，再单击结束","长按开始，单击结束","双击开始，再单击结束"]
global SENDMODES := ["保持按住，结束时松开（如微信）","点按一次开始、再点按一次结束"]

global C := Map()
LoadCfg() {
    global C
    d := Map("Ctrl",1,"Alt",0,"Shift",0,"Win",1,"Key","(无)","SendMode",1,"MidMode",1
        ,"UpTap","光标左移","UpHold","退格删除","DownTap","光标右移","DownHold","回车","UpDouble","无","DownDouble","无","DoubleTapMs",300
        ,"RepeatMs",220,"HoldMs",350,"Enabled",1)
    for k, v in d
        C[k] := IniRead(INI, "main", k, v)
    for k in ["Ctrl","Alt","Shift","Win","SendMode","MidMode","RepeatMs","HoldMs","Enabled","DoubleTapMs"]
        C[k] := Integer(C[k])
}
SaveCfg() {
    for k, v in C
        IniWrite v, INI, "main", k
}
LoadCfg()

; ---------- 语音快捷键 ----------
global talking := false
ModsDown() {
    s := ""
    if C["Ctrl"]
        s .= "{Ctrl down}"
    if C["Alt"]
        s .= "{Alt down}"
    if C["Shift"]
        s .= "{Shift down}"
    if C["Win"]
        s .= "{LWin down}"
    if C["Key"] != "(无)"
        s .= "{" C["Key"] " down}"
    return s
}
ModsUp() {
    s := ""
    if C["Key"] != "(无)"
        s .= "{" C["Key"] " up}"
    return s "{LWin up}{RWin up}{Shift up}{Alt up}{LCtrl up}{RCtrl up}{Ctrl up}"
}
Tap() {
    Send ModsDown()
    Sleep 60
    Send ModsUp()
}
StartTalk() {
    global talking
    talking := true
    if C["SendMode"] = 1
        Send ModsDown()
    else
        Tap()
    ToolTip "🎤 语音输入中…再按一下中间键结束"
}
StopTalk() {
    global talking
    if !talking
        return
    talking := false
    if C["SendMode"] = 1
        Send ModsUp()
    else
        Tap()
    ToolTip
}
ReleaseAll() => Send(ModsUp())
OnExit (*) => (talking && C["SendMode"]=1 ? ReleaseAll() : 0)

; ---------- 中间键 ----------
global midDown := false, midLong := false, lastTap := 0, skipUp := false
MidDownH(*) {
    global midDown, midLong, skipUp
    if midDown
        return
    midDown := true, midLong := false
    if talking {
        StopTalk(), skipUp := true
        return
    }
    if C["MidMode"] = 1 {
        StartTalk(), skipUp := true
    } else if C["MidMode"] = 2
        SetTimer MidLongFn, -C["HoldMs"]
}
MidLongFn() {
    global midLong
    if midDown && !talking
        midLong := true, StartTalk()
}
MidUpH(*) {
    global midDown, skipUp, lastTap
    if !midDown
        return
    midDown := false
    SetTimer MidLongFn, 0
    if skipUp || midLong {
        skipUp := false
        return
    }
    if C["MidMode"] = 2 {
        Send "{Media_Play_Pause}"
    } else if C["MidMode"] = 3 {
        if A_TickCount - lastTap < 400 {
            lastTap := 0, SetTimer(SingleMid, 0), StartTalk()
        } else {
            lastTap := A_TickCount, SetTimer(SingleMid, -400)
        }
    }
}
SingleMid() => Send("{Media_Play_Pause}")

; ---------- 上下键 ----------
global st := Map("Volume_Up", {down:false, holding:false, t:"UpTap", h:"UpHold", d:"UpDouble", pending:false, count:0}
              , "Volume_Down", {down:false, holding:false, t:"DownTap", h:"DownHold", d:"DownDouble", pending:false, count:0})
for k, s in st {
    s.startFn := BeginMove.Bind(k)
    s.moveFn := DoMove.Bind(k)
    s.tapFn := SingleTap.Bind(k)
}
KDown(k, *) {
    s := st[k]
    if s.down
        return
    s.down := true, s.holding := false
    if talking
        StopTalk()
    if ACTIONS[C[s.h]] != ""
        SetTimer s.startFn, -C["HoldMs"]
}
KUp(k, *) {
    s := st[k]
    if !s.down
        return
    s.down := false
    SetTimer s.startFn, 0
    if s.holding {
        SetTimer s.moveFn, 0
        s.holding := false
    } else
        TapLogic(k)
}
BeginMove(k) {
    s := st[k]
    if !s.down
        return
    FlushPending(k)
    s.holding := true
    act := ACTIONS[C[s.h]]
    if act = ""
        return
    Send act
    ; 回车只发一次，不连发；删除/移动按 RepeatMs 重复
    if act != "{Enter}"
        SetTimer s.moveFn, C["RepeatMs"]
}
; 连击计数：一串间隔都在 DoubleTapMs 内的点按算一个 burst。
; 第 2、4、6… 次触发双击动作；只有整串恰好 1 次时才执行单击动作；末尾落单的奇数次忽略。
TapLogic(k) {
    s := st[k]
    if ACTIONS[C[s.d]] = "" {
        if ACTIONS[C[s.t]] != ""
            Send ACTIONS[C[s.t]]
        return
    }
    s.count := s.pending ? s.count + 1 : 1
    s.pending := true
    if Mod(s.count, 2) = 0
        Send ACTIONS[C[s.d]]
    SetTimer s.tapFn, -C["DoubleTapMs"]
}
SingleTap(k) {
    s := st[k]
    if !s.pending
        return
    s.pending := false
    n := s.count, s.count := 0
    if n = 1 && ACTIONS[C[s.t]] != ""
        Send ACTIONS[C[s.t]]
}
FlushPending(k) {
    SetTimer st[k].tapFn, 0
    SingleTap(k)
}
DoMove(k) => Send(ACTIONS[C[st[k].h]])

ApplyHotkeys() {
    on := C["Enabled"] ? "On" : "Off"
    Hotkey "*Media_Play_Pause", MidDownH, on
    Hotkey "*Media_Play_Pause up", MidUpH, on
    Hotkey "*Volume_Up", KDown.Bind("Volume_Up"), on
    Hotkey "*Volume_Up up", KUp.Bind("Volume_Up"), on
    Hotkey "*Volume_Down", KDown.Bind("Volume_Down"), on
    Hotkey "*Volume_Down up", KUp.Bind("Volume_Down"), on
    A_IconTip := APP (C["Enabled"] ? "（运行中）" : "（已暂停）")
}
ApplyHotkeys()

; ---------- 托盘 ----------
A_TrayMenu.Delete()
A_TrayMenu.Add("设置...", (*) => ShowGui())
A_TrayMenu.Add("练习场", (*) => Run('"' A_ScriptDir '\..\practice\index.html"'))
A_TrayMenu.Add("暂停/启用", (*) => (C["Enabled"] := !C["Enabled"], SaveCfg(), ApplyHotkeys()))
A_TrayMenu.Add()
A_TrayMenu.Add("退出", (*) => ExitApp())
A_TrayMenu.Default := "设置..."

; ---------- 设置程序（独立 exe）与配置热加载 ----------
global SETEXE := A_ScriptDir "\耳机语音助手设置.exe"
ShowGui() {
    if WinExist("耳机语音助手 设置 ahk_exe 耳机语音助手设置.exe")
        WinActivate
    else if FileExist(SETEXE)
        Run '"' SETEXE '"'
    else
        MsgBox "找不到设置程序：" SETEXE, APP
}
global lastMtime := FileExist(INI) ? FileGetTime(INI, "M") : ""
WatchCfg() {
    global lastMtime
    if !FileExist(INI)
        return
    m := FileGetTime(INI, "M")
    if m = lastMtime
        return
    lastMtime := m
    if talking
        StopTalk()
    ReleaseAll()
    LoadCfg()
    ApplyHotkeys()
}
SetTimer WatchCfg, 1000
OnExit (*) => ReleaseAll()
ReleaseAll()
if !FileExist(INI) {
    SaveCfg()
    lastMtime := FileGetTime(INI, "M")
    ShowGui()
}