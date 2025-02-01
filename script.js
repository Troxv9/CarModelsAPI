const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
document.head.appendChild(script);

function openModal(type) {
  const modal = document.getElementById("authModal");
  modal.style.display = "block";

  gsap.fromTo(
    ".modal-content",
    { opacity: 0, scale: 0.8, y: -30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" }
  );

  switchForm(type);
}

function closeModal() {
  gsap.to(".modal-content", {
    opacity: 0,
    scale: 0.8,
    y: -30,
    duration: 0.3,
    ease: "power2.in",
    onComplete: function () {
      document.getElementById("authModal").style.display = "none";
    },
  });
}

function switchForm(type) {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  if (type === "signIn") {
    gsap.to(signUpForm, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        signUpForm.style.display = "none";
        signInForm.style.display = "block";
        gsap.fromTo(
          signInForm,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  } else {
    gsap.to(signInForm, {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
        gsap.fromTo(
          signUpForm,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  }
}

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{6,}$/;

function saveUser(username, email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some((user) => user.email === email)) {
    document.getElementById("signUpError").textContent =
      "Email already registered!";
    return;
  }

  users.push({ username, email, password: btoa(password) });
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("signInEmail").value = email;

  switchForm("signIn");
}

function validateSignUp() {
  let username = document.getElementById("signUpUsername").value.trim();
  let email = document.getElementById("signUpEmail").value.trim();
  let password = document.getElementById("signUpPassword").value.trim();
  let errorMsg = document.getElementById("signUpError");

  if (!username) {
    errorMsg.textContent = "Username is required!";
    return;
  }
  if (!emailPattern.test(email)) {
    errorMsg.textContent = "Invalid email format!";
    return;
  }
  if (!passwordPattern.test(password)) {
    errorMsg.textContent =
      "Password must be 6+ chars, 1 uppercase, 1 number, 1 special character!";
    return;
  }

  errorMsg.textContent = "";
  saveUser(username, email, password);
}

function validateSignIn() {
  let email = document.getElementById("signInEmail").value.trim();
  let password = document.getElementById("signInPassword").value.trim();
  let errorMsg = document.getElementById("signInError");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(
    (user) => user.email === email && atob(user.password) === password
  );

  if (!user) {
    errorMsg.textContent = "Invalid email or password!";
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));

  updateAuthUI();
  closeModal();
}

function updateAuthUI() {
  const authButtons = document.querySelector(".auth-buttons");
  const userProfile = document.querySelector(".user-profile");
  const logoImg = document.querySelector(".logo img");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    authButtons.style.display = "none";
    userProfile.style.display = "flex";

    if (window.innerWidth <= 1024) {
      logoImg.style.top = "53px";
    } else {
      logoImg.style.top = "45px";
    }

    userProfile.innerHTML = `
      <div class="profile">
        <span>${user.username}</span>
        <div id="userIcon" class="profile-icon"></div>
        <div class="dropdown" id="dropdownMenu">
          <a href="#" onclick="logout()">Log Out</a>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      const userIconContainer = document.getElementById("userIcon");
      if (userIconContainer) {
        lottie.loadAnimation({
          container: userIconContainer,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/assets/user-icon.json",
        });
      }
    });

    setupDropdownAnimation();
  } else {
    authButtons.style.display = "flex";
    userProfile.style.display = "none";

    if (window.innerWidth <= 1024) {
      logoImg.style.top = "53px";
    } else {
      logoImg.style.top = "35px";
    }
  }
}

window.addEventListener("resize", updateAuthUI);
window.onload = function () {
  updateAuthUI();
};

function setupDropdownAnimation() {
  const profileIcon = document.querySelector(".profile-icon");
  const dropdown = document.querySelector("#dropdownMenu");

  if (!profileIcon || !dropdown) return;

  let isOpen = false;

  profileIcon.addEventListener("click", (event) => {
    event.stopPropagation();

    gsap.to(dropdown, {
      opacity: isOpen ? 0 : 1,
      y: isOpen ? -10 : 0,
      visibility: isOpen ? "hidden" : "visible",
      duration: 0.3,
      ease: "power2.out",
    });

    isOpen = !isOpen;
  });

  document.addEventListener("click", (event) => {
    if (
      !profileIcon.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      gsap.to(dropdown, {
        opacity: 0,
        y: -10,
        visibility: "hidden",
        duration: 0.2,
        ease: "power2.in",
      });
      isOpen = false;
    }
  });
}

function logout() {
  localStorage.removeItem("loggedInUser");
  updateAuthUI();
}

window.onload = function () {
  updateAuthUI();
};
document.addEventListener("DOMContentLoaded", function () {
  let menuAnimation = lottie.loadAnimation({
    container: document.getElementById("menuIcon"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "/assets/menu-icon.json",
  });

  let isMenuOpen = false;
  const mobileNav = document.getElementById("mobileNav");
  const closeMenuBtn = document.getElementById("closeMenu");
  const navLinks = document.querySelectorAll(".mobile-nav-links li");

  function openMenu() {
    isMenuOpen = true;
    menuAnimation.playSegments([0, 30], true);
    mobileNav.classList.add("show");

    navLinks.forEach((li, index) => {
      gsap.fromTo(
        li,
        { opacity: 0, x: index % 2 === 0 ? -450 : 450 },
        { opacity: 1, x: 0, duration: 0.8, delay: index * 0.1 }
      );
    });
  }

  function closeMenu() {
    isMenuOpen = false;
    menuAnimation.playSegments([30, 0], true);

    gsap.to(navLinks, { opacity: 0, x: 0, duration: 0.3, stagger: 0.1 });

    setTimeout(() => mobileNav.classList.remove("show"), 300);
  }

  document.getElementById("menuIcon").addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
});
