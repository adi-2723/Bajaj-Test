const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid input. 'data' must be array"
      });
    }

    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdges = [];

    const seen = new Set();
    const regex = /^[A-Z]->[A-Z]$/;

    // ✅ VALIDATION
    for (let entry of data) {
      const trimmed = entry.trim();

      if (!regex.test(trimmed) || trimmed[0] === trimmed[3]) {
        invalidEntries.push(entry);
      } else {
        if (seen.has(trimmed)) {
          duplicateEdges.push(trimmed);
        } else {
          seen.add(trimmed);
          validEdges.push(trimmed);
        }
      }
    }

    // ✅ BUILD GRAPH
    const graph = {};
    for (let edge of validEdges) {
      const [u, v] = edge.split("->");
      if (!graph[u]) graph[u] = [];
      graph[u].push(v);
    }

    // ✅ SIMPLE TREE + CYCLE DETECTION (SAFE)
    const visited = new Set();
    const recStack = new Set();

    let totalCycles = 0;
    let totalTrees = 0;

    function hasCycle(node) {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      recStack.add(node);

      if (graph[node]) {
        for (let nei of graph[node]) {
          if (hasCycle(nei)) return true;
        }
      }

      recStack.delete(node);
      return false;
    }

    // check all nodes
    const nodes = new Set();
    validEdges.forEach(e => {
      const [a, b] = e.split("->");
      nodes.add(a);
      nodes.add(b);
    });

    nodes.forEach(node => {
      if (!visited.has(node)) {
        if (hasCycle(node)) totalCycles++;
        else totalTrees++;
      }
    });

    res.json({
      user_id: "jaditya_27082005",
      email_id: "ja6645@srmist.edu.in",
      college_roll_number: "RA2311003010280",
      valid_edges: validEdges,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: totalTrees,
        total_cycles: totalCycles
      }
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});