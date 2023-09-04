import * as assert from 'assert';
import { parseDraft } from './draft';


describe('draft', function() {

    it('parseDraft', function() {
        //SUCCESSFUL PARSE #1
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 0, order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray"]}), 

        {drafters: ["Kevin", "Zatloukal"], draftID: 0, order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray"]}
        )

        //SUCCESSFUL PARSE #2
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal", "KZ", "KCZ", "KevZ"], draftID: 0, order: 3, rounds: 5, done: true,
        drafted: [ {drafter: "KZ", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), 

        {drafters: ["Kevin", "Zatloukal", "KZ", "KCZ", "KevZ"], draftID: 0, order: 3, rounds: 5, done: true,
        drafted: [{drafter: "KZ", option: "Luka"}],
        options:["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        )

        //UNSUCCESSFUL #1, val not an object 
        assert.deepStrictEqual(parseDraft("why"), undefined);
        //UNSUCCESSFUL #2, val undefined
        assert.deepStrictEqual(parseDraft(undefined), undefined);

        //UNSUCCESSFUL #1, missing drafters
        assert.deepStrictEqual(parseDraft({
        draftID: 0, order: 3, rounds: 5, done: true,
        drafted: [ {drafter: "KZ", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid drafters
        assert.deepStrictEqual(parseDraft({drafters: "undefined", 
        draftID: 0, order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray"]}), undefined);

        //UNSUCCESSFUL #1, missing options
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"],
        draftID: 0, order: 3, rounds: 5, done: true,
        drafted: [ {drafter: "KZ", option: "Luka"}]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid options
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 0, order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: "undefined"}), undefined);

        //UNSUCCESSFUL #1, missing draftID
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"],
        order: 3, rounds: 5, done: true,
        drafted: [ {drafter: "KZ", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid draftID
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: -1, order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);
        //UNSUCCESSFUL #3, invalid draftID
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: NaN, order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);
        //UNSUCCESSFUL #4, invalid draftID
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: "hehe", order: 1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);

        //UNSUCCESSFUL #1, missing rounds
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"],
        draftID: 1, order: 3, done: true,
        drafted: [ {drafter: "KZ", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid rounds
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: 1, rounds: -21, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);
        //UNSUCCESSFUL #3, invalid rounds
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: 1, rounds: NaN, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);
        //UNSUCCESSFUL #4, invalid rounds
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: 1, rounds: "weewoo", done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);

        //UNSUCCESSFUL #1, missing order
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"],
        draftID: 1, rounds: 1, done: true,
        drafted: [ {drafter: "KZ", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid order
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: -1, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);
        //UNSUCCESSFUL #3, invalid order
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: NaN, rounds: 1, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);
        //UNSUCCESSFUL #4, invalid order
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: "beepboop", rounds: 3, done: false,
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);

        //UNSUCCESSFUL #1, missing drafted
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"],
        draftID: 1, order: 1, rounds: 1, done: true,
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid drafted
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: 1, rounds: 1, done: false,
        drafted: 32,
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);

        //UNSUCCESSFUL #1, missing done
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"],
        draftID: 1, order: 1, rounds: 1, 
        drafted: [ {drafter: "KZ", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}
        ), undefined);
        //UNSUCCESSFUL #2, invalid done
        assert.deepStrictEqual(parseDraft({drafters: ["Kevin", "Zatloukal"], 
        draftID: 1, order: 1, rounds: 1, done: "89",
        drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
        options: ["Steph", "Nikola", "Durant", "Murray", "Dejounte", "Melo"]}), undefined);

    });

});