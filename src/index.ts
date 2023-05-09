import * as fs from "fs";
import { getRandomValues } from "crypto";
import { DateTime } from "luxon";
import { getComments } from "./ig-data";

const NUM_TO_SELECT = 2;
const DEADLINE = "2023-05-08T00:00"; // ISO 8601 timestamp in local time

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

  // Deadline timestamp
  const deadline = DateTime.fromISO(DEADLINE);

  for (let i = 0; i < NUM_TO_SELECT; i++) {
    // Select post number
    let isPreviousWinner = true;
    let commentNum = 0;
    let comment = undefined;
    let commentTimestamp = DateTime.fromSeconds(0);
    while (isPreviousWinner) {
      comment = comments[commentNum];
      commentTimestamp = DateTime.fromISO(comment.timestamp, { zone: "UTC" });
      commentNum = cryptoRandomNumber(0, comments.length - 1);
      // Checks: Not a previous winner & submitted before deadline
      if (!winners.includes(comment.username) && commentTimestamp < deadline) {
        isPreviousWinner = false;
      }
    }
    winners.push(comment.username);
    console.log(
      `Winner #${i + 1}: @${comment.username}\n  Comment Text: ${
        comment.text
      }\n  Timestamp: ${commentTimestamp
        .setZone("system")
        .toLocaleString(DateTime.DATETIME_FULL)}`
    );
  }
};

main();
