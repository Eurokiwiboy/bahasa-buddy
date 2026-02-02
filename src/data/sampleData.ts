// Sample data for Bahasa Buddy app

export interface SplashCard {
  id: string;
  indonesian: string;
  pronunciation: string;
  english: string;
  exampleSentence: string;
  exampleTranslation: string;
  culturalContext?: string;
  category: 'greetings' | 'food' | 'travel' | 'shopping' | 'emergency' | 'casual';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  phrases: LessonPhrase[];
  xpReward: number;
  estimatedMinutes: number;
}

export interface LessonPhrase {
  id: string;
  indonesian: string;
  pronunciation: string;
  english: string;
  audioUrl?: string;
  imageUrl?: string;
  dialogue?: {
    speaker: string;
    line: string;
    translation: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLevel: string;
  message: string;
  timestamp: Date;
  isIndonesian: boolean;
  reactions?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  wordsLearned: number;
  phrasesMastered: number;
  chatMinutes: number;
  joinDate: Date;
  achievements: Achievement[];
}

// 20 Greeting Splash Cards
export const greetingCards: SplashCard[] = [
  {
    id: '1',
    indonesian: 'Selamat pagi',
    pronunciation: 'seh-lah-maht pah-gee',
    english: 'Good morning',
    exampleSentence: 'Selamat pagi, apa kabar?',
    exampleTranslation: 'Good morning, how are you?',
    culturalContext: 'Used from sunrise until around 11am. Indonesians are early risers!',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '2',
    indonesian: 'Selamat siang',
    pronunciation: 'seh-lah-maht see-ahng',
    english: 'Good afternoon',
    exampleSentence: 'Selamat siang, Bu Guru.',
    exampleTranslation: 'Good afternoon, Teacher (female).',
    culturalContext: 'Used from around 11am until 3pm.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '3',
    indonesian: 'Selamat sore',
    pronunciation: 'seh-lah-maht soh-reh',
    english: 'Good evening (late afternoon)',
    exampleSentence: 'Selamat sore, senang bertemu.',
    exampleTranslation: 'Good evening, nice to meet you.',
    culturalContext: 'Used from around 3pm until sunset.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '4',
    indonesian: 'Selamat malam',
    pronunciation: 'seh-lah-maht mah-lahm',
    english: 'Good night',
    exampleSentence: 'Selamat malam, tidur yang nyenyak.',
    exampleTranslation: 'Good night, sleep well.',
    culturalContext: 'Used after sunset. Can be both greeting and farewell.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '5',
    indonesian: 'Apa kabar?',
    pronunciation: 'ah-pah kah-bar',
    english: 'How are you?',
    exampleSentence: 'Hai, apa kabar hari ini?',
    exampleTranslation: 'Hi, how are you today?',
    culturalContext: 'The most common way to ask someone how they are.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '6',
    indonesian: 'Kabar baik',
    pronunciation: 'kah-bar bah-eek',
    english: "I'm fine / Good news",
    exampleSentence: 'Kabar baik, terima kasih.',
    exampleTranslation: "I'm fine, thank you.",
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '7',
    indonesian: 'Terima kasih',
    pronunciation: 'teh-ree-mah kah-see',
    english: 'Thank you',
    exampleSentence: 'Terima kasih banyak atas bantuannya.',
    exampleTranslation: 'Thank you very much for your help.',
    culturalContext: 'Often accompanied by a slight bow or nod of the head.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '8',
    indonesian: 'Sama-sama',
    pronunciation: 'sah-mah sah-mah',
    english: "You're welcome",
    exampleSentence: 'Sama-sama, senang bisa membantu.',
    exampleTranslation: "You're welcome, happy to help.",
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '9',
    indonesian: 'Permisi',
    pronunciation: 'per-mee-see',
    english: 'Excuse me',
    exampleSentence: 'Permisi, di mana toilet?',
    exampleTranslation: 'Excuse me, where is the toilet?',
    culturalContext: 'Very important in Indonesian culture to be polite.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '10',
    indonesian: 'Maaf',
    pronunciation: 'mah-ahf',
    english: 'Sorry',
    exampleSentence: 'Maaf, saya terlambat.',
    exampleTranslation: 'Sorry, I am late.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '11',
    indonesian: 'Sampai jumpa',
    pronunciation: 'sahm-pai joom-pah',
    english: 'See you later',
    exampleSentence: 'Sampai jumpa besok!',
    exampleTranslation: 'See you tomorrow!',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '12',
    indonesian: 'Selamat tinggal',
    pronunciation: 'seh-lah-maht ting-gahl',
    english: 'Goodbye (when you are leaving)',
    exampleSentence: 'Selamat tinggal, semoga sukses.',
    exampleTranslation: 'Goodbye, I wish you success.',
    culturalContext: 'Said by the person who is leaving.',
    category: 'greetings',
    difficulty: 'intermediate',
  },
  {
    id: '13',
    indonesian: 'Selamat jalan',
    pronunciation: 'seh-lah-maht jah-lahn',
    english: 'Goodbye (when staying behind)',
    exampleSentence: 'Selamat jalan, hati-hati di jalan.',
    exampleTranslation: 'Goodbye, be careful on the road.',
    culturalContext: 'Said by the person who stays to the one leaving.',
    category: 'greetings',
    difficulty: 'intermediate',
  },
  {
    id: '14',
    indonesian: 'Salam kenal',
    pronunciation: 'sah-lahm keh-nahl',
    english: 'Nice to meet you',
    exampleSentence: 'Nama saya Budi, salam kenal.',
    exampleTranslation: 'My name is Budi, nice to meet you.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '15',
    indonesian: 'Senang bertemu dengan Anda',
    pronunciation: 'seh-nahng ber-teh-moo deng-ahn ahn-dah',
    english: 'Pleased to meet you (formal)',
    exampleSentence: 'Senang bertemu dengan Anda, Pak.',
    exampleTranslation: 'Pleased to meet you, Sir.',
    culturalContext: 'More formal, used in business or with elders.',
    category: 'greetings',
    difficulty: 'intermediate',
  },
  {
    id: '16',
    indonesian: 'Hai',
    pronunciation: 'hai',
    english: 'Hi',
    exampleSentence: 'Hai, mau ke mana?',
    exampleTranslation: 'Hi, where are you going?',
    culturalContext: 'Casual greeting, borrowed from English.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '17',
    indonesian: 'Halo',
    pronunciation: 'hah-loh',
    english: 'Hello',
    exampleSentence: 'Halo, siapa ini?',
    exampleTranslation: 'Hello, who is this?',
    culturalContext: 'Common greeting, especially on the phone.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '18',
    indonesian: 'Apa kabarmu?',
    pronunciation: 'ah-pah kah-bar-moo',
    english: 'How are you? (informal)',
    exampleSentence: 'Lama tidak bertemu, apa kabarmu?',
    exampleTranslation: "Long time no see, how are you?",
    culturalContext: 'Used with friends and people your age.',
    category: 'greetings',
    difficulty: 'beginner',
  },
  {
    id: '19',
    indonesian: 'Bagaimana harimu?',
    pronunciation: 'bah-gai-mah-nah hah-ree-moo',
    english: 'How is your day?',
    exampleSentence: 'Hai sayang, bagaimana harimu?',
    exampleTranslation: 'Hi dear, how is your day?',
    category: 'greetings',
    difficulty: 'intermediate',
  },
  {
    id: '20',
    indonesian: 'Selamat datang',
    pronunciation: 'seh-lah-maht dah-tahng',
    english: 'Welcome',
    exampleSentence: 'Selamat datang di rumah kami.',
    exampleTranslation: 'Welcome to our home.',
    culturalContext: 'Indonesian hospitality is legendary!',
    category: 'greetings',
    difficulty: 'beginner',
  },
];

// Sample lesson
export const sampleLesson: Lesson = {
  id: 'lesson-1',
  title: 'Restaurant Basics',
  description: 'Learn essential phrases for ordering food in Indonesian restaurants.',
  category: 'food',
  xpReward: 50,
  estimatedMinutes: 10,
  phrases: [
    {
      id: 'p1',
      indonesian: 'Saya mau pesan',
      pronunciation: 'sah-yah mau peh-sahn',
      english: 'I would like to order',
      dialogue: [
        { speaker: 'Customer', line: 'Saya mau pesan, Bu.', translation: 'I would like to order, Ma\'am.' },
        { speaker: 'Waiter', line: 'Silakan, mau pesan apa?', translation: 'Please, what would you like to order?' },
      ],
    },
    {
      id: 'p2',
      indonesian: 'Menu, tolong',
      pronunciation: 'meh-noo, toh-long',
      english: 'Menu, please',
    },
    {
      id: 'p3',
      indonesian: 'Nasi goreng',
      pronunciation: 'nah-see goh-reng',
      english: 'Fried rice',
      dialogue: [
        { speaker: 'Customer', line: 'Saya mau nasi goreng.', translation: 'I want fried rice.' },
        { speaker: 'Waiter', line: 'Pakai telur?', translation: 'With egg?' },
        { speaker: 'Customer', line: 'Ya, pakai telur.', translation: 'Yes, with egg.' },
      ],
    },
    {
      id: 'p4',
      indonesian: 'Tidak pedas',
      pronunciation: 'tee-dahk peh-dahs',
      english: 'Not spicy',
    },
    {
      id: 'p5',
      indonesian: 'Berapa harganya?',
      pronunciation: 'beh-rah-pah har-gah-nyah',
      english: 'How much is it?',
    },
    {
      id: 'p6',
      indonesian: 'Minta air putih',
      pronunciation: 'min-tah ah-eer poo-teeh',
      english: 'I want plain water',
    },
    {
      id: 'p7',
      indonesian: 'Enak sekali!',
      pronunciation: 'eh-nahk seh-kah-lee',
      english: 'Very delicious!',
    },
    {
      id: 'p8',
      indonesian: 'Minta bon, ya',
      pronunciation: 'min-tah bon, yah',
      english: 'The bill, please',
    },
  ],
};

// Sample chat messages
export const sampleChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Sarah',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    senderLevel: 'Pelajar',
    message: 'Selamat pagi semua! 🌅',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isIndonesian: true,
  },
  {
    id: '2',
    senderId: 'user2',
    senderName: 'Budi',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    senderLevel: 'Mahir',
    message: 'Selamat pagi Sarah! Apa kabar hari ini?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    isIndonesian: true,
    reactions: ['👋', '❤️'],
  },
  {
    id: '3',
    senderId: 'user1',
    senderName: 'Sarah',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    senderLevel: 'Pelajar',
    message: 'Kabar baik! I just finished my first lesson on food vocabulary 🍜',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    isIndonesian: false,
  },
  {
    id: '4',
    senderId: 'user3',
    senderName: 'Made',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Made',
    senderLevel: 'Master',
    message: 'Bagus! Keep practicing, you\'re doing great! Kalian bisa mencoba menulis kalimat dengan kata-kata baru.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isIndonesian: true,
    reactions: ['🔥', '💪'],
  },
  {
    id: '5',
    senderId: 'user4',
    senderName: 'Alex',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    senderLevel: 'Pemula',
    message: 'Hi everyone! I\'m new here. Saya mau belajar Bahasa Indonesia!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isIndonesian: false,
  },
];

// Sample user profile
export const sampleUser: UserProfile = {
  id: 'user-main',
  name: 'Anya',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anya',
  level: 5,
  levelTitle: 'Pelajar',
  xp: 450,
  xpToNextLevel: 600,
  streak: 7,
  wordsLearned: 127,
  phrasesMastered: 34,
  chatMinutes: 45,
  joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  achievements: [
    {
      id: 'a1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      color: 'bg-blue-500',
      earned: true,
      earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    },
    {
      id: 'a2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      color: 'bg-orange-500',
      earned: true,
      earnedDate: new Date(),
    },
    {
      id: 'a3',
      name: 'Word Collector',
      description: 'Learn 100 words',
      icon: '📚',
      color: 'bg-purple-500',
      earned: true,
      earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: 'a4',
      name: 'Social Butterfly',
      description: 'Chat for 30 minutes total',
      icon: '🦋',
      color: 'bg-pink-500',
      earned: true,
      earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      id: 'a5',
      name: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '⭐',
      color: 'bg-yellow-500',
      earned: false,
    },
    {
      id: 'a6',
      name: 'Night Owl',
      description: 'Study after 10 PM',
      icon: '🦉',
      color: 'bg-indigo-500',
      earned: false,
    },
    {
      id: 'a7',
      name: 'Master Chef',
      description: 'Complete all food lessons',
      icon: '👨‍🍳',
      color: 'bg-red-500',
      earned: false,
    },
    {
      id: 'a8',
      name: 'Globetrotter',
      description: 'Complete all travel lessons',
      icon: '✈️',
      color: 'bg-teal-500',
      earned: false,
    },
  ],
};

// Level titles
export const levelTitles: { [key: number]: string } = {
  1: 'Pemula',
  2: 'Pemula',
  3: 'Pelajar',
  4: 'Pelajar',
  5: 'Pelajar',
  6: 'Mahir',
  7: 'Mahir',
  8: 'Ahli',
  9: 'Ahli',
  10: 'Master',
};

// Chat rooms
export const chatRooms = [
  {
    id: 'beginners',
    name: 'Beginners Lounge',
    description: 'Perfect for A1-A2 learners',
    icon: '🌱',
    members: 234,
    level: 'Beginner',
  },
  {
    id: 'intermediate',
    name: 'Intermediate Discussion',
    description: 'For B1-B2 level conversations',
    icon: '📖',
    members: 156,
    level: 'Intermediate',
  },
  {
    id: 'advanced',
    name: 'Advanced Conversations',
    description: 'Fluent speakers welcome',
    icon: '🎓',
    members: 89,
    level: 'Advanced',
  },
  {
    id: 'food',
    name: 'Food & Recipes',
    description: 'Discuss Indonesian cuisine',
    icon: '🍜',
    members: 178,
    level: 'All',
  },
  {
    id: 'travel',
    name: 'Travel Tips',
    description: 'Share travel experiences',
    icon: '✈️',
    members: 201,
    level: 'All',
  },
  {
    id: 'culture',
    name: 'Culture & Traditions',
    description: 'Learn about Indonesian culture',
    icon: '🎭',
    members: 145,
    level: 'All',
  },
];
