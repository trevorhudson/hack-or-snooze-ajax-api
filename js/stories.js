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
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const starType = findIndexFavStory(story) !== -1 ? "bi-star-fill" : "bi-star";

  return $(`
      <li id="${story.storyId}">
        <span><i class="bi ${starType}"></i></span>
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
    //if stories is in favorites list
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** /** Gets list of favorited stories from current user.
 * generates HTML, and puts on page. */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gathers data from form input. Creates new story, and appends the new story
 * onto the page.
 */

async function submitNewStory(e) {
  console.debug("submitNewStory");

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

/****************************************************************************
 * Area for Handling user favorite stories
 */

/** Function takes in a story, and it's favorite icon DOM element.
 * Toggles the story to add to the favorites list, or remove it.
 * Will also remove the page from the DOM.
 */
function toggleFavorite(story, targetIcon) {
  const index = findIndexFavStory(story);

  //if story already in favorites
  if (index === -1) {
    currentUser.addFavorite(story);
    console.log("story added to favorites");

    // if story not in favorites
  } else {
    currentUser.removeFavorite(story, index);
    console.log("story removed from favorites");
  }

  // toggles icon color
  changeIcon(targetIcon);
}

/** Toggle between icons depending if story is on favorities */
function changeIcon(eventTarget) {
  let icons = ["bi-star", "bi-star-fill"];
  eventTarget.toggleClass(icons);
}

/** Function searches favorites stories for the target story
 * Takes in a story, returns the index of the story if found, or -1.
 */
function findIndexFavStory(story) {
  // console.log("findIndexFavStory passes in", story);

  return currentUser.favorites.findIndex(
    ({ storyId }) => storyId === story.storyId
  );
}

/** Takes in a storyID, and a stories object. Returns the story that matches
 * the target storyID.
 */
function findFavStoryById(storyID, { stories }) {
  // console.log("findFavStoryById passes in", storyID);

  return stories.find(({ storyId }) => storyId === storyID);
}

/** function handles clicks to each stories favorites icon.  */
function handleFavoritesClick(e) {
  e.preventDefault();

  const $targetIcon = $(e.target);
  const $storyLi = $targetIcon.closest("li");
  const storyId = $storyLi[0].id;
  const $story = findFavStoryById(storyId, storyList);

  toggleFavorite($story, $targetIcon);
}

$("ol").on("click", "span", handleFavoritesClick);

$(".storyForm").submit(submitNewStory);
