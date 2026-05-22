const MOVIES_DATA = [
  {
    id: 'inception',
    title: 'Inception',
    shortTitle: 'Inception',
    year: 2010,
    genres: ['Sci-Fi', 'Thriller', 'Action'],
    rating: 8.8,
    director: 'Christopher Nolan',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into a CEO\'s mind.',
    canvasPos: { x: 0.42, y: 0.22 }
  },
  {
    id: 'dark_knight',
    title: 'The Dark Knight',
    shortTitle: 'Dark Knight',
    year: 2008,
    genres: ['Action', 'Crime', 'Drama'],
    rating: 9.0,
    director: 'Christopher Nolan',
    description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham City into anarchy and tests the hero\'s limits.',
    canvasPos: { x: 0.13, y: 0.42 }
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    shortTitle: 'Interstellar',
    year: 2014,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: 8.6,
    director: 'Christopher Nolan',
    description: 'Astronauts travel through a wormhole near Saturn in search of a new home for a dying humanity.',
    canvasPos: { x: 0.57, y: 0.13 }
  },
  {
    id: 'matrix',
    title: 'The Matrix',
    shortTitle: 'The Matrix',
    year: 1999,
    genres: ['Sci-Fi', 'Action'],
    rating: 8.7,
    director: 'The Wachowskis',
    description: 'A hacker discovers that reality is a simulation and joins a rebellion against the machines that built it.',
    canvasPos: { x: 0.29, y: 0.14 }
  },
  {
    id: 'parasite',
    title: 'Parasite',
    shortTitle: 'Parasite',
    year: 2019,
    genres: ['Thriller', 'Drama', 'Crime'],
    rating: 8.5,
    director: 'Bong Joon-ho',
    description: 'A poor family schemes to become employed by a wealthy household, but a long-held secret threatens them all.',
    canvasPos: { x: 0.70, y: 0.37 }
  },
  {
    id: 'pulp_fiction',
    title: 'Pulp Fiction',
    shortTitle: 'Pulp Fiction',
    year: 1994,
    genres: ['Crime', 'Drama'],
    rating: 8.9,
    director: 'Quentin Tarantino',
    description: 'Interconnected stories of Los Angeles criminals told in a bold, non-linear narrative.',
    canvasPos: { x: 0.27, y: 0.73 }
  },
  {
    id: 'shawshank',
    title: 'The Shawshank Redemption',
    shortTitle: 'Shawshank',
    year: 1994,
    genres: ['Drama'],
    rating: 9.3,
    director: 'Frank Darabont',
    description: 'Two imprisoned men bond over decades, finding solace and eventual redemption through acts of common decency.',
    canvasPos: { x: 0.51, y: 0.51 }
  },
  {
    id: 'forrest_gump',
    title: 'Forrest Gump',
    shortTitle: 'Forrest Gump',
    year: 1994,
    genres: ['Drama', 'Romance', 'Comedy'],
    rating: 8.8,
    director: 'Robert Zemeckis',
    description: 'Decades of American history as seen through the eyes of a kind-hearted man from Alabama.',
    canvasPos: { x: 0.62, y: 0.63 }
  },
  {
    id: 'goodfellas',
    title: 'GoodFellas',
    shortTitle: 'GoodFellas',
    year: 1990,
    genres: ['Crime', 'Drama'],
    rating: 8.7,
    director: 'Martin Scorsese',
    description: 'The rise and fall of Henry Hill and his associates in the New York mob from 1955 to 1980.',
    canvasPos: { x: 0.17, y: 0.64 }
  },
  {
    id: 'fight_club',
    title: 'Fight Club',
    shortTitle: 'Fight Club',
    year: 1999,
    genres: ['Drama', 'Thriller'],
    rating: 8.8,
    director: 'David Fincher',
    description: 'An insomniac office worker and a soap salesman form an underground fight club that escalates dangerously.',
    canvasPos: { x: 0.39, y: 0.45 }
  },
  {
    id: 'spirited_away',
    title: 'Spirited Away',
    shortTitle: 'Spirited Away',
    year: 2001,
    genres: ['Animation', 'Adventure', 'Fantasy'],
    rating: 8.6,
    director: 'Hayao Miyazaki',
    description: 'A girl becomes trapped in a spirit world and must work in a bathhouse to free herself and her parents.',
    canvasPos: { x: 0.82, y: 0.43 }
  },
  {
    id: 'your_name',
    title: 'Your Name',
    shortTitle: 'Your Name',
    year: 2016,
    genres: ['Animation', 'Romance', 'Drama'],
    rating: 8.4,
    director: 'Makoto Shinkai',
    description: 'Two strangers find themselves linked by a mysterious body-swapping phenomenon and search to find each other.',
    canvasPos: { x: 0.90, y: 0.53 }
  },
  {
    id: 'princess_mononoke',
    title: 'Princess Mononoke',
    shortTitle: 'Mononoke',
    year: 1997,
    genres: ['Animation', 'Adventure', 'Fantasy'],
    rating: 8.4,
    director: 'Hayao Miyazaki',
    description: 'A prince becomes embroiled in a conflict between forest gods and an iron-mining settlement.',
    canvasPos: { x: 0.80, y: 0.61 }
  },
  {
    id: 'blade_runner',
    title: 'Blade Runner 2049',
    shortTitle: 'Blade Runner',
    year: 2017,
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    rating: 8.0,
    director: 'Denis Villeneuve',
    description: 'A blade runner uncovers a buried secret that could plunge society into chaos.',
    canvasPos: { x: 0.19, y: 0.28 }
  },
  {
    id: 'arrival',
    title: 'Arrival',
    shortTitle: 'Arrival',
    year: 2016,
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    rating: 7.9,
    director: 'Denis Villeneuve',
    description: 'A linguist works with the military to communicate with alien lifeforms after ships appear worldwide.',
    canvasPos: { x: 0.67, y: 0.21 }
  },
  {
    id: 'ex_machina',
    title: 'Ex Machina',
    shortTitle: 'Ex Machina',
    year: 2014,
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    rating: 7.7,
    director: 'Alex Garland',
    description: 'A programmer is invited to administer the Turing test to an AI with a remarkably human presence.',
    canvasPos: { x: 0.78, y: 0.30 }
  },
  {
    id: 'whiplash',
    title: 'Whiplash',
    shortTitle: 'Whiplash',
    year: 2014,
    genres: ['Drama', 'Music'],
    rating: 8.5,
    director: 'Damien Chazelle',
    description: 'A young drummer pursues greatness at a prestigious music conservatory under a ruthless instructor.',
    canvasPos: { x: 0.44, y: 0.71 }
  },
  {
    id: 'la_la_land',
    title: 'La La Land',
    shortTitle: 'La La Land',
    year: 2016,
    genres: ['Romance', 'Drama', 'Music'],
    rating: 8.0,
    director: 'Damien Chazelle',
    description: 'A jazz musician and an aspiring actress fall in love while each chasing their dreams in Los Angeles.',
    canvasPos: { x: 0.55, y: 0.80 }
  },
  {
    id: 'godfather',
    title: 'The Godfather',
    shortTitle: 'Godfather',
    year: 1972,
    genres: ['Crime', 'Drama'],
    rating: 9.2,
    director: 'Francis Ford Coppola',
    description: 'The aging patriarch of a crime dynasty transfers control to his reluctant son, with far-reaching consequences.',
    canvasPos: { x: 0.07, y: 0.55 }
  },
  {
    id: 'no_country',
    title: 'No Country for Old Men',
    shortTitle: 'No Country',
    year: 2007,
    genres: ['Crime', 'Drama', 'Thriller'],
    rating: 8.2,
    director: 'Coen Brothers',
    description: 'Violence and mayhem ensue after a hunter stumbles upon drug money and a merciless killer pursues him.',
    canvasPos: { x: 0.11, y: 0.78 }
  },
  {
    id: '1917',
    title: '1917',
    shortTitle: '1917',
    year: 2019,
    genres: ['Drama', 'Action', 'War'],
    rating: 8.3,
    director: 'Sam Mendes',
    description: 'Two soldiers race against time across enemy territory to deliver a message that could save 1,600 lives.',
    canvasPos: { x: 0.34, y: 0.87 }
  },
  {
    id: 'dunkirk',
    title: 'Dunkirk',
    shortTitle: 'Dunkirk',
    year: 2017,
    genres: ['Action', 'Drama', 'War'],
    rating: 7.9,
    director: 'Christopher Nolan',
    description: 'Allied soldiers are encircled by enemy forces at Dunkirk as a massive evacuation is launched.',
    canvasPos: { x: 0.09, y: 0.31 }
  },
  {
    id: 'get_out',
    title: 'Get Out',
    shortTitle: 'Get Out',
    year: 2017,
    genres: ['Horror', 'Thriller', 'Mystery'],
    rating: 7.7,
    director: 'Jordan Peele',
    description: 'A young man visits his girlfriend\'s family estate and slowly uncovers disturbing secrets.',
    canvasPos: { x: 0.83, y: 0.73 }
  },
  {
    id: 'quiet_place',
    title: 'A Quiet Place',
    shortTitle: 'Quiet Place',
    year: 2018,
    genres: ['Horror', 'Drama', 'Sci-Fi'],
    rating: 7.5,
    director: 'John Krasinski',
    description: 'A family struggles to survive in a world inhabited by blind monsters with an acute sense of hearing.',
    canvasPos: { x: 0.91, y: 0.81 }
  },
  {
    id: 'grand_budapest',
    title: 'The Grand Budapest Hotel',
    shortTitle: 'Grand Budapest',
    year: 2014,
    genres: ['Comedy', 'Drama', 'Adventure'],
    rating: 8.1,
    director: 'Wes Anderson',
    description: 'A legendary concierge and his lobby boy become embroiled in theft, murder, and a battle for an inheritance.',
    canvasPos: { x: 0.65, y: 0.87 }
  }
];

const GRAPH_EDGES = [
  // Nolan cluster
  ['inception', 'dark_knight'],
  ['inception', 'interstellar'],
  ['dark_knight', 'interstellar'],
  ['dark_knight', 'dunkirk'],
  ['interstellar', 'dunkirk'],

  // Sci-Fi connections
  ['inception', 'matrix'],
  ['matrix', 'blade_runner'],
  ['matrix', 'ex_machina'],
  ['interstellar', 'arrival'],
  ['arrival', 'ex_machina'],
  ['blade_runner', 'ex_machina'],
  ['arrival', 'parasite'],
  ['ex_machina', 'quiet_place'],

  // Crime cluster
  ['dark_knight', 'godfather'],
  ['pulp_fiction', 'goodfellas'],
  ['goodfellas', 'godfather'],
  ['godfather', 'no_country'],
  ['no_country', 'pulp_fiction'],
  ['parasite', 'no_country'],
  ['parasite', 'godfather'],

  // Drama + Fight Club
  ['fight_club', 'inception'],
  ['fight_club', 'parasite'],
  ['fight_club', 'pulp_fiction'],
  ['fight_club', 'shawshank'],
  ['fight_club', 'no_country'],
  ['shawshank', 'godfather'],
  ['shawshank', 'forrest_gump'],
  ['forrest_gump', 'la_la_land'],
  ['whiplash', 'la_la_land'],
  ['whiplash', 'shawshank'],
  ['whiplash', 'grand_budapest'],
  ['forrest_gump', 'whiplash'],

  // War
  ['1917', 'dunkirk'],
  ['1917', 'shawshank'],

  // Animation cluster
  ['spirited_away', 'princess_mononoke'],
  ['spirited_away', 'your_name'],
  ['your_name', 'princess_mononoke'],
  ['your_name', 'la_la_land'],

  // Horror cluster
  ['get_out', 'quiet_place'],
  ['get_out', 'parasite'],
  ['get_out', 'ex_machina'],

  // Cross-genre
  ['grand_budapest', 'la_la_land'],
  ['grand_budapest', 'pulp_fiction'],
  ['blade_runner', 'arrival'],
  ['spirited_away', 'grand_budapest'],
  ['1917', 'dark_knight'],
];
