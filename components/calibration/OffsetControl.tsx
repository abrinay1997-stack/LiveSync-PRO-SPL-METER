
import React from 'react';
import { Mic2, Minus, Plus } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import { triggerHaptic } from '../../utils/haptics';

interface OffsetControlProps {
  offset: number;
  setOffset: (val: number | ((prev: number) => number)) => void;
}

const OffsetControl: React.FC<OffsetControlProps> = ({
  offset, setOffset
}) => {
  const adjustOffset = (val: number) => {
    triggerHaptic('light');
    setOffset(p => Math.min(Math.max(p + val, 80), 140));
  };

  return (
    <Card title="Sens Offset" subtitle="Physical Calibration (1dB Steps)" icon={<Mic2 />}>
      <div className="space-y-8 py-4">
        <div className="flex flex-col items-center">
          <div className="text-6xl font-black text-white mb-6 tabular-nums">
            {offset} <span className="text-lg text-slate-600">dB</span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={() => adjustOffset(-1)} size="lg" icon={<Minus size={20} />} className="text-purple-400">
              -1.0
            </Button>
            <Button onClick={() => adjustOffset(1)} size="lg" icon={<Plus size={20} />} className="text-purple-400">
              +1.0
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 text-center uppercase font-bold tracking-widest px-4 leading-tight">Match this value with a professional reference SPL meter.</p>
      </div>
    </Card>
  );
};

export default OffsetControl;
