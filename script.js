// HTML elements
// Cube
const cube = document.querySelector(".cube");
// Minicube
const miniCubes = cube.querySelectorAll(".minicube");
// Control buttons
const controlsBtns = document.querySelectorAll("button");
const minicubeControls = document.querySelector(".minicube__controls");
const cubeControls = document.querySelector(".cube__controls");
// Move minicubes buttons
const leftUpBtn = document.querySelector(".left-up-btn");
const leftDownBtn = document.querySelector(".left-down-btn");
const midUpBtn = document.querySelector(".mid-up-btn");
const midDownBtn = document.querySelector(".mid-down-btn");
const rightUpBtn = document.querySelector(".right-up-btn");
const rightDownBtn = document.querySelector(".right-down-btn");
const topLeftBtn = document.querySelector(".top-left-btn");
const topRightBtn = document.querySelector(".top-right-btn");
const midLeftBtn = document.querySelector(".mid-left-btn");
const midRightBtn = document.querySelector(".mid-right-btn");
const botLeftBtn = document.querySelector(".bot-left-btn");
const botRightBtn = document.querySelector(".bot-right-btn");
// Rotate cube buttons
const cubeUpBtn = document.querySelector(".cube-up-btn");
const cubeDownBtn = document.querySelector(".cube-down-btn");
const cubeLeftBtn = document.querySelector(".cube-left-btn");
const cubeRightBtn = document.querySelector(".cube-right-btn");

//----------------------------------------------------------------

// Eventlisteners
leftUpBtn.addEventListener("click", moveLeftUp);
leftDownBtn.addEventListener("click", moveLeftDown);
midUpBtn.addEventListener("click", moveMidUp);
midDownBtn.addEventListener("click", moveMidDown);
rightUpBtn.addEventListener("click", moveRightUp);
rightDownBtn.addEventListener("click", moveRightDown);
topLeftBtn.addEventListener("click", moveTopLeft);
topRightBtn.addEventListener("click", moveTopRight);
midLeftBtn.addEventListener("click", moveMidLeft);
midRightBtn.addEventListener("click", moveMidRight);
botLeftBtn.addEventListener("click", moveBotLeft);
botRightBtn.addEventListener("click", moveBotRight);
cubeUpBtn.addEventListener("click", () => moveCube("up"));
cubeDownBtn.addEventListener("click", () => moveCube("down"));
cubeLeftBtn.addEventListener("click", () => moveCube("left"));
cubeRightBtn.addEventListener("click", () => moveCube("right"));
setUpPointerEvents();

//----------------------------------------------------------------

// Helper variable
let moving = false;

//----------------------------------------------------------------

// Resize observer
const resizeObserver = new ResizeObserver(() => {
  miniCubes.forEach((c) => {
    c.classList.add("resize");
  });
});
resizeObserver.observe(cube);

//----------------------------------------------------------------

// Add document touchmove
if ("ontouchstart" in document.documentElement) {
  document.addEventListener("touchmove", handleTouchMove, false);
}

//----------------------------------------------------------------

// Do the touch detection stuff here
let xDown = null;
let yDown = null;
let touchedMinicube = null;

// Touchstart
function handleTouchStart(e) {
  e.preventDefault();
  touchedMinicube = e.currentTarget.parentElement;
  // First touch
  const firstTouch = e.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

// Touchmove
function handleTouchMove(e) {
  // Guard
  if (!xDown || !yDown) {
    return;
  }
  // Difference
  var xDiff = xDown - e.touches[0].clientX;
  var yDiff = yDown - e.touches[0].clientY;
  // Move right or left
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      if (touchedMinicube.classList.contains("top")) {
        moveTopLeft();
      } else if (touchedMinicube.classList.contains("mid1")) {
        moveMidLeft();
      } else {
        moveBotLeft();
      }
    } else {
      if (touchedMinicube.classList.contains("top")) {
        moveTopRight();
      } else if (touchedMinicube.classList.contains("mid1")) {
        moveMidRight();
      } else {
        moveBotRight();
      }
    }
    // Move up or down
  } else {
    if (yDiff > 0) {
      if (touchedMinicube.classList.contains("left")) {
        moveLeftUp();
      } else if (touchedMinicube.classList.contains("mid2")) {
        moveMidUp();
      } else {
        moveRightUp();
      }
    } else {
      if (touchedMinicube.classList.contains("left")) {
        moveLeftDown();
      } else if (touchedMinicube.classList.contains("mid2")) {
        moveMidDown();
      } else {
        moveRightDown();
      }
    }
  }
  // Reset
  xDown = null;
  yDown = null;
}

//----------------------------------------------------------------

// Custom timeout using promise
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Do some start stuff here
window.addEventListener("load", async () => {
  // Disable pointer events
  document.body.style.pointerEvents = "none";
  await timeout(500); // short timeout
  // Async calls to the move functions
  await moveLeftUp();
  await moveTopLeft();
  await moveMidDown();
  // Show the control buttons
  cubeControls.style.visibility = "visible";
  cubeControls.style.opacity = 1;
  //Check if we are on a touch screen device
  if (!("ontouchstart" in document.documentElement)) {
    minicubeControls.style.visibility = "visible";
    minicubeControls.style.opacity = 1;
  }
  // Make the cube and buttons interactable now
  document.body.style.removeProperty("pointer-events");
});

//----------------------------------------------------------------

// Setting up the touch events for the minicube front sides
function setUpPointerEvents() {
  if ("ontouchstart" in document.documentElement) {
    document.querySelectorAll(".minicube__side.front").forEach((front) => {
      front.addEventListener("touchstart", handleTouchStart, { once: true });
    });
  }
}

//----------------------------------------------------------------

// Move functions
function moveCube(direction) {
  // Guard
  if (moving) return;
  moving = true;
  cube.classList.remove("a", "b");
  // Rotate the cube
  switch (direction) {
    case "up":
      cube.classList.add("b");
      cube.style.setProperty("--rotate-cube-x", +90);
      break;
    case "down":
      cube.classList.add("b");
      cube.style.setProperty("--rotate-cube-x", -90);
      break;
    case "left":
      cube.classList.add("a");
      cube.style.setProperty("--rotate-cube-y", -90);
      break;
    case "right":
      cube.classList.add("a");
      cube.style.setProperty("--rotate-cube-y", +90);
      break;
  }
  // Wait for the transition to finish
  cube.addEventListener(
    "transitionend",
    () => {
      // Remove the rotation custom properties
      cube.style.removeProperty("--rotate-cube-x");
      cube.style.removeProperty("--rotate-cube-y");
      cube.style.transition = "none";
      cube.offsetWidth;
      // Move the minicubes
      miniCubes.forEach((mini) => {
        switch (direction) {
          case "up":
            moveUp(mini, false);
            break;
          case "down":
            moveDown(mini, false);
            break;
          case "left":
            moveLeft(mini, false);
            break;
          case "right":
            moveRight(mini, false);
            break;
        }
      });
      moving = false;
      cube.style.transition = "";
    },
    { once: true }
  );
}

function moveLeftUp() {
  // Guard
  if (moving) return;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.left").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateX = getComputedStyle(c).getPropertyValue("--rotate-x");
    c.style.setProperty("--rotate-x", Number(rotateX) + 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveUp(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveLeftDown() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.left").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateX = getComputedStyle(c).getPropertyValue("--rotate-x");
    c.style.setProperty("--rotate-x", Number(rotateX) - 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveDown(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveMidUp() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.mid2").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateX = getComputedStyle(c).getPropertyValue("--rotate-x");
    c.style.setProperty("--rotate-x", Number(rotateX) + 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveUp(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveMidDown() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.mid2").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateX = getComputedStyle(c).getPropertyValue("--rotate-x");
    c.style.setProperty("--rotate-x", Number(rotateX) - 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveDown(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveRightUp() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.right").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateX = getComputedStyle(c).getPropertyValue("--rotate-x");
    c.style.setProperty("--rotate-x", Number(rotateX) + 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveUp(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveRightDown() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.right").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateX = getComputedStyle(c).getPropertyValue("--rotate-x");
    c.style.setProperty("--rotate-x", Number(rotateX) - 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveDown(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveTopLeft() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.top").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateY = getComputedStyle(c).getPropertyValue("--rotate-y");
    c.style.setProperty("--rotate-y", Number(rotateY) - 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveLeft(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveTopRight() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.top").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateY = getComputedStyle(c).getPropertyValue("--rotate-y");
    c.style.setProperty("--rotate-y", Number(rotateY) + 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveRight(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveMidLeft() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.mid1").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateY = getComputedStyle(c).getPropertyValue("--rotate-y");
    c.style.setProperty("--rotate-y", Number(rotateY) - 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveLeft(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveMidRight() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.mid1").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateY = getComputedStyle(c).getPropertyValue("--rotate-y");
    c.style.setProperty("--rotate-y", Number(rotateY) + 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveRight(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveBotLeft() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.bot").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateY = getComputedStyle(c).getPropertyValue("--rotate-y");
    c.style.setProperty("--rotate-y", Number(rotateY) - 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveLeft(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

function moveBotRight() {
  // Guard
  if (moving) return;
  moving = true;
  let promises = [];
  // Loop thru all minicubes
  cube.querySelectorAll(".minicube.bot").forEach((c) => {
    c.style.removeProperty("transition");
    c.classList.remove("resize");
    const rotateY = getComputedStyle(c).getPropertyValue("--rotate-y");
    c.style.setProperty("--rotate-y", Number(rotateY) + 90);
    // Push the promise
    promises.push(
      new Promise((resolve) => {
        c.addEventListener(
          "transitionend",
          () => {
            c.style.removeProperty("--rotate-x");
            c.style.removeProperty("--rotate-y");
            c.style.transition = "none";
            moveRight(c);
            moving = false;
            resolve();
          },
          { once: true }
        );
      })
    );
  });
  return Promise.all(promises);
}

// Move a minicube
function moveDown(c, solve = true) {
  // Front side
  if (c.matches(".front.top")) {
    c.classList.remove("top");
    c.classList.add("bot");
  } else if (c.matches(".front.mid1")) {
    c.classList.remove("front", "mid1");
    c.classList.add("middle", "bot");
  } else if (c.matches(".front.bot")) {
    c.classList.remove("front");
    c.classList.add("back");
  }
  // Middle side
  else if (c.matches(".middle.top")) {
    c.classList.remove("middle", "top");
    c.classList.add("front", "mid1");
  } else if (c.matches(".middle.mid1")) {
    return;
  } else if (c.matches(".middle.bot")) {
    c.classList.remove("middle", "bot");
    c.classList.add("back", "mid1");
    // Back side
  } else if (c.matches(".back.top")) {
    c.classList.remove("back");
    c.classList.add("front");
  } else if (c.matches(".back.mid1")) {
    c.classList.remove("back", "mid1");
    c.classList.add("middle", "top");
  } else if (c.matches(".back.bot")) {
    c.classList.remove("bot");
    c.classList.add("top");
  }
  // Set up pointer events
  setUpPointerEvents();
  // Change minicube CSS classes
  c.querySelectorAll(".minicube__side").forEach((mini) => {
    if (mini.classList.contains("front")) {
      mini.classList.remove("front");
      mini.classList.add("bottom");
      return;
    } else if (mini.classList.contains("top")) {
      mini.classList.remove("top");
      mini.classList.add("front");
      return;
    } else if (mini.classList.contains("back")) {
      mini.classList.remove("back");
      mini.classList.add("top");
      return;
    } else if (mini.classList.contains("bottom")) {
      mini.classList.remove("bottom");
      mini.classList.add("back");
      return;
    }
  });
  // Check if cube is solved
  if (solve) {
    checkSolve();
  }
}

function moveUp(c, solve = true) {
  // Front side
  if (c.matches(".front.top")) {
    c.classList.remove("front");
    c.classList.add("back");
  } else if (c.matches(".front.mid1")) {
    c.classList.remove("front", "mid1");
    c.classList.add("middle", "top");
  } else if (c.matches(".front.bot")) {
    c.classList.remove("bot");
    c.classList.add("top");
  }
  // Middle side
  else if (c.matches(".middle.top")) {
    c.classList.remove("middle", "top");
    c.classList.add("back", "mid1");
  } else if (c.matches(".middle.mid1")) {
    return;
  } else if (c.matches(".middle.bot")) {
    c.classList.remove("middle", "bot");
    c.classList.add("front", "mid1");
    // Back side
  } else if (c.matches(".back.top")) {
    c.classList.remove("top");
    c.classList.add("bot");
  } else if (c.matches(".back.mid1")) {
    c.classList.remove("back", "mid1");
    c.classList.add("middle", "bot");
  } else if (c.matches(".back.bot")) {
    c.classList.remove("back");
    c.classList.add("front");
  }
  // Set up pointer events
  setUpPointerEvents();
  // Change minicube CSS classes
  c.querySelectorAll(".minicube__side").forEach((mini) => {
    if (mini.classList.contains("front")) {
      mini.classList.remove("front");
      mini.classList.add("top");
    } else if (mini.classList.contains("top")) {
      mini.classList.remove("top");
      mini.classList.add("back");
    } else if (mini.classList.contains("back")) {
      mini.classList.remove("back");
      mini.classList.add("bottom");
    } else if (mini.classList.contains("bottom")) {
      mini.classList.remove("bottom");
      mini.classList.add("front");
    }
  });
  // Check if cube is solved
  if (solve) {
    checkSolve();
  }
}

function moveRight(c, solve = true) {
  // Front
  if (c.matches(".front.left")) {
    c.classList.remove("left");
    c.classList.add("right");
  } else if (c.matches(".front.mid2")) {
    c.classList.remove("front", "mid2");
    c.classList.add("middle", "right");
  } else if (c.matches(".front.right")) {
    c.classList.remove("front");
    c.classList.add("back");
  }
  // Middle
  else if (c.matches(".middle.left")) {
    c.classList.remove("middle", "left");
    c.classList.add("front", "mid2");
  } else if (c.matches(".middle.mid2")) {
    return;
  } else if (c.matches(".middle.right")) {
    c.classList.remove("middle", "right");
    c.classList.add("back", "mid2");
  }
  // Back
  else if (c.matches(".back.left")) {
    c.classList.remove("back");
    c.classList.add("front");
  } else if (c.matches(".back.mid2")) {
    c.classList.remove("back", "mid2");
    c.classList.add("middle", "left");
  } else if (c.matches(".back.right")) {
    c.classList.remove("right");
    c.classList.add("left");
  }
  // Set up pointer events
  setUpPointerEvents();
  // Change minicube CSS classes
  c.querySelectorAll(".minicube__side").forEach((mini) => {
    if (mini.classList.contains("front")) {
      mini.classList.remove("front");
      mini.classList.add("right");
    } else if (mini.classList.contains("right")) {
      mini.classList.remove("right");
      mini.classList.add("back");
    } else if (mini.classList.contains("back")) {
      mini.classList.remove("back");
      mini.classList.add("left");
    } else if (mini.classList.contains("left")) {
      mini.classList.remove("left");
      mini.classList.add("front");
    }
  });
  // Check if cube is solved
  if (solve) {
    checkSolve();
  }
}

function moveLeft(c, solve = true) {
  // Front
  if (c.matches(".front.left")) {
    c.classList.remove("front");
    c.classList.add("back");
  } else if (c.matches(".front.mid2")) {
    c.classList.remove("front", "mid2");
    c.classList.add("middle", "left");
  } else if (c.matches(".front.right")) {
    c.classList.remove("right");
    c.classList.add("left");
  }
  // Middle
  else if (c.matches(".middle.left")) {
    c.classList.remove("middle", "left");
    c.classList.add("back", "mid2");
  } else if (c.matches(".middle.mid2")) {
    return;
  } else if (c.matches(".middle.right")) {
    c.classList.remove("middle", "right");
    c.classList.add("front", "mid2");
  }
  // Back
  else if (c.matches(".back.left")) {
    c.classList.remove("left");
    c.classList.add("right");
  } else if (c.matches(".back.mid2")) {
    c.classList.remove("back", "mid2");
    c.classList.add("middle", "right");
  } else if (c.matches(".back.right")) {
    c.classList.remove("back");
    c.classList.add("front");
  }
  // Set up pointer events
  setUpPointerEvents();
  // Change minicube CSS classes
  c.querySelectorAll(".minicube__side").forEach((mini) => {
    if (mini.classList.contains("front")) {
      mini.classList.remove("front");
      mini.classList.add("left");
    } else if (mini.classList.contains("left")) {
      mini.classList.remove("left");
      mini.classList.add("back");
    } else if (mini.classList.contains("back")) {
      mini.classList.remove("back");
      mini.classList.add("right");
    } else if (mini.classList.contains("right")) {
      mini.classList.remove("right");
      mini.classList.add("front");
    }
  });
  // Check if cube is solved
  if (solve) {
    checkSolve();
  }
}

//----------------------------------------------------------------

// Check cube solve
function checkSolve() {
  let solved = new Array(6, false);
  document.querySelectorAll(".minicube").forEach((minicube, index) => {
    let color = getComputedStyle(minicube.firstElementChild).getPropertyValue(
      "background-color"
    );
    let sideSolved = [
      ...minicube.querySelectorAll(".minicube__side.front"),
    ].every(
      (item) =>
        getComputedStyle(item).getPropertyValue("background-color") == color
    );
    solved[index] = sideSolved;
  });
  if (solved.every((item) => item == true)) {
    window.alert("Cube solved");
  }
}
