import express from "express";
import bodyParser from 'body-parser';
import { loadDraft, saveDraft, savePick} from "./routes";


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.post("/api/saveDraft", saveDraft);
app.post("/api/savePick", savePick);
app.get("/api/loadDraft", loadDraft);
app.listen(port, () => console.log(`Server listening on ${port}`));
