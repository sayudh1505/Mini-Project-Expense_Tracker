// rrd imports
import { Link, useLoaderData, useNavigate } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

// helper functions
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";

// loader
export async function dashboardLoader() {
  try {
    const budgets = await fetchData("budgets");
    const expenses = await fetchData("expenses");
    return { budgets, expenses };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    throw error;
  }
}

// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  try {
    if (_action === "createBudget") {
      const budget = await createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      return toast.success(`Budget "${values.newBudget}" created!`);
    }

    if (_action === "createExpense") {
      if (!values.newExpenseBudget) {
        throw new Error("Please select a budget");
      }
      const expense = await createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense "${values.newExpense}" created!`);
    }

    if (_action === "deleteExpense") {
      await deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Expense deleted!");
    }
  } catch (e) {
    console.error("Error:", e);
    throw new Error(e.message || "There was a problem with the action.");
  }
}

const Dashboard = () => {
  const { budgets, expenses } = useLoaderData();

  return (
    <div className="dashboard">
      <h1>Welcome back!</h1>
      <div className="grid-sm">
        {budgets && budgets.length > 0 ? (
          <div className="grid-lg">
            <div className="flex-lg">
              <AddBudgetForm />
              <AddExpenseForm budgets={budgets} />
            </div>
            <h2>Existing Budgets</h2>
            <div className="budgets">
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} />
              ))}
            </div>
            {expenses && expenses.length > 0 && (
              <div className="grid-md">
                <h2>Recent Expenses</h2>
                <Table
                  expenses={expenses
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, 8)}
                />
                {expenses.length > 8 && (
                  <Link to="expenses" className="btn btn--dark">
                    View all expenses
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="grid-sm">
            <p>Personal budgeting is the secret to financial freedom.</p>
            <p>Create a budget to get started!</p>
            <AddBudgetForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;