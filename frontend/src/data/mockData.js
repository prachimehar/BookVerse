export const categories = [
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Mystery',
  'Poetry',
  'History',
  'Technology',
];

export const books = [
  {
    id: 'book-1',
    title: 'The Violet Library',
    author: 'Nina Hart',
    genre: 'Fantasy',
    rating: 4.9,
    price: 0,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    description:
      'A luminous tale about a library that holds every story ever written, where readers discover the books that change them.',
    tags: ['magic', 'literary', 'adventure'],
    followers: 12400,
    status: 'FREE',
    chapters: [
      { title: 'A Quiet Invitation', unlocked: true },
      { title: 'The Reading Room', unlocked: false },
      { title: 'Ink in the Moonlight', unlocked: false },
    ],
  },
  {
    id: 'book-2',
    title: 'Midnight Manuscript',
    author: 'Jason Cole',
    genre: 'Mystery',
    rating: 4.7,
    price: 199,
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    description:
      'A writer races to finish a lost manuscript while the city around him pulses with suspense and secrets.',
    tags: ['thriller', 'noir', 'suspense'],
    followers: 8700,
    status: 'PAID',
    chapters: [
      { title: 'The Last Page', unlocked: true },
      { title: 'Footsteps in Fog', unlocked: false },
      { title: 'Typewriter Confessions', unlocked: false },
    ],
  },
  {
    id: 'book-3',
    title: 'Paper Cities',
    author: 'Maya Liu',
    genre: 'Sci-Fi',
    rating: 4.8,
    price: 0,
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    description:
      'A richly imagined future where readers travel between paper cities, chasing stories that blur the line between reality and wonder.',
    tags: ['science fiction', 'worldbuilding', 'dreamy'],
    followers: 15700,
    status: 'FREE',
    chapters: [
      { title: 'Map of the Unknown', unlocked: true },
      { title: 'Skyline of Stories', unlocked: false },
      { title: 'The Library Gate', unlocked: false },
    ],
  },
  {
    id: 'book-4',
    title: 'Season of Quiet Pages',
    author: 'Aria Bennett',
    genre: 'Romance',
    rating: 4.6,
    price: 149,
    cover: 'https://images.unsplash.com/photo-1496104679561-38b3e7f1f5b0?auto=format&fit=crop&w=600&q=80',
    description:
      'An intimate love story told in letters, coffee shop evenings, and quiet pages that capture a year of change.',
    tags: ['romance', 'slow burn', 'contemporary'],
    followers: 9600,
    status: 'PAID',
    chapters: [
      { title: 'Letters on the Window', unlocked: true },
      { title: 'An Afternoon at Birch', unlocked: false },
      { title: 'Winter Pages', unlocked: false },
    ],
  },
  {
    id: 'book-5',
    title: 'The Archive of Stars',
    author: 'Noah Reed',
    genre: 'History',
    rating: 4.5,
    price: 0,
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    description:
      'A poetic nonfiction voyage through the people, places, and ideas that shaped a century of stories.',
    tags: ['history', 'biography', 'poetry'],
    followers: 11200,
    status: 'FREE',
    chapters: [
      { title: 'First Edition', unlocked: true },
      { title: 'Golden Trails', unlocked: false },
      { title: 'After the Ink', unlocked: false },
    ],
  },
];

export const writers = [
  {
    id: 'writer-1',
    name: 'Nina Hart',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    followers: 23400,
    bio: 'Fantasy author with a taste for immersive worlds and poetic characters.',
  },
  {
    id: 'writer-2',
    name: 'Jason Cole',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    followers: 18900,
    bio: 'Mystery storyteller who blends suspense with emotional depth.',
  },
  {
    id: 'writer-3',
    name: 'Maya Liu',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    followers: 27600,
    bio: 'Science fiction creator focused on lyrical futures and bold ideas.',
  },
  {
    id: 'writer-4',
    name: 'Aria Bennett',
    avatar:
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=200&q=80',
    followers: 14200,
    bio: 'Romance writer capturing tender moments and honest relationships.',
  },
];

export const reviews = [
  {
    id: 'review-1',
    reviewer: 'Zara M.',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment:
      'BookVerse feels polished, immersive, and effortless. The detail in every page is outstanding.',
  },
  {
    id: 'review-2',
    reviewer: 'Leo P.',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    rating: 4,
    comment: 'A premium reader experience with powerful discovery tools and elegant design.',
  },
  {
    id: 'review-3',
    reviewer: 'Anika S.',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    rating: 4.5,
    comment: 'I love the modern tone and smooth interactions. Great for readers and writers alike.',
  },
];
