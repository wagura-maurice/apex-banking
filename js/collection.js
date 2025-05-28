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
  // Layout
  columnsContainer: "#columns-container",
  leftColumn: "#left-column",
  middleColumn: "#middle-column",
  rightColumn: "#right-column",
  collapsedContent: ".collapsed-content",
  expandedContent: ".expanded-content",

  // Mobile
  mobileTabs: ".mobile-tabs",
  tabButton: ".tab-button",
  mobileTabContent: ".mobile-tab-content",

  // Modals
  modal: ".modal",
  modalClose: ".modal-close",

  // Sources
  sourceItem: ".source-item",
  sourceMenuToggle: ".source-menu-toggle",
  sourceMenuDropdown: ".source-menu-dropdown",

  // Notes
  noteItem: ".note-item",
  noteMenuToggle: ".note-menu-toggle",
  menuDropdown: ".menu-dropdown",

  // Chat
  chatInput: "#chat-input",
  chatMessages: "#chat-messages",
  sendMessage: "#send-message",
  chatSuggestions: "#chat-suggestions",
  chatSuggestionsLeft: "#chat-suggestions-left",
  chatSuggestionsRight: "#chat-suggestions-right",
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
    element.addClass(classesToAdd).removeClass(classesToRemove);
  },
};

/* ============================================ */
/* === MODULE: PRELOADER === */
/* ============================================ */
const Preloader = {
  init: function () {
    setTimeout(() => {
      $("#preloader").fadeOut();
    }, 1000);
  },
};

/* ============================================ */
/* === MODULE: CHAT SUGGESTIONS === */
/* ============================================ */
const ChatSuggestions = {
  init: function () {
    const chatSuggestions = $(SELECTORS.chatSuggestions);
    const leftBtn = $(SELECTORS.chatSuggestionsLeft);
    const rightBtn = $(SELECTORS.chatSuggestionsRight);

    if (chatSuggestions.length && chatSuggestions.parent().length) {
      chatSuggestions.parent().css({
        "min-width": "0",
        "flex-shrink": "0",
        "overflow-x": "auto",
      });

      leftBtn.on("click", () => {
        chatSuggestions.parent().get(0).scrollBy({
          left: -CONFIG.scrollOffset,
          behavior: "smooth",
        });
      });

      rightBtn.on("click", () => {
        chatSuggestions.parent().get(0).scrollBy({
          left: CONFIG.scrollOffset,
          behavior: "smooth",
        });
      });
    }
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
    $(`${SELECTORS.tabButton}[data-tab="${this.activeTab}"]`).addClass(
      "active"
    );
    $(`#${this.activeTab}`).addClass("active").removeClass("inactive");

    if (window.innerWidth < CONFIG.mobileBreakpoint) {
      $(SELECTORS.mobileTabContent)
        .not(`#${this.activeTab}`)
        .addClass("inactive");
    }
  },

  bindEvents: function () {
    $(SELECTORS.tabButton).on("click", this.handleTabClick.bind(this));
    $(window).on("resize", Utils.debounce(this.handleResize.bind(this), 100));
  },

  handleTabClick: function (e) {
    const tabId = $(e.currentTarget).data("tab");

    if (tabId !== this.activeTab) {
      this.switchTab(tabId);
    }
  },

  switchTab: function (tabId) {
    $(`${SELECTORS.tabButton}[data-tab="${this.activeTab}"]`).removeClass(
      "active"
    );
    $(`#${this.activeTab}`).removeClass("active").addClass("inactive");

    $(`${SELECTORS.tabButton}[data-tab="${tabId}"]`).addClass("active");
    $(`#${tabId}`).addClass("active").removeClass("inactive");
    this.activeTab = tabId;

    $(`#${tabId}`)[0].scrollTop = 0;
  },

  handleResize: function () {
    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
      $(SELECTORS.mobileTabContent).removeClass("inactive").addClass("active");
      $(SELECTORS.tabButton).removeClass("active");
      this.activeTab = null;
    } else {
      const currentTab =
        $(`${SELECTORS.tabButton}.active`).data("tab") || CONFIG.defaultTab;
      $(SELECTORS.mobileTabContent).removeClass("active").addClass("inactive");
      $(`#${currentTab}`).addClass("active").removeClass("inactive");
      this.activeTab = currentTab;
    }
  },
};

/* ============================================ */
/* === CUSTOMER INFO SUBMENU TOGGLE === */
$(document).ready(function () {
  $("#customer-info-chevron").on("click", function (e) {
    e.stopPropagation();
    const $submenu = $("#customer-info-submenu");
    $submenu.toggleClass("hidden");
    // Toggle chevron direction
    const $chevron = $(this);
    if ($submenu.hasClass("hidden")) {
      $chevron.removeClass("fa-chevron-down").addClass("fa-chevron-right");
    } else {
      $chevron.removeClass("fa-chevron-right").addClass("fa-chevron-down");
    }
  });
});

/* ============================================ */
/* === MODULE: COLUMN TOGGLES === */
/* ============================================ */
const ColumnToggles = {
  init: function () {
    this.bindEvents();
    this.updateMiddleColumnState();
  },

  bindEvents: function () {
    $("#collapse-left").on("click", this.toggleLeftColumn.bind(this));
    $("#collapse-right").on("click", this.toggleRightColumn.bind(this));
    $("#expand-left").on("click", this.expandLeftColumn.bind(this));
    $("#expand-right").on("click", this.expandRightColumn.bind(this));
    $("#expand-middle").on("click", this.toggleMiddleColumn.bind(this));
    $(SELECTORS.middleColumn).on(
      "dblclick",
      this.toggleMiddleColumnSize.bind(this)
    );
  },

  arePanelsActive: function () {
    return $(".view-source-content, .edit-note-content").length > 0;
  },

  updateMiddleColumnState: function () {
    const $middleColumn = $(SELECTORS.middleColumn);
    const $leftColumn = $(SELECTORS.leftColumn);
    const $rightColumn = $(SELECTORS.rightColumn);

    if (this.arePanelsActive()) {
      Utils.toggleClasses(
        $middleColumn,
        ["panel-active"],
        ["expanded", "contracted"]
      );
    } else {
      $middleColumn.removeClass("panel-active");
    }

    if (
      $leftColumn.hasClass("collapsed") ||
      $rightColumn.hasClass("collapsed")
    ) {
      $middleColumn.addClass("expanded");
    } else {
      $middleColumn.removeClass("expanded");
    }
  },

  toggleLeftColumn: function () {
    const $leftColumn = $(SELECTORS.leftColumn);
    $leftColumn.toggleClass("collapsed");
    $leftColumn.find(SELECTORS.expandedContent).toggleClass("hidden");
    $leftColumn.find(SELECTORS.collapsedContent).toggleClass("hidden");
    $leftColumn.find(SELECTORS.sourceMenuDropdown).addClass("hidden");
    this.updateMiddleColumnState();
  },

  toggleRightColumn: function () {
    const $rightColumn = $(SELECTORS.rightColumn);
    $rightColumn.toggleClass("collapsed");
    $rightColumn.find(SELECTORS.expandedContent).toggleClass("hidden");
    $rightColumn.find(SELECTORS.collapsedContent).toggleClass("hidden");
    $rightColumn.find(SELECTORS.menuDropdown).addClass("hidden");
    this.updateMiddleColumnState();
  },

  expandLeftColumn: function () {
    const $leftColumn = $(SELECTORS.leftColumn);
    $leftColumn.removeClass("collapsed");
    $leftColumn.find(SELECTORS.expandedContent).removeClass("hidden");
    $leftColumn.find(SELECTORS.collapsedContent).addClass("hidden");
    this.updateMiddleColumnState();
  },

  expandRightColumn: function () {
    const $rightColumn = $(SELECTORS.rightColumn);
    $rightColumn.removeClass("collapsed");
    $rightColumn.find(SELECTORS.expandedContent).removeClass("hidden");
    $rightColumn.find(SELECTORS.collapsedContent).addClass("hidden");
    this.updateMiddleColumnState();
  },

  toggleMiddleColumn: function (e) {
    const $middleColumn = $(SELECTORS.middleColumn);
    const $leftColumn = $(SELECTORS.leftColumn);
    const $rightColumn = $(SELECTORS.rightColumn);

    if (
      !$leftColumn.hasClass("collapsed") &&
      !$rightColumn.hasClass("collapsed")
    ) {
      this.collapseSideColumns();
      $middleColumn.addClass("expanded");
      $(e.currentTarget).html('<i class="fas fa-compress-alt"></i>');
    } else {
      this.expandSideColumns();
      $middleColumn.removeClass("expanded");
      $(e.currentTarget).html('<i class="fas fa-expand-alt"></i>');
    }

    this.updateMiddleColumnState();
  },

  collapseSideColumns: function () {
    const $leftColumn = $(SELECTORS.leftColumn);
    const $rightColumn = $(SELECTORS.rightColumn);

    $leftColumn
      .addClass("collapsed")
      .find(SELECTORS.expandedContent)
      .addClass("hidden");
    $leftColumn.find(SELECTORS.collapsedContent).removeClass("hidden");

    $rightColumn
      .addClass("collapsed")
      .find(SELECTORS.expandedContent)
      .addClass("hidden");
    $rightColumn.find(SELECTORS.collapsedContent).removeClass("hidden");
  },

  expandSideColumns: function () {
    const $leftColumn = $(SELECTORS.leftColumn);
    const $rightColumn = $(SELECTORS.rightColumn);

    $leftColumn
      .removeClass("collapsed")
      .find(SELECTORS.expandedContent)
      .removeClass("hidden");
    $leftColumn.find(SELECTORS.collapsedContent).addClass("hidden");

    $rightColumn
      .removeClass("collapsed")
      .find(SELECTORS.expandedContent)
      .removeClass("hidden");
    $rightColumn.find(SELECTORS.collapsedContent).addClass("hidden");
  },

  toggleMiddleColumnSize: function () {
    if (!this.arePanelsActive()) {
      $(SELECTORS.middleColumn).toggleClass("contracted");
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
    $(document)
      .on(
        "click",
        SELECTORS.sourceMenuToggle,
        this.handleSourceMenuToggle.bind(this)
      )
      .on(
        "click",
        SELECTORS.noteMenuToggle,
        this.handleNoteMenuToggle.bind(this)
      )
      .on("click", "#notes-menu-button", this.handleNotesMenuButton.bind(this))
      .on("click", this.handleDocumentClick.bind(this));
  },

  handleSourceMenuToggle: function (e) {
    e.stopPropagation();
    const $sourceItem = $(e.currentTarget).closest(SELECTORS.sourceItem);
    const $dropdown = $sourceItem.find(SELECTORS.sourceMenuDropdown);
    const isVisible = !$dropdown.hasClass("hidden");

    this.hideAllDropdowns();

    if (!isVisible) {
      this.positionDropdown($(e.currentTarget), $dropdown);
      $dropdown.removeClass("hidden").addClass("show");
    }
  },

  handleNoteMenuToggle: function (e) {
    e.stopPropagation();
    const $noteItem = $(e.currentTarget).closest(SELECTORS.noteItem);
    const $dropdown = $noteItem.find(SELECTORS.menuDropdown);
    const isVisible = !$dropdown.hasClass("hidden");

    this.hideAllDropdowns();

    if (!isVisible) {
      this.positionDropdown($(e.currentTarget), $dropdown);
      $dropdown.removeClass("hidden").addClass("show");
    }
  },

  handleNotesMenuButton: function (e) {
    e.stopPropagation();
    $("#menu-dropdown").toggleClass("hidden");
  },

  handleDocumentClick: function (e) {
    if (
      !$(e.target).closest("#menu-dropdown").length &&
      !$(e.target).closest("#notes-menu-button").length
    ) {
      $("#menu-dropdown").addClass("hidden");
    }

    if (
      !$(e.target).closest(
        `${SELECTORS.sourceMenuDropdown}, ${SELECTORS.sourceMenuToggle}, ${SELECTORS.menuDropdown}, ${SELECTORS.noteMenuToggle}`
      ).length
    ) {
      this.hideAllDropdowns();
    }
  },

  hideAllDropdowns: function () {
    $(`${SELECTORS.sourceMenuDropdown}, ${SELECTORS.menuDropdown}`)
      .removeClass("show")
      .addClass("hidden");
  },

  positionDropdown: function ($trigger, $dropdown) {
    const triggerOffset = $trigger.offset();
    const triggerHeight = $trigger.outerHeight();
    const dropdownHeight = $dropdown.outerHeight();
    const windowHeight = $(window).height();
    const spaceBelow = windowHeight - (triggerOffset.top + triggerHeight);
    const spaceAbove = triggerOffset.top;

    // Default position below the trigger
    let top = triggerOffset.top + triggerHeight;
    let transformOrigin = "top left";

    // Attachment icon triggers file input for AI right input
    $(document).on("click", "#ai-attach-right", function () {
      // $('#ai-file-input-right').trigger('click');
      console.log("Attachment icon clicked");
    });

    // If not enough space below but enough space above, position above the trigger
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      top = triggerOffset.top - dropdownHeight - 8; // 8px gap
      transformOrigin = "bottom left";
    }
    // If not enough space in either direction, position where there's more space
    else if (spaceBelow < dropdownHeight && spaceAbove < dropdownHeight) {
      if (spaceBelow > spaceAbove) {
        top = triggerOffset.top + triggerHeight;
      } else {
        top = triggerOffset.top - dropdownHeight - 8; // 8px gap
        transformOrigin = "bottom left";
      }
    }

    $dropdown.css({
      top: top,
      left: triggerOffset.left,
      position: "fixed",
      "min-width": $trigger.outerWidth() + 140,
      "transform-origin": transformOrigin,
    });
  },
};

/* ============================================ */
/* === MODULE: CHAT FUNCTIONALITY === */
/* ============================================ */
const ChatFunctionality = {
  init: function () {
    $(SELECTORS.sendMessage).on("click", this.sendMessage.bind(this));
    $(SELECTORS.chatInput).on("keydown", this.handleKeydown.bind(this));
  },

  sendMessage: function () {
    const messageText = $(SELECTORS.chatInput).val().trim();
    if (messageText !== "") {
      const userMessage = $(`
        <div class="flex justify-end">
          <div class="max-w-[80%] bg-purple-500 px-4 py-2 rounded-xl rounded-br-none shadow">
            <div class="text-white">${messageText}</div>
            <div class="text-xs text-gray-300 text-right">${Utils.formatTime()}</div>
          </div>
        </div>
      `);

      $(SELECTORS.chatMessages).append(userMessage);
      $(SELECTORS.chatInput).val("");
      Utils.scrollToBottom($(SELECTORS.chatMessages)[0]);

      setTimeout(() => {
        const aiResponse = $(`
          <div class="flex justify-start">
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
          </div>
        `);

        $(SELECTORS.chatMessages).append(aiResponse);
        Utils.scrollToBottom($(SELECTORS.chatMessages)[0]);
      }, 1000);
    }
  },

  handleKeydown: function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      $(SELECTORS.sendMessage).click();
    }
  },
};

/* ============================================ */
/* === MODULE: MESSAGE ACTIONS === */
/* ============================================ */
const MessageActions = {
  init: function () {
    $(document)
      .on("click", ".add-to-note-btn", this.addToNote.bind(this))
      .on("click", ".copy-message-btn", this.copyMessage.bind(this));
  },

  addToNote: function (e) {
    const messageContent = $(e.currentTarget)
      .closest(".bg-blue-500")
      .find(".text-white")
      .text();
    console.log("Adding to note:", messageContent);
    alert("Message added to notes!");
  },

  copyMessage: function (e) {
    const $button = $(e.currentTarget);
    const messageContent = $button
      .closest(".bg-blue-500")
      .find(".text-white")
      .text();
    navigator.clipboard.writeText(messageContent).then(() => {
      $button.html('<i class="fas fa-check mr-1"></i> Copied');
      setTimeout(() => {
        $button.html('<i class="fas fa-copy mr-1"></i> Copy');
      }, 2000);
    });
  },
};

/* ============================================ */
/* === MODULE: UTILITIES === */
/* ============================================ */
const Utilities = {
  init: function () {
    $("#select-all").on("change", this.handleSelectAll.bind(this));
    $(document).on(
      "click",
      ".processing-btn",
      this.handleProcessingButton.bind(this)
    );
  },

  handleSelectAll: function (e) {
    $(".source-checkbox").prop("checked", $(e.currentTarget).prop("checked"));
  },

  handleProcessingButton: function (e) {
    e.stopPropagation();
    const $btn = $(e.currentTarget);
    const $icon = $btn.find("i");

    $btn.data("processing", "true").addClass("active");

    let spinCount = 0;
    const spinInterval = setInterval(() => {
      $icon.css("animation", "none");
      void $icon[0].offsetWidth;
      $icon.css("animation", "spin 1s linear");
      spinCount++;

      if (spinCount >= 5) {
        clearInterval(spinInterval);
        $btn.removeClass("active").data("processing", "false");
        alert("Processing complete!");
      }
    }, 1000);
  },
};

/* ============================================ */
/* === MODULE: MODAL HANDLING === */
/* ============================================ */
const ModalHandling = {
  init: function () {
    $(document)
      .on("click", SELECTORS.modalClose, this.closeModal.bind(this))
      .on("click", SELECTORS.modal, this.closeModalOnClickOutside.bind(this))
      .on("keydown", this.closeModalOnEscape.bind(this));
  },

  closeModal: function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(e.currentTarget).closest(SELECTORS.modal).addClass("hidden");
  },

  closeModalOnClickOutside: function (e) {
    if (e.target === e.currentTarget) {
      $(e.currentTarget).addClass("hidden");
    }
  },

  closeModalOnEscape: function (e) {
    if (e.key === "Escape") {
      $(SELECTORS.modal).addClass("hidden");
    }
  },
};

/* ============================================ */
/* === DOCUMENT READY === */
/* ============================================ */
$(document).ready(function () {
  Preloader.init();
  ChatSuggestions.init();
  MobileTabs.init();
  ColumnToggles.init();
  DropdownMenus.init();
  SourceActions.init();
  NoteActions.init();
  SourceItemInteractions.init();
  NoteItemInteractions.init();
  ChatFunctionality.init();
  MessageActions.init();
  Utilities.init();
  ModalHandling.init();
});

// More CHAT SUGGESTIONS Javascript

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const suggestionsContainer = document.getElementById("chat-suggestions");
  const leftChevron = document.getElementById("chat-suggestions-left");
  const rightChevron = document.getElementById("chat-suggestions-right");
  let scrollStep = 200; // Default scroll step in pixels, adjustable based on design

  // Dynamically adjust scrollStep based on the first suggestion pill's width
  /* const firstSuggestion = suggestionsContainer.querySelector("button");
  if (firstSuggestion) {
    scrollStep = firstSuggestion.offsetWidth + 8; // Add gap (8px from CSS gap-2)
  } */

  // Scroll function with boundary checking
  const scrollSuggestions = (direction) => {
    const currentScroll = suggestionsContainer.scrollLeft;
    const maxScroll =
      suggestionsContainer.scrollWidth - suggestionsContainer.clientWidth;

    if (direction === "left") {
      const newScroll = Math.max(0, currentScroll - scrollStep); // Prevent negative scroll
      suggestionsContainer.scrollTo({ left: newScroll, behavior: "smooth" });
    } else if (direction === "right") {
      const newScroll = Math.min(maxScroll, currentScroll + scrollStep); // Prevent over-scroll
      suggestionsContainer.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  // Add event listeners for chevron buttons
  leftChevron.addEventListener("click", () => scrollSuggestions("left"));
  rightChevron.addEventListener("click", () => scrollSuggestions("right"));

  // Optional: Update chevron visibility based on scroll position
  const updateChevronVisibility = () => {
    const currentScroll = suggestionsContainer.scrollLeft;
    const maxScroll =
      suggestionsContainer.scrollWidth - suggestionsContainer.clientWidth;

    leftChevron.style.opacity = currentScroll > 0 ? "1" : "0.5";
    rightChevron.style.opacity = currentScroll < maxScroll ? "1" : "0.5";
    leftChevron.style.pointerEvents = currentScroll > 0 ? "auto" : "none";
    rightChevron.style.pointerEvents =
      currentScroll < maxScroll ? "auto" : "none";
  };

  // Initial visibility check and add scroll event listener for dynamic updates
  updateChevronVisibility();
  suggestionsContainer.addEventListener("scroll", updateChevronVisibility);
});

// ================================

(function () {
  const chatMessages = document.getElementById("ai-chat-messages");
  const jumpBtn = document.getElementById("jump-to-bottom-btn");

  function atBottom() {
    // 2px tolerance for floating point errors
    return (
      chatMessages.scrollHeight -
        chatMessages.scrollTop -
        chatMessages.clientHeight <
      2
    );
  }

  function toggleJumpBtn() {
    if (!atBottom()) {
      jumpBtn.classList.add("show");
    } else {
      jumpBtn.classList.remove("show");
    }
  }

  chatMessages.addEventListener("scroll", toggleJumpBtn);

  // Initial check
  setTimeout(toggleJumpBtn, 500);

  jumpBtn.addEventListener("click", function () {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: "smooth",
    });
  });

  // Also handle new messages (MutationObserver)
  const observer = new MutationObserver(() => {
    setTimeout(toggleJumpBtn, 100);
  });
  observer.observe(chatMessages, { childList: true, subtree: true });
})();
