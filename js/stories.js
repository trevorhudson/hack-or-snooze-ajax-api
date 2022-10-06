"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gathers data from form input. Creates new story, and appends the new story
 * onto the page.
 */

async function submitNewStory(e) {
  e.preventDefault();
  const title = $(".titleInput").val();
  const author = $(".authorInput").val();
  const url = $(".linkInput").val();

  let newStory = await storyList.addStory(currentUser, {
    title: title,
    author: author,
    url: url,
  });

  $allStoriesList.prepend(generateStoryMarkup(newStory));
  $(".storyForm input").val("");
  $(".storyForm").css("display", "none");
}

$(".storyForm").submit(submitNewStory);
