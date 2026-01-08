'use client';

import { useEffect, useRef } from 'react';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import { createClient } from '@/utils/supabase/client';

interface DrawingBoardProps {
  gameId: string;
  role: 'SPY' | 'DETECTIVE';
  userId: string;
  activeDrawerId: string | null;
}

export default function DrawingBoard({ gameId, role, userId, activeDrawerId }: DrawingBoardProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const supabase = createClient();
  
  // Only the active drawer can draw, everyone else is a viewer
  const canDraw = role === 'SPY' && userId === activeDrawerId;

  useEffect(() => {
    // All non-drawing users (detectives + non-active spies) listen for strokes
    if (!canDraw) {
      const channel = supabase.channel(`game_room:${gameId}`);

      channel
        .on('broadcast', { event: 'new-stroke' }, ({ payload }) => {
          if (canvasRef.current && payload.stroke) {
            // Load the incoming stroke onto the canvas
            canvasRef.current.loadPaths(payload.stroke);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [gameId, canDraw, supabase]);

  // Active drawer: Broadcast strokes when completed
  const handleStroke = async (stroke: unknown) => {
    if (canDraw) {
      const channel = supabase.channel(`game_room:${gameId}`);
      
      await channel.subscribe();
      await channel.send({
        type: 'broadcast',
        event: 'new-stroke',
        payload: { stroke },
      });
    }
  };

  return (
    <div className="w-full h-full">
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={4}
        strokeColor="black"
        canvasColor="white"
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          pointerEvents: canDraw ? 'auto' : 'none',
        }}
        onStroke={handleStroke}
      />
    </div>
  );
}
