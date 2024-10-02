export const DROPDOWN_OPTIONS = [
  {
    placeholder: '🍎 Select a fruit',
    options: [
      {
        emoji: '🍎',
        label: 'Apple',
        value: 'apple',
      },
      {
        emoji: '🍊',
        label: 'Orange',
        value: 'orange',
      },
      {
        emoji: '🍇',
        label: 'Grape',
        value: 'grape',
        // assign the onSelect function in the Class component
      },
    ],
  },
  {
    placeholder: '🟥 Select a color',
    options: [
      {
        emoji: '🟥',
        label: 'Red',
        value: 'red',
      },
      {
        emoji: '🟧',
        label: 'Orange',
        value: 'orange',
      },
      {
        emoji: '🟨',
        label: 'Yellow',
        value: 'yellow',
      },
      {
        emoji: '🟩',
        label: 'Green',
        value: 'green',
      },
      {
        emoji: '🟦',
        label: 'Blue',
        value: 'blue',
      },
      {
        emoji: '🟪',
        label: 'Purple',
        value: 'purple',
      },
    ],
  },
] as {
  placeholder: string;
  options: {
    emoji: string;
    label: string;
    value: string;
  }[];
}[];
