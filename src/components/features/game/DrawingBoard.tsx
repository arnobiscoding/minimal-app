'use client';

import { useEffect, useRef } from 'react';
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas';
import { createClient } from '@/utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface DrawingBoardProps {
  gameId: string;
  role: 'SPY' | 'DETECTIVE';
  userId: string;
  activeDrawerId: string | null;
}

export default function DrawingBoard({ gameId, role, userId, activeDrawerId }: DrawingBoardProps) {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  // Store the active channel in a ref so we can access it inside event handlers
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();
  
  const canDraw = role === 'SPY' && userId === activeDrawerId;

  // 1. SETUP CONNECTION (Run once)
  useEffect(() => {
    // Create the channel ONE time
    const channel = supabase.channel(`game_room:${gameId}`);

    // Setup the listener
    channel
      .on('broadcast', { event: 'new-stroke' }, ({ payload }) => {
        // If I am the one drawing, I don't need to listen to myself
        // This prevents "echo" lag where my line disappears and reappears
        if (!canDraw && canvasRef.current && payload.stroke) {
          canvasRef.current.loadPaths(payload.stroke);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            // Channel is ready!
            channelRef.current = channel;
        }
      });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [gameId, canDraw, supabase]); // Re-run only if permissions/game change

  // 2. SEND DATA (Use existing connection)
  const handleStroke = async (stroke: unknown) => {
    if (canDraw && channelRef.current) {
      // Send immediately using the open pipe
      await channelRef.current.send({
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