import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Move, Printer, 
  CheckCircle2, RefreshCw, Image as ImageIcon,
  Upload, Trash2, Save, Download, Sparkles, Settings
} from 'lucide-react';

const BRAND_NAME = "XIANG VISUAL";

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; 
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 核心状态：模版数据 (目前存放在网页内存中)
  const [templates, setTemplates] = useState([
    {
      id: 'default-strip',
      name: '经典双排照片条 (2x6)',
      folderPath: 's6x2_2/DS620', 
      type: 'strip',
      bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
      slots: [
        { id: 1, photoIndex: 0, top: 6.4, left: 7.8, width: 35.2, height: 18.2 },
        { id: 2, photoIndex: 1, top: 25.6, left: 7.8, width: 35.2, height: 18.2 },
        { id: 3, photoIndex: 2, top: 44.8, left: 7.8, width: 35.2, height: 18.2 },
        { id: 4, photoIndex: 0, top: 6.4, left: 56.8, width: 35.2, height: 18.2 },
        { id: 5, photoIndex: 1, top: 25.6, left: 56.8, width: 35.2, height: 18.2 },
        { id: 6, photoIndex: 2, top: 44.8, left: 56.8, width: 35.2, height: 18.2 },
      ]
    },
    {
      id: 'default-4x6',
      name: '极简全画幅 (4x6)',
      folderPath: 's4x6/DS620',
      type: 'full',
      bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400',
      slots: [{ id: 1, photoIndex: 0, top: 5, left: 5, width: 90, height: 90 }]
    }
  ]);

  // 路由守护：检查是不是老板来巡店了
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }
    // 模拟加载动画，显得高级一点
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-white/50 animate-spin mb-4" />
        <p className="text-[10px] tracking-[0.3em] animate-pulse uppercase text-white/50">Loading Studio...</p>
      </div>
    );
  }

  // 根据 URL 参数，完全分离呈现不同的界面
  return (
    <div className={`font-sans min-h-screen flex items-center justify-center p-0 sm:p-4 ${isAdmin ? 'bg-slate-100' : 'bg-[#0a0a0a]'}`}>
      <div className={`w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:h-[850px] overflow-hidden relative flex flex-col sm:rounded-[3rem] sm:shadow-2xl sm:border-[8px] ${isAdmin ? 'bg-white border-slate-300' : 'bg-[#0a0a0a] border-[#1a1a1a]'}`}>
        {isAdmin ? (
          <AdminDashboard templates={templates} setTemplates={setTemplates} />
        ) : (
          <ClientExperience templates={templates} />
        )}
      </div>
    </div>
  );
}

// ================= 👑 老板隐藏后台 =================
function AdminDashboard({ templates, setTemplates }) {
  const [step, setStep] = useState('list');
  const [newTpl, setNewTpl] = useState({ name: '', type: 'strip', bgImage: '' });
  const fileRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTpl({ ...newTpl, bgImage: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    if (!newTpl.name || !newTpl.bgImage) return alert("请填写名称并上传底图");
    let slots = [];
    let folderPath = '';
    if (newTpl.type === 'strip') {
      folderPath = 's6x2_2/DS620';
      slots = [
        { id: 1, photoIndex: 0, top: 6.4, left: 7.8, width: 35.2, height: 18.2 },
        { id: 2, photoIndex: 1, top: 25.6, left: 7.8, width: 35.2, height: 18.2 },
        { id: 3, photoIndex: 2, top: 44.8, left: 7.8, width: 35.2, height: 18.2 },
        { id: 4, photoIndex: 0, top: 6.4, left: 56.8, width: 35.2, height: 18.2 },
        { id: 5, photoIndex: 1, top: 25.6, left: 56.8, width: 35.2, height: 18.2 },
        { id: 6, photoIndex: 2, top: 44.8, left: 56.8, width: 35.2, height: 18.2 },
      ];
    } else {
      folderPath = 's4x6/DS620';
      slots = [{ id: 1, photoIndex: 0, top: 5, left: 5, width: 90, height: 90 }];
    }
    setTemplates([{
      id: `tpl-${Date.now()}`,
      name: newTpl.name, folderPath, type: newTpl.type, bgImage: newTpl.bgImage, slots
    }, ...templates]);
    setNewTpl({ name: '', type: 'strip', bgImage: '' });
    setStep('list');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full relative overflow-hidden">
      <div className="p-5 bg-white border-b flex items-center justify-between sticky top-0 z-10">
        {step === 'add' ? (
          <button onClick={() => setStep('list')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full"><ChevronLeft /></button>
        ) : (
          <Settings className="w-5 h-5 text-slate-400" />
        )}
        <span className="font-black text-[11px] uppercase tracking-widest text-slate-800">Admin Dashboard</span>
        <div className="w-8" />
      </div>

      {step === 'list' && (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-black">模版库</h2>
              <p className="text-xs text-slate-400 mt-1">当前由于未接数据库，刷新后会重置</p>
            </div>
            <button onClick={() => setStep('add')} className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"><Plus /></button>
          </div>
          <div className="space-y-4">
            {templates.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-14 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0"><img src={t.bgImage} className="w-full h-full object-cover" /></div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 truncate text-sm">{t.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{t.type === 'strip' ? '双排条' : '单张'}</p>
                </div>
                <button onClick={() => setTemplates(templates.filter(x => x.id !== t.id))} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'add' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">模版名称</label>
            <input type="text" value={newTpl.name} onChange={e => setNewTpl({...newTpl, name: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none" placeholder="如：万圣节限定" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">选择版型</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setNewTpl({...newTpl, type:'strip'})} className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${newTpl.type==='strip'?'bg-black text-white border-black':'bg-white text-slate-400 border-slate-200'}`}>2x6 双排条</button>
              <button onClick={() => setNewTpl({...newTpl, type:'full'})} className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${newTpl.type==='full'?'bg-black text-white border-black':'bg-white text-slate-400 border-slate-200'}`}>4x6 全画幅</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">上传带孔底图 (1200x1800)</label>
            <div onClick={() => fileRef.current.click()} className="w-full aspect-[2/3] border-2 border-dashed border-slate-300 rounded-[2rem] bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group">
              {newTpl.bgImage ? <img src={newTpl.bgImage} className="w-full h-full object-cover" /> : <><Upload className="w-8 h-8 text-slate-300 mb-3 group-hover:scale-110 transition-transform" /><span className="text-[10px] font-bold text-slate-400 uppercase">点击上传图库</span></>}
            </div>
            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
          <button onClick={handleSave} className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-black/20 active:scale-95 transition-all">保存并上架</button>
        </div>
      )}
    </div>
  );
}

// ================= 📸 顾客唯美前台 =================
function ClientExperience({ templates }) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoPositions, setPhotoPositions] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [printStatus, setPrintStatus] = useState('idle');
  const fileRef = useRef(null);
  const [uploadIdx, setUploadIdx] = useState(0);

  useEffect(() => {
    if (selectedTemplate) {
      const count = Math.max(...selectedTemplate.slots.map(s => s.photoIndex)) + 1;
      setPhotos(new Array(count).fill(null));
      setPhotoPositions(new Array(count).fill({ x: 50, y: 50 }));
    }
  }, [selectedTemplate]);

  const handleDrag = (e, idx) => {
    if (!photos[idx]) return;
    const sX = e.clientX || e.touches?.[0]?.clientX;
    const sY = e.clientY || e.touches?.[0]?.clientY;
    const oX = photoPositions[idx].x;
    const oY = photoPositions[idx].y;
    const move = (me) => {
      setPhotoPositions(prev => {
        const n = [...prev];
        n[idx] = { x: Math.max(0, Math.min(100, oX - ((me.clientX || me.touches?.[0]?.clientX) - sX) * 0.5)), y: Math.max(0, Math.min(100, oY - ((me.clientY || me.touches?.[0]?.clientY) - sY) * 0.5)) };
        return n;
      });
    };
    const end = () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', end); document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end); };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', move, { passive: false }); document.addEventListener('touchend', end);
  };

  const generate = async () => {
    setIsProcessing(true); setStep(3);
    try {
      const cvs = document.createElement('canvas'); const ctx = cvs.getContext('2d');
      const bg = await loadImage(selectedTemplate.bgImage);
      cvs.width = 1200; cvs.height = 1800; 
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cvs.width, cvs.height);
      
      for (const slot of selectedTemplate.slots) {
        if (photos[slot.photoIndex]) {
          const img = await loadImage(photos[slot.photoIndex]);
          const pos = photoPositions[slot.photoIndex];
          const x = (slot.left / 100) * cvs.width, y = (slot.top / 100) * cvs.height, w = (slot.width / 100) * cvs.width, h = (slot.height / 100) * cvs.height;
          const ir = img.width / img.height, sr = w / h;
          let dW, dH, oX = 0, oY = 0;
          if (ir > sr) { dH = img.height; dW = img.height * sr; oX = (img.width - dW) * (pos.x / 100); }
          else { dW = img.width; dH = img.width / sr; oY = (img.height - dH) * (pos.y / 100); }
          ctx.drawImage(img, oX, oY, dW, dH, x, y, w, h);
        }
      }
      setFinalImage(cvs.toDataURL('image/jpeg', 0.9));
      setTimeout(() => setIsProcessing(false), 800);
    } catch (e) { setIsProcessing(false); setStep(2); }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-white">
      {/* 极简顶栏 */}
      <div className="p-6 flex items-center justify-between z-10">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md active:scale-95"><ChevronLeft className="w-5 h-5 text-white"/></button>
        ) : (
          <div className="w-10" />
        )}
        <span className="font-black text-[12px] uppercase tracking-[0.3em]">{BRAND_NAME}</span>
        <div className="w-10" />
      </div>

      {step === 1 && (
        <div className="flex-1 overflow-y-auto px-6 pb-32 flex flex-col">
          <div className="mb-8 mt-4 text-center">
            <h1 className="text-3xl font-black mb-2 flex items-center justify-center gap-2">Choose Frame <Sparkles className="w-6 h-6 text-yellow-400" /></h1>
            <p className="text-white/40 text-xs tracking-widest uppercase">请选择您喜欢的相框模版</p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {templates.map(t => (
              <div key={t.id} onClick={() => setSelectedTemplate(t)} className={`cursor-pointer group rounded-[2rem] transition-all overflow-hidden border-[3px] ${selectedTemplate?.id === t.id ? 'border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-white/5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}`}>
                <div className="aspect-[2/3] bg-white/5 flex items-center justify-center relative">
                    <img src={t.bgImage} className="w-full h-full object-cover" />
                </div>
                <div className={`p-3 text-center text-[10px] font-black uppercase tracking-widest ${selectedTemplate?.id === t.id ? 'bg-white text-black' : 'bg-white/5 text-white/50'}`}>{t.name}</div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent z-10">
             <button disabled={!selectedTemplate} onClick={() => setStep(2)} className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-lg disabled:bg-white/10 disabled:text-white/30 transition-all active:scale-95">NEXT STEP</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
             {/* 模版实时预览 */}
             <div className="relative bg-white shadow-2xl rounded-[0.5rem] overflow-hidden" style={{ height: '90%', aspectRatio: '2/3' }}>
                <div className="absolute inset-0 z-10 pointer-events-none"><img src={selectedTemplate.bgImage} className="w-full h-full object-cover" /></div>
                {selectedTemplate.slots.map(s => (
                  <div key={s.id} className={`absolute overflow-hidden ${photos[s.photoIndex] ? 'cursor-move touch-none border border-white/50' : 'bg-slate-200'}`} style={{ top: s.top+'%', left: s.left+'%', width: s.width+'%', height: s.height+'%' }} onMouseDown={(e) => handleDrag(e, s.photoIndex)} onTouchStart={(e) => handleDrag(e, s.photoIndex)}>
                    {photos[s.photoIndex] ? (
                      <><img src={photos[s.photoIndex]} className="w-full h-full object-cover pointer-events-none" style={{ objectPosition: `${photoPositions[s.photoIndex].x}% ${photoPositions[s.photoIndex].y}%` }} /><div className="absolute bottom-1 right-1 bg-black/50 rounded-full p-1 backdrop-blur-sm"><Move className="w-3 h-3 text-white" /></div></>
                    ) : (<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] font-black uppercase"><ImageIcon className="w-5 h-5 mb-1 opacity-50" />Tap</div>)}
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-white/10 p-8 rounded-t-[3rem] backdrop-blur-xl border-t border-white/10">
             <div className="flex gap-4 justify-center mb-8 overflow-x-auto">
                {photos.map((p, i) => (
                  <div key={i} onClick={() => { setUploadIdx(i); fileRef.current.click(); }} className={`shrink-0 w-16 h-16 border-2 rounded-[1.2rem] flex items-center justify-center overflow-hidden cursor-pointer transition-all ${p ? 'border-white scale-110 shadow-lg' : 'border-white/20 hover:border-white/50'}`}>
                    {p ? <img src={p} className="w-full h-full object-cover" /> : <Plus className="w-6 h-6 text-white/50" />}
                  </div>
                ))}
             </div>
             <button disabled={photos.includes(null)} onClick={generate} className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-lg disabled:bg-white/10 disabled:text-white/30 transition-all active:scale-95">生成排版</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center relative p-6">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-6">
                <RefreshCw className="w-12 h-12 text-white/50 animate-spin" />
                <p className="text-[12px] font-black tracking-[0.4em] uppercase animate-pulse">Rendering...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full h-full pb-4">
              {printStatus === 'idle' && (
                <div className="flex flex-col items-center justify-center h-full w-full animate-in zoom-in-95">
                  <div className="flex-1 relative w-full flex items-center justify-center mb-8">
                     <div className="p-3 bg-white shadow-2xl rounded-sm transform rotate-2">
                        <img src={finalImage} className="max-h-[50vh] object-contain" />
                     </div>
                  </div>
                  <div className="w-full bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl border border-white/10 space-y-4">
                     <button onClick={() => { const a = document.createElement('a'); a.href = finalImage; a.download = 'XIANG_VISUAL.jpg'; a.click(); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10">
                        <Download className="w-5 h-5" /> 保存电子版到相册
                     </button>
                     <button onClick={() => { setPrintStatus('sending'); setTimeout(() => setPrintStatus('success'), 2000); }} className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                        <Printer className="w-6 h-6" /> 发送至门店打印机
                     </button>
                  </div>
                </div>
              )}
              {printStatus === 'sending' && (
                <div className="flex flex-col items-center my-auto">
                    <Printer className="w-16 h-16 text-white animate-pulse mb-8" />
                    <h2 className="text-xl font-black tracking-widest uppercase mb-2">Transmitting...</h2>
                    <p className="text-white/50 text-[10px] tracking-widest uppercase">请留意打印机出纸口</p>
                </div>
              )}
              {printStatus === 'success' && (
                <div className="flex flex-col items-center text-center my-auto">
                    <CheckCircle2 className="w-24 h-24 text-green-400 mb-8 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                    <h2 className="text-3xl font-black mb-4">打印成功!</h2>
                    <p className="text-white/60 text-xs tracking-widest leading-relaxed mb-12">
                        照片正在火速冲印中<br/>请在打印机旁稍候片刻
                    </p>
                    <button onClick={() => {setStep(1); setPrintStatus('idle')}} className="px-12 py-5 bg-white/10 text-white rounded-full font-black text-xs tracking-widest uppercase hover:bg-white/20 transition-all border border-white/10">完成并返回</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if(f) { const n = [...photos]; n[uploadIdx] = URL.createObjectURL(f); setPhotos(n); } }} />
    </div>
  );
}
