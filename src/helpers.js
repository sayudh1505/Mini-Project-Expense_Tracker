import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc } from "firebase/firestore";
import { auth } from "./firebase";

export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 2000));

// colors
const generateRandomColor = () => {
  return `${Math.floor(Math.random() * 360)} 65% 50%`;
};

// create budget
export const createBudget = async ({ name, amount }) => {
  try {
    const newItem = {
      name: name,
      createdAt: Date.now(),
      amount: +amount,
      color: generateRandomColor(),
      userId: auth.currentUser.uid
    };
    const docRef = await addDoc(collection(db, "budgets"), newItem);
    return { id: docRef.id, ...newItem };
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

// create expense
export const createExpense = async ({ name, amount, budgetId }) => {
  try {
    // First verify that the budget exists and belongs to the user
    const budgetRef = doc(db, "budgets", budgetId);
    const budgetSnap = await getDoc(budgetRef);
    
    if (!budgetSnap.exists() || budgetSnap.data().userId !== auth.currentUser.uid) {
      throw new Error("Budget not found or access denied");
    }

    const newItem = {
      name: name,
      createdAt: Date.now(),
      amount: +amount,
      budgetId: budgetId,
      userId: auth.currentUser.uid
    };

    const docRef = await addDoc(collection(db, "expenses"), newItem);
    return { id: docRef.id, ...newItem };
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// total spent by budget
export const calculateSpentByBudget = async (budgetId) => {
  try {
    const expensesQuery = query(
      collection(db, "expenses"),
      where("budgetId", "==", budgetId),
      where("userId", "==", auth.currentUser.uid)
    );
    const expensesSnapshot = await getDocs(expensesQuery);
    const expenses = expensesSnapshot.docs.map(doc => doc.data());
    
    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  } catch (error) {
    console.error("Error calculating spent by budget:", error);
    throw error;
  }
};

// delete item
export const deleteItem = async ({ key, id }) => {
  try {
    await deleteDoc(doc(db, key, id));
    return true;
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
    throw error;
  }
};

// get all items
export const getAllMatchingItems = async ({ category, key, value }) => {
  try {
    let q;
    if (key && value) {
      q = query(
        collection(db, category),
        where("userId", "==", auth.currentUser.uid),
        where(key, "==", value)
      );
    } else {
      q = query(
        collection(db, category),
        where("userId", "==", auth.currentUser.uid)
      );
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting ${category}:`, error);
    throw error;
  }
};

// fetch data
export const fetchData = async (key) => {
  try {
    const q = query(
      collection(db, key),
      where("userId", "==", auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    throw error;
  }
};

// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

// Format percentage
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt) => {
  return amt.toLocaleString('en-IN', {
    style: "currency",
    currency: "INR",
  });
};