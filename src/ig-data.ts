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
    let res = await fetch(endpoint);
    if (res.status != 200) {
      console.log(res);
      break;
    }
    let body = await res.json();

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
    console.log(endpoint);
  }
  let commentsJsonString = JSON.stringify(comments, undefined, 2);
  await fs.promises.appendFile("data/comments.json", commentsJsonString);
};
