const { base64EncodedHtmlExample } = require("./html");

const startTime = new Date();
console.log("Start time: ", startTime.toISOString());
const results = [];
for (let i = 0; i < 5; i++) {
  results.push(
    fetch("", {
      method: "POST",
      body: JSON.stringify({
        base64EncodedHtml: base64EncodedHtmlExample,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

results
  .map(async (result, i) => {
    const res = await result;
    const json = await res.json();
    console.log(
      `Finished ${i} ${res.status} ${res.statusText} ${Object.keys(json)}`
    );
    const endTime = new Date();
    console.log("End time: ", endTime.toISOString());

    console.log(
      "Total time in seconds: ",
      (endTime.getTime() - startTime.getTime()) / 1000
    );
  })
  .map((item) => Promise.resolve(item));
