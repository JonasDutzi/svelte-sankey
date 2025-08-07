export default {
	branches: ["main", { name: "next", prerelease: true }, { name: "next-major", prerelease: true }, { name: "beta", prerelease: true }, { name: "alpha", prerelease: true }],
	plugins: ["@semantic-release/commit-analyzer", "@semantic-release/release-notes-generator", "@semantic-release/npm", "@semantic-release/github"]
};
