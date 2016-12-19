export class NewsReddit {
  constructor(
    public id: string,
    public author: string,
    public title: string,
    public permalink: string,
    public subreddit: string,
    public url: string,
    public subreddit_id: string,
    public score: string
  ) {
  }
}