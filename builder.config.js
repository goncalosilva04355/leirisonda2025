// Builder.io configuration
module.exports = {
  // Project configuration
  apiKey: "24b5ff5dbb9f4bb493659e90291d92bc",

  // GitHub integration
  github: {
    owner: "GoncaloFonseca86",
    repo: "Builder-stellar-landing",
    branch: "ai_main_9fcae005c620",
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
