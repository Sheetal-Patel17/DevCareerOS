const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const headers = () => ({ "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("devcareer_token") });
const parse = async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.message || "Request failed"); return d; };
export const getProjects = async () => parse(await fetch(API_BASE_URL + "/projects", { headers: headers() }));
export const createProject = async (data) => parse(await fetch(API_BASE_URL + "/projects", { method:"POST", headers:headers(), body:JSON.stringify(data) }));
export const updateProject = async (id,data) => parse(await fetch(API_BASE_URL + "/projects/" + id, { method:"PUT", headers:headers(), body:JSON.stringify(data) }));
export const deleteProject = async (id) => parse(await fetch(API_BASE_URL + "/projects/" + id, { method:"DELETE", headers:headers() }));