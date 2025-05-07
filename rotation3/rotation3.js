// DOM elements and state already defined...

const connections = [
    ['battery+', 'semi1'],
    ['semi1', 'semi2'],
    ['semi2', 'bulb'],
    ['bulb', 'battery-']
];

function getGraph() {
    // Directed graph depending on rotation
    const graph = {
        'battery+': ['semi1'],
        'semi1': [],
        'semi2': [],
        'bulb': ['battery-'],
        'battery-': []
    };

    if (components.semi1.rotation % 360 === 0) {
        graph['semi1'].push('semi2');
    }
    if (components.semi2.rotation % 360 === 0) {
        graph['semi2'].push('bulb');
    }

    return graph;
}

function hasPath(graph, start, end, visited = new Set()) {
    if (start === end) return true;
    visited.add(start);
    for (const neighbor of graph[start] || []) {
        if (!visited.has(neighbor)) {
            if (hasPath(graph, neighbor, end, visited)) return true;
        }
    }
    return false;
}

function updateCircuit() {
    const graph = getGraph();
    const isFlowing = hasPath(graph, 'battery+', 'battery-');

    // Lightbulb visual update
    components.bulb1.element.classList.toggle('on', isFlowing);
    currentStatusDisplay.textContent = isFlowing ? 'Flowing' : 'Blocked';
}

function rotateSemiconductor(semiconductor, display) {
    semiconductor.rotation = (semiconductor.rotation + 90) % 360;
    semiconductor.element.style.transform = `rotate(${semiconductor.rotation}deg)`;
    display.textContent = `${semiconductor.rotation}°`;
    updateCircuit();
}

// Event listeners
semiconductor1Element.addEventListener('click', () => {
    rotateSemiconductor(components.semi1, rotationDisplay1);
});
semiconductor2Element.addEventListener('click', () => {
    rotateSemiconductor(components.semi2, rotationDisplay2);
});

// Initial state
updateCircuit();
