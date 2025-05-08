// --- DOM Elements ---
const semiconductor1Element = document.getElementById('semiconductor1');
const semiconductor2Element = document.getElementById('semiconductor2');
const lightbulbElement = document.getElementById('lightbulb');
const rotationDisplay1 = document.getElementById('rotationDisplay1');
const rotationDisplay2 = document.getElementById('rotationDisplay2');
const currentStatusDisplay = document.getElementById('currentStatus');

// Wire Elements (cache them for performance)
const wires = {
    bat_pos_out_v: document.getElementById('wire_bat_pos_out_v'),
    bat_pos_out_h: document.getElementById('wire_bat_pos_out_h'),
    // wire config for S1
    split_to_s1_v: document.getElementById('wire_split_to_s1_v'), // Renamed for clarity (vertical segment)
    split_to_s1_h: document.getElementById('wire_split_to_s1_h'),
    // wire config for S2
    split_to_s2_v: document.getElementById('wire_split_to_s2_v'), // Renamed for clarity (vertical segment)
    split_to_s2_h: document.getElementById('wire_split_to_s2_h'),

    s1_out_h: document.getElementById('wire_s1_out_to_merge_h'),
    s1_merge_v: document.getElementById('wire_s1_out_to_merge_v'), // This is the main vertical merge wire from S1
    s2_merge_v: document.getElementById('wire_s2_out_to_merge_v'), // This is the main vertical merge wire from S2

    s2_out_h: document.getElementById('wire_s2_out_to_merge_h'),
    // s2 output merges into s1_merge_v via s2_out_h

    merge_to_bulb_h: document.getElementById('wire_merge_to_bulb_h'),
    // merge_to_bulb_v is covered by s1_merge_v

    bulb_out_h: document.getElementById('wire_bulb_out_h'),
    bulb_out_v: document.getElementById('wire_bulb_out_v'),
    to_bat_neg_h: document.getElementById('wire_to_bat_neg_h'),
};


// --- Circuit Data (Components) ---
const components = {
    battery1: { id: 'battery', type: 'battery' },
    semi1: {
        id: 'semiconductor1', type: 'semiconductor',
        element: semiconductor1Element, rotation: 0,
    },
    semi2: {
        id: 'semiconductor2', type: 'semiconductor',
        element: semiconductor2Element, rotation: 0,
    },
    bulb1: {
        id: 'lightbulb', type: 'lightbulb',
        element: lightbulbElement, isOn: false,
    }
};

// --- Circuit Logic ---
function updateCircuit() {
    const semi1AllowsCurrent = components.semi1.rotation === 180;
    const semi2AllowsCurrent = components.semi2.rotation === 180;

    const lightbulbShouldBeOn = semi1AllowsCurrent || semi2AllowsCurrent;

    // Update Semiconductor visuals and displays
    components.semi1.element.style.transform = `rotate(${components.semi1.rotation}deg)`;
    rotationDisplay1.textContent = `${components.semi1.rotation}°`;
    components.semi2.element.style.transform = `rotate(${components.semi2.rotation}deg)`;
    rotationDisplay2.textContent = `${components.semi2.rotation}°`;

    // Update Lightbulb state
    components.bulb1.isOn = lightbulbShouldBeOn;
    components.bulb1.element.classList.toggle('on', components.bulb1.isOn);

    // Update Wire states (color)
    // Path from Battery Positive
    const inputPathActive = semi1AllowsCurrent || semi2AllowsCurrent;
    wires.bat_pos_out_v.classList.toggle('wire-active', inputPathActive);
    wires.bat_pos_out_h.classList.toggle('wire-active', inputPathActive); // Active if either S1 or S2 path will be active

    // Path to Semiconductor 1
    // wire_bat_pos_out_h also serves as the input to S1 if semi1AllowsCurrent
    // No separate wire_split_to_s1_h needed if bat_pos_out_h reaches S1's x-coordinate
    wires.split_to_s1_v.classList.toggle('wire-active', semi1AllowsCurrent);
    wires.split_to_s1_h.classList.toggle('wire-active', semi1AllowsCurrent);

    // Path to Semiconductor 2 (vertical drop from main input line)
    wires.split_to_s2_v.classList.toggle('wire-active', semi2AllowsCurrent);
    wires.split_to_s2_h.classList.toggle('wire-active', semi2AllowsCurrent);


    // Output path from Semiconductor 1
    wires.s1_out_h.classList.toggle('wire-active', semi1AllowsCurrent);
    // The main vertical merge wire (s1_merge_v) is active if EITHER S1 or S2 output path is active
    wires.s1_merge_v.classList.toggle('wire-active', semi1AllowsCurrent);
    wires.s2_merge_v.classList.toggle('wire-active', semi2AllowsCurrent);


    // Output path from Semiconductor 2
    wires.s2_out_h.classList.toggle('wire-active', semi2AllowsCurrent);
    // S2 output path also uses s1_merge_v if active


    // Path from Merge point to Lightbulb
    wires.merge_to_bulb_h.classList.toggle('wire-active', lightbulbShouldBeOn);

    // Path from Lightbulb to Battery Negative
    wires.bulb_out_h.classList.toggle('wire-active', lightbulbShouldBeOn);
    wires.bulb_out_v.classList.toggle('wire-active', lightbulbShouldBeOn);
    wires.to_bat_neg_h.classList.toggle('wire-active', lightbulbShouldBeOn);


    // Update Status Display
    if (lightbulbShouldBeOn) {
        currentStatusDisplay.textContent = 'ON';
        currentStatusDisplay.style.color = 'green';
    } else {
        currentStatusDisplay.textContent = 'OFF';
        currentStatusDisplay.style.color = 'red';
    }
}

// --- Event Listeners ---
components.semi1.element.addEventListener('click', () => {
    components.semi1.rotation = (components.semi1.rotation === 0) ? 180 : 0;
    updateCircuit();
});

components.semi2.element.addEventListener('click', () => {
    components.semi2.rotation = (components.semi2.rotation === 0) ? 180 : 0;
    updateCircuit();
});

// --- Initial Setup ---
updateCircuit();