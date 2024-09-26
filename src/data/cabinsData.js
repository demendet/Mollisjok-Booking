// src/data/cabinsData.js
const sampleImageUrl =
  'https://images.squarespace-cdn.com/content/v1/5c162bc6f793925de2e7c883/1572100623021-ANEREU0ZVDPZH4XK1B62/5V7A6534.jpg?format=2500w';

const cabinsData = [
  {
    id: 1,
    name: 'Rágesvárri',
    maxGuests: 6,
    basePrice: 1500, // Base price per night
    description:
      'The cabin is of basic standard with 5 beds, a living room, and a kitchen with simple cooking facilities. Electricity is available for lighting and charging small devices. No WC or shower. Heating is provided by a wood stove. Bed linen is included.',
    nonSmoking: true,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true, // From March 1st to May 4th
      minimumStay: 2, // Minimum stay in nights during peak season
    },
  },
  {
    id: 2,
    name: 'Bergestua',
    maxGuests: 5,
    basePrice: 1500,
    description:
      'The cabin is of basic standard with 5 beds, a living room, and a kitchen with simple cooking facilities. Electricity for lighting and charging devices. No WC or shower. Heating via wood stove. Bed linen included.',
    nonSmoking: false,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: false,
      minimumStay: 1,
    },
  },
  {
    id: 3,
    name: 'Corotjohka',
    maxGuests: 10,
    basePrice: 3000,
    description:
      'A basic standard cabin with 10 beds, living room, and simple kitchen facilities. Electricity available for lighting and charging devices. No WC or shower. Heated by wood stove. Bed linen included.',
    nonSmoking: false,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 2,
    },
  },
  {
    id: 4,
    name: 'Mettestua',
    maxGuests: 4,
    basePrice: 1500,
    description:
      'Basic standard cabin with 4 beds, living room, and simple kitchen facilities. Electricity for lighting and charging devices. No WC or shower. Heated by wood stove. Bed linen included.',
    nonSmoking: true,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 2,
    },
  },
  {
    id: 5,
    name: 'Perry',
    maxGuests: 10,
    basePrice: 3000,
    description:
      'A basic standard cabin with 10 beds, living room, and simple kitchen facilities. Electricity for lighting and charging devices. No WC or shower. Heating via wood stove. Bed linen included.',
    nonSmoking: true,
    refrigerator: true,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 2,
    },
  },
  {
    id: 6,
    name: 'Room 1',
    maxGuests: 2,
    basePrice: 1200,
    description:
      'A room for two people with basic standard, featuring a bunk bed. Bed linen included. Located close to shared bathroom and shower facilities.',
    nonSmoking: true,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 1,
    },
  },
  {
    id: 7,
    name: 'Room 2',
    maxGuests: 2,
    basePrice: 1200,
    description:
      'A basic room for two with a bunk bed. Bed linen included. Close to shared bathroom and shower facilities.',
    nonSmoking: true,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 1,
    },
  },
  {
    id: 8,
    name: 'Room 3',
    maxGuests: 2,
    basePrice: 1200,
    description:
      'Standard room accommodating two guests with a bunk bed. Bed linen included. Near shared bathroom and shower facilities.',
    nonSmoking: true,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 1,
    },
  },
  {
    id: 9,
    name: 'Room 4',
    maxGuests: 2,
    basePrice: 1200,
    description:
      'A two-person room with basic amenities and a bunk bed. Bed linen included. Located near shared bathroom and shower facilities.',
    nonSmoking: true,
    refrigerator: false,
    imageUrl: sampleImageUrl,
    policies: {
      mandatoryHalfBoard: true,
      minimumStay: 1,
    },
  },
];

export default cabinsData;
