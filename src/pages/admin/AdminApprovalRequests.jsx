import DashboardLayout from "../../components/DashboardLayout";
import ApprovalBasket from "../../components/ApprovalBasket";
import { useAuth } from "../../context/AuthContext";

export default function AdminApprovalRequests() {

    const { user } = useAuth();

    return (

        <DashboardLayout>


            <div className="mt-6">

                <ApprovalBasket
                    adminMode={true}
                />

            </div>

        </DashboardLayout>

    );

}