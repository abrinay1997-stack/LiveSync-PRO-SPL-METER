
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import SegmentedControl from '../SegmentedControl';
import { PropagationModel } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface PropagationControlProps {
  distance: number;
  setDistance: (val: number | ((prev: number) => number)) => void;
  model: PropagationModel;
  setModel: (m: PropagationModel) => void;
}

const PropagationControl: React.FC<PropagationControlProps> = ({
  distance, setDistance, model, setModel
}) => {
  const adjustDistance = (val: number) => {
    triggerHaptic('light');
    setDistance(p => Math.max(1, p + val));
  };

  return (
    <Card title="Propagation Geometry" subtitle="Distance Compensation" className="md:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Distance to Source</p>
             <p className="text-5xl font-black text-white mb-6 tabular-nums">{distance}m</p>
             <div className="grid grid-cols-2 gap-4 w-full">
                <Button onClick={() => adjustDistance(-1)} size="lg" icon={<Minus size={20} />} />
                <Button onClick={() => adjustDistance(1)} size="lg" icon={<Plus size={20} />} />
             </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center">
          <SegmentedControl 
            label="Environment Model"
            value={model}
            onChange={setModel}
            options={[
              { label: 'Point Source', value: 'POINT' },
              { label: 'Line Array', value: 'LINE' },
            ]}
          />
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
            <p className="text-[9px] text-slate-500 uppercase font-bold leading-tight">
              {model === 'POINT' 
                ? "Spherical Decay: -6dB per distance doubling. Best for single speakers or subwoofers." 
                : "Cylindrical Decay: -3dB per distance doubling. Optimized for large Line Array systems."
              }
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropagationControl;
