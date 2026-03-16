import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TipContent {
  title: string;
  explanation: string;
  examples: Array<{ indonesian: string; english: string; note?: string }>;
}

interface GrammarTipCardProps {
  tip: TipContent;
  onDismiss: () => void;
}

export default function GrammarTipCard({ tip, onDismiss }: GrammarTipCardProps) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      className="bg-card border rounded-2xl shadow-lg p-5 space-y-4 max-w-md mx-auto"
    >
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="font-bold text-lg">{tip.title}</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {tip.explanation}
      </p>

      <div className="space-y-2">
        {tip.examples.map((ex, i) => (
          <div key={i} className="bg-muted/50 rounded-lg p-3">
            <p className="font-semibold text-sm">{ex.indonesian}</p>
            <p className="text-sm text-muted-foreground italic">{ex.english}</p>
            {ex.note && (
              <p className="text-xs text-muted-foreground mt-1">{ex.note}</p>
            )}
          </div>
        ))}
      </div>

      <Button onClick={onDismiss} className="w-full">
        Got it!
      </Button>
    </motion.div>
  );
}
