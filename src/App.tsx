import React, { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { Download, LayoutTemplate, Palette, Type, Info, ImagePlus } from 'lucide-react';
import { Poster } from './components/Poster';
import { PosterState, initialState } from './types';

export default function App() {
  const [state, setState] = useState<PosterState>(initialState);
  const posterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const posterWidth = 1080;
        const posterHeight = state.format === '4:5' ? 1350 : 1920;
        const padding = 80;
        
        const scaleX = (width - padding) / posterWidth;
        const scaleY = (height - padding) / posterHeight;
        
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [state.format]);

  const handleExport = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toJpeg(posterRef.current, { 
        quality: 0.95, 
        pixelRatio: 1,
        width: 1080,
        height: state.format === '4:5' ? 1350 : 1920
      });

      const link = document.createElement('a');
      link.download = `fiori-freschi-${state.date.replace(/[^a-z0-9]/gi, '-')}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleChange = (key: keyof PosterState, value: string | null) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange('logoUrl', url);
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100 font-sans text-neutral-900 overflow-hidden">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-neutral-200 flex flex-col h-full z-10 shadow-sm shrink-0">
        <div className="p-6 border-b border-neutral-200">
          <h1 className="text-2xl font-bold tracking-tight">Fiori Freschi</h1>
          <p className="text-sm text-neutral-500 mt-1">Poster Generator</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Format */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <LayoutTemplate size={16} /> Layout
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleChange('format', '4:5')}
                className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                  state.format === '4:5' 
                    ? 'bg-neutral-900 text-white border-neutral-900' 
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                Post (4:5)
              </button>
              <button
                onClick={() => handleChange('format', '9:16')}
                className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                  state.format === '9:16' 
                    ? 'bg-neutral-900 text-white border-neutral-900' 
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                Story (9:16)
              </button>
            </div>
          </section>

          {/* Branding */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <ImagePlus size={16} /> Branding
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Bookshop Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 cursor-pointer"
                />
                {state.logoUrl && (
                  <button 
                    onClick={() => handleChange('logoUrl', null)}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Body Font</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleChange('bodyFont', 'space')}
                    className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                      state.bodyFont === 'space' 
                        ? 'bg-neutral-900 text-white border-neutral-900' 
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    Space Grotesk
                  </button>
                  <button
                    onClick={() => handleChange('bodyFont', 'work')}
                    className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                      state.bodyFont === 'work' 
                        ? 'bg-neutral-900 text-white border-neutral-900' 
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    Work Sans
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <Palette size={16} /> Colors
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={state.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="h-10 w-14 p-1 rounded border border-neutral-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={state.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-neutral-300 text-sm uppercase font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={state.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="h-10 w-14 p-1 rounded border border-neutral-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={state.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-md border border-neutral-300 text-sm uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Content */}
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
              <Type size={16} /> Content
            </h2>
            
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs mb-4 flex gap-2 items-start">
              <Info size={14} className="mt-0.5 shrink-0" />
              <p>Tip: Use underscores to create yellow underlines. Example: <code>_Text_</code> becomes underlined.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Subtitle (e.g. incontri di critica...)</label>
                <input
                  type="text"
                  value={state.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-neutral-300 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                <input
                  type="text"
                  value={state.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-neutral-300 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Event Description</label>
                <textarea
                  value={state.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full p-3 rounded-md border border-neutral-300 text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Extra Info (Optional)</label>
                <input
                  type="text"
                  value={state.extraInfo}
                  onChange={(e) => handleChange('extraInfo', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-neutral-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Font Size ({Math.round(state.contentFontSizeScale * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.05"
                    value={state.contentFontSizeScale}
                    onChange={(e) => handleChange('contentFontSizeScale', parseFloat(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Line Height ({state.contentLineHeight.toFixed(2)})
                  </label>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    value={state.contentLineHeight}
                    onChange={(e) => handleChange('contentLineHeight', parseFloat(e.target.value))}
                    className="w-full accent-neutral-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Time</label>
                <input
                  type="text"
                  value={state.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-neutral-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Footer Text</label>
                <input
                  type="text"
                  value={state.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-neutral-300 text-sm"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isExporting ? 'Exporting...' : 'Export Poster'}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 bg-neutral-200 overflow-hidden flex items-center justify-center relative"
        style={{
          backgroundImage: 'radial-gradient(#d4d4d4 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      >
        <div 
          className="relative shadow-2xl origin-center transition-transform duration-200 ease-out"
          style={{ 
            transform: `scale(${scale})`,
            width: 1080,
            height: state.format === '4:5' ? 1350 : 1920
          }}
        >
          <Poster state={state} ref={posterRef} />
        </div>
      </div>
    </div>
  );
}
