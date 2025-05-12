document.addEventListener('DOMContentLoaded', () => {
    const latticeContainer = document.getElementById('latticeContainer');
    const addPTypeBtn = document.getElementById('addPTypeBtn');
    const addNTypeBtn = document.getElementById('addNTypeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const infoPanel = document.getElementById('infoPanel');

    const lattice_rows = 8; // Number of rows in the lattice
    const lattice_cols = 12; // Number of columns in the lattice
    let latticeAtoms = []; // Array to store atom objects {element: div, type: 'Si'/'P'/'N', carrier: null}

    // Function to create the initial silicon lattice
    function createLattice() {
        latticeContainer.innerHTML = ''; // Clear previous lattice
        latticeAtoms = [];
        latticeContainer.style.gridTemplateColumns = `repeat(${lattice_cols}, 1fr)`;

        for (let i = 0; i < lattice_rows * lattice_cols; i++) {
            const atomDiv = document.createElement('div');
            atomDiv.classList.add('atom', 'silicon');
            atomDiv.textContent = 'Si';
            latticeContainer.appendChild(atomDiv);
            latticeAtoms.push({ element: atomDiv, type: 'Si', carrierVisual: null });
        } 
        updateInfoPanel('Si');
    }

    // Function to update the info panel
    function updateInfoPanel(dopant) {
        let dopantType = 'Si'; // Default to 'Si'
        if (dopant === 'P') {
            dopantType = 'P'; // P-type doping
        } else if (dopant === 'B') {
            dopantType = 'N'; // N-type doping
        }
        let title = '';
        let description = '';
        switch (dopantType) {
            case 'Si':
                title = 'Silicon Pur (Semiconductor Intrinsec)';
                description = `
                    <p>Aceasta este o rețea cristalină de siliciu pur. Fiecare atom de siliciu (Si) își împarte cei 4 electroni de valență cu patru atomi vecini, formând legături covalente.</p>
                    <p>Într-un semiconductor intrinsec (nedopat), există foarte puțini purtători liberi de sarcină (electroni sau goluri) la temperatura camerei. Conductivitatea acestuia este scăzută.</p>
                    <p>Apasă butoanele pentru a adăuga dopanți de tip P sau N.</p>`;
                break;
            case 'N':
                title = 'Dopare Tip P (ex. Bor)';
                description = `
                    <p>Doparea de tip P implică adăugarea de atomi impurități trivalenți (precum Bor, Aluminiu, Galiu) în rețeaua de siliciu. Acești atomi au 3 electroni de valență.</p>

                    <p>Atunci când un atom trivalent înlocuiește un atom de siliciu, acesta poate forma doar 3 legături covalente, lăsând una incompletă. Acest lucru creează un „gol” – o absență a unui electron.</p>

                    <p>Golurile acționează ca purtători de sarcină pozitivi. Un electron dintr-un atom vecin poate sări în acel gol, făcând ca golul să pară că se mișcă în direcția opusă.</p>

                    <p>Semiconductoarele de tip P au o abundență de goluri ca purtători majoritari de sarcină.</p>
                    `;
                break;
            case 'P':
                title = 'Dopare Tip N (ex. Fosfor)';
                description = `
                    <p>Doparea de tip N implică adăugarea de atomi impurități pentavalenți (precum Fosfor, Arsen, Stibiu) în rețeaua de siliciu. Acești atomi au 5 electroni de valență.</p>

                    <p>Atunci când un atom pentavalent înlocuiește un atom de siliciu, patru dintre electronii săi de valență formează legături covalente cu atomii de siliciu vecini. Al cincilea electron este slab legat și poate deveni cu ușurință un electron liber.</p>

                    <p>Acest electron liber se poate deplasa prin rețea, contribuind la conductivitatea electrică.</p>

                    <p>Semiconductoarele de tip N au o abundență de electroni liberi ca purtători majoritari de sarcină.</p>
`;
                break;
        }
        infoPanel.innerHTML = `<h2>${title}</h2>${description}`;
    }

    // Function to add a dopant
    function addDopant(dopant, dopantClass, carrierClass, carrierSymbol) {
        // Find a random silicon atom to replace
        const siAtomsIndices = latticeAtoms.reduce((acc, atom, index) => {
            if (atom.type === 'Si') acc.push(index);
            return acc;
        }, []);

        if (siAtomsIndices.length === 0) {
            infoPanel.innerHTML += "<p style='color:red;'>No more silicon atoms to replace!</p>";
            return; // No more Si atoms to replace
        }

        const randomIndex = siAtomsIndices[Math.floor(Math.random() * siAtomsIndices.length)];
        const atomToReplace = latticeAtoms[randomIndex];

        // Update atom's visual style and text
        atomToReplace.element.classList.remove('silicon');
        atomToReplace.element.classList.add(dopantClass);
        atomToReplace.element.textContent = dopant;
        atomToReplace.type = dopant;

        // Remove any existing carrier visual
        if (atomToReplace.carrierVisual) {
            atomToReplace.carrierVisual.remove();
        }

        // Add new carrier visual (hole or electron)
        const carrierDiv = document.createElement('div');
        carrierDiv.classList.add(carrierClass);
        // carrierDiv.textContent = carrierSymbol; // Not using text for visual carrier
        atomToReplace.element.appendChild(carrierDiv);
        atomToReplace.carrierVisual = carrierDiv;

        updateInfoPanel(dopant);
    }

    // Event Listeners
    addPTypeBtn.addEventListener('click', () => {
        addDopant('B', 'p-type', 'hole', 'h+'); // Using 'B' for Boron (P-type)
    });

    addNTypeBtn.addEventListener('click', () => {
        addDopant('P', 'n-type', 'electron', 'e-'); // Using 'P' for Phosphorus (N-type)
    });

    resetBtn.addEventListener('click', () => {
        createLattice();
    });

    // Initial setup
    createLattice();
});
