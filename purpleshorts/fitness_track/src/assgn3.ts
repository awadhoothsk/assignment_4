import readlineSync from "readline-sync";

type Workout = {
    type: string;
    duration: number; // in minutes
    caloriesBurned: number;
    date: Date;
};

type User = {
    id: string;
    name: string;
    age: number;
    weight: number;
    height: number;
    workouts: Workout[];
};

class FitnessTracker {
    private users: Map<string, User>;

    constructor() {
        this.users = new Map();
    }

    addUser(id: string, name: string, age: number, weight: number, height: number): void {
        if (this.users.has(id)) {
            throw new Error(`User with ID ${id} already exists.`);
        }
        if (age <= 0 || weight <= 0 || height <= 0) {
            throw new Error("Age, weight, and height must be positive values.");
        }
        this.users.set(id, { id, name, age, weight, height, workouts: [] });
    }

    logWorkout(userId: string, workout: Workout): void {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        if (workout.duration <= 0 || workout.caloriesBurned < 0) {
            throw new Error("Workout duration must be positive and calories burned cannot be negative.");
        }
        user.workouts.push(workout);
    }

    getAllWorkoutsOf(userId: string): Workout[] {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        return user.workouts;
    }

    getAllWorkoutsByType(userId: string, type: string): Workout[] {
        const user = this.users.get(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        return user.workouts.filter(workout => workout.type.toLowerCase() === type.toLowerCase());
    }

    getUsers(): User[] {
        return Array.from(this.users.values());
    }

    getUser(id: string): User | undefined {
        return this.users.get(id);
    }

    updateUser(id: string, updatedFields: Partial<Omit<User, 'id'>>): void {
        const user = this.users.get(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found.`);
        }
        Object.assign(user, updatedFields);
    }
}

// Interactive CLI
const tracker = new FitnessTracker();

while (true) {
    console.log("\nFitness Tracker");
    console.log("1. Add User");
    console.log("2. Log Workout");
    console.log("3. Get All Workouts");
    console.log("4. Get Workouts By Type");
    console.log("5. Get Users");
    console.log("6. Get User Details");
    console.log("7. Update User");
    console.log("8. Exit");
    
    const choice = readlineSync.question("Enter your choice: ");
    switch (choice) {
        case "1": {
            const id = readlineSync.question("Enter User ID: ");
            const name = readlineSync.question("Enter Name: ");
            const age = parseInt(readlineSync.question("Enter Age: "));
            const weight = parseFloat(readlineSync.question("Enter Weight: "));
            const height = parseFloat(readlineSync.question("Enter Height: "));
            tracker.addUser(id, name, age, weight, height);
            console.log("User added successfully!");
            break;
        }
        case "2": {
            const userId = readlineSync.question("Enter User ID: ");
            const type = readlineSync.question("Enter Workout Type: ");
            const duration = parseInt(readlineSync.question("Enter Duration (minutes): "));
            const caloriesBurned = parseInt(readlineSync.question("Enter Calories Burned: "));
            tracker.logWorkout(userId, { type, duration, caloriesBurned, date: new Date() });
            console.log("Workout logged successfully!");
            break;
        }
        case "3": {
            const userId = readlineSync.question("Enter User ID: ");
            console.log(tracker.getAllWorkoutsOf(userId));
            break;
        }
        case "4": {
            const userId = readlineSync.question("Enter User ID: ");
            const type = readlineSync.question("Enter Workout Type: ");
            console.log(tracker.getAllWorkoutsByType(userId, type));
            break;
        }
        case "5": {
            console.log(JSON.stringify(tracker.getUsers(), null, 2));
            break;
        }
        case "6": {
            const id = readlineSync.question("Enter User ID: ");
            console.log(tracker.getUser(id));
            break;
        }
        case "7": {
            const id = readlineSync.question("Enter User ID: ");
            const name = readlineSync.question("Enter New Name (leave blank to skip): ");
            const age = readlineSync.question("Enter New Age (leave blank to skip): ");
            const weight = readlineSync.question("Enter New Weight (leave blank to skip): ");
            const height = readlineSync.question("Enter New Height (leave blank to skip): ");
            
            const updatedFields: Partial<Omit<User, 'id'>> = {};
            if (name) updatedFields.name = name;
            if (age) updatedFields.age = parseInt(age);
            if (weight) updatedFields.weight = parseFloat(weight);
            if (height) updatedFields.height = parseFloat(height);
            
            tracker.updateUser(id, updatedFields);
            console.log("User updated successfully!");
            break;
        }
        case "8": {
            console.log("Exiting...");
            process.exit(0);
        }
        default:
            console.log("Invalid choice. Please try again.");
    }
}
