module.exports = {
  content: [
    "./index.html", // Add the path to your HTML files
    "./src/**/*.html",
    "./src/**/*.js",
  ],
  safelist: ['bg-gray-200',
  'm-4',
  'rounded-lg',
  'p-4',
  'bg-gray-500',
  'm-22', 
  'mx-auto', 
  'block', 
  'text-white', 
  'flex', 
  'flex-wrap', 
  'items-center'
],
  theme: {
    extend: {
      backgroundColor: {
        'gray-100': '#f7fafc', // Or other shade of gray
      },
    },
  },
  plugins: [
    // Your plugins
  ],
};
