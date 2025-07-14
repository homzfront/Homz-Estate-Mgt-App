/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        BlackHomz: '#202020',
        BlueHomz: '#006AFF',
        BlueHomz2: '#0058D4',
        BlueHomz3: '#F9FBFF',
        BlueHomz4:'#559CFF',
        BlueHomzDark:'#002E6E',
        BlueHomz5: "#0058D4",
        GrayHomz: '#4E4E4E',
        GrayHomz2: '#A9A9A9',
        GrayHomz3: '#9BB9E4',
        GrayHomz4: '#101828',
        GrayHomz6: '#E6E6E6',
        GrayHomz5: '#D5D5D5',
        Success: '#039855',
        Success2: '#81CBAA',
        Success3: '#EBF7F2',
        Success4: '#ABDDC6',
        whiteblue: '#EEF5FF',
        lightblue: '#559CFF',
        darkblue: '#0058D4',
        lightgreen: '#81CBAA',
        darkgreen: '#039855',
        warning: '#E89A57',
        warning2: '#DC6803',
        warning3: '#EDB381',
        warning4: '#FCF3EB',
        error: '#D92D20',
        warningBg: '#FCF3EB',
        successBg: '#CDEADD',
        inputBg: "#F6F6F6",
        walletBg: "#EEF5FF",
        withdrawBg: "#FBFDFF",
        bgGray: "#FCFCFC",
        dashboardGray: "#292D32",
        textGray: "#475467",
        avatarBg: "#F2F4F7",
        logoutRed: "#D92D20",
        GrayHomzDash: "#006AFF",
        HomePageBg: "#EDF3FB",
        HomzIndigo: "#5856D6",
        bgRed:"#FDF2F2"
      },
 
    },
  },
  plugins: [],
}

