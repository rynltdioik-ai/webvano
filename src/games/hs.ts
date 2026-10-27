export const getHS = (k: string) => Number(localStorage.getItem("hs_" + k) || 0);
export const setHS = (k: string, v: number) => localStorage.setItem("hs_" + k, String(v));
