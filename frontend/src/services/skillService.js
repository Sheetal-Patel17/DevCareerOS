const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const headers = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("devcareer_token") });
const parse = async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Request failed"); return d; };
export const getSkills = async () => parse(await fetch(API_BASE_URL + "/skills", { headers: headers() }));
export const createSkill = async (data) => parse(await fetch(API_BASE_URL + "/skills", { method:"POST", headers:headers(), body:JSON.stringify(data) }));
export const updateSkill = async (id,data) => parse(await fetch(API_BASE_URL + "/skills/" + id, { method:"PUT", headers:headers(), body:JSON.stringify(data) }));
export const deleteSkill = async (id) => parse(await fetch(API_BASE_URL + "/skills/" + id, { method:"DELETE", headers:headers() }));