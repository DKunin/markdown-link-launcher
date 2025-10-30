import raycast from "@raycast/eslint-config";

const flatConfig = raycast.flatMap((config) => (Array.isArray(config) ? config : [config]));

export default flatConfig;
