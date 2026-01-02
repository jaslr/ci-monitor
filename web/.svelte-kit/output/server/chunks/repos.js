const repos = {
  jaslr: [
    "orchon",
    "livna",
    "brontiq",
    "shippywhippy",
    "loadmanagement",
    "Ladderbox",
    "littlelistoflights",
    "wwc"
  ],
  "jvp-ux": [
    "vastpuddle.com.au",
    "support.junipa.com.au",
    "junipa-organisations",
    "junipa.com.au"
  ]
};
const ownerPATEnvVar = {
  jaslr: "GITHUB_PAT_JASLR",
  "jvp-ux": "GITHUB_PAT_JVP_UX"
};
export {
  ownerPATEnvVar as o,
  repos as r
};
