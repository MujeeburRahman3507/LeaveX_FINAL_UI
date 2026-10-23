import DashboardLayout from "../../components/DashboardLayout";
import AdminDocumentReviewContent from "../../components/admin/AdminDocumentReview";


export default function AdminDocumentReview() {

    return (

        <DashboardLayout>

            <div className="mb-8">

                <h1 className="
                    text-3xl
                    font-bold
                    text-slate-800
                    dark:text-white
                ">
                    Documents Waiting Review
                </h1>

                <p className="
                    mt-2
                    text-slate-500
                    dark:text-slate-400
                ">
                    Review supporting documents uploaded by managers.
                </p>

            </div>

            <AdminDocumentReviewContent />

        </DashboardLayout>

    );
}