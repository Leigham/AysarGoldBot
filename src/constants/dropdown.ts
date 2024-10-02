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

/*
Change the dropdown to a file structure to auto load the dropdowns

dropdown/
	[dropdownGroup]/[dropdown_name]/index.ts
	[dropdownGroup]/[dropdown_name]/[option_name].ts
	[dropdownGroup]/[dropdown_name]/[option_name].ts

	//https://chatgpt.com/c/66fd1f40-5d00-800d-9ab6-4e6a6d323c66 chat gpt generated me a boilerplate for this. 
 */
