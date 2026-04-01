// ─── World Constants ────────────────────────────────────────────────────────
export const WORLD_WIDTH = 7000;
export const WORLD_HEIGHT = 500;
export const GROUND_Y = 340;       // px from top where ground surface is
export const CHARACTER_WIDTH = 32;
export const CHARACTER_HEIGHT = 48;
export const MOVE_SPEED = 4;       // px per normalised frame (16.67ms)
export const CHECKPOINT_RADIUS = 90;

// ─── Types ──────────────────────────────────────────────────────────────────
export type ZoneId =
  | 'crossroads'
  | 'scholars-hollow'
  | 'academy'
  | 'guild'
  | 'forge'
  | 'quest-board'
  | 'tavern';

export interface Zone {
  id: ZoneId;
  name: string;
  startX: number;
  width: number;
  checkpointX: number;     // world-space X of the interactive object
  skyGradient: string;
  groundColor: string;
  accentColor: string;
}

export interface DialogPage {
  text: string;
  component?: 'skills' | 'projects' | 'contact' | 'experience';
}

export interface CheckpointDialog {
  zoneId: ZoneId;
  title: string;
  portrait: string;
  pages: DialogPage[];
}

// ─── Zone Layout ────────────────────────────────────────────────────────────
export const ZONES: Zone[] = [
  {
    id: 'crossroads',
    name: 'The Crossroads',
    startX: 0,
    width: 900,
    checkpointX: 420,
    skyGradient: 'linear-gradient(to bottom, #0f0c29 0%, #302b63 60%, #24243e 100%)',
    groundColor: '#2d4a1e',
    accentColor: '#a3e635',
  },
  {
    id: 'scholars-hollow',
    name: "Scholar's Hollow",
    startX: 1000,
    width: 900,
    checkpointX: 1460,
    skyGradient: 'linear-gradient(to bottom, #0d1b2a 0%, #1b4332 55%, #2d6a4f 100%)',
    groundColor: '#1a472a',
    accentColor: '#a78bfa',
  },
  {
    id: 'academy',
    name: 'The Academy',
    startX: 2000,
    width: 900,
    checkpointX: 2460,
    skyGradient: 'linear-gradient(to bottom, #1a1a2e 0%, #16213e 55%, #0f3460 100%)',
    groundColor: '#1e3a5f',
    accentColor: '#60a5fa',
  },
  {
    id: 'guild',
    name: 'The Guild',
    startX: 3000,
    width: 900,
    checkpointX: 3460,
    skyGradient: 'linear-gradient(to bottom, #1c1000 0%, #3b2000 55%, #5c3500 100%)',
    groundColor: '#3b2000',
    accentColor: '#fbbf24',
  },
  {
    id: 'forge',
    name: 'The Forge',
    startX: 4000,
    width: 900,
    checkpointX: 4460,
    skyGradient: 'linear-gradient(to bottom, #1a0a00 0%, #3d1c02 55%, #7a290a 100%)',
    groundColor: '#2d0a00',
    accentColor: '#f97316',
  },
  {
    id: 'quest-board',
    name: 'The Quest Board',
    startX: 5000,
    width: 1000,
    checkpointX: 5520,
    skyGradient: 'linear-gradient(to bottom, #0d1117 0%, #161b22 55%, #21262d 100%)',
    groundColor: '#0d1117',
    accentColor: '#34d399',
  },
  {
    id: 'tavern',
    name: 'The Tavern',
    startX: 6100,
    width: 900,
    checkpointX: 6560,
    skyGradient: 'linear-gradient(to bottom, #1a0a2e 0%, #2d1b69 55%, #4a1942 100%)',
    groundColor: '#2d1b69',
    accentColor: '#e879f9',
  },
];

// ─── Dialog Content ──────────────────────────────────────────────────────────
export const DIALOGS: Record<ZoneId, CheckpointDialog> = {
  crossroads: {
    zoneId: 'crossroads',
    portrait: '🗺️',
    title: 'THE WANDERER',
    pages: [
      {
        text: "Welcome, traveller! You've arrived at the Crossroads — the start of a grand adventure.",
      },
      {
        text: 'Walk EAST using the → arrow key (or D). Discover checkpoints along the way to learn about this portfolio.',
      },
      {
        text: "Press [E] near any glowing object to interact. Ready? The path ahead awaits...",
      },
    ],
  },
  'scholars-hollow': {
    zoneId: 'scholars-hollow',
    portrait: '📖',
    title: "ABOUT THEJAS",
    pages: [
      {
        text: "Greetings! I'm Thejas Haridas — a Computer Science graduate student specialising in Data Analytics.",
      },
      {
        text: "I'm passionate about building things at the intersection of software engineering and data. From signal processing to large language models, I love exploring new frontiers.",
      },
      {
        text: "Whether it's training a deep learning model or designing a data pipeline — I'm always up for the challenge.",
      },
    ],
  },
  academy: {
    zoneId: 'academy',
    portrait: '🎓',
    title: 'EDUCATION',
    pages: [
      {
        text: "Master of Science in Computer Science & Data Analytics — currently enrolled.",
      },
      {
        text: "My academic focus spans machine learning, statistical modelling, signal processing, and distributed systems.",
      },
      {
        text: "I've applied these skills across research projects in audio encryption, document intelligence, and video analysis.",
      },
    ],
  },
  guild: {
    zoneId: 'guild',
    portrait: '🏛️',
    title: 'WORK EXPERIENCE',
    pages: [
      {
        text: "I've ventured into the professional world and proven my skills at two companies.",
        component: 'experience',
      },
    ],
  },
  forge: {
    zoneId: 'forge',
    portrait: '⚒️',
    title: 'SKILLS & TOOLS',
    pages: [
      {
        text: "These are the weapons I've forged and mastered through study and battle:",
        component: 'skills',
      },
    ],
  },
  'quest-board': {
    zoneId: 'quest-board',
    portrait: '📜',
    title: 'FEATURED QUESTS',
    pages: [
      {
        text: "Four great quests I have completed. Each one a unique challenge that pushed my limits:",
        component: 'projects',
      },
    ],
  },
  tavern: {
    zoneId: 'tavern',
    portrait: '🍺',
    title: "LET'S CONNECT",
    pages: [
      {
        text: "The innkeeper raises a glass. 'We heard of your adventures, friend. The guild masters want to meet you!'",
        component: 'contact',
      },
    ],
  },
};

// ─── Skills Data ─────────────────────────────────────────────────────────────
export const SKILLS = [
  { name: 'Python', level: 90, color: '#3b82f6' },
  { name: 'TensorFlow / Keras', level: 82, color: '#f97316' },
  { name: 'LLMs / RAG Systems', level: 78, color: '#a78bfa' },
  { name: 'SQL & Databases', level: 75, color: '#34d399' },
  { name: 'Streamlit', level: 85, color: '#e879f9' },
  { name: 'Docker & AWS', level: 62, color: '#60a5fa' },
  { name: 'React / TypeScript', level: 68, color: '#fbbf24' },
  { name: 'OpenCV / CNN / LSTM', level: 77, color: '#f87171' },
];

// ─── Projects Data ───────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 'audio',
    title: 'Chaos-Based Audio Encryption',
    tags: ['Python', 'Signal Processing', 'NumPy'],
    description:
      'Designed a chaos-based encryption system for audio signals using spectrograms and Lorenz attractors. Achieves strong signal obfuscation while remaining reversible.',
  },
  {
    id: 'docqa',
    title: 'Document Q&A System',
    tags: ['LLMs', 'RAG', 'Vector DB', 'Streamlit'],
    description:
      'Built a retrieval-augmented generation pipeline for PDF documents. Users can ask natural-language questions and get precise, cited answers.',
  },
  {
    id: 'bm25',
    title: 'BM25 Search Tool',
    tags: ['Python', 'BM25', 'Streamlit'],
    description:
      'A lightweight, interactive document search application using BM25 indexing. Fast full-text search with a clean Streamlit UI.',
  },
  {
    id: 'video',
    title: 'Deep Learning Video Detection',
    tags: ['TensorFlow', 'CNN', 'LSTM', 'OpenCV'],
    description:
      'Trained a CNN-LSTM hybrid model for real-time activity detection in video streams. Processes spatial and temporal features for high-accuracy classification.',
  },
];

// ─── Experience Data ─────────────────────────────────────────────────────────
export const EXPERIENCE = [
  {
    id: 'tyloones',
    role: 'Junior Data Scientist',
    company: 'Tyloones Pvt Ltd',
    location: 'Delhi',
    type: 'Startup',
    duration: '5 months',
    current: false,
    color: '#fbbf24',
    icon: '🔬',
  },
  {
    id: 'feathersoft',
    role: 'Junior AI/ML Engineer',
    company: 'Feathersoft',
    location: 'Trivandrum',
    type: 'Software Company',
    duration: 'Current',
    current: true,
    color: '#34d399',
    icon: '🤖',
  },
];
