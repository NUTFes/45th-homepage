module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm run start",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/news",
        "http://localhost:3000/attention",
        "http://localhost:3000/contact",
        "http://localhost:3000/sponsors",
      ],
      numberOfRuns: 3,
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
