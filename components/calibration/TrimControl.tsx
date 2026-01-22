
import React from 'react';
import { Link2, Minus, Plus } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import { triggerHaptic } from '../../utils/haptics';

interface TrimControlProps {
  digitalTrim: number;
  setDigitalTrim: (val: number | ((prev: number) => number)) => void;
  aes17: boolean;
  setAes17: (val: boolean) => void;
}

const TrimControl: React.FC<TrimControlProps> = ({
  digitalTrim, setDigitalTrim, aes17, setAes17
}) => {
  const adjustTrim = (val: number) => {
    triggerHaptic('light');
    setDigitalTrim(p => Math.min(Math.max(parseFloat((p + val).toFixed(1)), -20), 20));
  };

  const toggleAes = () => {
    triggerHaptic('medium');
    setAes17(!aes17);
  };

  return (
    <Card title="Digital Trim" subtitle="Input Alignment (0.1dB Steps)" icon={<Link2 />}>
      <div className="space-y-8 py-4">
        <div className="flex flex-col items-center">
          <div className={`text-6xl font-black mb-6 ${digitalTrim !== 0 ? 'text-cyan-400' : 'text-white'} tabular-nums`}>
            {digitalTrim > 0 ? '+' : ''}{digitalTrim.toFixed(1)} <span className="text-lg text-slate-600">dB</span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button onClick={() => adjustTrim(-0.1)} size="lg" icon={<Minus size={20} />} className="text-cyan-400">
              -0.1
            </Button>
            <Button onClick={() => adjustTrim(0.1)} size="lg" icon={<Plus size={20} />} className="text-cyan-400">
              +0.1
            </Button>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5">
          <Button 
            fullWidth
            variant={aes17 ? 'cyan' : 'primary'}
            onClick={toggleAes}
          >
            <div className="flex justify-between w-full items-center">
              <span>AES-17 Correction (+3dB)</span>
              <span>{aes17 ? 'ON' : 'OFF'}</span>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TrimControl;
