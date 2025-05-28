/* ============================================ */
/* === CONSTANTS & CONFIGURATION === */
/* ============================================ */
const CONFIG = {
  defaultTab: "middle-column",
  mobileBreakpoint: 1024,
  animationDuration: 300,
  scrollOffset: 150,
  debounceTime: 100,
};

const SELECTORS = {
  // Core Elements
  columnsContainer: "#columns-container",
  leftColumn: "#left-column",
  middleColumn: "#middle-column",
  rightColumn: "#right-column",

  // Column Content
  collapsedContent: ".collapsed-content",
  expandedContent: ".expanded-content",

  // Mobile Navigation
  mobileTabs: ".mobile-tabs",
  tabButton: ".tab-button",
  mobileTabContent: ".mobile-tab-content",

  // Modals
  modal: ".modal",
  modalClose: ".modal-close",

  // Chat
  chatInput: ".ai-chat-chat-input",
  chatMessages: ".ai-chat-messages",
  sendMessage: "[aria-label='Send message']",
  chatAttach: ".ai-chat-attach-btn",
  chatFileInput: ".ai-chat-file-input",

  // Dropdowns
  actionsMenuDropdown: ".actions-menu-dropdown",
  actionsMenuToggle: ".dropdown-toggle",

  // Table
  selectAll: "#select-all",
  selectRow: ".select-row",
  toggleAdvancedSearch: "#toggle-advanced-search",
  advancedSearch: "#advanced-search",

  // Tabs
  tabScroll: "#tab-scroll",
  scrollLeft: "#scroll-left",
  scrollRight: "#scroll-right",
  tabBtn: ".tab-btn",
  tabContent: ".tab-content",

  // Jump to Bottom
  jumpToBottomBtn: ".jump-to-bottom-btn",
};

const CLASSES = {
  active: "active",
  inactive: "inactive",
  hidden: "hidden",
  show: "show",
  collapsed: "collapsed",
  expanded: "expanded",
};

/* ============================================ */
/* === UTILITY FUNCTIONS === */
/* ============================================ */
const Utils = {
  debounce: function (func, wait = CONFIG.debounceTime) {
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

  toggleClasses: function (element, classesToAdd = [], classesToRemove = []) {
    if (!element) return;
    element.classList.add(...classesToAdd);
    element.classList.remove(...classesToRemove);
  },

  toggleElement: function (element, force) {
    if (!element) return;
    if (force === undefined) {
      element.classList.toggle(CLASSES.hidden);
    } else {
      element.classList.toggle(CLASSES.hidden, !force);
    }
  },

  isMobile: function () {
    return window.innerWidth < CONFIG.mobileBreakpoint;
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
/* === MODULE: MOBILE TABS === */
/* ============================================ */
const MobileTabs = {
  activeTab: CONFIG.defaultTab,

  init: function () {
    this.setupInitialState();
    this.bindEvents();
  },

  setupInitialState: function () {
    const { activeTab } = this;
    const activeTabButton = document.querySelector(
      `${SELECTORS.tabButton}[data-tab="${activeTab}"]`
    );
    const activeTabContent = document.querySelector(`#${activeTab}`);

    if (activeTabButton) activeTabButton.classList.add(CLASSES.active);
    if (activeTabContent) activeTabContent.classList.add(CLASSES.active);

    if (Utils.isMobile()) {
      document
        .querySelectorAll(SELECTORS.mobileTabContent)
        .forEach((content) => {
          if (content.id !== activeTab) {
            content.classList.add(CLASSES.inactive);
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
      Utils.debounce(this.handleResize.bind(this))
    );
  },

  handleTabClick: function (e) {
    const tabId = e.currentTarget.dataset.tab;
    if (tabId !== this.activeTab) {
      this.switchTab(tabId);
    }
  },

  switchTab: function (tabId) {
    const { activeTab } = this;

    // Update tab buttons
    document
      .querySelector(`${SELECTORS.tabButton}[data-tab="${activeTab}"]`)
      ?.classList.remove(CLASSES.active);
    document
      .querySelector(`${SELECTORS.tabButton}[data-tab="${tabId}"]`)
      ?.classList.add(CLASSES.active);

    // Update tab content
    document.querySelector(`#${activeTab}`)?.classList.remove(CLASSES.active);
    document.querySelector(`#${activeTab}`)?.classList.add(CLASSES.inactive);

    document.querySelector(`#${tabId}`)?.classList.add(CLASSES.active);
    document.querySelector(`#${tabId}`)?.classList.remove(CLASSES.inactive);

    this.activeTab = tabId;

    // Scroll to top of new tab content
    const tabContent = document.querySelector(`#${tabId}`);
    if (tabContent) tabContent.scrollTop = 0;
  },

  handleResize: function () {
    const isMobile = Utils.isMobile();
    const { mobileTabContent, tabButton } = SELECTORS;

    if (!isMobile) {
      // Desktop view - show all tabs
      document.querySelectorAll(mobileTabContent).forEach((content) => {
        content.classList.remove(CLASSES.inactive);
        content.classList.add(CLASSES.active);
      });
      document
        .querySelectorAll(tabButton)
        .forEach((tab) => tab.classList.remove(CLASSES.active));
      this.activeTab = null;
    } else {
      // Mobile view - show only active tab
      const currentTab =
        document.querySelector(`${tabButton}.${CLASSES.active}`)?.dataset.tab ||
        CONFIG.defaultTab;

      document.querySelectorAll(mobileTabContent).forEach((content) => {
        content.classList.remove(CLASSES.active);
        content.classList.add(CLASSES.inactive);
      });

      const activeContent = document.querySelector(`#${currentTab}`);
      if (activeContent) {
        activeContent.classList.add(CLASSES.active);
        activeContent.classList.remove(CLASSES.inactive);
      }

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
    // Initialize all submenus as hidden
    document.querySelectorAll("[id^='submenu-']").forEach((submenu) => {
      submenu.classList.add(CLASSES.hidden);
    });

    // Initialize all chevrons
    document.querySelectorAll(".chevron").forEach((chevron) => {
      chevron.classList.remove("rotate-90");
    });

    // Event delegation for submenu toggles
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-submenu]");
      if (toggle) {
        e.stopPropagation();
        const submenuId = toggle.dataset.submenu;
        this.toggleSubmenu(submenuId);
      } else if (this.activeSubmenu) {
        // Close active submenu when clicking outside
        this.toggleSubmenu(this.activeSubmenu);
      }
    });
  },

  toggleSubmenu: function (submenuId) {
    const submenu = document.querySelector(`#${submenuId}`);
    const chevron = document.querySelector(
      `[data-submenu="${submenuId}"] .chevron`
    );

    if (!submenu || !chevron) return;

    // Close all other submenus
    document.querySelectorAll("[id^='submenu-']").forEach((sm) => {
      if (sm.id !== submenuId) {
        sm.classList.add(CLASSES.hidden);
      }
    });

    document.querySelectorAll(".chevron").forEach((ch) => {
      if (ch !== chevron) {
        ch.classList.remove("rotate-90");
      }
    });

    // Toggle current submenu
    if (this.activeSubmenu !== submenuId) {
      submenu.classList.remove(CLASSES.hidden);
      chevron.classList.add("rotate-90");
      this.activeSubmenu = submenuId;
    } else {
      submenu.classList.add(CLASSES.hidden);
      chevron.classList.remove("rotate-90");
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
    // Event delegation for dropdown toggles
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest(SELECTORS.actionsMenuToggle);
      if (toggle) {
        e.stopPropagation();
        this.handleActionMenuToggle(e);
      } else if (!e.target.closest(SELECTORS.actionsMenuDropdown)) {
        // Close all dropdowns when clicking outside
        this.hideAllDropdowns();
      }
    });
  },

  handleActionMenuToggle: function (e) {
    console.log("Dropdown toggle clicked", e);
    const toggle = e.target.closest(SELECTORS.actionsMenuToggle);
    const dropdown = toggle ? toggle.nextElementSibling : null;

    if (!dropdown || !dropdown.matches(SELECTORS.actionsMenuDropdown)) {
      console.log("Dropdown element not found or does not match selector");
      return;
    }

    const isVisible = dropdown.classList.contains(CLASSES.show);

    this.hideAllDropdowns();

    if (!isVisible) {
      console.log("Showing dropdown");
      this.positionDropdown(toggle, dropdown);
      dropdown.classList.add(CLASSES.show);
      console.log("Dropdown .show class added");
      dropdown.classList.remove(CLASSES.hidden);
      console.log("Dropdown .hidden class removed");
    }
  },

  hideAllDropdowns: function () {
    document
      .querySelectorAll(SELECTORS.actionsMenuDropdown)
      .forEach((dropdown) => {
        dropdown.classList.remove(CLASSES.show);
        dropdown.classList.add(CLASSES.hidden);
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

    Object.assign(dropdown.style, {
      position: "fixed",
      top: `${top}px`,
      left: `${triggerRect.left}px`,
      minWidth: `${triggerRect.width + 140}px`,
      transformOrigin: transformOrigin,
    });
  },
};

/* ============================================ */
/* === MODULE: CHAT FUNCTIONALITY === */
/* ============================================ */
const ChatFunctionality = {
  init: function () {
    const sendButton = document.querySelector(SELECTORS.sendMessage);
    const chatInput = document.querySelector(SELECTORS.chatInput);
    const attachButton = document.querySelector(SELECTORS.chatAttach);
    const fileInput = document.querySelector(SELECTORS.chatFileInput);

    if (sendButton)
      sendButton.addEventListener("click", this.sendMessage.bind(this));
    if (chatInput)
      chatInput.addEventListener("keydown", this.handleKeydown.bind(this));
    if (attachButton && fileInput) {
      attachButton.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", this.handleFileUpload.bind(this));
    }
  },

  sendMessage: function () {
    const chatInput = document.querySelector(SELECTORS.chatInput);
    const chatMessages = document.querySelector(SELECTORS.chatMessages);
    const messageText = chatInput?.value.trim();

    if (!messageText || !chatMessages) return;

    // Create user message element
    const userMessage = document.createElement("div");
    userMessage.className = "flex items-start justify-end";
    userMessage.innerHTML = `
      <div class="message-bubble user relative">
        <p>${messageText}</p>
        <div class="message-time text-gray-200">${Utils.formatTime()}</div>
      </div>
    `;
    chatMessages.appendChild(userMessage);
    chatInput.value = "";
    Utils.scrollToBottom(chatMessages);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = document.createElement("div");
      aiResponse.className = "flex items-start";
      aiResponse.innerHTML = `
        <div class="message-bubble ai relative">
          <p>I received your message about "${messageText.substring(
            0,
            20
          )}..."</p>
          <div class="flex justify-between items-center mt-2">
            <div class="text-xs text-gray-200">${Utils.formatTime()}</div>
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
  },

  handleKeydown: function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  },

  handleFileUpload: function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, you would upload the file and handle the response
    console.log("File selected:", file.name);
    // Reset the input
    e.target.value = "";
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
      .closest(".message-bubble.ai")
      ?.querySelector("p")?.textContent;
    if (messageContent) {
      console.log("Adding to note:", messageContent);
      // In a real app, this would add to the notes section
      alert("Message added to notes!");
    }
  },

  copyMessage: function (e) {
    const button = e.target.closest(".copy-message-btn");
    const messageContent = e.target
      .closest(".message-bubble.ai")
      ?.querySelector("p")?.textContent;

    if (!messageContent || !button) return;

    navigator.clipboard
      .writeText(messageContent)
      .then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check mr-1"></i> Copied';
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy message:", err);
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

    if (!middleColumn || !leftColumn || !rightColumn) return;

    if (this.arePanelsActive()) {
      Utils.toggleClasses(
        middleColumn,
        ["panel-active"],
        [CLASSES.expanded, "contracted"]
      );
    } else {
      middleColumn.classList.remove("panel-active");
    }

    if (
      leftColumn.classList.contains(CLASSES.collapsed) ||
      rightColumn.classList.contains(CLASSES.collapsed)
    ) {
      middleColumn.classList.add(CLASSES.expanded);
    } else {
      middleColumn.classList.remove(CLASSES.expanded);
    }
  },

  toggleLeftColumn: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    if (!leftColumn) return;

    leftColumn.classList.toggle(CLASSES.collapsed);
    Utils.toggleElement(leftColumn.querySelector(SELECTORS.expandedContent));
    Utils.toggleElement(leftColumn.querySelector(SELECTORS.collapsedContent));
    this.updateMiddleColumnState();
  },

  toggleRightColumn: function () {
    const rightColumn = document.querySelector(SELECTORS.rightColumn);
    if (!rightColumn) return;

    rightColumn.classList.toggle(CLASSES.collapsed);
    Utils.toggleElement(rightColumn.querySelector(SELECTORS.expandedContent));
    Utils.toggleElement(rightColumn.querySelector(SELECTORS.collapsedContent));
    this.updateMiddleColumnState();
  },

  expandLeftColumn: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    if (!leftColumn) return;

    leftColumn.classList.remove(CLASSES.collapsed);
    leftColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.remove(CLASSES.hidden);
    leftColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.add(CLASSES.hidden);
    this.updateMiddleColumnState();
  },

  expandRightColumn: function () {
    const rightColumn = document.querySelector(SELECTORS.rightColumn);
    if (!rightColumn) return;

    rightColumn.classList.remove(CLASSES.collapsed);
    rightColumn
      .querySelector(SELECTORS.expandedContent)
      ?.classList.remove(CLASSES.hidden);
    rightColumn
      .querySelector(SELECTORS.collapsedContent)
      ?.classList.add(CLASSES.hidden);
    this.updateMiddleColumnState();
  },

  toggleMiddleColumn: function (e) {
    const middleColumn = document.querySelector(SELECTORS.middleColumn);
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    if (!middleColumn || !leftColumn || !rightColumn) return;

    if (
      !leftColumn.classList.contains(CLASSES.collapsed) &&
      !rightColumn.classList.contains(CLASSES.collapsed)
    ) {
      this.collapseSideColumns();
      middleColumn.classList.add(CLASSES.expanded);
      if (e.currentTarget) {
        e.currentTarget.innerHTML = '<i class="fas fa-compress-alt"></i>';
      }
    } else {
      this.expandSideColumns();
      middleColumn.classList.remove(CLASSES.expanded);
      if (e.currentTarget) {
        e.currentTarget.innerHTML = '<i class="fas fa-expand-alt"></i>';
      }
    }

    this.updateMiddleColumnState();
  },

  collapseSideColumns: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    if (leftColumn) {
      leftColumn.classList.add(CLASSES.collapsed);
      leftColumn
        .querySelector(SELECTORS.expandedContent)
        ?.classList.add(CLASSES.hidden);
      leftColumn
        .querySelector(SELECTORS.collapsedContent)
        ?.classList.remove(CLASSES.hidden);
    }

    if (rightColumn) {
      rightColumn.classList.add(CLASSES.collapsed);
      rightColumn
        .querySelector(SELECTORS.expandedContent)
        ?.classList.add(CLASSES.hidden);
      rightColumn
        .querySelector(SELECTORS.collapsedContent)
        ?.classList.remove(CLASSES.hidden);
    }
  },

  expandSideColumns: function () {
    const leftColumn = document.querySelector(SELECTORS.leftColumn);
    const rightColumn = document.querySelector(SELECTORS.rightColumn);

    if (leftColumn) {
      leftColumn.classList.remove(CLASSES.collapsed);
      leftColumn
        .querySelector(SELECTORS.expandedContent)
        ?.classList.remove(CLASSES.hidden);
      leftColumn
        .querySelector(SELECTORS.collapsedContent)
        ?.classList.add(CLASSES.hidden);
    }

    if (rightColumn) {
      rightColumn.classList.remove(CLASSES.collapsed);
      rightColumn
        .querySelector(SELECTORS.expandedContent)
        ?.classList.remove(CLASSES.hidden);
      rightColumn
        .querySelector(SELECTORS.collapsedContent)
        ?.classList.add(CLASSES.hidden);
    }
  },

  toggleMiddleColumnSize: function () {
    if (!this.arePanelsActive()) {
      document
        .querySelector(SELECTORS.middleColumn)
        ?.classList.toggle("contracted");
    }
  },
};

/* ============================================ */
/* === MODULE: TABLE FUNCTIONALITY === */
/* ============================================ */
const TableFunctionality = {
  init: function () {
    const selectAll = document.querySelector(SELECTORS.selectAll);
    const toggleAdvancedSearch = document.querySelector(
      SELECTORS.toggleAdvancedSearch
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
    const isChecked = e.target.checked;
    document.querySelectorAll(SELECTORS.selectRow).forEach((cb) => {
      cb.checked = isChecked;
    });
  },

  toggleAdvancedSearch: function () {
    const advancedSearch = document.querySelector(SELECTORS.advancedSearch);
    if (advancedSearch) advancedSearch.classList.toggle(CLASSES.hidden);
  },
};

/* ============================================ */
/* === MODULE: MODAL HANDLING === */
/* ============================================ */
const ModalHandling = {
  init: function () {
    document.addEventListener("mousedown", (e) => {
      // Close modal on .modal-close (close icon, cancel button, etc.)
      const closeBtn = e.target.closest(SELECTORS.modalClose);
      if (closeBtn) {
        this.closeModal(e);
        return;
      }
      // Only close if click is directly on the modal overlay, not on modal-content or its children
      if (
        e.target.classList.contains("modal") &&
        !e.target.closest(".modal-content")
      ) {
        console.log("Clicked outside modal (overlay)");
        this.closeModal(e);
        return;
      }
      // If click is inside modal content (but not overlay)
      if (e.target.closest(".modal-content")) {
        console.log("Clicked inside modal content");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal();
      }
    });

    // Handle new customer button
    const newCustomerBtn = document.getElementById("new-customer-btn");
    const createCustomerModal = document.getElementById(
      "create-customer-modal"
    );
    if (newCustomerBtn && createCustomerModal) {
      newCustomerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createCustomerModal.classList.remove(CLASSES.hidden);
      });
    }
  },

  closeModal: function (eOrModal) {
    // If called with no arguments or Escape, close all modals
    if (!eOrModal || eOrModal.key === "Escape") {
      document.querySelectorAll(SELECTORS.modal).forEach((modal) => {
        modal.classList.add(CLASSES.hidden);
      });
      return;
    }
    // If called with an event, find the modal to close
    let modal = null;
    if (eOrModal.target) {
      // For overlay or button clicks
      modal =
        eOrModal.target.closest(SELECTORS.modal) ||
        (eOrModal.target.classList.contains("modal") ? eOrModal.target : null);
      if (modal) {
        eOrModal.preventDefault();
        modal.classList.add(CLASSES.hidden);
      }
    } else if (eOrModal instanceof Element) {
      // Direct modal element
      eOrModal.classList.add(CLASSES.hidden);
    }
  },
};

/* ============================================ */
/* === MODULE: JUMP TO BOTTOM === */
/* ============================================ */
const JumpToBottom = {
  init: function () {
    const chatMessages = document.querySelector(SELECTORS.chatMessages);
    const jumpBtn = document.querySelector(SELECTORS.jumpToBottomBtn);

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
        jumpBtn.classList.add(CLASSES.show);
      } else {
        jumpBtn.classList.remove(CLASSES.show);
      }
    };

    chatMessages.addEventListener("scroll", Utils.debounce(toggleJumpBtn));
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
    const scrollContainer = document.querySelector(SELECTORS.tabScroll);
    const leftBtn = document.querySelector(SELECTORS.scrollLeft);
    const rightBtn = document.querySelector(SELECTORS.scrollRight);

    if (!scrollContainer || !leftBtn || !rightBtn) return;

    leftBtn.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: -200, behavior: "smooth" });
    });

    rightBtn.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
    });

    // Enable horizontal scroll on mouse wheel (vertical axis)
    scrollContainer.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          scrollContainer.scrollBy({ left: e.deltaY, behavior: "auto" });
        }
      },
      { passive: false }
    );

    const updateScrollButtons = Utils.debounce(() => {
      const isAtStart = scrollContainer.scrollLeft <= 0;
      const isAtEnd =
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      leftBtn.style.opacity = isAtStart ? "0.5" : "1";
      rightBtn.style.opacity = isAtEnd ? "0.5" : "1";
    });

    scrollContainer.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
  },
};

/* ============================================ */
/* === MODULE: TABS NAVIGATION === */
/* ============================================ */
const TabsNavigation = {
  defaultTab: "main",

  init: function () {
    this.bindEvents();
    this.showTab(this.getInitialTab());
  },

  bindEvents: function () {
    document.addEventListener("click", (e) => {
      const tabBtn = e.target.closest(SELECTORS.tabBtn);
      if (tabBtn) {
        const tab = tabBtn.getAttribute("data-tab");
        if (tab) this.showTab(tab);
      }
    });
  },

  getInitialTab: function () {
    const activeBtn = document.querySelector(
      `${SELECTORS.tabBtn}.${CLASSES.active}`
    );
    return activeBtn ? activeBtn.getAttribute("data-tab") : this.defaultTab;
  },

  showTab: function (tab) {
    // Update tab buttons
    document.querySelectorAll(SELECTORS.tabBtn).forEach((btn) => {
      if (btn.getAttribute("data-tab") === tab) {
        btn.classList.add(CLASSES.active);
      } else {
        btn.classList.remove(CLASSES.active);
      }
    });

    // Update tab content
    document.querySelectorAll(SELECTORS.tabContent).forEach((content) => {
      if (content.id === tab) {
        content.classList.add(CLASSES.active);
        content.classList.remove(CLASSES.inactive);
        content.classList.remove(CLASSES.hidden);
      } else {
        content.classList.remove(CLASSES.active);
        content.classList.add(CLASSES.inactive);
        content.classList.add(CLASSES.hidden);
      }
    });
  },
};

/* ============================================ */
/* === DOCUMENT READY === */
/* ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  Preloader.init();
  MobileTabs.init();
  TabsNavigation.init();
  ColumnToggles.init();
  DropdownMenus.init();
  ChatFunctionality.init();
  MessageActions.init();
  TableFunctionality.init();
  ModalHandling.init();
  JumpToBottom.init();
  TabScroll.init();
  SubmenuToggle.init();

  // Handle delete action
  document.addEventListener("click", (e) => {
    const deleteAction = e.target.closest('[data-action="delete"]');
    if (deleteAction) {
      e.preventDefault();
      document
        .getElementById("delete-customer-modal")
        ?.classList.remove(CLASSES.hidden);
      DropdownMenus.hideAllDropdowns();
      return;
    }

    // Handle view details action
    const viewDetailsAction = e.target.closest('[data-action="view-details"]');
    if (viewDetailsAction) {
      e.preventDefault();
      document.querySelector('.tab-btn[data-tab="address"]')?.click();
      DropdownMenus.hideAllDropdowns();
      return;
    }
  });
});
