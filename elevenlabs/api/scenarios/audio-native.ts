import type { Scenario } from "../types/index.js";
import { completeStudioProjectJobs } from "./studio-projects.js";
export const emptyAudioNative: Scenario = ($) => {
  const c = $.loadContext("/audio-native");
  c.players = new Map(); c.articles = new Map(); c.pending = new Map();
  c.studio = () => $.loadContext("/studio/projects");
};
export const resetAudioNative: Scenario = ($) => {
  emptyAudioNative($);
  const c = $.loadContext("/audio-native");
  c.players.set("sim-project",{snapshot:null,defaults:{title:"Local article",author:"Local author",image:"",small:false,text_color:"#000000",background_color:"#ffffff",sessionization:5,audio_path:null,audio_url:null,status:"ready"}});
  c.articles.set("https://simulator.invalid/articles/local",{project:"sim-project",text:"Local synthetic article."});
};
export const completeAudioNative: Scenario = ($) => {
  const c = $.loadContext("/audio-native"), studio = c.studio();
  completeStudioProjectJobs(studio,new Set(c.pending.keys()));
  for (const [id,job] of c.pending) {
    const player = c.players.get(id);
    if (player && studio.projects.has(id)) {
      const snapshot = studio.listSnapshots(id).snapshots.find(s => !job.previousSnapshots.includes(s.project_snapshot_id));
      if (!snapshot) continue;
      player.snapshot = snapshot.project_snapshot_id;
    }
    c.pending.delete(id);
  }
};
