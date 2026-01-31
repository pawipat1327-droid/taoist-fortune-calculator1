import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { RecommendedDate } from '../types';

export type SpiritLotStyle = 'lot' | 'calendar' | 'action';

interface SpiritLotProps {
    date: RecommendedDate;
    userName: string;
    request: string;
    variant: SpiritLotStyle;
}

export const SpiritLot = forwardRef<HTMLDivElement, SpiritLotProps>(({ date, userName, request, variant }, ref) => {

    // Helper: Clean Reason Text (Remove redundant prefixes/suffixes & Markdown)
    const cleanReason = (text: string) => {
        if (!text) return "";
        let cleaned = text.replace(/[*_~`]/g, ''); // Remove generic markdown
        // Remove specific headers (expanded list)
        cleaned = cleaned.replace(/^(大师批语|命理综述|道长锦囊|Reason|Detailed Reason|Summary|Analysis)[:：]?\s*/i, '');
        return cleaned.trim();
    };

    // Helper: Format Best Time
    // Tries to extract "Name" and "TimeRange"
    const formatBestTime = (timeStr: string) => {
        // Handle "Name (Time)" or "Name Time" or "Time Name"
        // We assume "Name" is Chinese chars (e.g. 巳时) and "Time" is numbers/colons

        // Strategy: Look for the time range pattern (e.g. 09:00-11:00)
        const timeRangeMatch = timeStr.match(/(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})/);

        if (timeRangeMatch) {
            const timeRange = timeRangeMatch[1];
            // Remove the time range from the original string to get the "Name"
            let name = timeStr.replace(timeRange, '').replace(/[()（）\s]/g, '').trim();

            // If name ends up empty, maybe the whole string was just time?
            if (!name) name = "吉时";

            return (
                <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-2xl font-bold font-serif text-red-900 leading-none">{name}</span>
                    <span className="text-sm font-sans font-medium opacity-80 leading-none">{timeRange}</span>
                </div>
            );
        }

        // Fallback: If no strict time range found, just display as is
        return <span className="text-lg font-bold">{timeStr}</span>;
    };

    // Paper Texture & Global Font
    const paperTexture = {
        backgroundColor: '#fcf8e3',
        backgroundImage: `
        radial-gradient(#dccfba 1px, transparent 1px), 
        radial-gradient(#dccfba 1px, transparent 1px)
    `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 10px 10px',
        fontFamily: '"STKaiti", "华文楷体", "KaiTi", "楷体", "Songti SC", "Noto Serif SC", serif'
    };

    // Content Helpers
    const renderHeader = () => {
        switch (variant) {
            case 'lot':
                return (
                    <div className="mt-8 mb-6 flex flex-col items-center w-full transform scale-100">
                        {/* Centered Lot Box - Fixed Aspect Ratio & Padded to prevent overflow */}
                        <div className="w-[84px] h-[180px] border-[6px] border-red-900/90 rounded-xl flex items-center justify-center bg-red-50/50 shadow-inner mx-auto relative overflow-hidden flex-shrink-0 p-1">
                            {/* Inner Border */}
                            <div className="absolute inset-1 border border-red-900/20 rounded-lg pointer-events-none"></div>
                            {/* Force absolute center for vertical text */}
                            <span className="writing-vertical-rl text-5xl font-bold text-red-900 tracking-[0.3em] leading-none select-none flex items-center justify-center h-full w-full text-center font-serif">
                                上上签
                            </span>
                        </div>
                        <div className="mt-4 text-xs text-red-900/50 tracking-[0.5em] uppercase font-serif">FORTUNE</div>
                    </div>
                );
            case 'calendar':
                return (
                    <div className="mt-10 mb-6 flex flex-col items-center w-full px-8">
                        <div className="border-b-4 border-double border-red-900 w-full mb-3 opacity-40"></div>
                        <div className="flex items-center space-x-4">
                            <span className="text-6xl text-red-900 drop-shadow-sm">📅</span>
                            <span className="text-6xl font-bold text-gray-900 tracking-widest font-serif">吉日</span>
                        </div>
                        <div className="border-b border-red-900 w-full mt-3 opacity-40"></div>
                    </div>
                );
            case 'action':
                return (
                    <div className="mt-10 mb-6 relative flex items-center justify-center w-full py-4">
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none scale-150">
                            <span className="text-[140px] font-bold text-red-900">☯️</span>
                        </div>
                        <div className="z-10 bg-white/95 px-10 py-4 border-[6px] border-gray-900 rounded-full shadow-2xl relative">
                            <div className="absolute inset-1 border border-gray-900/20 rounded-full pointer-events-none"></div>
                            <span className="text-4xl font-bold text-gray-900 tracking-[0.5em] font-serif pl-2">诸事大吉</span>
                        </div>
                    </div>
                );
        }
    };

    // Helper: Split Date for Aesthetic Layout
    // Input: "2026-01-24"
    const [yearMonth, day] = date.date.includes('-')
        ? [date.date.substring(0, 7), date.date.substring(8)]
        : [date.date, ''];

    return (
        <div
            ref={ref}
            // Changed: w-[375px] -> w-full to accept parent container's fixed width (e.g. 400px for export)
            className="w-full min-h-[667px] h-auto shadow-2xl relative flex flex-col items-center shrink-0 p-8 box-border text-gray-900"
            style={paperTexture}
        >
            {/* Border Decoration - Changes per style */}
            {variant === 'lot' && (
                <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-red-900/80 pointer-events-none rounded-xl z-0">
                    <div className="absolute top-1 left-1 right-1 bottom-1 border border-red-900/20 pointer-events-none rounded-lg"></div>
                    {/* Decor corners */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-[6px] border-l-[6px] border-red-900"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-[6px] border-r-[6px] border-red-900"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-[6px] border-l-[6px] border-red-900"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-[6px] border-r-[6px] border-red-900"></div>
                </div>
            )}
            {variant === 'calendar' && (
                <div className="absolute top-0 left-0 right-0 h-8 bg-red-900 pattern-grid-lg opacity-90"></div>
            )}
            {variant === 'action' && (
                <div className="absolute inset-5 border-[3px] border-dashed border-gray-400/50 rounded-3xl"></div>
            )}

            {/* 1. Header Area */}
            {renderHeader()}

            {/* 2. User Info - Increased line-height/spacing */}
            <div className="w-full flex-col space-y-4 border-b-2 border-dashed border-gray-400/40 pb-6 mb-8 px-4 text-sm z-10 relative">
                <div className="flex flex-col items-start w-full space-y-1">
                    <span className="text-xs text-gray-500 font-bold flex items-center space-x-1 opacity-80">👤 求吉者</span>
                    <span className="font-bold text-gray-900 font-serif text-lg leading-relaxed break-words text-left pl-1 tracking-wide">
                        {userName}
                    </span>
                </div>
                <div className="flex flex-col items-start w-full space-y-1">
                    <span className="text-xs text-gray-500 font-bold flex items-center space-x-1 opacity-80">🙏 祈福事项</span>
                    <span className="font-bold text-red-900 font-serif text-lg leading-relaxed break-words text-left pl-1 tracking-wide">
                        {request}
                    </span>
                </div>
            </div>

            {/* 3. Date Core - Fixed Overflow & Aesthetics */}
            <div className="flex flex-col items-center py-6 relative w-full bg-white/60 rounded-2xl border border-white/50 shadow-sm mb-8 backdrop-blur-sm z-10">
                {/* Solved Overflow: Split Year-Month and Day */}
                {/* Solved Overflow: Split Year-Month and Day -> TIGHTER SPACING, NO MARGIN */}
                <div className="flex flex-col items-center leading-none mb-1">
                    {/* Year-Month: Small, Serif, Red-ish */}
                    <span className="text-lg font-serif text-red-900/60 tracking-widest font-bold mb-0">{yearMonth}</span>
                    {/* Day: Huge, Serif, Bold, Negative Top Margin to tighten */}
                    <span className="text-[5.5rem] font-serif font-bold text-red-900 drop-shadow-sm leading-none -mt-2">{day}</span>
                </div>

                <div className="flex items-center space-x-4 text-lg text-gray-800 font-bold bg-white/80 px-8 py-2 rounded-full border border-gray-200 shadow-sm font-serif mt-2">
                    <span>🗓️ {date.lunarDate}</span>
                    <span className="w-px h-5 bg-gray-400"></span>
                    <span>{date.weekDay}</span>
                </div>
            </div>

            {/* 4. Details Grid - SYMMETRICAL LAYOUT */}
            {/* 4. Details Grid - SYMMETRICAL LAYOUT - Converted to Flex to avoid Grid Gap issues for html2canvas */}
            <div className="flex flex-row space-x-5 w-full mb-8 px-2 z-10 h-full">
                {/* Left Card: Good Time */}
                <div className="flex-1 bg-red-50/80 p-5 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center shadow-sm h-full min-h-[120px]">
                    <span className="text-sm text-red-900/60 font-serif font-bold mb-2 tracking-widest border-b border-red-900/10 pb-1">【吉时】</span>
                    <div className="font-serif text-red-900 w-full flex items-center justify-center flex-1">
                        {formatBestTime(date.bestTime)}
                    </div>
                </div>
                {/* Right Card: Direction */}
                <div className="flex-1 bg-orange-50/80 p-5 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center shadow-sm h-full min-h-[120px]">
                    <span className="text-sm text-orange-900/60 font-serif font-bold mb-2 tracking-widest border-b border-orange-900/10 pb-1">【吉方】</span>
                    <div className="font-serif text-orange-900 w-full flex items-center justify-center flex-1">
                        <span className="text-3xl font-bold tracking-wide">{date.direction}</span>
                    </div>
                </div>
            </div>

            {/* 5. Batch/Reason - Optimized Spacing & Line-Height */}
            {/* 5. Batch/Reason - Optimized Header Alignment */}
            <div className="w-full bg-white/70 p-8 pt-10 rounded-2xl border border-gray-200/50 relative mb-8 shadow-sm z-10">
                {/* Label: Centered Vertically, Bold, Larger, with stylized background */}
                <div className="absolute -top-4 left-6 bg-[#fcf8e3] px-4 py-1.5 border border-gray-400 rounded-full shadow-md flex items-center space-x-1.5 z-20">
                    <span className="w-2 h-2 rounded-full bg-red-900"></span>
                    <span className="text-base font-bold text-gray-800 font-serif tracking-widest leading-none pt-0.5">大师批语</span>
                </div>
                <p className="text-lg leading-loose text-gray-800 text-justify font-serif tracking-wide whitespace-pre-wrap pt-2 opacity-90">
                    {cleanReason(date.reason)}
                </p>
            </div>

            {/* 6. Footer */}
            <div className="mt-auto w-full flex items-center justify-between pt-6 border-t-2 border-gray-900/10 border-double">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900 tracking-[0.2em] flex items-center space-x-2 font-serif">
                        ☯️ 天机神算
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 opacity-70">Taoist Fortune Calculator</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <QRCodeCanvas
                        value="https://taoist-fortune-calculator.web.app"
                        size={58}
                        fgColor="#1a1a1a"
                    />
                </div>
            </div>

        </div>
    );
});

SpiritLot.displayName = 'SpiritLot';
