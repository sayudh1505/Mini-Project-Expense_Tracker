// rrd imports
import { redirect } from "react-router-dom";

// library
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// helpers
import { deleteItem } from "../helpers";

export async function logoutAction() {
  try {
    // Sign out from Firebase
    await signOut(auth);

    // delete the local data
    deleteItem({
      key: "userName"
    })
    deleteItem({
      key: "budgets"
    })
    deleteItem({
      key: "expenses"
    })
    
    toast.success("You've been logged out successfully!")
    // return redirect
    return redirect("/")
  } catch (error) {
    console.error("Error signing out:", error);
    toast.error("There was a problem logging out");
    return redirect("/dashboard")
  }
}