// ES6 Class with inheritance
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
    
    speak() {
        console.log(`${this.name} barks`);
    }
    
    static species() {
        return 'Canis familiaris';
    }
}

const myDog = new Dog('Buddy', 'Golden Retriever');
myDog.speak();
