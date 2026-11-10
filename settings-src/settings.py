import os, sys, subprocess, webview
APP='耳机语音助手'
INI=os.path.join(os.environ['APPDATA'],'HeadsetVoice','config.ini')
BASE=os.path.dirname(sys.executable if getattr(sys,'frozen',False) else os.path.abspath(__file__))
RES=getattr(sys,'_MEIPASS',BASE)
ENGINE=os.path.join(BASE,APP+'.exe')
LNK=os.path.join(os.environ['APPDATA'],r'Microsoft\Windows\Start Menu\Programs\Startup',APP+'.lnk')
ACTS=["无","退格删除","Delete删除","回车","光标左移","光标右移","光标上移","光标下移","Ctrl+退格(删词)","Ctrl+左(跳词)","Ctrl+右(跳词)"]
KEYS=["(无)","Space","Enter","Tab","CapsLock"]+[f"F{i}" for i in range(1,13)]+[chr(65+i) for i in range(26)]+[str(i) for i in range(10)]
DEF=dict(Ctrl=1,Alt=0,Shift=0,Win=1,Key="(无)",SendMode=1,MidMode=1,UpTap="光标左移",UpHold="退格删除",DownTap="光标右移",DownHold="回车",UpDouble="无",DownDouble="无",DoubleTapMs=300,RepeatMs=220,HoldMs=350,Enabled=1)
NUM={'Ctrl','Alt','Shift','Win','SendMode','MidMode','RepeatMs','HoldMs','Enabled','DoubleTapMs'}
def read_ini():
    c=dict(DEF)
    try:
        raw=open(INI,'rb').read()
        txt=raw.decode('utf-16') if raw[:2] in (b'\xff\xfe',b'\xfe\xff') else raw.decode('utf-8-sig',errors='replace')
        sec=None
        for l in txt.splitlines():
            l=l.strip()
            if l.startswith('['): sec=l[1:-1]
            elif sec=='main' and '=' in l:
                k,v=l.split('=',1)
                if k in c: c[k]=int(v) if k in NUM and v.strip().lstrip('-').isdigit() else v
    except FileNotFoundError: pass
    return c
def ps(cmd):
    subprocess.run(['powershell','-NoProfile','-Command',cmd],creationflags=0x08000000)
class Api:
    def load(self):
        c=read_ini(); c['AutoStart']=os.path.exists(LNK)
        return dict(cfg=c,keys=KEYS,acts=ACTS)
    def save(self,c):
        try:
            os.makedirs(os.path.dirname(INI),exist_ok=True)
            out='[main]\r\n'+''.join(f'{k}={c.get(k,DEF[k])}\r\n' for k in DEF)
            with open(INI,'w',encoding='utf-16',newline='') as f: f.write(out)
            if c.get('AutoStart'):
                ps(f"$s=(New-Object -ComObject WScript.Shell).CreateShortcut('{LNK}');$s.TargetPath='{ENGINE}';$s.WorkingDirectory='{BASE}';$s.Save()")
            elif os.path.exists(LNK): os.remove(LNK)
            return True
        except Exception as e: return str(e)
    def close(self):
        webview.windows[0].destroy()
html=open(os.path.join(RES,'page.html'),encoding='utf-8').read()
webview.create_window(APP+' 设置',html=html,js_api=Api(),width=760,height=860,min_size=(560,600),background_color='#F5F5F7')
webview.start(gui='edgechromium')
