import { RedditAngular2Page } from './app.po';

describe('reddit-angular2 App', function() {
  let page: RedditAngular2Page;

  beforeEach(() => {
    page = new RedditAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
