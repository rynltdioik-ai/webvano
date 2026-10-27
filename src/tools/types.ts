export type Tool = {
  id: string;
  name: string;
  cat: string;
  run: (s: string, a: string) => string | Promise<string>;
  noInput?: boolean;
  arg?: { label: string; def: string };
};

export const t = (
  cat: string,
  name: string,
  run: Tool["run"],
  o: { noInput?: boolean; arg?: { label: string; def: string } } = {},
): Tool => ({
  id: cat + "-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  cat,
  name,
  run,
  ...o,
});
