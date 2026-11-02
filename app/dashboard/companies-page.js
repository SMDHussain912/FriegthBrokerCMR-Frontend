
import { useEffect, useState } from "react";
import { useSession } from "next-session";
import { Panel, PanelHeader } from "@/components/ui";
import { useNavigate } from "next/navigation";
import { listUserCompanies, createCompany, updateCompany } from "@/lib/data";
import { CompanyForm } from "@/components/company-form";
import { Button } from "@/components/ui";

 export default function CompaniesPage() {
   const navigate = useNavigate();
   const [companies, setCompanies] = useState([]);
   const [creating, setCreating] = useState(false);
   const [editing, setEditing] = useState(null);
   const [editingCompany, setEditingCompany] = useState(null);
   
   useEffect(() => {
     listUserCompanies().then(setCompanies).catch(console.error);
   }, []);
   
   const handleCreate = async (data) => {
     setCreating(true);
     try {
       await createCompany(data);
       setCreating(false);
       setCompanies(prev => prev.concat(data));
       navigate("/dashboard");
     } catch (error) {
       console.error(error);
       setCreating(false);
     };
   };
   
   const handleEdit = async (company) => {
     setEditing(company);
   };
   
   const handleUpdate = async (id, data) => {
     setEditing(null);
     try {
       await updateCompany(id, data);
       setCompanies(prev => prev.map(c => c.id === id ? data : c));
       navigate("/dashboard");
     } catch (error) {
       console.error(error);
     };
   };

   return (
     <div className="space-y-6">
       <PanelHeader
         title="Companies"
         description="Your associated companies"
       />
       
      {/* Create company section */}
      {creating ? (
        <Panel>
          <PanelHeader title="Create Company" />
          <CompanyForm initialValues={{ type: "brokerage" }} onSubmit={handleCreate} />
        </Panel>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className={"rounded-panel border border-ink-700 bg-ink-900/70 py-2.5 text-sm font-medium text-mist-400 hover:bg-ink-800/50"}
        >
          Create Company
        </button>
      )
      }
      
      <div>
        {companies.length === 0 ? (
          <p className="text-mist-500">No companies found. Create one above.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div key={company.id} className="rounded-panel border border-ink-700 bg-ink-900/70 p-4 hover:bg-ink-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-xl font-semibold text-mist-100">{company.name}</span>
                  <span className="text-sm text-mist-500">({company.type})</span>
                  <span className="ml-auto text-xs text-mist-500">{company.slug}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setEditingCompany(company)}
                    className={"rounded-sm border border-ink-700 bg-ink-850/50 text-xs font-medium text-mist-400 hover:bg-ink-800/50 px-2 py-1"}
                  >Edit</button>
                  <button
                    className={"rounded-sm border border-ink-700 bg-ink-850/50 text-xs font-medium text-mist-400 hover:bg-ink-800/50 px-2 py-1"}
                  >Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      
      {editingCompany && (
        <Panel>
          <PanelHeader title="Edit Company" />
          <CompanyForm
            initialValues={{ name: editingCompany.name, type: editingCompany.type, slug: editingCompany.slug }}
            onSubmit={(data) => handleUpdate(editingCompany.id, data)}
          />
        </Panel>
      )}
    </div>
  );
}
