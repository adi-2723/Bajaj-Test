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
    console.log("Incoming body:", req.body);

    const data = req.body?.data;

    // ✅ HARD VALIDATION
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid input. Send { data: [] }"
      });
    }

    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdges = [];

    const seen = new Set();
    const regex = /^[A-Z]->[A-Z]$/;

    // ✅ SAFE LOOP
    for (let i = 0; i < data.length; i++) {
      const entry = String(data[i]).trim();

      if (!regex.test(entry) || entry[0] === entry[3]) {
        invalidEntries.push(entry);
        continue;
      }

      if (seen.has(entry)) {
        duplicateEdges.push(entry);
        continue;
      }

      seen.add(entry);
      validEdges.push(entry);
    }

    // ✅ SIMPLE SAFE GRAPH
    const graph = {};

    for (let edge of validEdges) {
      const parts = edge.split("->");

      if (parts.length !== 2) continue;

      const u = parts[0];
      const v = parts[1];

      if (!graph[u]) graph[u] = [];
      graph[u].push(v);
    }

    // ✅ SAFE NODE COLLECTION
    const nodes = new Set();
    validEdges.forEach(e => {
      const [a, b] = e.split("->");
      if (a) nodes.add(a);
      if (b) nodes.add(b);
    });

    // ✅ SAFE DFS (NO CRASH POSSIBLE)
    let totalCycles = 0;
    let totalTrees = 0;

    const visited = new Set();

    function dfs(node, stack) {
      if (!node) return false;

      if (stack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      stack.add(node);

      const neighbors = graph[node] || [];

      for (let i = 0; i < neighbors.length; i++) {
        if (dfs(neighbors[i], stack)) return true;
      }

      stack.delete(node);
      return false;
    }

    nodes.forEach(node => {
      if (!visited.has(node)) {
        const hasCycle = dfs(node, new Set());
        if (hasCycle) totalCycles++;
        else totalTrees++;
      }
    });

    // ✅ FINAL RESPONSE
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
    console.log("🔥 FULL ERROR:", err); // VERY IMPORTANT
    res.status(500).json({
      error: "Server crashed",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});