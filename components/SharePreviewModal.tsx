import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { RecommendedDate } from '../types';
import { SpiritLot, SpiritLotStyle } from './SpiritLot';
import { Icons } from '../constants';

interface SharePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: RecommendedDate;
    userName: string;
    request: string;
}

const STYLES: { id: SpiritLotStyle; name: string }[] = [
    { id: 'lot', name: '上上签' },
    { id: 'calendar', name: '吉日' },
    { id: 'action', name: '宜' },
];

const SharePreviewModal: React.FC<SharePreviewModalProps> = ({ isOpen, onClose, date, userName, request }) => {
    const [styleIndex, setStyleIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // Hidden ref for high-res capture
    const captureRef = useRef<HTMLDivElement>(null);

    const currentStyle = STYLES[styleIndex];

    // Carousel Logic
    const nextStyle = () => setStyleIndex((prev) => (prev + 1) % STYLES.length);
    const prevStyle = () => setStyleIndex((prev) => (prev - 1 + STYLES.length) % STYLES.length);

    // Reset when closed
    React.useEffect(() => {
        if (!isOpen) {
            setGeneratedImage(null);
            setIsGenerating(false);
            setStyleIndex(0);
        }
    }, [isOpen]);

    const handleGenerateAndShare = async () => {
        // STRATEGY: Off-screen Fixed Rendering (The "Hidden Studio")
        // We capture the existing hidden DOM node which is locked to 400px.
        // No manual JS cloning to avoid state/context loss.

        const element = captureRef.current;
        if (!element) return;

        setIsGenerating(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render

            // 2. Capture directly from the "Studio"
            let canvas;
            await document.fonts.ready.then(async () => {
                canvas = await html2canvas(element, {
                    useCORS: true,
                    scale: 3, // Ultra High resolution
                    backgroundColor: null,
                    logging: false,
                    width: 375, // Explicitly match CSS width
                    windowWidth: 375,
                    scrollY: 0,
                });
            });

            if (!canvas) throw new Error("Canvas generation failed");

            const dataUrl = canvas.toDataURL('image/png');
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `fortune_${date.date}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: '天机神算·吉日分享',
                    text: `我算到了一个好日子：${date.date}，诸事皆宜！`
                });
                onClose();
            } else {
                setGeneratedImage(dataUrl);
            }

        } catch (error: any) {
            console.error("Share failed:", error);
            alert(`生成失败: ${error.message || '未知错误'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `fortune_${date.date}.png`;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>

            {/* Hidden Studio for Capture - THE TRUTH SOURCE */}
            {/* Locked to 375px width (Standard Mobile). This guarantees consistent layout. */}
            <div
                id="hidden-export-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '-9999px',
                    zIndex: -1,
                    opacity: 0, // Keep invisible to user
                    pointerEvents: 'none',
                    width: '375px', // EXPLICIT 375px FIXED WIDTH matched to Preview
                    height: 'auto',
                    overflow: 'visible',
                    backgroundColor: '#fff' // Ensure clean background
                }}
            >
                <SpiritLot
                    ref={captureRef}
                    date={date}
                    userName={userName}
                    request={request}
                    variant={currentStyle.id}
                />
            </div>

            {/* Modal Content */}
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-[375px] flex flex-col overflow-hidden max-h-[85vh] animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-shrink-0 z-20 shadow-sm relative">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">📤 分享灵签</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors">
                        ✕
                    </button>
                </div>

                {/* Content Area - SCROLLABLE NOW */}
                <div className="flex-1 overflow-y-auto relative bg-gray-100/50 flex flex-col items-center p-4" id="preview-scroll-container">

                    {generatedImage ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <img src={generatedImage} alt="Generated Fortune" className="w-full shadow-lg rounded-xl" />
                            <p className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full text-center">
                                ✅ 长按图片保存
                            </p>
                        </div>
                    ) : (
                        // Live Preview with Carousel Arrows
                        <div className="relative w-full flex flex-col items-center">

                            {/* Scale Wrapper: Visual Simulation of the 375px Export */}
                            <div className="relative w-full flex justify-center mb-4 overflow-hidden">
                                {/* 
                                    CRITICAL FIX: 
                                    We enforce a 375px width container here to EXACTLY MATCH the hidden capture container.
                                    Then we scale it down to fit the modal (which might be ~340px pad-4).
                                    Scale calculation: 340 / 375 ≈ 0.9.
                                */}
                                <div
                                    style={{
                                        width: '375px',
                                        transform: 'scale(0.85)',
                                        transformOrigin: 'top center',
                                        flexShrink: 0
                                    }}
                                >
                                    <SpiritLot
                                        date={date}
                                        userName={userName}
                                        request={request}
                                        variant={currentStyle.id}
                                    />
                                </div>
                            </div>

                            {/* Floating Controls */}
                            <div className="fixed bottom-24 left-0 right-0 flex justify-between px-8 pointer-events-none z-30">
                                <button
                                    onClick={prevStyle}
                                    className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white text-purple-900 pointer-events-auto backdrop-blur-sm border border-purple-100"
                                >
                                    ◀
                                </button>
                                <button
                                    onClick={nextStyle}
                                    className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white text-purple-900 pointer-events-auto backdrop-blur-sm border border-purple-100"
                                >
                                    ▶
                                </button>
                            </div>

                            {/* Style Name Badge */}
                            <div className="fixed bottom-24 bg-black/70 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-md pointer-events-none z-20 font-bold tracking-widest shadow-lg border border-white/20">
                                {currentStyle.name}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Controls */}
                {!generatedImage ? (
                    <div className="p-4 bg-white border-t space-y-3 flex-shrink-0">
                        <button
                            onClick={handleGenerateAndShare}
                            disabled={isGenerating}
                            className="w-full py-3 bg-red-900 text-white rounded-lg font-bold shadow-md hover:bg-red-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isGenerating ? '🎨 正在绘制...' : <><Icons.Share /> 生成分享图</>}
                        </button>
                    </div>
                ) : (
                    <div className="p-4 bg-white border-t flex gap-2 flex-shrink-0">
                        <button onClick={() => setGeneratedImage(null)} className="flex-1 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">
                            ✏️ 调整样式
                        </button>
                        <button onClick={handleDownload} className="flex-1 py-2 text-sm bg-purple-100 text-purple-900 rounded font-bold hover:bg-purple-200">
                            📥 下载图片
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharePreviewModal;
