# Calculator Web-App

- Basic four-function calculator, accepts both mouse and keyboard input.
- Implemented using HTML, CSS and Javascript.
- App was made to complete the final project for the Javacript Basics section of The Odin Project's Web Developement program.
- Inspired by basic built-in calculator app on macOS and iOS.

## Features

### Functionality

- Allows users to enter numbers with maximum 9 digits before the decimal, 8 digits after the decimal.
- Answers smaller than 1E-8 or larger than 1E+9 returned in exponential notation.
- All other answers rounded to 8 decimal places (trailing zeroes eliminated) which accounts for common floating point imprecision issues.
- Stops inappropriate inputs such as "=" immediately after an operator or decimal point.
- Operator selection can be changed by simply clicking a selecting a different one before next number input.
- Pressing "=" after executing a calculation will repeat the most recent operation.
- Clear button dynamically switches between Clear (C) and Clear All (AC) functionality as appropriate. Change is reflected in the button's inner text.

### Design

- Layout and animations inpired by built-in calculator app on macOS and iOS, but with a different color palette.
- Buttons animated with flash effect when clicked or when corresponding keyboard key is pressed. The four main operator keys remain highlighted to show which operator was selected.
- Calculator stays centered at top of page regardless of browser window re-sizing.

## Learnings

- Learnings included but not limited to: CSS grid and keyframe animations; Javascript array methods, number methods, and callback functions; debugging in browser developer tools.
