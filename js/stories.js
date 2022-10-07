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

{
  /* <i class="bi bi-star"></i>
<i class="bi bi-moon-stars-fill"></i>; */
}

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // TODO: ADD A FAVORITES ICON;//
  const hostName = story.getHostName();
  //if in our favorites list have markup of filled star
  console.log(findIndexOfStory(story), "index of ");
  let star = findIndexOfStory(story) !== -1 ? "bi-star-fill" : "bi-star";
  console.log(star, "star");
  return $(`
      <li id="${story.storyId}">
        <span><i class="bi ${star}"></i></span>
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

/** Display favorites */
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

/** favorites button handler function:
 * On click, toggle class of icon. (from black to white)
 * add or remove item from favorites */

/** TODO:Takes in a story. Function adds the story to the favorites list if it is
 * not present, or removes it if it already exists.
 *
 *
 */
function toggleFavorite(story, targetEl) {
  changeIcon(targetEl);
  // const {story} = event.target
  //console.log(targetEl, "targetEl in toggleFav");
  const { favorites } = currentUser;
  const { storyId } = story;
  // get story by ID

  // toggle icon on or off:

  // if target has class of ON
  // then remove from favorites
  // if target has class of OFF
  // add to favorite

  // const eventStoryID = Story.getStoryID(story);
  const index = findIndexOfStory(story);
  console.log(index, "toggleFavorite");
  //if story already in favorites
  if (index === -1) {
    currentUser.addFavorite(story);
    console.log("story added");
    // toggle favorites icon ON
    //return "Story added to favorites";
    // if story not in favorites
  } else {
    currentUser.removeFavorite(story, index);
    console.log("story removed");
    // toggle favorites icon OFF
    //return "Story removed to favorites";
  }
}

/** Toggle between icons depending if story is on favorities */
function changeIcon(eventTarget) {
  //change icon takes in event target. Then pass in that element
  let icons = ["bi-star", "bi-star-fill"];
  eventTarget.toggleClass(icons);
}

/** TODO:checks the current favorite stories. takes in a story ID. returns
 * the index of the story if found, or -1 if not found.
 */
function findIndexOfStory(story) {
  console.log("findIndexOfStory passes in", story);
  return currentUser.favorites.findIndex(
    ({ storyId }) => storyId === story.storyId
  );
}

/** Takes in a storyID, and a stories object. Returns the story that matches
 * the target storyID.
 */
function findStoryById(eventStoryID, { stories }) {
  console.log("findStoryById passes in", eventStoryID);
  return stories.find(({ storyId }) => storyId === eventStoryID);
}

// TODO: click handler for favorites button submit
// calls isFavorite function

function handleFavoritesClick(e) {
  e.preventDefault();
  const targetEl = $(e.target);
  const storyID = targetEl.closest("li")[0].id;
  const story = findStoryById(storyID, storyList);
  toggleFavorite(story, targetEl);
  // call toggleFavorite(story)

  // const { story } = e.target;
  // this.toggleFavorite(story);
}

$("ol").on("click", "span", handleFavoritesClick);

$(".storyForm").submit(submitNewStory);
