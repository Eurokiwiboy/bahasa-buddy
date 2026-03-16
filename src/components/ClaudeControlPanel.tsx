// src/components/ClaudeControlPanel.tsx
// Floating overlay that surfaces real-time commands sent by Claude.
// Appears in the bottom-right corner whenever Claude has an active command.

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, ArrowRight, Sparkles, Lightbulb, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useClaudeControl } from '@/hooks/useClaudeControl';
import {
  ClaudeCommand,
  ClaudeCommandType,
  ClaudeMessagePayload,
  ClaudeNavigatePayload,
  ClaudeHighlightPayload,
  ClaudeExercisePayload,
  ClaudeCelebratePayload,
} from '@/integrations/supabase/types';

// Icon for each command type
function CommandIcon({ type }: { type: ClaudeCommandType }) {
  switch (type) {
    case 'message':    return <Lightbulb className="h-4 w-4 text-amber-400" />;
    case 'navigate':   return <ArrowRight className="h-4 w-4 text-blue-400" />;
    case 'highlight':  return <BookOpen className="h-4 w-4 text-purple-400" />;
    case 'exercise':   return <BookOpen className="h-4 w-4 text-green-400" />;
    case 'celebrate':  return <Sparkles className="h-4 w-4 text-yellow-400" />;
    default:           return <Bot className="h-4 w-4 text-primary" />;
  }
}

// Render the body content for each command type
function CommandBody({
  command,
  onAction,
}: {
  command: ClaudeCommand;
  onAction: () => void;
}) {
  const navigate = useNavigate();

  switch (command.command_type) {
    case 'message': {
      const p = command.payload as ClaudeMessagePayload;
      return <p className="text-sm leading-relaxed">{p.text}</p>;
    }

    case 'navigate': {
      const p = command.payload as ClaudeNavigatePayload;
      return (
        <div className="space-y-2">
          {p.label && <p className="text-sm leading-relaxed">{p.label}</p>}
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigate(p.route);
              onAction();
            }}
          >
            <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
            Go there now
          </Button>
        </div>
      );
    }

    case 'highlight': {
      const p = command.payload as ClaudeHighlightPayload;
      return (
        <p className="text-sm leading-relaxed">
          {p.text
            ? <>Pay attention to: <strong className="text-primary">{p.text}</strong></>
            : 'Focus on this phrase in your current lesson.'}
        </p>
      );
    }

    case 'exercise': {
      const p = command.payload as ClaudeExercisePayload;
      return (
        <div className="space-y-2">
          {p.instruction && (
            <p className="text-sm leading-relaxed">{p.instruction}</p>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigate(`/learn/lesson/${p.lesson_id}`);
              onAction();
            }}
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            Start exercise
          </Button>
        </div>
      );
    }

    case 'celebrate': {
      const p = command.payload as ClaudeCelebratePayload;
      return (
        <div className="space-y-1">
          <p className="text-sm leading-relaxed font-medium">
            {p.message ?? 'Great work! Keep it up! 🎉'}
          </p>
          {p.xp_earned != null && (
            <p className="text-xs text-muted-foreground">+{p.xp_earned} XP earned</p>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

export function ClaudeControlPanel() {
  const { activeCommand, dismissCommand, markExecuted } = useClaudeControl();

  return (
    <AnimatePresence>
      {activeCommand && (
        <motion.div
          key={activeCommand.id}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 right-4 z-50 w-72 md:bottom-6 md:right-6"
          role="status"
          aria-live="polite"
        >
          <div className="bg-card border border-primary/20 rounded-2xl shadow-xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">Claude</span>
                  <CommandIcon type={activeCommand.command_type} />
                </div>
              </div>
              <button
                onClick={() => dismissCommand(activeCommand.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <CommandBody
              command={activeCommand}
              onAction={() => markExecuted(activeCommand.id)}
            />

            {/* Footer with dismiss */}
            {activeCommand.command_type === 'message' ||
            activeCommand.command_type === 'highlight' ||
            activeCommand.command_type === 'celebrate' ? (
              <button
                onClick={() => dismissCommand(activeCommand.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Got it, thanks
              </button>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
