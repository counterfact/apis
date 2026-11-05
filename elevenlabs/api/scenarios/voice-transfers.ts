import type {Scenario} from '../types/index.js';
import {defaultSettings} from '../routes/_.context.js';
export const resetVoiceTransfers: Scenario = ($) => {
 $.context.voiceReplicas = new Map();
 $.context.nextReplica = 0;
 $.context.replicationTargets = new Map([['sim-isolated-workspace',{billingGroup:'sim-billing-group',residency:'synthetic-eu',canWrite:true}]]);
 $.context.replicationPolicy = {central:true,sourceWrite:true,serviceAccount:false,billingGroup:'sim-billing-group',residency:'synthetic-central',categories:['generated','cloned']};
 $.context.transferDefaults = {time:1735689600,settings:defaultSettings()};
};
