// rrd import
import { redirect } from "react-router-dom";

// library
import { toast } from "react-toastify";

// helpers
import { deleteItem, getAllMatchingItems } from "../helpers";

export async function deleteBudget({ params }) {
  try {
    // First, get all associated expenses
    const expenses = await getAllMatchingItems({
      category: "expenses",
      key: "budgetId",
      value: params.id,
    });

    // Delete all associated expenses first
    for (const expense of expenses) {
      await deleteItem({
        key: "expenses",
        id: expense.id,
      });
    }

    // Then delete the budget
    await deleteItem({
      key: "budgets",
      id: params.id,
    });

    toast.success("Budget and associated expenses deleted successfully!");
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw new Error("There was a problem deleting your budget and its expenses.");
  }
  return redirect("/");
}