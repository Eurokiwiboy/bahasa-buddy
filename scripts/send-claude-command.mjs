#!/usr/bin/env node
// scripts/send-claude-command.mjs
//
// CLI utility for sending Claude remote-control commands to Bahasa Buddy users.
// Requires a Supabase service_role key — never expose this on the client side.
//
// Usage:
//   export SUPABASE_URL=https://your-project.supabase.co
//   export SUPABASE_SERVICE_ROLE_KEY=eyJ...
//
//   node scripts/send-claude-command.mjs message "Great job on Unit 3!"
//   node scripts/send-claude-command.mjs message "Try the next lesson" --tone encouraging
//   node scripts/send-claude-command.mjs navigate /learn "Head to the Learn page"
//   node scripts/send-claude-command.mjs navigate /learn/lesson/<id>
//   node scripts/send-claude-command.mjs highlight --text "mau" --phrase-id <uuid>
//   node scripts/send-claude-command.mjs exercise <lesson-id> "Practice this exercise"
//   node scripts/send-claude-command.mjs celebrate "Excellent work!" --xp 50
//   node scripts/send-claude-command.mjs message "Hello" --user-id <profile-uuid>
//   node scripts/send-claude-command.mjs --list   (show recent commands)
//   node scripts/send-claude-command.mjs --help

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const COMMANDS_URL = `${SUPABASE_URL}/rest/v1/claude_commands`;

const HELP = `
send-claude-command — push Claude remote-control commands to Bahasa Buddy

Usage:
  node scripts/send-claude-command.mjs <type> [args...] [flags]

Types:
  message  <text>           Show a tip/message overlay
  navigate <route> [label]  Suggest navigating to a route
  highlight [--text <str>] [--phrase-id <id>] [--lesson-id <id>]
  exercise  <lesson-id> [instruction]
  celebrate [message] [--xp <number>]

Flags:
  --tone <neutral|encouraging|corrective|celebratory>  (message only)
  --user-id <uuid>   Target a specific user (default: broadcast to all)
  --xp <number>      XP earned to display (celebrate only)
  --list             Show 10 most recent commands
  --help             Show this help

Environment variables required:
  SUPABASE_URL              Your Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY Your Supabase service_role JWT

Examples:
  node scripts/send-claude-command.mjs message "Try the next lesson!" --tone encouraging
  node scripts/send-claude-command.mjs navigate /learn "Go to your curriculum"
  node scripts/send-claude-command.mjs celebrate "Unit 1 complete!" --xp 100
  node scripts/send-claude-command.mjs exercise abc-lesson-id "Practice ordering food"
`.trim();

// --- Argument parsing ---------------------------------------------------

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {};
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(args[i]);
    }
  }

  return { positional, flags };
}

// --- Supabase REST helpers ----------------------------------------------

async function supabaseRequest(method, url, body) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
    process.exit(1);
  }

  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`Supabase error ${res.status}: ${text}`);
    process.exit(1);
  }

  return text ? JSON.parse(text) : null;
}

async function insertCommand(commandType, payload, userId) {
  const record = {
    command_type: commandType,
    payload,
    status: 'pending',
    ...(userId ? { user_id: userId } : {}),
  };

  const result = await supabaseRequest('POST', COMMANDS_URL, record);
  return Array.isArray(result) ? result[0] : result;
}

async function listRecentCommands() {
  const url = `${COMMANDS_URL}?select=*&order=created_at.desc&limit=10`;
  return supabaseRequest('GET', url);
}

// --- Command builders ---------------------------------------------------

function buildPayload(type, positional, flags) {
  switch (type) {
    case 'message': {
      const text = positional[1];
      if (!text) { console.error('message requires <text>'); process.exit(1); }
      return { text, ...(flags.tone ? { tone: flags.tone } : {}) };
    }

    case 'navigate': {
      const route = positional[1];
      if (!route) { console.error('navigate requires <route>'); process.exit(1); }
      const label = positional[2];
      return { route, ...(label ? { label } : {}) };
    }

    case 'highlight': {
      const p = {};
      if (flags.text)       p.text = flags.text;
      if (flags['phrase-id'])  p.phrase_id = flags['phrase-id'];
      if (flags['lesson-id'])  p.lesson_id = flags['lesson-id'];
      if (!p.text && !p.phrase_id && !p.lesson_id) {
        console.error('highlight requires at least one of --text, --phrase-id, --lesson-id');
        process.exit(1);
      }
      return p;
    }

    case 'exercise': {
      const lessonId = positional[1];
      if (!lessonId) { console.error('exercise requires <lesson-id>'); process.exit(1); }
      const instruction = positional[2];
      return { lesson_id: lessonId, ...(instruction ? { instruction } : {}) };
    }

    case 'celebrate': {
      const message = positional[1] || undefined;
      const xp = flags.xp ? Number(flags.xp) : undefined;
      return {
        ...(message ? { message } : {}),
        ...(xp != null ? { xp_earned: xp } : {}),
      };
    }

    default:
      console.error(`Unknown command type: ${type}`);
      console.error('Valid types: message, navigate, highlight, exercise, celebrate');
      process.exit(1);
  }
}

// --- Main ---------------------------------------------------------------

async function main() {
  const { positional, flags } = parseArgs(process.argv);

  if (flags.help || positional.length === 0) {
    console.log(HELP);
    process.exit(0);
  }

  if (flags.list) {
    const rows = await listRecentCommands();
    if (!rows || rows.length === 0) {
      console.log('No commands found.');
      return;
    }
    console.log(`\nRecent commands (${rows.length}):\n`);
    for (const r of rows) {
      const age = Math.round((Date.now() - new Date(r.created_at).getTime()) / 1000);
      const target = r.user_id ? `user:${r.user_id.slice(0, 8)}...` : 'broadcast';
      console.log(`  [${r.status.padEnd(9)}] ${r.command_type.padEnd(10)} → ${target}  (${age}s ago)`);
      console.log(`            payload: ${JSON.stringify(r.payload)}`);
    }
    return;
  }

  const type = positional[0];
  const payload = buildPayload(type, positional, flags);
  const userId = flags['user-id'] || null;

  const cmd = await insertCommand(type, payload, userId);

  const target = userId ? `user ${userId.slice(0, 8)}...` : 'all users (broadcast)';
  console.log(`\n✓ Command sent to ${target}`);
  console.log(`  id:      ${cmd?.id ?? '(no id returned)'}`);
  console.log(`  type:    ${type}`);
  console.log(`  payload: ${JSON.stringify(payload)}`);
  console.log(`  expires: ${cmd?.expires_at ?? '30 min from now'}\n`);
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
