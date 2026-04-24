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

    // ✅ VALIDATE
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
    validEdges.forEach(edge => {
      const [u, v] = edge.split("->");
      if (!graph[u]) graph[u] = [];
      graph[u].push(v);
    });

    // ✅ SAFE CYCLE DETECTION (NO CRASH)
    const visited = new Set();
    const stack = new Set();

    let totalCycles = 0;
    let totalTrees = 0;

    function dfs(node) {
      if (stack.has(node)) return true; // cycle
      if (visited.has(node)) return false;

      visited.add(node);
      stack.add(node);

      if (graph[node]) {
        for (let nei of graph[node]) {
          if (dfs(nei)) return true;
        }
      }

      stack.delete(node);
      return false;
    }

    const nodes = new Set();
    validEdges.forEach(e => {
      const [a, b] = e.split("->");
      nodes.add(a);
      nodes.add(b);
    });

    nodes.forEach(node => {
      if (!visited.has(node)) {
        if (dfs(node)) totalCycles++;
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