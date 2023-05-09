import * as dotenv from "dotenv";
import * as fs from "fs";

const API_URL = "https://graph.facebook.com/v16.0/";

export const getComments = async () => {
  dotenv.config();

  let endpoint = `${API_URL}${process.env.MEDIA_ID}?access_token=${process.env.ACCESS_TOKEN}&fields=comments{username,text,id,timestamp}`;
  const comments = [];

  let numComments = 0;

  // For some reason, the data structure changes after the first call
  let firstIter = true;

  while (true) {
    const res = await fetch(endpoint);
    if (res.status != 200) {
      console.log(res);
      break;
    }
    const body = await res.json();

    let base = body;

    // Account for different data structure on first call
    if (firstIter) {
      firstIter = false;
      base = body.comments;
    }

    comments.push(...base.data);
    numComments += base.data.length;
    console.log(`Comments saved: ${numComments}`);

    if (!base.paging || !base.paging.next) {
      // Last page of results
      break;
    }

    // Set endpoint URL for next page of results
    endpoint = base.paging.next;
    // If the process gets interrupted (due to rate-limiting or any other reason),
    // Take the last successful endpoint and use it as the new initial value for endpoint (line 9).
    console.log(endpoint);
  }
  const commentsJsonString = JSON.stringify(comments, undefined, 2);
  // Data is saved to a file in case of interruption.
  // If interrupted, you will want to change this to appendFile to avoid overwriting the old data.
  await fs.promises.writeFile("data/comments.json", commentsJsonString);
};
