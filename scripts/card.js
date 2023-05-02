class Card {
  constructor({ imageUrl, onDismiss, onLike, onDislike }) {
    this.imageUrl = imageUrl;
    this.onDismiss = onDismiss;
    this.onLike = onLike;
    this.onDislike = onDislike;
    this.#init();
  }

  // private properties
  #startPoint;
  #offsetX;
  #offsetY;

  #isTouchDevice = () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  #init = () => {
    //CARD INFO SECTION

    const personalInfo = document.createElement("div");
    personalInfo.classList.add("personal-info");
    const nameInfo = document.createElement("div");
    nameInfo.classList.add("name");
    const name = document.createElement("h3");
    name.innerHTML = "Name, ";
    nameInfo.append(name);
    const age = document.createElement("h3");
    age.innerHTML = "19";
    nameInfo.append(age);

    const activeSituation = document.createElement("div");
    activeSituation.classList.add("active-situation");
    const activeIcon = document.createElement("h4");
    activeIcon.innerHTML = "•";
    const activeText = document.createElement("h4");
    activeText.innerHTML = "Recently Active";
    activeSituation.append(activeIcon);
    activeSituation.append(activeText);

    const hobbiesInfo = document.createElement("div");
    hobbiesInfo.classList.add("hobbies");
    const hobbies1 = document.createElement("h4");
    hobbies1.innerHTML = "Instagram";
    const hobbies2 = document.createElement("h4");
    hobbies2.innerHTML = "Travel";
    const hobbies3 = document.createElement("h4");
    hobbies3.innerHTML = "Trying new things";
    hobbiesInfo.append(hobbies1);
    hobbiesInfo.append(hobbies2);
    hobbiesInfo.append(hobbies3);

    personalInfo.append(nameInfo);
    personalInfo.append(activeSituation);
    personalInfo.append(hobbiesInfo);

    // BUTTONS SECTION

    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    const button1 = document.createElement("i");
    const button2 = document.createElement("i");
    const button3 = document.createElement("i");
    const button4 = document.createElement("i");
    const button5 = document.createElement("i");
    button1.classList.add("fa-solid", "fa-rotate-right", "rotate");
    button2.classList.add("fa-solid", "fa-xmark", "x-mark");
    button3.classList.add("fa-solid", "fa-star", "star");
    button4.classList.add("fa-solid", "fa-heart", "heart");
    button5.classList.add("fa-sharp", "fa-solid", "fa-bolt", "bolt");
    button2.setAttribute("id", "cancelButton");
    button4.setAttribute("id", "likeButton");
    buttons.append(button1, button2, button3, button4, button5);

    const card = document.createElement("div");
    card.classList.add("card");
    const img = document.createElement("img");
    img.src = this.imageUrl;
    img.style.position = "relative";
    card.append(img);
    card.append(personalInfo);
    card.append(buttons);
    this.element = card;
    if (this.#isTouchDevice()) {
      this.#listenToTouchEvents();
    } else {
      this.#listenToMouseEvents();
    }
  };

  #listenToTouchEvents = () => {
    this.element.addEventListener("touchstart", e => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const { clientX, clientY } = touch;
      this.#startPoint = { x: clientX, y: clientY };
      document.addEventListener("touchmove", this.#handleTouchMove);
      this.element.style.transition = "transform 0s";
    });

    document.addEventListener("touchend", this.#handleTouchEnd);
    document.addEventListener("cancel", this.#handleTouchEnd);
  };

  #listenToMouseEvents = () => {
    this.element.addEventListener("mousedown", e => {
      const { clientX, clientY } = e;
      this.#startPoint = { x: clientX, y: clientY };
      document.addEventListener("mousemove", this.#handleMouseMove);
      this.element.style.transition = "transform 0s";
    });

    document.addEventListener("mouseup", this.#handleMoveUp);

    // prevent card from being dragged
    this.element.addEventListener("dragstart", e => {
      e.preventDefault();
    });
  };

  #handleMove = (x, y) => {
    this.#offsetX = x - this.#startPoint.x;
    this.#offsetY = y - this.#startPoint.y;
    const rotate = this.#offsetX * 0.1;
    this.element.style.transform = `translate(${this.#offsetX}px, ${
      this.#offsetY
    }px) rotate(${rotate}deg)`;
    // dismiss card
    if (Math.abs(this.#offsetX) > this.element.clientWidth * 0.7) {
      this.#dismiss(this.#offsetX > 0 ? 1 : -1);
    }
  };

  // mouse event handlers
  #handleMouseMove = e => {
    e.preventDefault();
    if (!this.#startPoint) return;
    const { clientX, clientY } = e;
    this.#handleMove(clientX, clientY);
  };

  #handleMoveUp = () => {
    this.#startPoint = null;
    document.removeEventListener("mousemove", this.#handleMouseMove);
    this.element.style.transform = "";
  };

  // touch event handlers
  #handleTouchMove = e => {
    if (!this.#startPoint) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const { clientX, clientY } = touch;
    this.#handleMove(clientX, clientY);
  };

  #handleTouchEnd = () => {
    this.#startPoint = null;
    document.removeEventListener("touchmove", this.#handleTouchMove);
    this.element.style.transform = "";
  };

  #dismiss = direction => {
    this.#startPoint = null;
    document.removeEventListener("mouseup", this.#handleMoveUp);
    document.removeEventListener("mousemove", this.#handleMouseMove);
    document.removeEventListener("touchend", this.#handleTouchEnd);
    document.removeEventListener("touchmove", this.#handleTouchMove);
    this.element.style.transition = "transform 1s";
    this.element.style.transform = `translate(${
      direction * window.innerWidth
    }px, ${this.#offsetY}px) rotate(${90 * direction}deg)`;
    this.element.classList.add("dismissing");
    setTimeout(() => {
      this.element.remove();
    }, 1000);

    if (typeof this.onDismiss === "function") {
      this.onDismiss();
    }
    if (typeof this.onLike === "function" && direction === 1) {
      this.onLike();
    }
    if (typeof this.onDislike === "function" && direction === -1) {
      this.onDislike();
    }
  };
}
