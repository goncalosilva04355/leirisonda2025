// Builder.io configuration
module.exports = {
  // Project configuration
  apiKey: process.env.BUILDER_IO_API_KEY || "",

  // GitHub integration
  github: {
    owner: "goncalosilva04355",
    repo: "Builder-stellar-landing",
    branch: "main",
    baseBranch: "main",
  },

  // Build settings
  framework: "react",
  typescript: true,

  // Sync settings
  sync: {
    enabled: true,
    autoCommit: true,
    commitMessage: "Builder.io sync: Updated from visual editor",
  },

  // File paths
  componentsDir: "src/components",
  pagesDir: "src/pages",

  // Override for sync issues
  forceSync: true,
  retryCount: 3,
  timeout: 30000,
};
