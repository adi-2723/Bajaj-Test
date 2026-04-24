const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.post("/bfhl", (req, res) => {
  const { data } = req.body;

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

  const visitedGlobal = new Set();
  let totalCycles = 0;
  let totalTrees = 0;
  let largestDepth = 0;
  let largestRoot = "";

  const hierarchies = [];

  function dfs(node, visited, stack) {
    if (stack.has(node)) return { cycle: true, depth: 0 };
    if (visited.has(node)) return { cycle: false, depth: 0 };

    visited.add(node);
    stack.add(node);

    let maxDepth = 1;
    let hasCycle = false;
    let subtree = {};

    if (graph[node]) {
      for (let child of graph[node]) {
        const res = dfs(child, visited, stack);
        if (res.cycle) hasCycle = true;

        maxDepth = Math.max(maxDepth, 1 + res.depth);
        subtree[child] = res.tree || {};
      }
    }

    stack.delete(node);

    return {
      cycle: hasCycle,
      depth: maxDepth,
      tree: subtree,
    };
  }

  for (let root of roots) {
    if (visitedGlobal.has(root)) continue;

    const visited = new Set();
    const stack = new Set();

    const result = dfs(root, visited, stack);

    visited.forEach((n) => visitedGlobal.add(n));

    if (result.cycle) {
      totalCycles++;
      hierarchies.push({
        root,
        has_cycle: true,
      });
    } else {
      totalTrees++;

      if (
        result.depth > largestDepth ||
        (result.depth === largestDepth && root < largestRoot)
      ) {
        largestDepth = result.depth;
        largestRoot = root;
      }

      hierarchies.push({
        root,
        tree: { [root]: result.tree },
        depth: result.depth,
      });
    }
  }

  const remaining = [...allNodes].filter((n) => !visitedGlobal.has(n));
  const cycleVisited = new Set();

  for (let node of remaining) {
    if (cycleVisited.has(node)) continue;

    const stack = new Set();
    const visited = new Set();

    function detectCycle(n) {
      if (stack.has(n)) return [true, n];
      if (visited.has(n)) return [false, null];

      visited.add(n);
      stack.add(n);

      if (graph[n]) {
        for (let child of graph[n]) {
          const [found, start] = detectCycle(child);
          if (found) return [true, start];
        }
      }

      stack.delete(n);
      return [false, null];
    }

    const [hasCycle, startNode] = detectCycle(node);

    if (hasCycle) {
      totalCycles++;

      // collect cycle nodes
      const cycleNodes = [];
      let curr = startNode;

      do {
        cycleNodes.push(curr);
        cycleVisited.add(curr);
        curr = graph[curr][0];
      } while (curr !== startNode && !cycleNodes.includes(curr));

      cycleNodes.sort();
      const root = cycleNodes[0];

      hierarchies.push({
        root,
        has_cycle: true,
      });
    }
  }

  res.json({
    user_id: "jaditya_27082005",
    email_id: "ja6645@srmist.edu.in",
    college_roll_number: "RA2311003010280",
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
