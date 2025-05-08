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
                title = 'Pure Silicon (Intrinsic)';
                description = `
                    <p>This is a pure silicon crystal lattice. Each silicon (Si) atom shares its 4 valence electrons with four neighboring atoms, forming covalent bonds.</p>
                    <p>In an intrinsic (undoped) semiconductor, there are very few free charge carriers (electrons or holes) at room temperature. Its conductivity is low.</p>
                    <p>Click buttons to add P-type or N-type dopants.</p>`;
                break;
            case 'P':
                title = 'P-type Doping (e.g., Boron)';
                description = `
                    <p>P-type doping involves adding trivalent impurity atoms (like Boron, Aluminum, Gallium) to the silicon lattice. These atoms have 3 valence electrons.</p>
                    <p>When a trivalent atom replaces a silicon atom, it can only form 3 covalent bonds, leaving one bond incomplete. This creates a "hole" – an absence of an electron.</p>
                    <p>Holes act as positive charge carriers. An electron from a neighboring atom can move into the hole, causing the hole to appear to move in the opposite direction.</p>
                    <p>P-type semiconductors have an abundance of holes as majority charge carriers.</p>`;
                break;
            case 'N':
                title = 'N-type Doping (e.g., Phosphorus)';
                description = `
                    <p>N-type doping involves adding pentavalent impurity atoms (like Phosphorus, Arsenic, Antimony) to the silicon lattice. These atoms have 5 valence electrons.</p>
                    <p>When a pentavalent atom replaces a silicon atom, four of its valence electrons form covalent bonds with neighboring silicon atoms. The fifth electron is loosely bound and can easily become a free electron.</p>
                    <p>This free electron can move through the lattice, contributing to electrical conductivity.</p>
                    <p>N-type semiconductors have an abundance of free electrons as majority charge carriers.</p>`;
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
