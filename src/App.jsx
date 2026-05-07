import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Plus, Smartphone, Move, Printer, 
  CheckCircle2, RefreshCw, Image as ImageIcon,
  Settings, Upload, Trash2, Save, Download, Cloud
} from 'lucide-react';

// === 🌐 云端互联网配置 ===
const CLOUD_API_URL = ""; 

const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; 
    img.onload = () => resolve(img);
    img.onerror = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 1800;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const fallback = new Image();
      fallback.onload = () => resolve(fallback);
      fallback.src = canvas.toDataURL();
    };
    img.src = src || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000';
  });
};

export default function App() {
  const [view, setView] = useState('home');
  
  // 核心状态：模版数据
  const [templates, setTemplates] = useState([
    {
      id: 'default-strip',
      name: '万圣节限定相框 (2x6)',
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
      name: '极简 4x6 全幅',
      folderPath: 's4x6/DS620',
      type: 'full',
      bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400',
      slots: [{ id: 1, photoIndex: 0, top: 5, left: 5, width: 90, height: 90 }]
    }
  ]);

  return (
    <div className="font-sans text-gray-900 bg-slate-900 min-h-screen flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:h-[850px] bg-white sm:rounded-[3rem] sm:shadow-2xl sm:border-[8px] sm:border-gray-800 overflow-hidden relative flex flex-col">
        
        {view === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center space-y-8 relative overflow-hidden">
            <Cloud className="absolute top-10 right-10 w-32 h-32 text-white/5" />
            <Cloud className="absolute bottom-20 left-10 w-48 h-48 text-white/5" />

            <div className="space-y-4 z-10">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/50 transform rotate-3">
                <Printer className="w-10 h-10 text-white -rotate-3" />
              </div>
              <h1 className="text-3xl font-black tracking-tight mt-4">云端照相馆</h1>
              <p className="text-blue-300 text-sm font-medium">线上排版 • 门店闪印</p>
            </div>
            
            <div className="w-full space-y-4 z-10">
              <button 
                onClick={() => setView('client')} 
                className="w-full flex items-center justify-center gap-3 p-5 bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 text-lg font-bold"
              >
                <Smartphone className="w-6 h-6" /> 开始体验
              </button>

              <button 
                onClick={() => setView('admin')} 
                className="w-full flex items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700 text-sm text-slate-300 active:scale-95"
              >
                <Settings className="w-4 h-4" /> 商家模版管理
              </button>
            </div>
          </div>
        )}
        
        {view === 'admin' && <AdminView templates={templates} setTemplates={setTemplates} goHome={() => setView('home')} />}
        {view === 'client' && <ClientView templates={templates} goHome={() => setView('home')} />}
      </div>
    </div>
  );
}

// 商家后台
function AdminView({ templates, setTemplates, goHome }) {
  const [step, setStep] = useState('list');
  const [newTemplate, setNewTemplate] = useState({ name: '', type: 'strip', bgImage: null });
  const fileRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTemplate({ ...newTemplate, bgImage: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    if (!newTemplate.name || !newTemplate.bgImage) return alert("请填写名称并上传底图");

    let slots = [];
    let folderPath = '';

    if (newTemplate.type === 'strip') {
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

    setTemplates([...templates, {
      id: `tpl-${Date.now()}`,
      name: newTemplate.name, folderPath, type: newTemplate.type,
      bgImage: newTemplate.bgImage, slots
    }]);
    setStep('list');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full relative overflow-hidden">
      <div className="p-4 bg-white border-b flex items-center justify-between z-10 sticky top-0 shadow-sm">
        <button onClick={() => step === 'add' ? setStep('list') : goHome()} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <span className="font-bold text-gray-800">商家管理</span>
        <div className="w-10" />
      </div>

      {step === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold">已上架模版</h3>
            <button onClick={() => setStep('add')} className="p-2 bg-blue-600 text-white rounded-full shadow-lg">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3 pb-20">
            {templates.map(t => (
              <div key={t.id} className="bg-white p-3 rounded-2xl shadow-sm border flex items-center gap-4">
                <div className="w-16 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                  {t.bgImage && <img src={t.bgImage} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-sm truncate">{t.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{t.type === 'strip' ? '双排条' : '单张'}</p>
                </div>
                <button onClick={() => setTemplates(templates.filter(x => x.id !== t.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'add' && (
        <div className="flex-1 overflow-y-auto p-5 flex flex-col space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">模版名称</label>
            <input 
              type="text" value={newTemplate.name}
              onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
              className="w-full p-3 bg-white border rounded-xl"
              placeholder="输入名称"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">选择版型</label>
            <div className="grid grid-cols-2 gap-3">
              <div onClick={() => setNewTemplate({...newTemplate, type: 'strip'})} className={`p-3 text-center border-2 rounded-xl cursor-pointer ${newTemplate.type === 'strip' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>双排条</div>
              <div onClick={() => setNewTemplate({...newTemplate, type: 'full'})} className={`p-3 text-center border-2 rounded-xl cursor-pointer ${newTemplate.type === 'full' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>单张</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">上传底图</label>
            <div onClick={() => fileRef.current.click()} className="w-full aspect-[2/3] border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center cursor-pointer overflow-hidden relative">
              {newTemplate.bgImage ? (
                <img src={newTemplate.bgImage} className="w-full h-full object-cover" />
              ) : (
                <><Upload className="w-8 h-8 text-gray-400 mb-2" /><span className="text-sm text-gray-500">上传 1200x1800 图片</span></>
              )}
            </div>
            <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>

          <button onClick={handleSave} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">
            保存并上架
          </button>
        </div>
      )}
    </div>
  );
}

// 顾客前台
function ClientView({ templates, goHome }) {
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
      const cX = me.clientX || me.touches?.[0]?.clientX;
      const cY = me.clientY || me.touches?.[0]?.clientY;
      setPhotoPositions(prev => {
        const n = [...prev];
        n[idx] = { 
          x: Math.max(0, Math.min(100, oX - (cX - sX) * 0.5)),
          y: Math.max(0, Math.min(100, oY - (cY - sY) * 0.5))
        };
        return n;
      });
    };
    const end = () => {
      document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', move); document.removeEventListener('touchend', end);
    };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', move, { passive: false }); document.addEventListener('touchend', end);
  };

  const generate = async () => {
    setIsProcessing(true); setStep(3);
    try {
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      const bg = await loadImage(selectedTemplate.bgImage);
      cvs.width = 1200; cvs.height = 1800; 
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cvs.width, cvs.height);
      
      for (const slot of selectedTemplate.slots) {
        const url = photos[slot.photoIndex];
        if (url) {
          const img = await loadImage(url);
          const pos = photoPositions[slot.photoIndex];
          const x = (slot.left / 100) * cvs.width, y = (slot.top / 100) * cvs.height;
          const w = (slot.width / 100) * cvs.width, h = (slot.height / 100) * cvs.height;
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
    <div className="flex-1 flex flex-col bg-white h-full relative overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between shadow-sm z-10 bg-white">
        <button onClick={() => step === 1 ? goHome() : setStep(step - 1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6 text-gray-700"/>
        </button>
        <span className="font-bold text-gray-800">定制照片</span>
        <div className="w-10" />
      </div>

      {step === 1 && (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
          <div className="mb-6"><h3 className="text-xl font-bold mb-1">选择模版</h3></div>
          <div className="grid grid-cols-2 gap-4 pb-24">
            {templates.map(t => (
              <div key={t.id} onClick={() => setSelectedTemplate(t)} className={`cursor-pointer group bg-white rounded-2xl shadow-sm border-[3px] overflow-hidden ${selectedTemplate?.id === t.id ? 'border-blue-500' : 'border-transparent'}`}>
                <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center">
                    {t.bgImage && <img src={t.bgImage} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3 text-center border-t text-sm font-bold truncate">{t.name}</div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white to-transparent z-10">
             <button disabled={!selectedTemplate} onClick={() => setStep(2)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold disabled:bg-gray-200">开始制作</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col bg-gray-900 relative">
          <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
             <div className="relative shadow-2xl bg-white rounded-sm border-[6px] border-white" style={{ height: '90%', aspectRatio: '2/3' }}>
                <div className="absolute inset-0 z-0 opacity-20"><img src={selectedTemplate.bgImage} className="w-full h-full object-cover grayscale" /></div>
                {selectedTemplate.slots.map(s => (
                  <div key={s.id} className={`absolute overflow-hidden shadow-inner ${photos[s.photoIndex] ? 'cursor-move touch-none border-2 border-white/50' : 'bg-gray-100'}`} style={{ top: s.top+'%', left: s.left+'%', width: s.width+'%', height: s.height+'%' }} onMouseDown={(e) => handleDrag(e, s.photoIndex)} onTouchStart={(e) => handleDrag(e, s.photoIndex)}>
                    {photos[s.photoIndex] ? (
                      <><img src={photos[s.photoIndex]} className="w-full h-full object-cover pointer-events-none" style={{ objectPosition: `${photoPositions[s.photoIndex].x}% ${photoPositions[s.photoIndex].y}%` }} /><div className="absolute bottom-1 right-1 bg-black/50 rounded-full p-1"><Move className="w-3 h-3 text-white" /></div></>
                    ) : (<div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-[9px] font-bold"><ImageIcon className="w-5 h-5 mb-1" />传图</div>)}
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-white p-6 rounded-t-[2.5rem]">
             <div className="flex gap-4 justify-center mb-6 py-2 overflow-x-auto">
                {photos.map((p, i) => (
                  <div key={i} onClick={() => { setUploadIdx(i); fileRef.current.click(); }} className={`shrink-0 w-16 h-16 border-2 rounded-2xl flex items-center justify-center cursor-pointer ${p ? 'border-blue-500 scale-110' : 'border-dashed border-gray-300'}`}>
                    {p ? <img src={p} className="w-full h-full object-cover" /> : <Plus className="w-6 h-6 text-gray-400" />}
                  </div>
                ))}
             </div>
             <button disabled={photos.includes(null)} onClick={generate} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">生成高清照片</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col bg-slate-900 items-center justify-center p-6 text-center">
          {isProcessing ? (
            <div className="text-white flex flex-col items-center"><RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-6" /><p className="text-lg font-bold">云端渲染中...</p></div>
          ) : (
            <div className="flex flex-col items-center w-full h-full pb-4">
              {printStatus === 'idle' && (
                <><div className="flex-1 w-full flex flex-col items-center justify-center mb-6"><div className="p-3 bg-white shadow-2xl"><img src={finalImage} className="max-h-[45vh] object-contain" /></div></div>
                  <div className="w-full bg-white p-5 rounded-[2rem] space-y-3 shadow-2xl">
                     <button onClick={() => { const a = document.createElement('a'); a.href = finalImage; a.download = 'photo.jpg'; a.click(); }} className="w-full py-4 bg-slate-100 text-slate-800 rounded-xl font-bold flex items-center justify-center gap-2"><Download className="w-5 h-5" /> 保存电子版</button>
                     <button onClick={() => { setPrintStatus('sending'); setTimeout(() => setPrintStatus('success'), 2000); }} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg flex items-center justify-center gap-2"><Printer className="w-5 h-5" /> 打印照片</button>
                  </div></>
              )}
              {printStatus === 'sending' && (<div className="flex flex-col items-center my-auto"><Cloud className="w-16 h-16 text-blue-500 animate-pulse mb-4"/><h2 className="text-2xl font-bold text-white mb-2">指令下发中...</h2></div>)}
              {printStatus === 'success' && (<div className="flex flex-col items-center text-center my-auto"><CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" /><h2 className="text-3xl font-black text-white mb-4">打印成功!</h2><button onClick={goHome} className="px-12 py-4 bg-slate-800 text-white rounded-2xl font-bold mt-8">完成</button></div>)}
            </div>
          )}
        </div>
      )}
      <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if(f) { const n = [...photos]; n[uploadIdx] = URL.createObjectURL(f); setPhotos(n); } }} />
    </div>
  );
}
