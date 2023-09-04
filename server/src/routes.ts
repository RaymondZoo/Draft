import { Request, Response } from "express";


// Description of a draft
// RI: rounds >= 0, draftID >= 0, drafters and options must only have unique elements
// order = -1 when draft has been completed
type Draft = {
  drafters: string[],
  draftID: number,
  order: number,
  rounds: number,
  options: string[],
  drafted : pick[],
  done: boolean
};

//Description of a pick in a draft
type pick = {
  drafter: string,
  option: string
}


/* Resets the Map values by clearing it and resets the draftIDgenerator by setting it to 0 */
export function reset() { 
  drafts.clear();
  draftIDgenerator = 0;
}

// Map from item name to details of the auction.
const drafts: Map<number, Draft> = new Map();

// Generates number IDs for each draft, increments to generate next ID
let draftIDgenerator: number = 0;

/** Save contents of a draft and return the ID */
export function saveDraft(req: Request, res: Response) {
  const drafters = first(req.body.drafters);
  const rounds = parseNatural("rounds", first(req.body.rounds));
  const options = first(req.body.options);
  if (drafters === undefined || !Array.isArray(JSON.parse(drafters)) ) {
    res.status(400).send('missing "drafters" parameter in body');
    return;
  }
  else if(typeof rounds === "string"){
    res.status(400).send(rounds);
    return;
  }
  else if(options === undefined || !Array.isArray(JSON.parse(options))){
    res.status(400).send('missing "options" parameter in body');
    return;
  }

  const draft: Draft = {
    drafters: JSON.parse(drafters),
    draftID: draftIDgenerator,
    rounds: rounds,
    options: JSON.parse(options),
    order: 0,
    drafted : [],
    done : false
  };
  draftIDgenerator++;
  drafts.set(draft.draftID, draft);
  res.send(""+draft.draftID);
}

/** Save a pick to the draft with the given number ID */
export function savePick(req: Request, res: Response) {
  const ID = parseNatural("ID", req.query.id);
  const drafter = first(req.body.drafter);
  const option = first(req.body.option);
  if (typeof ID === 'string') {
    res.status(400).send(ID);
    return;
  }
  else if (drafter === undefined || typeof JSON.parse(drafter) !== 'string') {
    res.status(400).send("missing 'drafter' parameter");
    return;
  }
  else if (option === undefined || typeof JSON.parse(option) !== 'string') {
    res.status(400).send("missing 'option' parameter");
    return;
  }

  const draft = drafts.get(ID);
  if (draft === undefined || draft.drafters.indexOf(JSON.parse(drafter)) === -1 ||  draft.options.indexOf(JSON.parse(option)) === -1) {
    res.status(400).send(`no draft with given ID: ${ID} or no such drafter/option`);
    return;
  }

  draft.drafted.push({drafter: JSON.parse(drafter), option: JSON.parse(option)});
  draft.options.splice(draft.options.indexOf(JSON.parse(option)), 1);

  draft.order++;
  if(draft.order === (draft.rounds*draft.drafters.length) || draft.options.length == 0)
  {
    draft.done = true;
  }

  res.send("Successfully Saved Pick");

}

/** Load the draft with the given ID. */
export function loadDraft(req: Request, res: Response) {
  const ID = parseNatural("ID", req.query.id);
  if (typeof ID === 'string') {
    res.status(400).send(ID);
    return;
  }
  const draft = drafts.get(ID);
  if (draft === undefined) {
    res.status(400).send(`no draft with given ID: ${ID}`);
    return;
  }
  res.json(draft); 
}

// Returns the given string parsed into an integer or an error message 
function parseNatural(name: string, val: unknown): number | string {
  if (val === undefined || typeof val !== 'string') {
    return `missing (or too many) '${name}' parameter`;
  }

  const amount = parseInt(val);
  if (isNaN(amount)) {
    return `invalid '${name}': ${val}`;
  }

  return amount;
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}
