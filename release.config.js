export default {
	branches: ["main", "next", "next-major", { name: "beta", prerelease: true }, { name: "alpha", prerelease: true }],
	plugins: ["@semantic-release/commit-analyzer", "@semantic-release/release-notes-generator", "@semantic-release/npm", "@semantic-release/github"]
};
