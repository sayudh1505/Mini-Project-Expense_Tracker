// rrd imports
import { Link, useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";

// library import
import { TrashIcon } from "@heroicons/react/24/solid";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const loadBudget = async () => {
      try {
        if (showBudget) {
          const budgets = await getAllMatchingItems({
            category: "budgets",
            key: "id",
            value: expense.budgetId,
          });
          if (budgets.length > 0) {
            setBudget(budgets[0]);
          }
        }
      } catch (error) {
        console.error("Error loading budget:", error);
      }
    };
    loadBudget();
  }, [expense.budgetId, showBudget]);

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.createdAt)}</td>
      {showBudget && budget && (
        <td>
          <Link
            to={`/budget/${budget.id}`}
            style={{
              "--accent": budget.color,
            }}
          >
            {budget.name}
          </Link>
        </td>
      )}
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="deleteExpense" />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="btn btn--warning"
            aria-label={`Delete ${expense.name} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};

export default ExpenseItem;