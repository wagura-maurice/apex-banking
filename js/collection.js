/* ============================================ */
/* === CONSTANTS & CONFIGURATION === */
/* ============================================ */
const CONFIG = {
  defaultTab: "middle-column",
  mobileBreakpoint: 1024,
  animationDuration: 300,
  scrollOffset: 150,
};

const SELECTORS = {
  columnsContainer: "#columns-container",
  leftColumn: "#left-column",
  middleColumn: "#middle-column",
  rightColumn: "#right-column",
  collapsedContent: ".collapsed-content",
  expandedContent: ".expanded-content",
  mobileTabs: ".mobile-tabs",
  tabButton: ".tab-button",
  mobileTabContent: ".mobile-tab-content",
  modal: ".modal",
  modalClose: ".modal-close",
  chatInput: "#chat-input",
  chatMessages: "#chat-messages",
  sendMessage: "#send-message",
  chatSuggestions: "#chat-suggestions",
  chatSuggestionsLeft: "#chat-suggestions-left",
  chatSuggestionsRight: "#chat-suggestions-right",
  actionsMenuDropdown: ".actions-menu-dropdown, .dropdown-menu",
  actionsMenuToggle: ".dropdown-toggle",
};

/* ============================================ */
/* === UTILITY FUNCTIONS === */
/* ============================================ */
const Utils = {
  debounce: function (func, wait) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },

  scrollToBottom: function (element) {
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  },

  formatTime: function (date = new Date()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  },

  toggleClasses: function (element, classesToAdd, classesToRemove) {
    element.classList.add(...classesToAdd);
    element.classList.remove(...classesToRemove);
  },
};

/* ============================================ */
/* === MODULE: PRELOADER === */
/* ============================================ */
const Preloader = {
  init: function () {
    setTimeout(() => {
      const preloader = document.querySelector("#preloader");
      if (preloader) preloader.style.display = "none";
    }, 1000);
  },
};

/* ============================================ */
/* === MODULE: CHAT SUGGESTIONS === */
/* ============================================ */
const ChatSuggestions = {
  init: function () {
    const suggestionsContainer = document.querySelector(
      SELECTORS.chatSuggestions
    );
    const leftChevron = document.querySelector(SELECTORS.chatSuggestionsLeft);
    const rightChevron = document.querySelector(SELECTORS.chatSuggestionsRight);
    let scrollStep = 200;

    if (!suggestionsContainer || !leftChevron || !rightChevron) return;

    const scrollSuggestions = (direction) => {
      const currentScroll = suggestionsContainer.scrollLeft;
      const maxScroll =
        suggestionsContainer.scrollWidth - suggestionsContainer.clientWidth;

      if (direction === "left") {
        const newScroll = Math.max(0, currentScroll - scrollStep);
        suggestionsContainer.scrollTo({ left: newScroll, behavior: "smooth" });
      } else if (direction === "right") {
        const newScroll = Math.min(maxScroll, currentScroll + scrollStep);
        suggestionsContainer.scrollTo({ left: newScroll, behavior: "smooth" });
      }

      const isAtStart = suggestionsContainer.scrollLeft <= 0;
      const isAtEnd = suggestionsContainer.scrollLeft >= maxScroll;
      leftChevron.style.opacity = isAtStart ? "0.5" : "1";
      rightChevron.style.opacity = isAtEnd ? "0.5" : "1";
      leftChevron.style.pointerEvents = isAtStart ? "none" : "auto";
      rightChevron.style.pointerEvents = isAtEnd ? "none" : "auto";
    };

    leftChevron.addEventListener("click", () => scrollSuggestions("left"));
    rightChevron.addEventListener("click", () => scrollSuggestions("right"));
    suggestionsContainer.addEventListener("scroll", () => scrollSuggestions());
    scrollSuggestions();
  },
};

/* ============================================ */
/* === MODULE: MOBILE TABS === */
/* ============================================ */
const MobileTabs = {
  activeTab: CONFIG.defaultTab,

  init: function () {
    this.setupInitialState();
    this.bindEvents();
  },

  setupInitialState: function () {
    const activeTabButton = document.querySelector(
      `${SELECTORS.tabButton}[data-tab="${this.activeTab}"]`
    );
    const activeTabContent = document.querySelector(`#${this.activeTab}`);
    if (activeTabButton) activeTabButton.classList.add("active");
    if (activeTabContent) activeTabContent.classList.add("active");

    if (window.innerWidth < CONFIG.mobileBreakpoint) {
      document
        .querySelectorAll(SELECTORS.mobileTabContent)
        .forEach((content) => {
          if (content.id !== this.activeTab) {
            content.classList.add("inactive");
          }
        });
    }
  },

  bindEvents: function () {
    document.querySelectorAll(SELECTORS.tabButton).forEach((tab) => {
      tab.addEventListener("click", this.handleTabClick.bind(this));
    });
    window.addEventListener(
      "resize",
      Utils.debounce(this.handleResize.bind(this), 100)
    );
  },

  handleTabClick: function (e) {
    const tabId = e.currentTarget.dataset.tab;
    if (tabId !== this.activeTab) {
      this.switchTab(tabId);
    }
  },

  switchTab: function (tabId) {
    document
      .querySelector(`${SELECTORS.tabButton}[data-tab="${this.activeTab}"]`)
      ?.classList.remove("active");
    document.querySelector(`#${this.activeTab}`)?.classList.remove("active");
    document.querySelector(`#${this.activeTab}`)?.classList.add("inactive");

    document
      .querySelector(`${SELECTORS.tabButton}[data-tab="${tabId}"]`)
      ?.classList.add("active");
    document.querySelector(`#${tabId}`)?.classList.add("active");
    document.querySelector(`#${tabId}`)?.classList.remove("inactive");
    this.activeTab = tabId;

    const tabContent = document.querySelector(`#${tabId}`);
    if (tabContent) tabContent.scrollTop = 0;
  },

  handleResize: function () {
    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
      document
        .querySelectorAll(SELECTORS.mobileTabContent)
        .forEach((content) => {
          content.classList.remove("inactive");
          content.classList.add("active");
        });
      document
        .querySelectorAll(SELECTORS.tabButton)
        .forEach((tab) => tab.classList.remove("active"));
      this.activeTab = null;
    } else {
      const currentTab =
        document.querySelector(`${SELECTORS.tabButton}.active`)?.dataset.tab ||
        CONFIG.defaultTab;
      document
        .querySelectorAll(SELECTORS.mobileTabContent)
        .forEach((content) => {
          content.classList.remove("active");
          content.classList.add("inactive");
        });
      document.querySelector(`#${currentTab}`)?.classList.add("active");
      document.querySelector(`#${currentTab}`)?.classList.remove("inactive");
      this.activeTab = currentTab;
    }
  },
};

/* ============================================ */
/* === MODULE: SUBMENU TOGGLE === */
/* ============================================ */
const SubmenuToggle = {
  activeSubmenu: null,

  init: function () {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[id^='submenu-']").forEach((submenu) => {
        submenu.classList.add("hidden");
      });
      document.querySelectorAll(".chevron").forEach((chevron) => {
        chevron.classList.remove("rotate-90");
      });
    });

    document.querySelectorAll("[data-submenu]").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const submenuId = toggle.dataset.submenu;
        this.toggleSubmenu(submenuId);
      });
    });
  },

  toggleSubmenu: function (submenuId) {
    const submenu = document.querySelector(`#${submenuId}`);
    const chevron = document.querySelector(
      `[data-submenu="${submenuId}"] .chevron`
    );

    document.querySelectorAll("[id^='submenu-']").forEach((sm) => {
      sm.classList.add("hidden");
    });
    document.querySelectorAll(".chevron").forEach((ch) => {
      ch.classList.remove("rotate-90");
    });

    if (this.activeSubmenu !== submenuId) {
      submenu.classList.remove("hidden");
      chevron.classList.add("rotate-90");
      this.activeSubmenu = submenuId;
    } else {
      this.activeSubmenu = null;
    }
  },
};

/* ============================================ */
/* === MODULE: DROPDOWN MENUS === */
/* ============================================ */
const DropdownMenus = {
  init: function () {
    this.bindEvents();
  },

  bindEvents: function () {
    document.addEventListener("click", this.handleDocumentClick.bind(this));
    document.querySelectorAll(SELECTORS.actionsMenuToggle).forEach((toggle) => {
      toggle.addEventListener("click", this.handleActionMenuToggle.bind(this));
    });
  },

  handleActionMenuToggle: function (e) {
    e.stopPropagation();
    const dropdown = e.currentTarget.nextElementSibling;
    const isVisible = dropdown.classList.contains("show");

    this.hideAllDropdowns();

    if (!isVisible) {
      this.positionDropdown(e.currentTarget, dropdown);
      dropdown.classList.add("show");
      dropdown.classList.remove("hidden");
    }
  },

  handleDocumentClick: function (e) {
    if (
      !e.target.closest(
        `${SELECTORS.actionsMenuToggle}, ${SELECTORS.actionsMenuDropdown}`
      )
    ) {
      this.hideAllDropdowns();
    }
  },

  hideAllDropdowns: function () {
    document
      .querySelectorAll(SELECTORS.actionsMenuDropdown)
      .forEach((dropdown) => {
        dropdown.classList.remove("show");
        dropdown.classList.add("hidden");
      });
  },

  positionDropdown: function (trigger, dropdown) {
    const triggerRect = trigger.getBoundingClientRect();
    const dropdownHeight = dropdown.offsetHeight;
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let top = triggerRect.bottom;
    let transformOrigin = "top left";

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      top = triggerRect.top - dropdownHeight - 8;
      transformOrigin = "bottom left";
    } else if (spaceBelow < dropdownHeight && spaceAbove < dropdownHeight) {
      top =
        spaceBelow > spaceAbove
          ? triggerRect.bottom
          : triggerRect.top - dropdownHeight - 8;
      transformOrigin = spaceBelow > spaceAbove ? "top left" : "bottom left";
    }

    dropdown.style.position = "fixed";
    dropdown.style.top = `${top}px`;
    dropdown.style.left = `${triggerRect.left}px`;
    dropdown.style.minWidth = `${triggerRect.width + 140}px`;
    dropdown.style.transformOrigin = transformOrigin;
  },
};

/* ============================================ */
/* === MODULE: CHAT FUNCTIONALITY === */
/* ============================================ */
const ChatFunctionality = {
  init: function () {
    const sendButton = document.querySelector(SELECTORS.sendMessage);
    const chatInput = document.querySelector(SELECTORS.chatInput);
    if (sendButton)
      sendButton.addEventListener("click", this.sendMessage.bind(this));
    if (chatInput)
      chatInput.addEventListener("keydown", this.handleKeydown.bind(this));
  },

  sendMessage: function () {
    const chatInput = document.querySelector(SELECTORS.chatInput);
    const chatMessages = document.querySelector(SELECTORS.chatMessages);
    const messageText = chatInput.value.trim();

    if (messageText !== "") {
      const userMessage = document.createElement("div");
      userMessage.className = "flex justify-end";
      userMessage.innerHTML = `
        <div class="max-w-[80%] bg-purple-500 px-4 py-2 rounded-xl rounded-br-none shadow">
          <div class="text-white">${messageText}</div>
          <div class="text-xs text-gray-300 text-right">${Utils.formatTime()}</div>
        </div>
      `;
      chatMessages.appendChild(userMessage);
      chatInput.value = "";
      Utils.scrollToBottom(chatMessages);

      setTimeout(() => {
        const aiResponse = document.createElement("div");
        aiResponse.className = "flex justify-start";
        aiResponse.innerHTML = `
          <div class="max-w-[80%] bg-blue-500 px-4 py-2 rounded-xl rounded-bl-none shadow relative group">
            <div class="text-white">I received your message about "${messageText.substring(
              0,
              20
            )}..."</div>
            <div class="flex justify-between items-center mt-2">
              <div class="text-xs text-gray-300">${Utils.formatTime()}</div>
              <button class="text-gray-300 hover:text-white text-sm flex items-center add-to-note-btn">
                <i class="fas fa-plus-circle mr-1"></i> Add to note
              </button>
              <button class="text-gray-300 hover:text-white text-sm flex items-center copy-message-btn">
                <i class="fas fa-copy mr-1"></i> Copy
              </button>
            </div>
          </div>
        `;
        chatMessages.appendChild(aiResponse);
        Utils.scrollToBottom(chatMessages);
      }, 1000);
    }
  },

  handleKeydown: function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      document.querySelector(SELECTORS.sendMessage)?.click();
    }
  },
};

/* ============================================ */
/* === MODULE: MESSAGE ACTIONS === */
/* ============================================ */
const MessageActions = {
  init: function () {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-note-btn")) {
        this.addToNote(e);
      } else if (e.target.closest(".copy-message-btn")) {
        this.copyMessage(e);
      }
    });
  },

  addToNote: function (e) {
    const messageContent = e.target
      .closest(".bg-blue-500")
      .querySelector(".text-white").textContent;
    console.log("Adding to note:", messageContent);
    alert("Message added to notes!");
  },

  copyMessage: function (e) {
    const button = e.target.closest(".copy-message-btn");
    const messageContent = button
      .closest(".bg-blue-500")
      .querySelector(".text-white").textContent;
    navigator.clipboard.writeText(messageContent).then(() => {
      button.innerHTML = '<i class="fas fa-check mr-1"></i> Copied';
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-copy mr-1"></i> Copy';
      }, 2000);
    });
  },
};

/* ============================================ */
/* === MODULE: COLUMN TOGGLES === */
/* ============================================ */
const ColumnToggles = {
  init: function () {
    this.bindEvents();
    this.updateMiddleColumnState();
  },

  bindEvents: function () {
    const collapseLeft = document.querySelector("#collapse-left");
    const collapseRight = document.querySelector("#collapse-right");
    const expandLeft = document.querySelector("#expand-left");
    const expandRight = document.querySelector("#expand-right");
    const expandMiddle = document.querySelector("#expand-middle");
    const middleColumn = document.querySelector(SELECTORS.middleColumn);

    if (collapseLeft)
      collapseLeft.addEventListener("click", this.toggleLeftColumn.bind(this));
    if (collapseRight)
      collapseRight.addEventListener(
        "click",
        this.toggleRightColumn.bind(this)
      );
    if (expandLeft)
      expandLeft.addEventListener("click", this.expandLeftColumn.bind(this));
    if (expandRight)
      expandRight.addEventListener("click", this.expandRightColumn.bind(this));
    if (expandMiddle)
      expandMiddle.addEventListener(
        "click",
        this.toggleMiddleColumn.bind(this)
      );
    if (middleColumn)
      middleColumn.addEventListener(
        "dblclick",
        this.toggleMiddleColumnSize.bind(this)
      );
  },

  arePanelsActive: function () {
    return (
      document.querySelectorAll(".view-source-content, .edit-note-content")
        .length > 0
    );
  },

  updateMiddleColumnState: function () {
    const middleColumn = document.querySelector(SELECTORS.middleColumn);
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    if (this.arePanelsActive()) {
      Utils.toggleClasses(
        middleColumn,
        ["panel-active"],
        ["expanded", "contracted"]
      );
    } else {
      middleColumn.classList.remove("panel-active");
    }

    if (
      leftColumn.classList.contains("collapsed") ||
      rightColumn.classList.contains("collapsed")
    ) {
      middleColumn.classList.add("expanded");
    } else {
      middleColumn.classList.remove("expanded");
    }
  },

  toggleLeftColumn: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    leftColumn.classList.toggle("collapsed");
    leftColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.toggle("hidden");
    leftColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.toggle("hidden");
    this.updateMiddleColumnState();
  },

  toggleRightColumn: function () {
    const rightColumn = document.querySelector(SELECTORS.rightColumn);
    rightColumn.classList.toggle("collapsed");
    rightColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.toggle("hidden");
    rightColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.toggle("hidden");
    this.updateMiddleColumnState();
  },

  expandLeftColumn: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    leftColumn.classList.remove("collapsed");
    leftColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.remove("hidden");
    leftColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.add("hidden");
    this.updateMiddleColumnState();
  },

  expandRightColumn: function () {
    const rightColumn = document.querySelector(SELECTORS.rightColumn);
    rightColumn.classList.remove("collapsed");
    rightColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.remove("hidden");
    rightColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.add("hidden");
    this.updateMiddleColumnState();
  },

  toggleMiddleColumn: function (e) {
    const middleColumn = document.querySelector(SELECTORS.middleColumn);
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    if (
      !leftColumn.classList.contains("collapsed") &&
      !rightColumn.classList.contains("collapsed")
    ) {
      this.collapseSideColumns();
      middleColumn.classList.add("expanded");
      e.currentTarget.innerHTML = '<i class="fas fa-compress-alt"></i>';
    } else {
      this.expandSideColumns();
      middleColumn.classList.remove("expanded");
      e.currentTarget.innerHTML = '<i class="fas fa-expand-alt"></i>';
    }

    this.updateMiddleColumnState();
  },

  collapseSideColumns: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    leftColumn.classList.add("collapsed");
    leftColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.add("hidden");
    leftColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.remove("hidden");

    rightColumn.classList.add("collapsed");
    rightColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.add("hidden");
    rightColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.remove("hidden");
  },

  expandSideColumns: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    leftColumn.classList.remove("collapsed");
    leftColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.remove("hidden");
    leftColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.add("hidden");

    rightColumn.classList.remove("collapsed");
    rightColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.remove("hidden");
    rightColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.add("hidden");
  },

  toggleMiddleColumnSize: function () {
    if (!this.arePanelsActive()) {
      document
        .querySelector(SELECTORS.middleColumn)
        .classList.toggle("contracted");
    }
  },
};

/* ============================================ */
/* === MODULE: TABLE FUNCTIONALITY === */
/* ============================================ */
const TableFunctionality = {
  init: function () {
    const selectAll = document.querySelector("#select-all");
    const toggleAdvancedSearch = document.querySelector(
      "#toggle-advanced-search"
    );
    if (selectAll)
      selectAll.addEventListener("change", this.handleSelectAll.bind(this));
    if (toggleAdvancedSearch)
      toggleAdvancedSearch.addEventListener(
        "click",
        this.toggleAdvancedSearch.bind(this)
      );
  },

  handleSelectAll: function (e) {
    document.querySelectorAll(".select-row").forEach((cb) => {
      cb.checked = e.target.checked;
    });
  },

  toggleAdvancedSearch: function () {
    const advancedSearch = document.querySelector("#advanced-search");
    if (advancedSearch) advancedSearch.classList.toggle("hidden");
  },
};

/* ============================================ */
/* === MODULE: MODAL HANDLING === */
/* ============================================ */
const ModalHandling = {
  init: function () {
    document.addEventListener("click", (e) => {
      if (e.target.matches(SELECTORS.modalClose)) {
        this.closeModal(e);
      } else if (e.target.matches(SELECTORS.modal)) {
        this.closeModalOnClickOutside(e);
      }
    });
    document.addEventListener("keydown", this.closeModalOnEscape.bind(this));
  },

  closeModal: function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest(SELECTORS.modal).classList.add("hidden");
  },

  closeModalOnClickOutside: function (e) {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add("hidden");
    }
  },

  closeModalOnEscape: function (e) {
    if (e.key === "Escape") {
      document
        .querySelectorAll(SELECTORS.modal)
        .forEach((modal) => modal.classList.add("hidden"));
    }
  },
};

/* ============================================ */
/* === MODULE: JUMP TO BOTTOM === */
/* ============================================ */
const JumpToBottom = {
  init: function () {
    const chatMessages = document.querySelector("#ai-chat-messages");
    const jumpBtn = document.querySelector("#jump-to-bottom-btn");
    if (!chatMessages || !jumpBtn) return;

    const atBottom = () => {
      return (
        chatMessages.scrollHeight -
          chatMessages.scrollTop -
          chatMessages.clientHeight <
        2
      );
    };

    const toggleJumpBtn = () => {
      if (!atBottom()) {
        jumpBtn.classList.add("show");
      } else {
        jumpBtn.classList.remove("show");
      }
    };

    chatMessages.addEventListener("scroll", toggleJumpBtn);
    setTimeout(toggleJumpBtn, 500);

    jumpBtn.addEventListener("click", () => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth",
      });
    });

    const observer = new MutationObserver(() => setTimeout(toggleJumpBtn, 100));
    observer.observe(chatMessages, { childList: true, subtree: true });
  },
};

/* ============================================ */
/* === MODULE: TAB SCROLL === */
/* ============================================ */
const TabScroll = {
  init: function () {
    const scrollContainer = document.querySelector("#tab-scroll");
    const leftBtn = document.querySelector("#scroll-left");
    const rightBtn = document.querySelector("#scroll-right");
    if (!scrollContainer || !leftBtn || !rightBtn) return;

    leftBtn.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
    });

    const updateScrollButtons = () => {
      const isAtStart = scrollContainer.scrollLeft <= 0;
      const isAtEnd =
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth;
      leftBtn.style.opacity = isAtStart ? "0.5" : "1";
      rightBtn.style.opacity = isAtEnd ? "0.5" : "1";
    };

    scrollContainer.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
  },
};

/* ============================================ */
/* === DOCUMENT READY === */
/* ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  Preloader.init();
  ChatSuggestions.init();
  MobileTabs.init();
  ColumnToggles.init();
  DropdownMenus.init();
  ChatFunctionality.init();
  MessageActions.init();
  TableFunctionality.init();
  ModalHandling.init();
  JumpToBottom.init();
  TabScroll.init();
  SubmenuToggle.init();
});
