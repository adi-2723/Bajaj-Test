const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.post("/bfhl", (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];

  const seen = new Set();
  const regex = /^[A-Z]->[A-Z]$/;

  for (let entry of data) {
    const trimmed = entry.trim();

    if (!regex.test(trimmed) || trimmed[0] === trimmed[3]) {
      invalidEntries.push(entry);
    } else {
      if (seen.has(trimmed)) {
        if (!duplicateEdges.includes(trimmed)) {
          duplicateEdges.push(trimmed);
        }
      } else {
        seen.add(trimmed);
        validEdges.push(trimmed);
      }
    }
  }

  const graph = {};
  const childSet = new Set();

  for (let edge of validEdges) {
    const [parent, child] = edge.split("->");
    if (!graph[parent]) graph[parent] = [];
    graph[parent].push(child);
    childSet.add(child);
  }

  const allNodes = new Set();
  for (let edge of validEdges) {
    const [p, c] = edge.split("->");
    allNodes.add(p);
    allNodes.add(c);
  }

  const roots = [];
  for (let node of allNodes) {
    if (!childSet.has(node)) roots.push(node);
  }

  const hierarchies = [];

  for (let root of roots) {
    hierarchies.push({
      root,
      children: graph[root] || []
    });
  }

  res.json({
    user_id: "jaditya_27082005",
    email_id: "ja6645@srmist.edu.in",
    college_roll_number: "RA2311003010280",
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});