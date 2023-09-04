import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { saveDraft, loadDraft, reset, savePick} from './routes';


describe('routes', function() {

  it('saveDraft', function() {
    //SUCCESSFUL SAVE #1
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveDraft', body: 
        {drafters: JSON.stringify(["Kevin", "Zatloukal"]), 
        rounds: JSON.stringify(3), options: JSON.stringify(["Lebron", "Steph", "Nikola"])}}); 
    const res1 = httpMocks.createResponse();
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(0)}}); 
    const res2 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(parseInt(res1._getData()), 0);
    loadDraft(req2, res2);
    assert.deepStrictEqual(res2._getJSONData(), {drafters: ["Kevin", "Zatloukal"], draftID: 0,
     order: 0, rounds: 3, done: false, drafted: [], options: ["Lebron", "Steph", "Nikola"]});

    //SUCCESSFUL SAVE #2
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Spurs", "Hornets", "Rockets"]), 
      rounds: JSON.stringify(6), options: JSON.stringify(["Wemby", "Paolo", "Green", "Cade"])}}); 
    const res3 = httpMocks.createResponse();
    const req4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(1)}}); 
    const res4 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req3, res3);
    // check that the request was successful
    assert.deepStrictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(parseInt(res3._getData()), 1);
    loadDraft(req4, res4);
    assert.deepStrictEqual(res4._getJSONData(), {drafters: ["Spurs", "Hornets", "Rockets"], done: false, drafted: [],
    draftID: 1, order: 0, rounds: 6, options: ["Wemby", "Paolo", "Green", "Cade"]});

    reset();

    //FAILED SAVE, DRAFTERS ERROR #1, Not an array 
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify("Seattle Supersonics"),
      rounds: JSON.stringify(6), options: JSON.stringify(["Wemby", "Paolo", "Green", "Cade"])}}); 
    const res5 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req5, res5);
    // check that the request was not successful
    assert.deepStrictEqual(res5._getStatusCode(), 400);

    //FAILED SAVE, DRAFTERS ERROR #2, Undefined
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft',  body: 
      {drafters: JSON.stringify(undefined), 
      rounds: JSON.stringify(3), options: JSON.stringify(["Lebron", "Steph", "Nikola"])}}); 
    const res6 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req6, res6);
    // check that the request was not successful
    assert.deepStrictEqual(res6._getStatusCode(), 400);

    //FAILED SAVE, ROUNDS ERROR #1, Not a number
    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Kevin", "Zatloukal"]), 
      rounds: JSON.stringify("Kevin Durant"), options: JSON.stringify(["Lebron", "Steph", "Nikola"])}}); 
    const res9 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req9, res9);
    // check that the request was not successful
    assert.deepStrictEqual(res9._getStatusCode(), 400);

    //FAILED SAVE, ROUNDS ERROR #2, undefined
    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Spurs", "Hornets", "Rockets", "Portland"]), 
      rounds: JSON.stringify(undefined), options: JSON.stringify(["Wemby", "Paolo", "Green", "Cade", "Chet"])}}); 
    const res10 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req10, res10);
    // check that the request was not successful
    assert.deepStrictEqual(res10._getStatusCode(), 400);

    //FAILED SAVE, OPTIONS ERROR #1, not a list
    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Spurs", "Hornets", "Rockets", "Portland"]),  
      rounds: JSON.stringify(3), options: JSON.stringify("LebronStephNikolaDurantMurray")}}); 
    const res11 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req11, res11);
    // check that the request was not successful
    assert.deepStrictEqual(res11._getStatusCode(), 400);

    //FAILED SAVE, OPTIONS ERROR #2, undefined
    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Kevin", "Zatloukal"]), 
      rounds: JSON.stringify(8), options: JSON.stringify(undefined)}}); 
    const res12 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req12, res12);
    // check that the request was not successful
    assert.deepStrictEqual(res12._getStatusCode(), 400);
  });

  it('loadDraft', function() {
    //SUCCESSFUL LOAD #1
    reset();
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/saveDraft', body: 
        {drafters: JSON.stringify(["Edison", "Raymond", "Xander", "Xavier"]),
        rounds: JSON.stringify(3), options: JSON.stringify(["Pikachu", "Charizard", "Buizel", "Lucario"])}}); 
    const res1 = httpMocks.createResponse();
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(0)}}); 
    const res2 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    loadDraft(req2, res2);
    assert.deepStrictEqual(res2._getJSONData(), {drafters: ["Edison", "Raymond", "Xander", "Xavier"], done: false, drafted: [],
      draftID: 0, order: 0,  rounds: 3, options: ["Pikachu", "Charizard", "Buizel", "Lucario"]});

    //SUCCESSFUL LOAD #2
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Jonny", "Troy", "Gurtej", "Anson"]), 
      rounds: JSON.stringify(43), options: JSON.stringify(["NY Strip", "Porterhouse", "T Bone", "Ribeye"])}}); 
    const res3 = httpMocks.createResponse();
    const req4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(1)}}); 
    const res4 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req3, res3);
    // check that the request was successful
    assert.deepStrictEqual(res3._getStatusCode(), 200);
    loadDraft(req4, res4);
    assert.deepStrictEqual(res4._getJSONData(), {drafters: ["Jonny", "Troy", "Gurtej", "Anson"], done: false, drafted: [],
      draftID: 1, order: 0, rounds: 43, options: ["NY Strip", "Porterhouse", "T Bone", "Ribeye"]});

    reset();

    //FAILED LOAD, ID ERROR #1, Not a number
    const req5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify("Petal on the Moon")}}); 
    const res5 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req5, res5);
    // check that the request was not successful
    assert.deepStrictEqual(res5._getStatusCode(), 400);

    //FAILED LOAD, ID ERROR #2, Undefined
    const req6 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(undefined)}}); 
    const res6 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req6, res6);
    // check that the request was not successful
    assert.deepStrictEqual(res6._getStatusCode(), 400);

    //FAILED LOAD, NO SUCH DRAFT #1
    const req7 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(33)}}); 
    const res7 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req7, res7);
    // check that the request was not successful
    assert.deepStrictEqual(res7._getStatusCode(), 400);

    //FAILED LOAD, NO SUCH DRAFT #2
    const req8 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(89)}}); 
    const res8 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req8, res8);
    // check that the request was not successful
    assert.deepStrictEqual(res8._getStatusCode(), 400);
  });

  it('savePick', function() {
    reset();
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/saveDraft', body: 
      {drafters: JSON.stringify(["Kevin", "Zatloukal"]), 
      rounds: JSON.stringify(1), options: JSON.stringify(["Lebron", "Steph", "Nikola", "Durant", "Luka", "Murray"])}}); 
    const res1 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    saveDraft(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);

    //SAVEPICK SUCCESS #1 
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify("Lebron")}}); 
    const res2 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req2, res2);
    // check that the request was successful
    assert.deepStrictEqual(res2._getStatusCode(), 200);

    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(0)}}); 
    const res3 = httpMocks.createResponse();
    
    loadDraft(req3, res3);
    assert.deepStrictEqual(res3._getJSONData(), {drafters: ["Kevin", "Zatloukal"], 
    draftID: 0, order: 1, rounds: 1, done: false,
    drafted: [{drafter:"Kevin", option: "Lebron"}],
    options: ["Steph", "Nikola", "Durant", "Luka", "Murray"]});

    //SAVEPICK SUCCESS #2 
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Zatloukal"), option: JSON.stringify("Luka")}}); 
    const res4 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req4, res4);
    // check that the request was successful
    assert.deepStrictEqual(res4._getStatusCode(), 200);

    const req5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/loadDraft', query: {id: JSON.stringify(0)}}); 
    const res5 = httpMocks.createResponse();
    
    loadDraft(req5, res5);
    assert.deepStrictEqual(res5._getJSONData(), {drafters: ["Kevin", "Zatloukal"], 
    draftID: 0, order: 2, rounds: 1, done: true,
    drafted: [{drafter:"Kevin", option: "Lebron"}, {drafter: "Zatloukal", option: "Luka"}],
    options: ["Steph", "Nikola", "Durant", "Murray"]});

    //SAVEPICK FAIL, ID ERROR #1, string
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify("1")}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify("Durant")}}); 
    const res6 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req6, res6);
    // check that the request was successful
    assert.deepStrictEqual(res6._getStatusCode(), 400);

    //SAVEPICK FAIL, ID ERROR #2, undefined
    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(undefined)}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify("Durant")}}); 
    const res7 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req7, res7);
    // check that the request was successful
    assert.deepStrictEqual(res7._getStatusCode(), 400);

    //SAVEPICK FAIL, DRAFTER ERROR #1, not a string
    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify(76), option: JSON.stringify("Durant")}}); 
    const res8 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req8, res8);
    // check that the request was successful
    assert.deepStrictEqual(res8._getStatusCode(), 400);

    //SAVEPICK FAIL, DRAFTER ERROR #2, undefined
    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify(undefined), option: JSON.stringify("Durant")}}); 
    const res9 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req9, res9);
    // check that the request was successful
    assert.deepStrictEqual(res9._getStatusCode(), 400);

    //SAVEPICK FAIL, OPTION ERROR #1, not a string
    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify(891)}}); 
    const res10 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req10, res10);
    // check that the request was successful
    assert.deepStrictEqual(res10._getStatusCode(), 400);

    //SAVEPICK FAIL, OPTION ERROR #2, undefined
    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Zatloukal"), option: JSON.stringify(undefined)}}); 
    const res11 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req11, res11);
    // check that the request was successful
    assert.deepStrictEqual(res11._getStatusCode(), 400);


    //SAVEPICK FAIL, ID NOT FOUND #1
    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify("9")}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify("Durant")}}); 
    const res12 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req12, res12);
    // check that the request was successful
    assert.deepStrictEqual(res12._getStatusCode(), 400);

    //SAVEPICK FAIL, ID NOT FOUND #2
    const req13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify("89")}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify("Durant")}}); 
    const res13 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req13, res13);
    // check that the request was successful
    assert.deepStrictEqual(res13._getStatusCode(), 400);


    //SAVEPICK FAIL, DRAFTER NOT FOUND #1
    const req14 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Haymundo"), option: JSON.stringify("Murray")}}); 
    const res14 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req14, res14);
    // check that the request was successful
    assert.deepStrictEqual(res14._getStatusCode(), 400);

    //SAVEPICK FAIL, DRAFTER NOT FOUND #2
    const req15 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Reimund"), option: JSON.stringify("Murray")}}); 
    const res15 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req15, res15);
    // check that the request was successful
    assert.deepStrictEqual(res15._getStatusCode(), 400);

    //SAVEPICK FAIL, OPTION NOT FOUND #1, not a string
    const req16 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Kevin"), option: JSON.stringify("Lebron")}}); 
    const res16 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req16, res16);
    // check that the request was successful
    assert.deepStrictEqual(res16._getStatusCode(), 400);

    //SAVEPICK FAIL, OPTION NOT FOUND #2, undefined
    const req17 = httpMocks.createRequest(
      {method: 'POST', url: '/api/savePick', query: {id: JSON.stringify(0)}, body: 
      {drafter: JSON.stringify("Zatloukal"), option: JSON.stringify("Luka")}}); 
    const res17 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    savePick(req17, res17);
    // check that the request was successful
    assert.deepStrictEqual(res11._getStatusCode(), 400);

  });

});
