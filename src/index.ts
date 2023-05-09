import * as fs from "fs";
import { getRandomValues } from "crypto";
import { getComments } from "./ig-data";

const NUM_TO_SELECT = 2;

const cryptoRandomNumber = (a: number, b: number) => {
  return (
    (a + ((b - a + 1) * getRandomValues(new Uint32Array(1))[0]) / 2 ** 32) | 0
  );
};

const main = async () => {
  // Fetch comments and save them to data/comments.json
  await getComments();

  // Get comments from file
  const file = await fs.promises.readFile("data/comments.json");
  const comments = JSON.parse(file.toString());
  console.log(`Number of comments read: ${comments.length}\n`);

  // Store selected winners
  const winners: string[] = [];

  for (let i = 0; i < NUM_TO_SELECT; i++) {
    // Select post number
    let isPreviousWinner = true;
    let commentNum = 0;
    let comment = undefined;
    while (isPreviousWinner) {
      comment = comments[commentNum];
      commentNum = cryptoRandomNumber(0, comments.length - 1);
      if (!winners.includes(comment.username)) {
        isPreviousWinner = false;
      }
    }
    winners.push(comment.username);
    console.log(
      `Winner #${i + 1}: @${comment.username}\n  Comment Text: ${
        comment.text
      }\n  Timestamp: ${comment.timestamp}`
    );
  }
};

main();
