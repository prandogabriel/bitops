export function getCallbackHtml() {
	return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OAuth Callback</title>
  </head>
  <body>
      <h2>Processing OAuth Authentication...</h2>
      <script>
          (function() {
              const hashParams = new URLSearchParams(window.location.hash.substring(1));
              const accessToken = hashParams.get("access_token");

              if (!accessToken) {
                  document.body.innerHTML = "<h2>Error: Access token not found</h2>";
                  return;
              }

              fetch("https://localhost:3000/save-token", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ accessToken })
              })
              .then(response => response.json())
              .then(data => {
                  console.log("Token saved:", data);
                  document.body.innerHTML = "<h2>Authentication successful! You can close this page.</h2>";
              })
              .catch(error => {
                  console.error("Error saving token:", error);
                  document.body.innerHTML = "<h2>Failed to save token.</h2>";
              });
          })();
      </script>
  </body>
  </html>
  `;
}
