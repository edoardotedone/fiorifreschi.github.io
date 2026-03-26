import React, { forwardRef } from 'react';
import { PosterState } from '../types';

interface PosterProps {
  state: PosterState;
}

export const Poster = forwardRef<HTMLDivElement, PosterProps>(({ state }, ref) => {
  const { format, primaryColor, backgroundColor, subtitle, date, description, extraInfo, time, footerText, logoUrl, bodyFont, contentFontSizeScale, contentLineHeight } = state;

  const width = 1080;
  const height = format === '4:5' ? 1350 : 1920;

  const fontClass = bodyFont === 'space' ? 'font-space' : 'font-work';

  const parseUnderline = (text: string) => {
    if (!text) return null;
    const parts = text.split(/_(.*?)_/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <span key={i} style={{ borderBottom: `0.15em solid ${primaryColor}`, paddingBottom: '0.05em' }}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      ref={ref}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#F7F7F2', // Off-white outer border
        padding: '30px',
        boxSizing: 'border-box',
      }}
      className="relative overflow-hidden flex flex-col font-sans"
    >
      <div
        style={{ backgroundColor }}
        className={`flex-1 w-full h-full relative flex flex-col p-8 ${fontClass}`}
      >
        {/* Yellow Square */}
        <div
          style={{ 
            backgroundColor: primaryColor, 
            ...(format === '4:5' ? { height: '820px' } : { aspectRatio: '15/14' })
          }}
          className="w-full relative p-10 flex flex-col justify-between shrink-0"
        >
          {/* Top Right Logo */}
          <div className="self-end flex flex-col items-end">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-40 object-contain" />
            ) : (
              <div className="border-[4px] border-white p-3 px-4 text-white font-black text-[60px] leading-[0.85] tracking-wider text-center font-syne">
                <div>TO</div>
                <div>MO</div>
              </div>
            )}
            {!logoUrl && <div className="text-white text-xl mt-2 font-semibold tracking-wide">libreria caffè</div>}
          </div>

          {/* Bottom Left Title */}
          <div className="text-white font-syne font-semibold text-[130px] leading-[0.85] tracking-tight uppercase">
            <div>FIORI</div>
            <div>FRESCHI</div>
          </div>
        </div>

        {/* Subtitle */}
        <div className={`text-white text-center tracking-wide font-medium ${format === '4:5' ? 'text-[20px] mt-6' : 'text-[26px] mt-8'}`}>
          {subtitle}
        </div>

        {/* Event Info */}
        <div 
          className={`grid grid-cols-[auto_1fr] ${format === '4:5' ? 'gap-6 mt-8' : 'gap-8 mt-16'} px-4 text-white tracking-tight`}
          style={{
            fontSize: format === '4:5' ? `${28 * contentFontSizeScale}px` : `${36 * contentFontSizeScale}px`,
            lineHeight: contentLineHeight
          }}
        >
          <div className="font-bold whitespace-nowrap">
            {parseUnderline(date)}
          </div>
          <div className="whitespace-pre-wrap">
            {parseUnderline(description)}
            {extraInfo && (
              <div className={`font-bold ${format === '4:5' ? 'mt-4' : 'mt-8'}`}>
                {parseUnderline(extraInfo)}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Time */}
        <div className={`text-white text-right px-4 tracking-tight font-medium ${format === '4:5' ? 'text-[28px] mb-6' : 'text-[36px] mb-8'}`}>
          {time}
        </div>

        {/* Footer Bar */}
        <div
          style={{ backgroundColor: primaryColor }}
          className={`w-full text-white text-center font-semibold tracking-widest uppercase shrink-0 ${format === '4:5' ? 'py-4 text-[22px]' : 'py-6 text-[28px]'}`}
        >
          {footerText}
        </div>
      </div>
    </div>
  );
});

Poster.displayName = 'Poster';
