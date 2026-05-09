Home → upload/capture image → detect 
→ Result page (waste type + severity)
    → LOW severity → see disposal tips
    → HIGH severity → "File a Complaint" button
        → Complaint form (auto-filled + user fills name/contact/email)
            → submitted → saved to MongoDB
                → redirected to public complaints page
                    → can track their complaint by ID or email



        /admin/login → enters credentials
    → if correct → JWT stored → redirected to /admin dashboard
        → sees all complaints
        → can update status + add action notes
        → timeline updates visible to citizen on tracking page