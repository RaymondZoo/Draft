// Description of a draft
// RI: rounds >= 0, drafters and options must only have unique elements
export type Draft = {
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
// Parses unkonwn data into an Draft. Will log an error and return undefined
// if it is not a valid Draft.
export function parseDraft(val: any): undefined | Draft {
    if (typeof val !== "object" || val === null) {
        console.error("not a draft", val)
        return undefined;
    }
    if (!('drafters' in val) || !Array.isArray(val.drafters) ) {
        console.error("not an object: missing or invalid 'drafters'", val)
        return undefined;
    }

    if (!('options' in val) || !Array.isArray(val.options) ) {
        console.error("not an object: missing or invalid 'options'", val)
        return undefined;
    }

    if (!('draftID' in val) || typeof val.draftID !== "number" ||
        val.draftID < 0 || isNaN(val.draftID)) {
        console.error("not an object: missing or invalid 'draftID'", val)
        return undefined;
    }

    if (!('rounds' in val) || typeof val.rounds !== "number" ||
        val.rounds < 0 || isNaN(val.rounds)) {
        console.error("not an object: missing or invalid 'rounds'", val)
        return undefined;
    }

    if (!('order' in val) || typeof val.order !== "number" ||
        val.order < 0 || isNaN(val.order)) {
        console.error("not an object: missing or invalid 'order'", val)
        return undefined;
    }

    if (!('drafted' in val) || !Array.isArray(val.drafted) ) {
        console.error("not an object: missing or invalid 'drafted'", val)
        return undefined;
    }

    if (!('done' in val) || typeof val.done !== "boolean") {
        console.error("not an object: missing or invalid 'done'", val)
        return undefined;
    }
  
    return {
      drafters: val.drafters,
      draftID: val.draftID,
      rounds: val.rounds,
      order: val.order,
      options: val.options,
      drafted: val.drafted,
      done: val.done
    };
  }
  