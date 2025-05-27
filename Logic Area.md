<!-- Main Content Area -->

        <div class="flex flex-1 overflow-hidden gap-x-2">
          <!-- Left Sidebar (25%) - Chat -->
          <div class="w-1/4 flex flex-col bg-gray-900 rounded-lg">
            <!-- Chat Messages -->
            <div
              class="flex-1 overflow-y-auto p-4 mt-2 space-y-2 hide-scrollbar"
              style="scrollbar-width: none; -ms-overflow-style: none"
            >
              <style>
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              </style>
              <!-- Bot message -->
              <div class="flex items-start">
                <div class="bg-gray-700 p-3 rounded-lg text-white max-w-[80%]">
                  <p>How can I help with your notes today?</p>
                </div>
              </div>
              <!-- User message -->
              <div class="flex items-start justify-end">
                <div class="bg-blue-600 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Can you summarize my last meeting notes?</p>
                </div>
              </div>
              <!-- Bot message -->
              <div class="flex items-start">
                <div class="bg-gray-700 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Of course! Here is a summary of your last meeting:</p>
                  <ul class="list-disc pl-5 text-sm mt-1">
                    <li>Reviewed project timeline and next steps</li>
                    <li>Assigned action items to team members</li>
                    <li>Discussed blockers and solutions</li>
                  </ul>
                </div>
              </div>
              <!-- User message -->
              <div class="flex items-start justify-end">
                <div class="bg-blue-600 p-3 rounded-lg text-white max-w-[80%]">
                  <p>
                    Thanks! Can you also draft an email update for the team?
                  </p>
                </div>
              </div>
              <!-- Bot message -->
              <div class="flex items-start">
                <div class="bg-gray-700 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Here's a draft email you can use:</p>
                  <div class="bg-gray-800 rounded p-2 text-xs mt-1">
                    <p>Hi team,</p>
                    <p>
                      Here’s a quick update from our last meeting. Please review
                      your action items and let me know if you have any
                      questions.
                    </p>
                    <p>Best,<br />[Your Name]</p>
                  </div>
                </div>
              </div>
              <!-- User message -->
              <div class="flex items-start justify-end">
                <div class="bg-blue-600 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Can you summarize my last meeting notes?</p>
                </div>
              </div>
              <!-- Bot message -->
              <div class="flex items-start">
                <div class="bg-gray-700 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Of course! Here is a summary of your last meeting:</p>
                  <ul class="list-disc pl-5 text-sm mt-1">
                    <li>Reviewed project timeline and next steps</li>
                    <li>Assigned action items to team members</li>
                    <li>Discussed blockers and solutions</li>
                  </ul>
                </div>
              </div>
              <!-- User message -->
              <div class="flex items-start justify-end">
                <div class="bg-blue-600 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Can you summarize my last meeting notes?</p>
                </div>
              </div>
              <!-- Bot message -->
              <div class="flex items-start">
                <div class="bg-gray-700 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Of course! Here is a summary of your last meeting:</p>
                  <ul class="list-disc pl-5 text-sm mt-1">
                    <li>Reviewed project timeline and next steps</li>
                    <li>Assigned action items to team members</li>
                    <li>Discussed blockers and solutions</li>
                  </ul>
                </div>
              </div>
              <!-- User message -->
              <div class="flex items-start justify-end">
                <div class="bg-blue-600 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Can you summarize my last meeting notes?</p>
                </div>
              </div>
              <!-- Bot message -->
              <div class="flex items-start">
                <div class="bg-gray-700 p-3 rounded-lg text-white max-w-[80%]">
                  <p>Of course! Here is a summary of your last meeting:</p>
                  <ul class="list-disc pl-5 text-sm mt-1">
                    <li>Reviewed project timeline and next steps</li>
                    <li>Assigned action items to team members</li>
                    <li>Discussed blockers and solutions</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="p-4">
              <div
                class="flex items-center bg-gray-800 rounded-full px-2 py-1 shadow-inner gap-2 w-full min-w-0"
              >
                <!-- Attachment button + hidden file input -->
                <button
                  type="button"
                  id="canvas-attach-btn"
                  class="text-gray-400 hover:text-blue-500 p-2 rounded-full focus:outline-none flex-shrink-0"
                  aria-label="Attach file"
                >
                  <i class="fa fa-paperclip"></i>
                </button>
                <input type="file" id="canvas-file-input" class="hidden" />
                <!-- Chat input (textarea) -->
                <textarea
                  id="canvas-chat-input"
                  placeholder="Share your story idea and watch it unfold"
                  class="flex-1 min-w-0 bg-transparent text-white px-2 py-3 focus:outline-none resize-none leading-snug"
                  autocomplete="off"
                  aria-label="Chat message"
                  rows="2"
                  maxlength="2000"
                  style="
                    min-height: 3.5em;
                    max-height: calc(1.5em * 9);
                    overflow-y: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                  "
                ></textarea>
                <style>
                  #canvas-chat-input::-webkit-scrollbar {
                    display: none;
                  }
                </style>
                <!-- Send button -->
                <button
                  type="button"
                  class="text-gray-400 hover:text-blue-500 p-2 rounded-full focus:outline-none flex-shrink-0"
                  aria-label="Send message"
                >
                  <i class="fa fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Middle Content Area (50%) - Quill Rich Text Editor -->
          <div class="w-2/4 flex flex-col bg-gray-900 rounded-lg main-editor">
            <div id="editor" class="flex-1 bg-slate-800 text-white rounded-lg">
              <h1>AI-Enhanced Document Editor</h1>
              <p>
                This is a sample document with rich text editing capabilities.
                Select any text to see AI integration features.
              </p>

              <h2>Key Features</h2>
              <p>
                You can highlight text, and the AI panel will show exactly where
                in the document you've selected. This enables precise AI
                assistance for content editing, expansion, or explanation.
              </p>

              <h3>How it Works</h3>
              <ul>
                <li>Select any text in this editor</li>
                <li>See the selection details in the right panel</li>
                <li>Use AI actions to modify or enhance your content</li>
                <li>AI responses are inserted at the exact location</li>
              </ul>

              <p>
                The system tracks the exact position of your selections, making
                it perfect for collaborative editing with AI assistance.
              </p>

              <blockquote>
                "The future of content creation is the seamless integration of
                human creativity with AI assistance."
              </blockquote>
            </div>
          </div>

          <!-- Right Sidebar (25%) - Ai Tools -->
          <div class="w-1/4 flex flex-col bg-gray-900 rounded-lg ai-panel">
            <div class="flex-1 w-full overflow-y-auto scrollbar-transparent">
              <div class="p-4">
                <div
                  class="selection-info bg-slate-700 rounded-lg border-l-4 border-sky-500 mb-4"
                >
                  <h3 class="text-slate-200 text-sm font-semibold p-4">
                    Selected Content
                  </h3>
                  <div
                    class="selected-text bg-slate-900 p-3 rounded border border-slate-600 italic"
                    id="selectedText"
                  >
                    Select text in the editor to see it here...
                  </div>
                  <div
                    class="position-info text-xs text-slate-400 p-4"
                    id="positionInfo"
                  >
                    Position: No selection
                  </div>
                </div>

                <div class="ai-actions flex flex-col gap-2">
                  <button
                    class="ai-btn primary py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition-colors text-white text-sm font-medium"
                    id="explainBtn"
                    disabled
                  >
                    🧠 Explain This
                  </button>
                  <button
                    class="ai-btn primary py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition-colors text-white text-sm font-medium"
                    id="expandBtn"
                    disabled
                  >
                    📝 Expand Content
                  </button>
                  <button
                    class="ai-btn secondary py-2 px-4 rounded bg-slate-600 hover:bg-slate-700 transition-colors text-white text-sm font-medium"
                    id="summarizeBtn"
                    disabled
                  >
                    📋 Summarize
                  </button>
                  <button
                    class="ai-btn secondary py-2 px-4 rounded bg-slate-600 hover:bg-slate-700 transition-colors text-white text-sm font-medium"
                    id="improveBtn"
                    disabled
                  >
                    ✨ Improve Writing
                  </button>
                </div>

                <div
                  class="relative w-full max-w-xl flex items-center bg-gray-800 shadow-inner px-4 mt-2 rounded-lg"
                >
                  <button
                    id="ai-attach-right"
                    class="absolute left-3 top-4 text-gray-400 hover:text-sky-400 transition-colors text-lg focus:outline-none bg-transparent border-none cursor-pointer"
                    title="Attach"
                    type="button"
                  >
                    <i class="fas fa-paperclip"></i>
                  </button>
                  <input type="file" id="ai-file-input-right" class="hidden" />
                  <textarea
                    id="ai-text-input-right"
                    class="flex-1 bg-transparent text-white text-sm font-medium placeholder-gray-400 focus:outline-none px-8 resize-none border-none shadow-none custom-textarea"
                    placeholder="Share your story idea and watch it unfold"
                    autocomplete="off"
                    rows="3"
                  ></textarea>
                  <button
                    id="ai-text-send-right"
                    class="absolute right-3 top-4 flex items-center justify-center text-gray-400 hover:text-sky-400 transition-colors text-lg focus:outline-none bg-transparent border-none cursor-pointer rounded-l-full"
                    title="Send"
                    type="button"
                  >
                    <i class="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
