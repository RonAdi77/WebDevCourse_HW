document.addEventListener("DOMContentLoaded", () => {

    pageLoaded();
    //...
});

let txt1;
let txt2;
let btn;
let lblRes;
let operation;
let txt1Desktop;
let txt2Desktop;
let btnDesktop;
let lblResDesktop;
let operationDesktop;
let txt2Tablet;
let operationTablet;

// Function to validate if a value is a valid number
function isValidNumber(value) {
    if (value === '' || value === null || value === undefined) {
        return false; // Empty is not valid
    }
    // Check if the value is a valid number (including decimals and negative numbers)
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && value.trim() !== '';
}

// Function to validate and update input classes
function validateInput(inputElement) {
    if (!inputElement) return;
    
    const value = inputElement.value;
    
    // Remove existing validation classes
    inputElement.classList.remove('is-valid', 'is-invalid');
    
    // Add appropriate class based on validation
    if (isValidNumber(value)) {
        inputElement.classList.add('is-valid');
    } else if (value !== '') {
        // Only show invalid if there's some input (not empty)
        inputElement.classList.add('is-invalid');
    }
}

function pageLoaded() {
    // Mobile elements
    txt1 = document.getElementById('txt1');
    txt2 = document.querySelector('#txt2');
    btn = document.getElementById('btnCalc');
    lblRes = document.getElementById('lblRes');
    operation = document.getElementById('operation');
    
    // Tablet elements
    txt2Tablet = document.getElementById('txt2-tablet');
    operationTablet = document.getElementById('operation-tablet');
    
    // Desktop elements
    txt1Desktop = document.getElementById('txt1-desktop');
    txt2Desktop = document.getElementById('txt2-desktop');
    btnDesktop = document.getElementById('btnCalc-desktop');
    lblResDesktop = document.getElementById('lblRes-desktop');
    operationDesktop = document.getElementById('operation-desktop');
    
    // Sync txt1 between all views and add validation
    if (txt1 && txt1Desktop) {
        txt1.addEventListener('input', () => {
            txt1Desktop.value = txt1.value;
            validateInput(txt1);
            validateInput(txt1Desktop);
        });
        txt1Desktop.addEventListener('input', () => {
            txt1.value = txt1Desktop.value;
            validateInput(txt1);
            validateInput(txt1Desktop);
        });
        // Initial validation
        validateInput(txt1);
        validateInput(txt1Desktop);
    }
    
    // Sync txt2 between mobile, tablet, and desktop and add validation
    const syncTxt2 = (source, targets) => {
        targets.forEach(target => {
            if (target) target.value = source.value;
        });
    };
    
    const validateTxt2Group = (source) => {
        validateInput(source);
        if (txt2) validateInput(txt2);
        if (txt2Tablet) validateInput(txt2Tablet);
        if (txt2Desktop) validateInput(txt2Desktop);
    };
    
    if (txt2) {
        txt2.addEventListener('input', () => {
            syncTxt2(txt2, [txt2Tablet, txt2Desktop]);
            validateTxt2Group(txt2);
        });
        validateInput(txt2);
    }
    
    if (txt2Tablet) {
        txt2Tablet.addEventListener('input', () => {
            syncTxt2(txt2Tablet, [txt2, txt2Desktop]);
            validateTxt2Group(txt2Tablet);
        });
        validateInput(txt2Tablet);
    }
    
    if (txt2Desktop) {
        txt2Desktop.addEventListener('input', () => {
            syncTxt2(txt2Desktop, [txt2, txt2Tablet]);
            validateTxt2Group(txt2Desktop);
        });
        validateInput(txt2Desktop);
    }
    
    // Sync operation between mobile, tablet, and desktop
    const syncOperation = (source, targets) => {
        targets.forEach(target => {
            if (target) target.value = source.value;
        });
    };
    
    if (operation) {
        operation.addEventListener('change', () => {
            syncOperation(operation, [operationTablet, operationDesktop]);
        });
    }
    
    if (operationTablet) {
        operationTablet.addEventListener('change', () => {
            syncOperation(operationTablet, [operation, operationDesktop]);
        });
    }
    
    if (operationDesktop) {
        operationDesktop.addEventListener('change', () => {
            syncOperation(operationDesktop, [operation, operationTablet]);
        });
    }
    
    // Add event listeners to both buttons
    if (btn) {
        btn.addEventListener('click', () => {
            calculate();
        });
    }
    
    if (btnDesktop) {
        btnDesktop.addEventListener('click', () => {
            calculate();
        });
    }
}

function calculate() {
    // Get values from any available input (they are synced)
    let txt1Text = txt1 ? txt1.value : (txt1Desktop ? txt1Desktop.value : '');
    let num1 = parseFloat(txt1Text);

    let txt2Text = txt2 ? txt2.value : (txt2Tablet ? txt2Tablet.value : (txt2Desktop ? txt2Desktop.value : ''));
    let num2 = parseFloat(txt2Text);

    let selectedOp = operation ? operation.value : (operationTablet ? operationTablet.value : (operationDesktop ? operationDesktop.value : '+'));
    let res;

    switch (selectedOp) {
        case '+':
            res = num1 + num2;
            break;
        case '-':
            res = num1 - num2;
            break;
        case '*':
            res = num1 * num2;
            break;
        case '/':
            res = num2 !== 0 ? num1 / num2 : 'Error: Division by zero';
            break;
        default:
            res = num1 + num2;
    }

    // Update both result displays
    if (lblRes) lblRes.innerText = res;
    if (lblResDesktop) lblResDesktop.innerText = res;

    let opSymbol = selectedOp === '*' ? '×' : selectedOp === '/' ? '÷' : selectedOp;
    let logEntry = `${num1} ${opSymbol} ${num2} = ${res}`;
    print(logEntry, true);

}





const btn2 = document.getElementById("btn2");
btn2.addEventListener("click", () => {
    print("btn2 clicked :" + btn2.id + "|" + btn2.innerText);
});


// btn2.addEventListener("click",func1);

// function func1()
// {

// }
function print(msg, append = false) {

    //--Get TextArea Element Reference
    const ta = document.getElementById("output");
    //--Write msg to textArea text
    if (ta) {
        if (append) {
            ta.value += (ta.value ? "\n" : "") + msg;
        } else {
            ta.value = msg;
        }
    }
    //write Log
    else console.log(msg);
}



// =============================================
// STEP 1: JS NATIVE TYPES, USEFUL TYPES & OPERATIONS
// =============================================
function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    // String
    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    // Number
    const n = 42;
    out += "\n\n[Number] n = " + n;

    // Boolean
    const b = true;
    out += "\n\n[Boolean] b = " + b;

    // Date
    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    // Array
    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    // Functions as variables
    const add = function (a, b) { return a + b; };
    out += "\n\n[Function as variable] add(3,4) = " + add(3, 4);

    // Callback
    function calc(a, b, fn) {
        return fn(a, b);

    }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20, x+y ) = " + result;

    //Print to Log
    print(out);
}