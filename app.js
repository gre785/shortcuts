// app.js (Updated with VS Code data)

function preg_quote(str, delimiter) {
    return String(str)
        .replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

angular.module('ideShortcuts', ['ngSanitize'])
    .filter('highlight', function ($sce) {
        return function (text, phrase) {
            if (phrase && text && text.toLowerCase().contains(phrase))
                text = text.replace( new RegExp( "(" + preg_quote( phrase ) + ")" , 'gi' ), '<span class="highlighted">$1</span>' );
            
            return $sce.trustAsHtml(text)
        }
    })
    .controller('mainController', function ($scope) {
        $scope.keyPressed = '';
        $scope.search = '';

        var specialKeyMap = [{37 : 'Left'}, {38 : 'Up'}, {39 : 'Right'}, {40 : 'Down'}];

        var isModifierPressed = function (event) {
            return event.ctrlKey || event.altKey || event.shiftKey;
        };
        var specialKeyPressed = function (keyCode) {
            var specialKey = specialKeyMap.filter((specialKey) => {return keyCode in  specialKey});
            return (specialKey && specialKey.length > 0 ) ? specialKey[0] : null;
        };

        var isValidCharacterKeyCode = function(param){
            return (param > 47 && param < 58) || param == 32 || (param > 64 && param < 91) || (param > 95 && param < 112) || (param > 185 && param < 193) || (param > 218 && param < 223);
        };

        $scope.onKeyDown = function(event) {
            // A map to convert key codes for special, non-printable keys into their names.
            const specialKeyMap = {
                8: 'Backspace', 9: 'Tab', 13: 'Enter', 16: 'Shift', 17: 'Ctrl', 18: 'Alt',
                19: 'Pause/Break', 20: 'Caps Lock', 27: 'Esc', 32: 'Space', 33: 'Page Up',
                34: 'Page Down', 35: 'End', 36: 'Home', 37: 'Left', 38: 'Up', 39: 'Right',
                40: 'Down', 45: 'Insert', 46: 'Delete', 91: 'Windows', 93: 'Context Menu',
                112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
                118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
                144: 'Num Lock', 145: 'Scroll Lock'
            };

            const isModifierPressed = event.ctrlKey || event.altKey || event.shiftKey;
            const pressedKey = event.key; // Use event.key for modern browsers

            if (isModifierPressed) {
                event.preventDefault(); // Prevent default browser action for the shortcut

                let result = '';
                if (event.ctrlKey) result += 'Ctrl + ';
                if (event.altKey) result += 'Alt + ';
                if (event.shiftKey) result += 'Shift + ';

                // Check if the pressed key is one of the modifiers themselves.
                // If so, just show the modifiers.
                if (['Control', 'Alt', 'Shift'].includes(pressedKey)) {
                    $scope.search = result;
                    return;
                }

                // Use the modern `event.key` property for the character or name of the key.
                // It correctly handles capitalization and special characters.
                $scope.search = result + pressedKey;

            } else if (specialKeyMap[event.keyCode]) {
                // Handle cases where a special key is pressed WITHOUT a modifier (e.g., just "Delete")
                event.preventDefault();
                $scope.search = specialKeyMap[event.keyCode];
            } else {
                // This part handles regular text input when no modifiers are pressed.
                // If the existing search is a shortcut, clear it before typing new text.
                if ($scope.search.includes('+')) {
                    $scope.search = '';
                }
            }
        };

        // The data from your new shortcuts.json is now embedded here
        $scope.shortcutTables = [
          {
            "shortcuts": [
              { "eclipse": "", "intellij": "Ctrl, Ctrl + Up", "description": "clone caret to upper position", "vscode": "Ctrl+Alt+Up" },
              { "eclipse": "", "intellij": "Ctrl, Ctrl + Down", "description": "clone caret to lower position", "vscode": "Ctrl+Alt+Down" },
              { "eclipse": "", "intellij": "Shift + Alt + Click", "description": "add/delete caret position", "vscode": "Alt+Click" },
              { "eclipse": "", "intellij": "Shift + Alt + Middle-Mouse-Button", "description": "select column", "vscode": "Shift+Alt+MouseDrag" },
              { "eclipse": "", "intellij": "Middle-Mouse-Button + Mouse-Movement", "description": "column-selection-mode", "vscode": "Shift+Alt+MouseDrag" },
              { "eclipse": "", "intellij": "Shift + Alt + Insert", "description": "Switch between column/line-selection-mode", "vscode": "Shift+Alt+I" },
              { "eclipse": "", "intellij": "Esc", "description": "leave multiline mode", "vscode": "Esc" },
              { "eclipse": "", "intellij": "Alt + J / Alt + Shift + J", "description": "select/unselect next occurence", "vscode": "Ctrl+D" },
              { "eclipse": "", "intellij": "Ctrl + Alt + Shift + J", "description": "select all occurences", "vscode": "Ctrl+Shift+L" },

              { "eclipse": "Ctrl + Space", "intellij": "Ctrl + Space", "description": "Basic code completion (the name of any class,method or variable)", "vscode": "Ctrl+Space" },
              { "eclipse": "", "intellij": "Ctrl + Shift + Space", "description": "Smart code completion (filters the list of methods and variables by expected type)", "vscode": "Ctrl+Space" },
              { "eclipse": "", "intellij": "Ctrl + Shift + Enter", "description": "Complete statement", "vscode": "" },
              { "eclipse": "Ctrl + Shift + Space", "intellij": "Ctrl + P", "description": "Parameter info (within method call arguments)", "vscode": "Ctrl+Shift+Space" },
              { "eclipse": "F2", "intellij": "Ctrl + Q", "description": "Quick documentation lookup", "vscode": "Ctrl+K Ctrl+I" },
              { "eclipse": "", "intellij": "Shift + F1", "description": "External Doc", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + mouse over code", "description": "Brief Info", "vscode": "Ctrl+K Ctrl+I" },
              { "eclipse": "F2", "intellij": "Ctrl + F1", "description": "Show descriptions of error or warning at caret", "vscode": "F8" },
              { "eclipse": "", "intellij": "Alt + Insert", "description": "Generate code... (Getters, Setters, Constructors, hashCode/equals, toString)", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + O", "description": "Override methods", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + I", "description": "Implement methods", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Alt + T", "description": "Surround with... (if..else, try..catch, for, synchronized, etc.)", "vscode": "" },
              { "eclipse": "Ctrl + Shift + C", "intellij": "Ctrl + NumPad/", "description": "Comment/uncomment with line comment", "vscode": "Ctrl+/" },
              { "eclipse": "Ctrl + Shift + /", "intellij": "Ctrl + Shift + NumPad/", "description": "Comment/uncomment with block comment", "vscode": "Shift+Alt+A" },
              { "eclipse": "Ctrl + Shift + Up", "intellij": "Ctrl + W", "description": "Select successively increasing code blocks", "vscode": "Shift+Alt+Right" },
              { "eclipse": "Ctrl + Shift + Down", "intellij": "Ctrl + Shift + W", "description": "Decrease current selection to previous state", "vscode": "Shift+Alt+Left" },
              { "eclipse": "", "intellij": "Alt + Q", "description": "Context info", "vscode": "" },
              { "eclipse": "Ctrl + 1", "intellij": "Alt + Enter", "description": "Show intention actions and quick-fixes", "vscode": "Ctrl+." },
              { "eclipse": "Ctrl + Shift + F", "intellij": "Ctrl + Alt + L", "description": "Reformat code", "vscode": "Shift+Alt+F" },
              { "eclipse": "Ctrl + Shift + O", "intellij": "Ctrl + Alt + O", "description": "Optimize imports", "vscode": "Shift+Alt+O" },
              { "eclipse": "", "intellij": "Ctrl + Alt + I", "description": "Auto-indent line(s)", "vscode": "Shift+Alt+F" },
              { "eclipse": "", "intellij": "Tab / Shift + Tab", "description": "Indent/unindent selected lines", "vscode": "Tab / Shift+Tab" },
              { "eclipse": "", "intellij": "Ctrl + X or Shift + Delete", "description": "Cut current line or selected block to clipboard", "vscode": "Ctrl+X" },
              { "eclipse": "", "intellij": "Ctrl + C or Ctrl + Insert", "description": "Copy current line or selected block to clipboard", "vscode": "Ctrl+C" },
              { "eclipse": "", "intellij": "Ctrl + V or Shift + Insert", "description": "Paste from clipboard", "vscode": "Ctrl+V" },
              { "eclipse": "", "intellij": "Ctrl + Shift + V", "description": "Paste from recent buffers...", "vscode": "" },
              { "eclipse": "Ctrl + Alt + Up", "intellij": "Ctrl + D", "description": "Duplicate current line or selected block", "vscode": "Shift+Alt+Down" },
              { "eclipse": "Ctrl + D", "intellij": "Ctrl + Y", "description": "Delete line at caret", "vscode": "Ctrl+Shift+K" },
              { "eclipse": "", "intellij": "Ctrl + Shift + J", "description": "Smart line join", "vscode": "J" },
              { "eclipse": "", "intellij": "Ctrl + Enter", "description": "Smart line split", "vscode": "Ctrl+Enter" },
              { "eclipse": "Shift + Enter", "intellij": "Shift + Enter", "description": "Start new line", "vscode": "Ctrl+Enter" },
              { "eclipse": "Ctrl + Shift + X / Y", "intellij": "Ctrl + Shift + U", "description": "Toggle case for word at caret or selected block", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Shift + ] / [", "description": "Select till code block end/start", "vscode": "" },
              { "eclipse": "Ctrl + Delete", "intellij": "Ctrl + Delete", "description": "Delete to word end", "vscode": "Ctrl+Delete" },
              { "eclipse": "", "intellij": "Ctrl + Backspace", "description": "Delete to word start", "vscode": "Ctrl+Backspace" },
              { "eclipse": "Ctrl + NumPad+/-", "intellij": "Ctrl + NumPad+/-", "description": "Expand/collapse code block", "vscode": "Ctrl+Shift+[ / Ctrl+Shift+]" },
              { "eclipse": "Ctrl + NumPad*", "intellij": "Ctrl + Shift + NumPad+", "description": "Expand all", "vscode": "Ctrl+K Ctrl+J" },
              { "eclipse": "Ctrl + Shift + NumPad/", "intellij": "Ctrl + Shift + NumPad-", "description": "Collapse all", "vscode": "Ctrl+K Ctrl+0" },
              { "eclipse": "Ctrl + W", "intellij": "Ctrl + F4", "description": "Close active editor tab", "vscode": "Ctrl+W" },
              { "eclipse": "Alt + Up", "intellij": "Ctrl + Shift + Up", "description": "Move line up", "vscode": "Alt+Up" },
              { "eclipse": "Alt + Down", "intellij": "Ctrl + Shift + Down", "description": "Move line down", "vscode": "Alt+Down" },
              { "eclipse": "Ctrl  + Up", "intellij": "", "description": "Scroll Line up", "vscode": "Ctrl+Up" },
              { "eclipse": "Ctrl  + Down", "intellij": "", "description": "Scroll Line down", "vscode": "Ctrl+Down" },

              { "eclipse": "", "intellij": "Double Shift", "description": "Search everywhere", "vscode": "Ctrl+P" },
              { "eclipse": "Ctrl + F", "intellij": "Ctrl + F", "description": "Find", "vscode": "Ctrl+F" },
              { "eclipse": "Ctrl + K", "intellij": "F3", "description": "Find next", "vscode": "F3" },
              { "eclipse": "Ctrl + Shift + K", "intellij": "Shift + F3", "description": "Find previous", "vscode": "Shift+F3" },
              { "eclipse": "Ctrl + F", "intellij": "Ctrl + R", "description": "Replace", "vscode": "Ctrl+H" },
              { "eclipse": "Ctrl + H", "intellij": "Ctrl + Shift + F", "description": "Find in path", "vscode": "Ctrl+Shift+F" },
              { "eclipse": "", "intellij": "Ctrl + Shift + R", "description": "Replace in path", "vscode": "Ctrl+Shift+H" },
              { "eclipse": "", "intellij": "Ctrl + Shift + S", "description": "Search structurally (Ultimate Edition only)", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Shift + M", "description": "Replace structurally (Ultimate Edition only)", "vscode": "" },

              { "eclipse": "Ctrl + G", "intellij": "Alt + F7", "description": "Find usages", "vscode": "Shift+F12" },
              { "eclipse": "Ctrl + Shift + G", "intellij": "Ctrl + F7", "description": "Find usages in file", "vscode": "Shift+F12" },
              { "eclipse": "", "intellij": "Ctrl + Shift + F7", "description": "Highlight usages in file", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Alt + F7", "description": "Show usages", "vscode": "Shift+F12" },
              { "eclipse": "Ctrl + Shift + U", "intellij": "", "description": "Show occurences in File", "vscode": "" },

              { "eclipse": "Ctrl + B", "intellij": "Ctrl + F9", "description": "Make project (compile modifed and dependent)", "vscode": "Ctrl+Shift+B" },
              { "eclipse": "", "intellij": "Ctrl + Shift + F9", "description": "Compile selected file, package or module", "vscode": "" },
              { "eclipse": "", "intellij": "Alt + Shift + F10", "description": "Select configuration and run", "vscode": "" },
              { "eclipse": "", "intellij": "Alt + Shift + F9", "description": "Select configuration and debug", "vscode": "" },
              { "eclipse": "Ctrl + F11", "intellij": "Shift + F10", "description": "Run", "vscode": "F5" },
              { "eclipse": "", "intellij": "Shift + F9", "description": "Debug", "vscode": "F5" },
              { "eclipse": "", "intellij": "Ctrl + Shift + F10", "description": "Run context configuration from editor", "vscode": "" },

              { "eclipse": "F6", "intellij": "F8", "description": "Step over", "vscode": "F10" },
              { "eclipse": "F5", "intellij": "F7", "description": "Step into", "vscode": "F11" },
              { "eclipse": "", "intellij": "Shift + F7", "description": "Smart step into", "vscode": "" },
              { "eclipse": "F7", "intellij": "Shift + F8", "description": "Step out", "vscode": "Shift+F11" },
              { "eclipse": "Ctrl + R", "intellij": "Alt + F9", "description": "Run to cursor", "vscode": "" },
              { "eclipse": "Ctrl + U", "intellij": "Alt + F8", "description": "Evaluate expression", "vscode": "Shift+F9" },
              { "eclipse": "F8", "intellij": "F9", "description": "Resume program", "vscode": "F5" },
              { "eclipse": "Ctrl + Shift + B", "intellij": "Ctrl + F8", "description": "Toggle breakpoint", "vscode": "F9" },
              { "eclipse": "Alt + Shift + Q, B", "intellij": "Ctrl + Shift + F8", "description": "View breakpoints", "vscode": "Ctrl+Shift+F8" },

              { "eclipse": "Ctrl + Shift + T", "intellij": "Ctrl + N", "description": "Go to class", "vscode": "Ctrl+T" },
              { "eclipse": "Ctrl + Shift + R", "intellij": "Ctrl + Shift + N", "description": "Go to file", "vscode": "Ctrl+P" },
              { "eclipse": "", "intellij": "Ctrl + Shift + T", "description": "Navigating between Test and Test-Subject", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Alt + Shift + N", "description": "Go to symbol", "vscode": "Ctrl+Shift+O" },
              { "eclipse": "Ctrl (+ Shift) + Tab", "intellij": "Alt + Right", "description": "Go to next editor tab", "vscode": "Ctrl+PageDown" },
              { "eclipse": "Ctrl (+ Shift) + Tab", "intellij": "Alt + Left", "description": "Go to previous editor tab", "vscode": "Ctrl+PageUp" },
              { "eclipse": "Alt + Shift + W", "intellij": "Alt + F1", "description": "Show file in ... (Package Explorer, Windows Explorer, etc.)", "vscode": "Ctrl+K R" },
              { "eclipse": "", "intellij": "F12", "description": "Go back to previous tool window", "vscode": "Ctrl+Tab" },
              { "eclipse": "", "intellij": "Esc", "description": "Go to editor (from tool window)", "vscode": "Esc" },
              { "eclipse": "", "intellij": "Shift + Esc", "description": "Hide active or last active window", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Shift + F4", "description": "Close active run/messages/find/... tab", "vscode": "Ctrl+W" },
              { "eclipse": "Ctrl + L", "intellij": "Ctrl + G", "description": "Go to line", "vscode": "Ctrl+G" },
              { "eclipse": "Ctrl + E", "intellij": "Ctrl + E", "description": "Recent files popup", "vscode": "Ctrl+Tab" },
              { "eclipse": "Alt + Right", "intellij": "Ctrl + Alt + Right", "description": "Navigate forward", "vscode": "Alt+Right" },
              { "eclipse": "Alt + Left", "intellij": "Ctrl + Alt + Left", "description": "Navigate back", "vscode": "Alt+Left" },
              { "eclipse": "", "intellij": "Ctrl + Shift + Backspace", "description": "Navigate to last edit location", "vscode": "Ctrl+U" },
              { "eclipse": "", "intellij": "Alt + F1", "description": "Select current file or symbol in any view", "vscode": "" },
              { "eclipse": "F3", "intellij": "Ctrl + B", "description": "Go to declaration", "vscode": "F12" },
              { "eclipse": "Ctrl + Click", "intellij": "Ctrl + Click", "description": "Go to declaration", "vscode": "Ctrl+Click" },
              { "eclipse": "Ctrl + T", "intellij": "Ctrl + Alt + B", "description": "Go to implementation(s)", "vscode": "Ctrl+F12" },
              { "eclipse": "", "intellij": "Ctrl + Shift + I", "description": "Open quick definition lookup", "vscode": "Alt+F12" },
              { "eclipse": "", "intellij": "Ctrl + Shift + B", "description": "Go to type declaration", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + U", "description": "Go to super-method/super-class", "vscode": "" },
              { "eclipse": "Ctrl + Shift + Up", "intellij": "Alt + Up", "description": "Go to previous method", "vscode": "" },
              { "eclipse": "Ctrl + Shift + Down", "intellij": "Alt + Down", "description": "Go to next method", "vscode": "" },
              { "eclipse": "Ctrl + Shift + P", "intellij": "Ctrl + ] / [", "description": "Move to code block end/start", "vscode": "Ctrl+Shift+\\" },
              { "eclipse": "Ctrl + O", "intellij": "Ctrl + F12", "description": "File structure popup", "vscode": "Ctrl+Shift+O" },
              { "eclipse": "F4", "intellij": "Ctrl + H", "description": "Type hierarchy", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Shift + H", "description": "Method hierarchy", "vscode": "" },
              { "eclipse": "Ctrl + Alt + H", "intellij": "Ctrl + Alt + H", "description": "Call hierarchy", "vscode": "Shift+Alt+H" },
              { "eclipse": "Ctrl + . / Ctrl + ,", "intellij": "F2 / Shift + F2", "description": "Next/previous highlighted error", "vscode": "F8" },
              { "eclipse": "", "intellij": "F4 / Ctrl + Enter", "description": "Edit source / View source", "vscode": "" },
              { "eclipse": "Alt + Shift + B", "intellij": "Alt + Home", "description": "Show navigation bar", "vscode": "" },

              { "eclipse": "", "intellij": "F11", "description": "Toggle bookmark", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + F11", "description": "Toggle bookmark with mnemonic", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + #[0-9]", "description": "Go to numbered bookmark", "vscode": "" },
              { "eclipse": "", "intellij": "Shift + F11", "description": "Show bookmarks", "vscode": "" },

              { "eclipse": "", "intellij": "F5", "description": "Copy", "vscode": "F5" },
              { "eclipse": "", "intellij": "F6", "description": "Move", "vscode": "F6" },
              { "eclipse": "", "intellij": "Alt + Delete", "description": "Safe Delete", "vscode": "Shift+Delete" },
              { "eclipse": "Alt + Shift + R", "intellij": "Shift + F6", "description": "Rename", "vscode": "F2" },
              { "eclipse": "Alt + Shift + C", "intellij": "Ctrl + F6", "description": "Change Signature", "vscode": "F2" },
              { "eclipse": "Alt + Shift + I", "intellij": "Ctrl + Alt + N", "description": "Inline", "vscode": "Ctrl+." },
              { "eclipse": "Alt + Shift + M", "intellij": "Ctrl + Alt + M", "description": "Extract Method", "vscode": "Ctrl+." },
              { "eclipse": "Ctrl + 2, L", "intellij": "Ctrl + Alt + V", "description": "Extract Variable", "vscode": "Ctrl+." },
              { "eclipse": "Alt + Shift + L", "intellij": "Ctrl + Alt + V", "description": "Extract Variable", "vscode": "Ctrl+." },
              { "eclipse": "Ctrl + 2, F", "intellij": "Ctrl + Alt + F", "description": "Extract Field", "vscode": "Ctrl+." },
              { "eclipse": "", "intellij": "Ctrl + Alt + C", "description": "Extract Constant", "vscode": "Ctrl+." },
              { "eclipse": "", "intellij": "Ctrl + Alt + P", "description": "Extract Parameter", "vscode": "Ctrl+." },

              { "eclipse": "", "intellij": "Ctrl + K", "description": "Commit project to VCS", "vscode": "Ctrl+Shift+G" },
              { "eclipse": "", "intellij": "Ctrl + T", "description": "Update project from VCS", "vscode": "Ctrl+Shift+P, Git: Pull" },
              { "eclipse": "", "intellij": "Alt + Shift + C", "description": "View recent changes", "vscode": "Ctrl+Shift+G" },
              { "eclipse": "", "intellij": "Alt + BackQuote `", "description": "'VCS' quick popup", "vscode": "Ctrl+Shift+G" },

              { "eclipse": "", "intellij": "Ctrl + Alt + J", "description": "Surround with Live Template", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + J", "description": "Insert Live Template", "vscode": "Ctrl+Space" },
              { "eclipse": "", "intellij": "iter", "description": "Iteration according to Java SDK 1.5 style", "vscode": "" },
              { "eclipse": "", "intellij": "inst", "description": "Check object type with instanceof and downcast it", "vscode": "" },
              { "eclipse": "", "intellij": "itco", "description": "Iterate elements of java.util.Collection", "vscode": "" },
              { "eclipse": "", "intellij": "itit", "description": "Iterate elements of java.util.Iterator", "vscode": "" },
              { "eclipse": "", "intellij": "itli", "description": "Iterate elements of java.util.List", "vscode": "" },
              { "eclipse": "", "intellij": "psf", "description": "public static final", "vscode": "" },
              { "eclipse": "", "intellij": "thr", "description": "throw new", "vscode": "" },

              { "eclipse": "Ctrl + M", "intellij": "Alt + #[0-9]", "description": "Open corresponding tool window", "vscode": "Ctrl+Shift+E/G/D/X" },
              { "eclipse": "", "intellij": "Ctrl + S", "description": "Save all", "vscode": "Ctrl+S" },
              { "eclipse": "", "intellij": "Ctrl + Alt + Y", "description": "Synchronize", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + Shift + F12", "description": "Toggle maximizing editor", "vscode": "Ctrl+K Z" },
              { "eclipse": "", "intellij": "Alt + Shift + F", "description": "Add to Favorites", "vscode": "" },
              { "eclipse": "", "intellij": "Alt + Shift + I", "description": "Inspect current file with current profile", "vscode": "" },
              { "eclipse": "", "intellij": "Ctrl + BackQuote (`)", "description": "Quick switch current scheme", "vscode": "Ctrl+`" },
              { "eclipse": "", "intellij": "Ctrl + Alt + S", "description": "Open Settings dialog", "vscode": "Ctrl+," },
              { "eclipse": "", "intellij": "Ctrl + Alt + Shift + S", "description": "Open Project Structure dialog", "vscode": "" },
              { "eclipse": "Ctrl + 3", "intellij": "Ctrl + Shift + A", "description": "Find Action", "vscode": "F1" },
              { "eclipse": "", "intellij": "Ctrl + Tab", "description": "Switch between tabs and tool window", "vscode": "Ctrl+Tab" }
            ]
          },
        ];
    });
