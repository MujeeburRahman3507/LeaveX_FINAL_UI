import { useState } from "react";

import toast from "react-hot-toast";

import {
    X,
    FileText,
    Send
} from "lucide-react";

import documentRequestService
    from "../../services/documentRequestService";

export default function RequestDocumentModal({

    open,

    onClose,

    leaveRequestId,

    onSuccess

}) {

    const [loading, setLoading] =
        useState(false);

const [form, setForm] =
    useState({

        documentType: "MEDICAL_CERTIFICATE",

        priority: "NORMAL",

        comments: ""

    });

    if (!open) {

        return null;

    }

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value

        });

    };

    const handleSubmit = async () => {

        if (!form.comments.trim()) {

            toast.error(
                "Please enter manager comments."
            );

            return;

        }

        try {

            setLoading(true);
await documentRequestService
.requestDocument({

    leaveRequestId,

    documentType: form.documentType,

    priority: form.priority,

    comments: form.comments

});

            toast.success(
                "Document request sent successfully."
            );

            if (onSuccess) {

                onSuccess();

            }

            onClose();

            setForm({

    documentType: "MEDICAL_CERTIFICATE",

    priority: "NORMAL",

    comments: ""

});

        } catch (err) {

            toast.error(

                err?.response?.data?.message ||

                "Failed to request document."

            );

        } finally {

            setLoading(false);

        }

    };

    return (

<div
className="
fixed
inset-0
bg-black/40
backdrop-blur-sm
flex
items-center
justify-center
z-50
"
>

<div
className="
bg-white
rounded-3xl
shadow-2xl
w-full
max-w-xl
overflow-hidden
"
>

{/* Header */}

<div
className="
bg-violet-600
text-white
px-6
py-5
flex
justify-between
items-center
"
>

<div
className="
flex
items-center
gap-3
"
>

<FileText size={24}/>

<div>

<h2
className="
text-xl
font-bold
"
>

Request Additional Documents

</h2>

<p
className="
text-violet-100
text-sm
"
>

Ask employee to upload supporting documents

</p>

</div>

</div>

<button

onClick={onClose}

className="
hover:bg-violet-700
rounded-lg
p-2
transition
"
>

<X size={22}/>

</button>

</div>

{/* Body */}

<div
className="
p-6
space-y-6
"
>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Document Type

</label>

<select

name="documentType"

value={form.documentType}

onChange={handleChange}

className="
w-full
border
rounded-xl
p-3
focus:ring-2
focus:ring-violet-500
"

>

<option value="MEDICAL_CERTIFICATE">

Medical Certificate

</option>

<option value="HOSPITAL_BILL">

Hospital Bill

</option>

<option value="LAB_REPORT">

Lab Report

</option>

<option value="PRESCRIPTION">

Prescription

</option>

<option value="OTHER">

Other

</option>

</select>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Priority

</label>

<select

name="priority"

value={form.priority}

onChange={handleChange}

className="
w-full
border
rounded-xl
p-3
focus:ring-2
focus:ring-violet-500
"

>

<option value="LOW">
🟢 Low
</option>

<option value="NORMAL">
🔵 Normal
</option>

<option value="HIGH">
🟠 High
</option>

<option value="URGENT">
🔴 Urgent
</option>

</select>

</div>

</div>

<div>

<label
className="
block
font-semibold
mb-2
"
>

Manager Comments

</label>


<textarea

name="comments"

rows="5"

value={form.comments}

onChange={handleChange}

placeholder="Example: Please upload the original medical certificate issued by the hospital."

className="
w-full
border
rounded-xl
p-4
resize-none
focus:ring-2
focus:ring-violet-500
"
/>

</div>

{/* Information */}

<div
className="
rounded-2xl
bg-violet-50
border
border-violet-200
p-5
"
>

<h3
className="
font-semibold
text-violet-700
mb-3
"
>

Employee will receive

</h3>

<ul
className="
space-y-2
text-sm
text-slate-700
"
>

<li>

✅ In-App Notification

</li>

<li>

✅ Email Notification

</li>

<li>

✅ Request will appear in Employee Dashboard

</li>

<li>

✅ Employee can upload the requested document

</li>

</ul>

</div>

</div>



{/* Footer */}

<div
className="
bg-slate-50
border-t
px-6
py-5
flex
justify-end
gap-4
"
>

<button

type="button"

onClick={onClose}

className="
px-5
py-3
rounded-xl
border
hover:bg-slate-100
transition
"

>

Cancel

</button>

<button

type="button"

disabled={loading}

onClick={handleSubmit}

className="
flex
items-center
gap-2
bg-violet-600
hover:bg-violet-700
disabled:bg-violet-300
text-white
px-6
py-3
rounded-xl
transition
"

>

<Send size={18}/>

{

loading

?

"Sending..."

:

"Send Request"

}

</button>

</div>

</div>

</div>

);

}
