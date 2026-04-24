async function sendData() {
  const input = document.getElementById("input").value;

  let data;

  // ✅ JSON validation
  try {
    data = JSON.parse(input);
  } catch (e) {
    document.getElementById("output").innerText = "❌ Invalid JSON format";
    return;
  }

  document.getElementById("output").innerText = "⏳ Processing...";

  try {
    const res = await fetch("https://bfhl-backend-d4z4.onrender.com/bfhl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const result = await res.json();

    document.getElementById("output").innerText = JSON.stringify(
      result,
      null,
      2,
    );
  } catch (err) {
    document.getElementById("output").innerText = "❌ API Error";
  }
}

// ✅ Copy output
function copyOutput() {
  const text = document.getElementById("output").innerText;
  navigator.clipboard.writeText(text);
}

// ✅ Clear input
function clearInput() {
  document.getElementById("input").value = "";
  document.getElementById("output").innerText = "";
}
