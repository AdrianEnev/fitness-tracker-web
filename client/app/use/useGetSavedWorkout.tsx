import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "firebaseConfig";
import type { Workout, Exercise, Set } from 'interfaces';

export const getSavedWorkout = async (savedWorkoutId: string, currentUserUid: any): Promise<Workout | null> => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, currentUserUid);
    const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');
    const savedWorkoutDocRef = doc(savedWorkoutsCollectionRef, savedWorkoutId);

    const savedWorkoutSnap = await getDoc(savedWorkoutDocRef);

    if (!savedWorkoutSnap.exists()) {
        console.log('No such saved workout!');
        return null;
    }

    const savedWorkoutData = savedWorkoutSnap.data();
    const exercises: Exercise[] = [];

    const exercisesCollectionRef = collection(savedWorkoutDocRef, 'info');
    const exercisesSnapshot = await getDocs(exercisesCollectionRef);

    for (const exerciseDoc of exercisesSnapshot.docs) {
        const exerciseData = exerciseDoc.data();
        const sets: Set[] = [];

        const setsCollectionRef = collection(exerciseDoc.ref, 'sets');
        const setsSnapshot = await getDocs(setsCollectionRef);

        for (const setDoc of setsSnapshot.docs) {
            sets.push({
                ...setDoc.data(),
                id: setDoc.id
            } as Set);
        }

        exercises.push({
            ...exerciseData,
            sets,
            id: exerciseDoc.id
        } as Exercise);
    }

    return {
        ...savedWorkoutData,
        exercises,
        id: savedWorkoutSnap.id
    } as Workout;
}