import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  filename?: string;
  onCropComplete: (croppedDataUrl: string, filename: string) => void;
  onClose: () => void;
}

type AspectRatio = '16:9' | '4:3' | '1:1' | 'free';

export default function ImageCropperModal({
  imageSrc,
  filename = 'image.jpg',
  onCropComplete,
  onClose
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Crop box rectangle relative to display image (in percentage 0-100)
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 45 // default 16:9 proportion
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{
    isDragging: boolean;
    dragType: 'move' | 'nw' | 'ne' | 'se' | 'sw';
    startX: number;
    startY: number;
    initialCrop: { x: number; y: number; width: number; height: number };
  }>({
    isDragging: false,
    dragType: 'move',
    startX: 0,
    startY: 0,
    initialCrop: { x: 10, y: 10, width: 80, height: 45 }
  });

  // Calculate default crop rect based on aspect ratio
  const applyAspectRatio = useCallback((ratio: AspectRatio) => {
    setAspectRatio(ratio);
    if (!imgRef.current) return;

    const imgWidth = imgRef.current.clientWidth || 600;
    const imgHeight = imgRef.current.clientHeight || 400;

    if (ratio === 'free') {
      setCrop({ x: 5, y: 5, width: 90, height: 90 });
      return;
    }

    let targetRatio = 16 / 9;
    if (ratio === '4:3') targetRatio = 4 / 3;
    if (ratio === '1:1') targetRatio = 1;

    // Convert ratio to % based on container proportions
    const containerAspect = imgWidth / imgHeight;
    let cropWidthPercent = 80;
    let cropHeightPercent = (cropWidthPercent * containerAspect) / targetRatio;

    if (cropHeightPercent > 85) {
      cropHeightPercent = 85;
      cropWidthPercent = (cropHeightPercent * targetRatio) / containerAspect;
    }

    const x = Math.max(0, (100 - cropWidthPercent) / 2);
    const y = Math.max(0, (100 - cropHeightPercent) / 2);

    setCrop({
      x,
      y,
      width: Math.min(100, cropWidthPercent),
      height: Math.min(100, cropHeightPercent)
    });
  }, []);

  useEffect(() => {
    applyAspectRatio('16:9');
  }, [applyAspectRatio, imageSrc]);

  // Drag handlers for the crop box
  const handlePointerDown = (
    e: React.PointerEvent,
    type: 'move' | 'nw' | 'ne' | 'se' | 'sw'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      isDragging: true,
      dragType: type,
      startX: e.clientX,
      startY: e.clientY,
      initialCrop: { ...crop }
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragRef.current.isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((moveEvent.clientX - dragRef.current.startX) / rect.width) * 100;
      const deltaYPercent = ((moveEvent.clientY - dragRef.current.startY) / rect.height) * 100;

      const init = dragRef.current.initialCrop;
      let newCrop = { ...init };

      if (dragRef.current.dragType === 'move') {
        newCrop.x = Math.max(0, Math.min(100 - init.width, init.x + deltaXPercent));
        newCrop.y = Math.max(0, Math.min(100 - init.height, init.y + deltaYPercent));
      } else {
        // Resizing
        if (dragRef.current.dragType === 'se') {
          newCrop.width = Math.max(15, Math.min(100 - init.x, init.width + deltaXPercent));
          newCrop.height = Math.max(15, Math.min(100 - init.y, init.height + deltaYPercent));
        } else if (dragRef.current.dragType === 'sw') {
          const newW = Math.max(15, init.width - deltaXPercent);
          const maxW = init.x + init.width;
          newCrop.width = Math.min(maxW, newW);
          newCrop.x = init.x + init.width - newCrop.width;
          newCrop.height = Math.max(15, Math.min(100 - init.y, init.height + deltaYPercent));
        } else if (dragRef.current.dragType === 'ne') {
          newCrop.width = Math.max(15, Math.min(100 - init.x, init.width + deltaXPercent));
          const newH = Math.max(15, init.height - deltaYPercent);
          const maxH = init.y + init.height;
          newCrop.height = Math.min(maxH, newH);
          newCrop.y = init.y + init.height - newCrop.height;
        } else if (dragRef.current.dragType === 'nw') {
          const newW = Math.max(15, init.width - deltaXPercent);
          const maxW = init.x + init.width;
          newCrop.width = Math.min(maxW, newW);
          newCrop.x = init.x + init.width - newCrop.width;

          const newH = Math.max(15, init.height - deltaYPercent);
          const maxH = init.y + init.height;
          newCrop.height = Math.min(maxH, newH);
          newCrop.y = init.y + init.height - newCrop.height;
        }
      }

      setCrop(newCrop);
    };

    const handlePointerUp = () => {
      dragRef.current.isDragging = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Perform Final Crop & Export via Canvas
  const handleApplyCrop = async () => {
    try {
      setIsProcessing(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      // Canvas for full transformation (zoom + rotation)
      const offscreen = document.createElement('canvas');
      const ctx = offscreen.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Normalized crop coords relative to natural image dimensions
      const normCropX = (crop.x / 100) * img.naturalWidth;
      const normCropY = (crop.y / 100) * img.naturalHeight;
      const normCropW = (crop.width / 100) * img.naturalWidth;
      const normCropH = (crop.height / 100) * img.naturalHeight;

      // Restrict max output dimension to 1280px for crisp display + database efficiency
      const maxDim = 1280;
      let outWidth = normCropW;
      let outHeight = normCropH;

      if (outWidth > maxDim || outHeight > maxDim) {
        if (outWidth > outHeight) {
          outHeight = Math.round((outHeight * maxDim) / outWidth);
          outWidth = maxDim;
        } else {
          outWidth = Math.round((outWidth * maxDim) / outHeight);
          outHeight = maxDim;
        }
      }

      // Handle rotation
      if (rotation % 180 !== 0) {
        offscreen.width = outHeight;
        offscreen.height = outWidth;
      } else {
        offscreen.width = outWidth;
        offscreen.height = outHeight;
      }

      ctx.save();
      // Center translation for rotation
      ctx.translate(offscreen.width / 2, offscreen.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw cropped slice of original image
      const drawW = rotation % 180 !== 0 ? offscreen.height : offscreen.width;
      const drawH = rotation % 180 !== 0 ? offscreen.width : offscreen.height;

      ctx.drawImage(
        img,
        normCropX,
        normCropY,
        normCropW,
        normCropH,
        -drawW / 2,
        -drawH / 2,
        drawW,
        drawH
      );
      ctx.restore();

      // Convert to JPEG data URL with optimized quality
      const croppedDataUrl = offscreen.toDataURL('image/jpeg', 0.85);
      onCropComplete(croppedDataUrl, filename);
    } catch (err) {
      console.error('Error cropping image:', err);
      // Fallback to original image if crop fails
      onCropComplete(imageSrc, filename);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none font-thaana">
      <div className="bg-[#180306] text-white rounded-3xl max-w-3xl w-full border border-[#4D0B14] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#4D0B14]">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-[#FBD38D]" />
            <h3 className="font-bold text-base sm:text-lg text-white">ފޮޓޯ ކްރޮޕްކުރައްވާ (Crop & Adjust)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Canvas Area */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center overflow-hidden bg-black/40">
          <div
            ref={containerRef}
            className="relative max-h-[55vh] max-w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center bg-[#0C0203]"
          >
            {/* Base Image */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop target"
              className="max-h-[55vh] max-w-full object-contain pointer-events-none transition-transform duration-100"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`
              }}
            />

            {/* Dark Mask around crop box */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(transparent, rgba(0,0,0,0.6))`
              }}
            />

            {/* Interactive Crop Box Overlay */}
            <div
              className="absolute border-2 border-[#FBD38D] shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move transition-all duration-75"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`
              }}
              onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
              {/* Grid lines */}
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div className="border-r border-b border-white/50" />
                <div className="border-r border-b border-white/50" />
                <div className="border-b border-white/50" />
                <div className="border-r border-b border-white/50" />
                <div className="border-r border-b border-white/50" />
                <div className="border-b border-white/50" />
                <div className="border-r border-white/50" />
                <div className="border-r border-white/50" />
                <div />
              </div>

              {/* Resize Handles */}
              <div
                className="absolute -top-2 -left-2 w-4 h-4 bg-[#FBD38D] border-2 border-black rounded-full cursor-nwse-resize shadow-md"
                onPointerDown={(e) => handlePointerDown(e, 'nw')}
              />
              <div
                className="absolute -top-2 -right-2 w-4 h-4 bg-[#FBD38D] border-2 border-black rounded-full cursor-nesw-resize shadow-md"
                onPointerDown={(e) => handlePointerDown(e, 'ne')}
              />
              <div
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FBD38D] border-2 border-black rounded-full cursor-nesw-resize shadow-md"
                onPointerDown={(e) => handlePointerDown(e, 'sw')}
              />
              <div
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#FBD38D] border-2 border-black rounded-full cursor-nwse-resize shadow-md"
                onPointerDown={(e) => handlePointerDown(e, 'se')}
              />
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 sm:p-5 border-t border-[#4D0B14] bg-[#220409] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Aspect Ratio Buttons */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
              <span className="text-xs text-white/60 px-2 font-mono">ރޭޝިއޯ:</span>
              <button
                type="button"
                onClick={() => applyAspectRatio('16:9')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === '16:9' ? 'bg-[#801320] text-white shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                16:9 (ލޭންޑްސްކޭޕް)
              </button>
              <button
                type="button"
                onClick={() => applyAspectRatio('4:3')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === '4:3' ? 'bg-[#801320] text-white shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                4:3
              </button>
              <button
                type="button"
                onClick={() => applyAspectRatio('1:1')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === '1:1' ? 'bg-[#801320] text-white shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                1:1 (ގޮޅި)
              </button>
              <button
                type="button"
                onClick={() => applyAspectRatio('free')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === 'free' ? 'bg-[#801320] text-white shadow-xs' : 'text-white/70 hover:text-white'
                }`}
              >
                ފްރީ
              </button>
            </div>

            {/* Transform Controls: Zoom & Rotate */}
            <div className="flex items-center gap-3">
              {/* Rotate Left & Right */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  title="ވާތަށް 90° އަނބުރާ"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  title="ކަނާތަށް 90° އަނބުރާ"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                <ZoomOut className="w-3.5 h-3.5 text-white/60" />
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-[#FBD38D] cursor-pointer"
                />
                <ZoomIn className="w-3.5 h-3.5 text-white/60" />
                <span className="text-xs font-mono text-[#FBD38D] w-9 text-left">
                  {zoom.toFixed(1)}x
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                applyAspectRatio('16:9');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>އަސްލު މިންގަނޑަށް އަލުން ހަމަޖައްސާ</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-colors"
              >
                ކެންސަލް
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleApplyCrop}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#801320] hover:bg-[#9E1B2B] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ޕްރޮސެސްވަނީ...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#FBD38D]" />
                    <span>ކްރޮޕްކޮށް ބޭނުންކުރައްވާ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
