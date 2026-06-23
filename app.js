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
                16: 'Shift', 17: 'Ctrl', 18: 'Alt',
                32: 'Space', 33: 'Page Up',
                34: 'Page Down', 35: 'End', 36: 'Home', 37: 'Left', 38: 'Up', 39: 'Right',
                40: 'Down', 45: 'Insert', 93: 'Context Menu',
                112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
                118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
            };
            // Map modern browser event.key arrow names to your clean display names
            const arrowKeyMap = {
                'ArrowUp': 'Up',
                'ArrowDown': 'Down',
                'ArrowLeft': 'Left',
                'ArrowRight': 'Right'
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
                let cleanKey = arrowKeyMap[pressedKey] || pressedKey;
                if (cleanKey.length === 1) {
                    cleanKey = cleanKey.toUpperCase();
                }
                $scope.search = result + cleanKey;

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
                {"description": "Search Everything / Actions", "eclipse": "Ctrl + 3", "vscode": "Ctrl + Shift + P", "intellij": "Double Shift", "visualstudio": "Ctrl + Q", "qt": "Ctrl + K"},
                {"description": "Open File / Resource by Name", "eclipse": "Ctrl + Shift + R", "vscode": "Ctrl + P", "intellij": "Ctrl + Shift + N", "visualstudio": "Ctrl + ,", "qt": "Ctrl + K"},
                {"description": "Go to Class / Type", "eclipse": "Ctrl + Shift + T", "vscode": "Ctrl + T", "intellij": "Ctrl + N", "visualstudio": "Ctrl + ,", "qt": "Ctrl + K, C"},
                {"description": "Find Text Globally (In Files)", "eclipse": "Ctrl + H", "vscode": "Ctrl + Shift + F", "intellij": "Ctrl + Shift + F", "visualstudio": "Ctrl + Shift + F", "qt": "Ctrl + Shift + F"},
                {"description": "Trigger Auto-Complete", "eclipse": "Ctrl + Space", "vscode": "Ctrl + Space", "intellij": "Ctrl + Space", "visualstudio": "Ctrl + Space", "qt": "Ctrl + Space"},
                {"description": "Auto-Format Code (Reformat)", "eclipse": "Ctrl + Shift + F", "vscode": "Shift + Alt + F", "intellij": "Ctrl + Alt + L", "visualstudio": "Ctrl + K, Ctrl + D", "qt": "Ctrl + I"},
                {"description": "Toggle Line Comment", "eclipse": "Ctrl + /", "vscode": "Ctrl + /", "intellij": "Ctrl + /", "visualstudio": "Ctrl + K, Ctrl + C / U", "qt": "Ctrl + /"},
                {"description": "Move Line Up / Down", "eclipse": "Alt + Up / Down", "vscode": "Alt + Up / Down", "intellij": "Ctrl + Shift + Up/Down", "visualstudio": "Alt + Up / Down", "qt": "Ctrl + Shift + Up/Down"},
                {"description": "Go to Definition / Declaration", "eclipse": "F3", "vscode": "F12", "intellij": "Ctrl + B", "visualstudio": "F12", "qt": "F2"},
                {"description": "Find Usages / References", "eclipse": "Ctrl + Shift + G", "vscode": "Shift + F12", "intellij": "Alt + F7", "visualstudio": "Shift + F12", "qt": "Shift + F2"},
                {"description": "Navigate Backward (Last Position)", "eclipse": "Alt + Left", "vscode": "Alt + Left", "intellij": "Ctrl + Alt + Left", "visualstudio": "Ctrl + -", "qt": "Alt + Left"},
                {"description": "Show File Outline / Quick Symbol", "eclipse": "Ctrl + O", "vscode": "Ctrl + Shift + O", "intellij": "Ctrl + F12", "visualstudio": "Ctrl + Alt + Down", "qt": "Ctrl + Shift + O"},
                {"description": "Rename Symbol (Global Safely)", "eclipse": "Alt + Shift + R", "vscode": "F2", "intellij": "Shift + F6", "visualstudio": "Ctrl + R, Ctrl + R", "qt": "Ctrl + Shift + R"},
                {"description": "Show Quick Fixes / Intentions", "eclipse": "Ctrl + 1", "vscode": "Ctrl + .", "intellij": "Alt + Enter", "visualstudio": "Ctrl + .", "qt": "Alt + Enter"},
                {"description": "Optimize / Organize Imports", "eclipse": "Ctrl + Shift + O", "vscode": "Shift + Alt + O", "intellij": "Ctrl + Alt + O", "visualstudio": "Ctrl + R, Ctrl + G", "qt": "Automatic"},
                {"description": "Extract Local Method", "eclipse": "Alt + Shift + M", "vscode": "Via Quick Fix", "intellij": "Ctrl + Alt + M", "visualstudio": "Ctrl + R, Ctrl + M", "qt": "Via Context Menu"},
                {"description": "Build Project / Solution", "eclipse": "Ctrl + B", "vscode": "Ctrl + Shift + B", "intellij": "Ctrl + F9", "visualstudio": "Ctrl + Shift + B", "qt": "Ctrl + B"},
                {"description": "Run Program", "eclipse": "Ctrl + F11", "vscode": "Ctrl + F5", "intellij": "Shift + F10", "visualstudio": "Ctrl + F5", "qt": "Ctrl + R"},
                {"description": "Debug Program", "eclipse": "F11", "vscode": "F5", "intellij": "Shift + F9", "visualstudio": "F5", "qt": "F5"},
                {"description": "Toggle Breakpoint", "eclipse": "Ctrl + Shift + B", "vscode": "F9", "intellij": "Ctrl + F8", "visualstudio": "F9", "qt": "F9"},
                {"description": "Step Over (Next Line)", "eclipse": "F6", "vscode": "F10", "intellij": "F8", "visualstudio": "F10", "qt": "F10"},
                {"description": "Step Into", "eclipse": "F5", "vscode": "F11", "intellij": "F7", "visualstudio": "F11", "qt": "F11"},
                {"description": "Step Out", "eclipse": "F7", "vscode": "Shift + F11", "intellij": "Shift + F8", "visualstudio": "Shift + F11", "qt": "Shift + F11"},
                {"description": "Stop Debugging / Execution", "eclipse": "Ctrl + F2", "vscode": "Shift + F5", "intellij": "Ctrl + F2", "visualstudio": "Shift + F5", "qt": "Shift + F5"},
                {"description": "Resume / Continue Execution", "eclipse": "F8", "vscode": "F5", "intellij": "F9", "visualstudio": "F5", "qt": "F5"},
                {"description": "Find Local Text (In Buffer)", "eclipse": "Ctrl + F", "vscode": "Ctrl + F", "intellij": "Ctrl + F", "visualstudio": "Ctrl + F", "qt": "Ctrl + F"},
                {"description": "Find and Replace Local Text", "eclipse": "Ctrl + F", "vscode": "Ctrl + H", "intellij": "Ctrl + R", "visualstudio": "Ctrl + H", "qt": "Ctrl + Shift + R (Local)"},
                {"description": "Find Next Match", "eclipse": "Ctrl + K", "vscode": "F3", "intellij": "F3", "visualstudio": "F3", "qt": "F3"},
                {"description": "Find Previous Match", "eclipse": "Ctrl + Shift + K", "vscode": "Shift + F3", "intellij": "Shift + F3", "visualstudio": "Shift + F3", "qt": "Shift + F3"},
                {"description": "Go to Line Number", "eclipse": "Ctrl + L", "vscode": "Ctrl + G", "intellij": "Ctrl + G", "visualstudio": "Ctrl + G", "qt": "Ctrl + L"},
                {"description": "DUplicate Current Line", "eclipse": "Ctrl + Alt + Down", "vscode": "Shift + Alt + Down", "intellij": "Ctrl + D", "visualstudio": "Ctrl + D", "qt": "Ctrl + Alt + Down"},
                {"description": "Delete Current Line", "eclipse": "Ctrl + D", "vscode": "Ctrl + Shift + K", "intellij": "Ctrl + Y", "visualstudio": "Ctrl + Line Delete", "qt": "Shift + Del"},
                {"description": "Toggle Block / Multiline Comment", "eclipse": "Ctrl + Shift + /", "vscode": "Shift + Alt + A", "intellij": "Ctrl + Shift + /", "visualstudio": "Ctrl + Shift + /", "qt": "Ctrl + Shift + /"},
                {"description": "Toggle Word Wrap", "eclipse": "Alt + Shift + Y", "vscode": "Alt + Z", "intellij": "Ctrl + F12 (Config)", "visualstudio": "Ctrl + E, Ctrl + W", "qt": "Alt + W"},
                {"description": "Show Parameters Info / Signature Help", "eclipse": "Ctrl + Shift + Space", "vscode": "Ctrl + Shift + Space", "intellij": "Ctrl + P", "visualstudio": "Ctrl + Shift + Space", "qt": "Ctrl + Shift + Space"},
                {"description": "Go to Matching Bracket / Brace", "eclipse": "Ctrl + Shift + P", "vscode": "Ctrl + Shift + \\", "intellij": "Ctrl + ] / [", "visualstudio": "Ctrl + ]", "qt": "Ctrl + R"},
                {"description": "Select Word / Expand Selection", "eclipse": "Alt + Shift + Up", "vscode": "Shift + Alt + Right", "intellij": "Ctrl + W", "visualstudio": "Ctrl + Shift + W", "qt": "Ctrl + Shift + Up"},
                {"description": "Shrink / Contract Selection", "eclipse": "Alt + Shift + Down", "vscode": "Shift + Alt + Left", "intellij": "Ctrl + Shift + W", "visualstudio": "Ctrl + Shift + M", "qt": "Ctrl + Shift + Down"},
                {"description": "Transform Selection to Uppercase", "eclipse": "Ctrl + Shift + X", "vscode": "Transform via Command", "intellij": "Ctrl + Shift + U", "visualstudio": "Ctrl + Shift + U", "qt": "Alt + U"},
                {"description": "Transform Selection to Lowercase", "eclipse": "Ctrl + Shift + Y", "vscode": "Transform via Command", "intellij": "Ctrl + Shift + U", "visualstudio": "Ctrl + U", "qt": "Alt + L"},
                {"description": "Insert Line Below Current Line", "eclipse": "Shift + Enter", "vscode": "Ctrl + Enter", "intellij": "Shift + Enter", "visualstudio": "Ctrl + Shift + Enter", "qt": "Ctrl + Enter"},
                {"description": "Insert Line Above Current Line", "eclipse": "Ctrl + Shift + Enter", "vscode": "Ctrl + Shift + Enter", "intellij": "Ctrl + Alt + Enter", "visualstudio": "Ctrl + Enter", "qt": "Ctrl + Shift + Enter"},
                {"description": "Open Call Hierarchy", "eclipse": "Ctrl + Alt + H", "vscode": "Shift + Alt + H", "intellij": "Ctrl + Alt + H", "visualstudio": "Ctrl + K, Ctrl + T", "qt": "Ctrl + Shift + H"},
                {"description": "Open Type Hierarchy", "eclipse": "F4", "vscode": "Via Extension", "intellij": "Ctrl + H", "visualstudio": "F4", "qt": "Ctrl + Shift + T"},
                {"description": "Go to Next Error / Warning", "eclipse": "Ctrl + .", "vscode": "F8", "intellij": "F2", "visualstudio": "F8", "qt": "Alt + Down"},
                {"description": "Go to Previous Error / Warning", "eclipse": "Ctrl + ,", "vscode": "Shift + F8", "intellij": "Shift + F2", "visualstudio": "Shift + F8", "qt": "Alt + Up"},
                {"description": "Navigate Forward (Forward History)", "eclipse": "Alt + Right", "vscode": "Alt + Right", "intellij": "Ctrl + Alt + Right", "visualstudio": "Ctrl + Shift + -", "qt": "Alt + Right"},
                {"description": "Go to Last Edit Location", "eclipse": "Ctrl + Q", "vscode": "Ctrl + K Ctrl + Q", "intellij": "Ctrl + Shift + Backspace", "visualstudio": "Ctrl + Shift + Backspace", "qt": "Ctrl + Shift + Backspace"},
                {"description": "Toggle Bookmark", "eclipse": "Ctrl + F10, B", "vscode": "Ctrl + Alt + K", "intellij": "F11", "visualstudio": "Ctrl + K, Ctrl + K", "qt": "Ctrl + M"},
                {"description": "Go to Next Bookmark", "eclipse": "Via Context Menu", "vscode": "Ctrl + Alt + L", "intellij": "Ctrl + F11", "visualstudio": "Ctrl + K, Ctrl + N", "qt": "Ctrl + ."},
                {"description": "Extract Variable Refactoring", "eclipse": "Alt + Shift + L", "vscode": "Via Quick Fix", "intellij": "Ctrl + Alt + V", "visualstudio": "Ctrl + R, Ctrl + V", "qt": "Via Context Menu"},
                {"description": "Inline Variable Refactoring", "eclipse": "Alt + Shift + I", "vscode": "Via Quick Fix", "intellij": "Ctrl + Alt + N", "visualstudio": "Ctrl + R, Ctrl + I", "qt": "Via Context Menu"},
                {"description": "Change Method Signature", "eclipse": "Alt + Shift + C", "vscode": "Via Quick Fix", "intellij": "Ctrl + F6", "visualstudio": "Ctrl + R, Ctrl + O", "qt": "Via Context Menu"},
                {"description": "Generate Code (Getters/Setters/Constructors)", "eclipse": "Alt + Shift + S", "vscode": "Via Command Palette", "intellij": "Alt + Insert", "visualstudio": "Ctrl + .", "qt": "Alt + Insert"},
                {"description": "Surround With Block (if, try/catch, etc.)", "eclipse": "Alt + Shift + Z", "vscode": "Via Snippet Control", "intellij": "Ctrl + Alt + T", "visualstudio": "Ctrl + K, Ctrl + S", "qt": "Ctrl + Shift + J"},
                {"description": "Clean and Rebuild Project", "eclipse": "Project -> Clean", "vscode": "Task: Clean", "intellij": "Build -> Rebuild", "visualstudio": "Ctrl + Shift + Enter (Clean menu)", "qt": "Build -> Clean Project"},
                {"description": "Run Unit Tests", "eclipse": "Alt + Shift + X, T", "vscode": "Ctrl + R, T", "intellij": "Ctrl + Shift + F10", "visualstudio": "Ctrl + R, T", "qt": "Ctrl + T"},
                {"description": "View / Evaluate Expression (While Debugging)", "eclipse": "Ctrl + Shift + I", "vscode": "Via Debug Console", "intellij": "Alt + F8", "visualstudio": "QuickWatch", "qt": "Ctrl + Shift + F5"},
                {"description": "Show Quick Documentation LookUp", "eclipse": "F2", "vscode": "Ctrl + K, Ctrl + I", "intellij": "Ctrl + Q", "visualstudio": "Ctrl + K, Ctrl + I", "qt": "F1"},
                {"description": "Close Active Editor Tab", "eclipse": "Ctrl + W", "vscode": "Ctrl + W", "intellij": "Ctrl + F4", "visualstudio": "Ctrl + F4", "qt": "Ctrl + W"},
                {"description": "Reopen Closed Editor Tab", "eclipse": "Ctrl + Shift + T", "vscode": "Ctrl + Shift + T", "intellij": "Ctrl + Shift + T", "visualstudio": "Ctrl + K, Ctrl + Z", "qt": "---"},
                {"description": "Switch to Next Editor Tab", "eclipse": "Ctrl + PageDown", "vscode": "Ctrl + PageDown", "intellij": "Alt + Right", "visualstudio": "Ctrl + Alt + PageDown", "qt": "Ctrl + PageDown"},
                {"description": "Switch to Previous Editor Tab", "eclipse": "Ctrl + PageUp", "vscode": "Ctrl + PageUp", "intellij": "Alt + Left", "visualstudio": "Ctrl + Alt + PageUp", "qt": "Ctrl + PageUp"},
                {"description": "Split Editor Pane Horizontally / Vertically", "eclipse": "Ctrl + _ or Ctrl + {", "vscode": "Ctrl + \\", "intellij": "Split Vertically Command", "visualstudio": "Ctrl + \\", "qt": "Ctrl + E, 2"},
                {"description": "Focus / Open Project Explorer View", "eclipse": "Alt + Shift + W", "vscode": "Ctrl + Shift + E", "intellij": "Alt + 1", "visualstudio": "Ctrl + Alt + L", "qt": "Alt + 1"},
                {"description": "Focus / Open Console Output View", "eclipse": "Via Window Menu", "vscode": "Ctrl + `", "intellij": "Alt + 4", "visualstudio": "Ctrl + Alt + O", "qt": "Alt + 3"},
                {"description": "Focus / Open Version Control View", "eclipse": "Via Window Menu", "vscode": "Ctrl + Shift + G", "intellij": "Alt + 9", "visualstudio": "Ctrl + Alt + V", "qt": "Alt + 7"},
                {"description": "Toggle Full Screen Mode", "eclipse": "Ctrl + M (Maximize Tab)", "vscode": "F11", "intellij": "Ctrl + Shift + F12", "visualstudio": "Shift + Alt + Enter", "qt": "Ctrl + Shift + F11"},
                {"description": "Save All Files", "eclipse": "Ctrl + Shift + S", "vscode": "Ctrl + K S", "intellij": "Ctrl + S (Auto)", "visualstudio": "Ctrl + Shift + S", "qt": "Ctrl + Shift + S"},
                {"description": "Quick Switch Schemes / Profiles", "eclipse": "Via Preferences", "vscode": "Ctrl + K Ctrl + T", "intellij": "Ctrl + `", "visualstudio": "Tools Menu", "qt": "Tools -> Options"},
                {"description": "Collapse All Code Folds", "eclipse": "Ctrl + Shift + Numpad_Divide", "vscode": "Ctrl + K Ctrl + 0", "intellij": "Ctrl + Shift + Minus", "visualstudio": "Ctrl + M, Ctrl + A", "qt": "Ctrl + Shift + <"},
                {"description": "Expand All Code Folds", "eclipse": "Ctrl + Numpad_Multiply", "vscode": "Ctrl + K Ctrl + J", "intellij": "Ctrl + Shift + Plus", "visualstudio": "Ctrl + M, Ctrl + X", "qt": "Ctrl + Shift + >"},
                {"description": "Add Multi-Cursor Above", "eclipse": "Alt + Shift + A (Block Mode)", "vscode": "Ctrl + Alt + Up", "intellij": "Alt + Shift + Up", "visualstudio": "Ctrl + Alt + Up", "qt": "---"},
                {"description": "Add Multi-Cursor Below", "eclipse": "Alt + Shift + A (Block Mode)", "vscode": "Ctrl + Alt + Down", "intellij": "Alt + Shift + Down", "visualstudio": "Ctrl + Alt + Down", "qt": "---"},
                {"description": "Add Selection to Next Find Match", "eclipse": "---", "vscode": "Ctrl + D", "intellij": "Alt + J", "visualstudio": "Shift + Alt + .", "qt": "---"},
                {"description": "Select All Occurrences of Current Symbol", "eclipse": "Alt + Shift + U", "vscode": "Ctrl + Shift + L", "intellij": "Ctrl + Alt + Shift + J", "visualstudio": "Shift + Alt + ;", "qt": "---"},
                {"description": "Delete Word Ahead", "eclipse": "Ctrl + Delete", "vscode": "Ctrl + Delete", "intellij": "Ctrl + Delete", "visualstudio": "Ctrl + Delete", "qt": "Ctrl + Delete"},
                {"description": "Delete Word Behind", "eclipse": "Ctrl + Backspace", "vscode": "Ctrl + Backspace", "intellij": "Ctrl + Backspace", "visualstudio": "Ctrl + Backspace", "qt": "Ctrl + Backspace"},
                {"description": "Move Cursor to Next Word", "eclipse": "Ctrl + Right", "vscode": "Ctrl + Right", "intellij": "Ctrl + Right", "visualstudio": "Ctrl + Right", "qt": "Ctrl + Right"},
                {"description": "Move Cursor to Previous Word", "eclipse": "Ctrl + Left", "vscode": "Ctrl + Left", "intellij": "Ctrl + Left", "visualstudio": "Ctrl + Left", "qt": "Ctrl + Left"},
                {"description": "Select to Next Word", "eclipse": "Ctrl + Shift + Right", "vscode": "Ctrl + Shift + Right", "intellij": "Ctrl + Shift + Right", "visualstudio": "Ctrl + Shift + Right", "qt": "Ctrl + Shift + Right"},
                {"description": "Select to Previous Word", "eclipse": "Ctrl + Shift + Left", "vscode": "Ctrl + Shift + Left", "intellij": "Ctrl + Shift + Left", "visualstudio": "Ctrl + Shift + Left", "qt": "Ctrl + Shift + Left"},
                {"description": "Go to Start of Document", "eclipse": "Ctrl + Home", "vscode": "Ctrl + Home", "intellij": "Ctrl + Home", "visualstudio": "Ctrl + Home", "qt": "Ctrl + Home"},
                {"description": "Go to End of Document", "eclipse": "Ctrl + End", "vscode": "Ctrl + End", "intellij": "Ctrl + End", "visualstudio": "Ctrl + End", "qt": "Ctrl + End"},
                {"description": "Select to Start of Document", "eclipse": "Ctrl + Shift + Home", "vscode": "Ctrl + Shift + Home", "intellij": "Ctrl + Shift + Home", "visualstudio": "Ctrl + Shift + Home", "qt": "Ctrl + Shift + Home"},
                {"description": "Select to End of Document", "eclipse": "Ctrl + Shift + End", "vscode": "Ctrl + Shift + End", "intellij": "Ctrl + Shift + End", "visualstudio": "Ctrl + Shift + End", "qt": "Ctrl + Shift + End"},
                {"description": "Undo Last Operation", "eclipse": "Ctrl + Z", "vscode": "Ctrl + Z", "intellij": "Ctrl + Z", "visualstudio": "Ctrl + Z", "qt": "Ctrl + Z"},
                {"description": "Redo Last Operation", "eclipse": "Ctrl + Y", "vscode": "Ctrl + Y", "intellij": "Ctrl + Shift + Z", "visualstudio": "Ctrl + Y", "qt": "Ctrl + Y"},
                {"description": "Show Extension / Plugin Marketplace", "eclipse": "Help -> Marketplace", "vscode": "Ctrl + Shift + X", "intellij": "File -> Settings -> Plugins", "visualstudio": "Extensions Menu", "qt": "Help -> About Plugins"},
                {"description": "Toggle Sidebar / Tool Window Visibility", "eclipse": "Ctrl + M", "vscode": "Ctrl + B", "intellij": "Shift + Esc", "visualstudio": "Alt + Shift + Enter", "qt": "Alt + 0"},
                {"description": "Open Terminal Instance", "eclipse": "Ctrl + Alt + T", "vscode": "Ctrl + Shift + `", "intellij": "Alt + F12", "visualstudio": "Ctrl + `", "qt": "Alt + Shift + T"},
                {"description": "Compare File with Clipboard / Branch", "eclipse": "Context Menu -> Compare With", "vscode": "Via Explorer Focus", "intellij": "Ctrl + D (In Git context)", "visualstudio": "Tools -> Diff", "qt": "Tools -> Git -> Diff"},
                {"description": "Go to Implementation", "eclipse": "Ctrl + Click", "vscode": "Ctrl + F12", "intellij": "Ctrl + Alt + B", "visualstudio": "Ctrl + F12", "qt": "Ctrl + Shift + F2"},
                {"description": "Open Command Line Interface / Prompt", "eclipse": "Alt + Shift + X", "vscode": "Ctrl + Shift + C", "intellij": "Ctrl + Alt + T", "visualstudio": "Ctrl + K, Ctrl + P", "qt": "Ctrl + Shift + K"},
                {"description": "Scroll Window Down One Line", "eclipse": "Ctrl + Down", "vscode": "Ctrl + Down", "intellij": "Ctrl + Down", "visualstudio": "Ctrl + Down", "qt": "Ctrl + Down"},
                {"description": "Scroll Window Up One Line", "eclipse": "Ctrl + Up", "vscode": "Ctrl + Up", "intellij": "Ctrl + Up", "visualstudio": "Ctrl + Up", "qt": "Ctrl + Up"},
                {"description": "Show Type Definition", "eclipse": "Via Hover", "vscode": "Ctrl + Shift + F10", "intellij": "Ctrl + Shift + P", "visualstudio": "Ctrl + K, Ctrl + V", "qt": "F1"},
                {"description": "Go to Next Method", "eclipse": "Ctrl + Shift + Down", "vscode": "Ctrl + Shift + ]", "intellij": "Alt + Down", "visualstudio": "Ctrl + Up/Down", "qt": "Alt + Down"},
                {"description": "Go to Previous Method", "eclipse": "Ctrl + Shift + Up", "vscode": "Ctrl + Shift + [", "intellij": "Alt + Up", "visualstudio": "Ctrl + Up/Down", "qt": "Alt + Up"},
                {"description": "Show Build Errors / Problems Panel", "eclipse": "Ctrl + Up (Markers View)", "vscode": "Ctrl + Shift + M", "intellij": "Alt + 6", "visualstudio": "Ctrl + \\, Ctrl + E", "qt": "Alt + 2"}
              ]
          },
        ];
    });
