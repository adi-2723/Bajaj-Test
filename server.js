const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS (allow your Vercel frontend)
app.use(cors({
  origin: "https://bajaj-test-sigma.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ MAIN API
app.post("/bfhl", (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const data = req.body?.data;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid input. Send { data: [] }"
      });
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
      if (!childSet.has(node)) {
        roots.push(node);
      }
    }

    let totalTrees = roots.length;

    res.json({
      user_id: "jaditya_27082005",
      email_id: "ja6645@srmist.edu.in",
      college_roll_number: "RA2311003010280",
      valid_edges: validEdges,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: {
        total_trees: totalTrees,
        total_cycles: 0,
        largest_tree_root: roots[0] || ""
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server crashed" });
  }
});

// ✅ PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});