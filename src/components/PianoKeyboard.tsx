import { useEffect, useRef, useState } from 'react';
import { drawPianoRoll, getPianoRollMeasurements, handlePianoRollMousePress } from '../features/drawing/piano';
import midiState from '../features/midi';
import type { MidiStateEvent } from '../types';

export function PianoKeyboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNotes, setActiveNotes] = useState<Map<number, string>>(new Map());

  // ✅ KONTINUIERLICHER LOOP (60fps)
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      const canvas = canvasRef.current;

      console.log('Canvas Width:', canvas?.clientWidth, 'Height:', canvas?.clientHeight);


      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width;
      canvas.height = height;
      
      ctx.fillStyle = '#2e2e2e';
      ctx.fillRect(0, 0, width, height);

      const measurements = getPianoRollMeasurements(width);
      const pianoTopY = height - measurements.whiteHeight - 5;
      drawPianoRoll(ctx, measurements, pianoTopY, activeNotes);

      rafId = requestAnimationFrame(loop);
    };
    
    loop();
    return () => cancelAnimationFrame(rafId);
  }, [activeNotes]);

  // ✅ MIDI LISTENER
  useEffect(() => {
    const handleMidiEvent = (event: MidiStateEvent) => {
      setActiveNotes(prev => {
        const next = new Map(prev);
        if (event.type === 'down') {
          next.set(event.note, 'rgb(100, 200, 255)');
        } else {
          next.delete(event.note);
        }
        return next;
      });
    };

    midiState.subscribe(handleMidiEvent);
    return () => midiState.unsubscribe(handleMidiEvent);
  }, []);

  // ✅ MOUSE/TOUCH INPUT
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const measurements = getPianoRollMeasurements(canvasRef.current.clientWidth);
    const pianoTopY = canvasRef.current.clientHeight - measurements.whiteHeight - 5;

    handlePianoRollMousePress(
      measurements,
      pianoTopY,
      {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    );
  };

  return (
  <canvas
    ref={canvasRef}
    style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1
    }}
    onPointerMove={handlePointerMove}
    onPointerDown={e => e.currentTarget.setPointerCapture(e.pointerId)}
    onPointerUp={e => e.currentTarget.releasePointerCapture(e.pointerId)}
  />
);
}
