
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [{"id":"TCiSxuwIgnag6jl8F2WXEbq6vk92","start":"2021-02-16T23:00:00.000Z","end":"2021-02-17T01:00:00.000Z","title":"Developer"},{"id":"TCiSxuwIgnag6jl8F2WXEbq6vk92","start":"2021-02-17T23:00:00.000Z","end":"2021-02-18T01:00:00.000Z","title":"Developer"},{"id":"TCiSxuwIgnag6jl8F2WXEbq6vk92","start":"2021-02-18T23:00:00.000Z","end":"2021-02-19T01:00:00.000Z","title":"Developer"},{"id":"7kjeer1RweaELbyJsAEMApT6KNo2","start":"2021-02-27T11:09:00.000Z","end":"2021-02-27T12:10:00.000Z","title":"B1 Crew Chief"},{"id":"7kjeer1RweaELbyJsAEMApT6KNo2","start":"2021-02-28T11:09:00.000Z","end":"2021-02-28T12:10:00.000Z","title":"A1 Crew Chief"},{"id":"TCiSxuwIgnag6jl8F2WXEbq6vk92","start":"2021-03-01T11:09:00.000Z","end":"2021-03-02T11:09:00.000Z","title":"Developer"},{"id":"VrkHZlR5rLWedraRLbG1uEF57Mm2","start":"2021-03-03T23:00:00.000Z","end":"2021-03-04T07:00:00.000Z","title":"Crew Chief"},{"id":"TCiSxuwIgnag6jl8F2WXEbq6vk92","start":"2021-03-04T11:09:00.000Z","end":"2021-03-05T11:09:00.000Z","title":"Developer"},{"id":"Bw2vmZhDT7eRrT5baJAaargTR9q1","start":"2021-03-04T23:00:00.000Z","end":"2021-03-05T07:00:00.000Z","title":"EMT"},{"id":"uqJNTuwfRPVpkFZr2faaSzZ4Bbh1","start":"2021-03-05T20:38:00.000Z","end":"2021-03-17T20:38:00.000Z","title":"null"},{"id":"5AKJU7bbe0RL0NR2pcRnDvgzL763","start":"2021-03-06T01:00:00.000Z","end":"2021-03-06T05:30:00.000Z","title":"mert guy"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-03-06T23:00:00.000Z","end":"2021-03-07T10:00:00.000Z","title":"Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-03-06T23:00:00.000Z","end":"2021-03-09T10:00:00.000Z","title":"Crew Chief"},{"id":"TCiSxuwIgnag6jl8F2WXEbq6vk92","start":"2021-03-09T23:00:00.000Z","end":"2021-03-10T01:00:00.000Z","title":"Developer"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-03-09T23:00:00.000Z","end":"2021-03-10T07:00:00.000Z","title":"Crew Chief"},{"id":"Bw2vmZhDT7eRrT5baJAaargTR9q1","start":"2021-03-11T23:00:00.000Z","end":"2021-03-12T07:00:00.000Z","title":"EMT"},{"id":"VrkHZlR5rLWedraRLbG1uEF57Mm2","start":"2021-03-16T23:00:00.000Z","end":"2021-03-17T07:00:00.000Z","title":"Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-03T17:00:00.000Z","end":"2021-11-03T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-03T17:00:00.000Z","end":"2021-11-03T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-03T17:00:00.000Z","end":"2021-11-03T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-13T17:00:00.000Z","end":"2021-11-13T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-13T17:00:00.000Z","end":"2021-11-13T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-13T17:00:00.000Z","end":"2021-11-13T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-18T17:00:00.000Z","end":"2021-11-18T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-18T17:00:00.000Z","end":"2021-11-18T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-18T17:00:00.000Z","end":"2021-11-18T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-21T10:00:00.000Z","end":"2021-11-21T13:00:00.000Z","title":"default"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-21T10:00:00.000Z","end":"2021-11-21T13:00:00.000Z","title":"default"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-11-21T10:00:00.000Z","end":"2021-11-21T13:00:00.000Z","title":"default"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-12-04T17:00:00.000Z","end":"2021-12-04T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-12-04T17:00:00.000Z","end":"2021-12-04T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-12-04T17:00:00.000Z","end":"2021-12-04T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-12-07T17:00:00.000Z","end":"2021-12-07T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-12-07T17:00:00.000Z","end":"2021-12-07T23:00:00.000Z","title":"1A Crew Chief"},{"id":"dzRgkrshE3UWSx3Cpwyl1qVhi5R2","start":"2021-12-07T17:00:00.000Z","end":"2021-12-07T23:00:00.000Z","title":"1A Crew Chief"}]


export function createEventId() {
  return String(eventGuid++)
}