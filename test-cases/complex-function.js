// Complex function with multiple features
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}

// Arrow function
const multiply = (a, b) => a * b;

// Generator function
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}
