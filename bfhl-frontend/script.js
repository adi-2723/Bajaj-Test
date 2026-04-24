async function sendData() {
  const input = document.getElementById("inputData").value;
  const output = document.getElementById("output");

  try {
    output.innerText = "Processing...";

    const response = await fetch("https://your-backend-url.onrender.com/bfhl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: JSON.parse(input),
      }),
    });

    const result = await response.json();

    output.innerText = JSON.stringify(result, null, 2);
  } catch (error) {
    output.innerText = "Error: " + error.message;
  }
}
