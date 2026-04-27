import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/api/health", function (request, response) {
  response.json({
    ok: true,
    app: "AhmedSolver",
    tools: ["mohrs-circle", "beam-deflection"]
  });
});

app.use(express.static(__dirname, {
  dotfiles: "ignore"
}));

app.listen(port, function () {
  console.log(`AhmedSolver preview server is running on http://localhost:${port}`);
});
