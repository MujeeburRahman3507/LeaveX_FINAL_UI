import React, { useEffect, useMemo, useState } from "react";
import {
  Bell, Check, ChevronDown, ChevronLeft, ChevronRight, Code2, FileText,
  Layers, Mail, Pause, Pencil, Plus, Power, RotateCcw, Search, Send, X, Eye
} from "lucide-react";
import notificationTemplateService from "../../services/notificationTemplateService";

const emptyForm = {
  templateCode: "", templateName: "", channel: "BOTH", title: "", message: "",
  emailSubject: "", emailBody: "", active: true,
};

const PAGE_SIZE = 10;

const PLACEHOLDERS = [
  "{employeeName}", "{employeeId}", "{cycleName}", "{appraisalPeriod}",
  "{managerName}", "{hrName}", "{actionUrl}", "{currentDate}", "{companyName}",
];

const channels = {
  BOTH: { icon: Layers, text: "BOTH", cls: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20" },
  IN_APP: { icon: Bell, text: "IN_APP", cls: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20" },
  EMAIL: { icon: Send, text: "EMAIL", cls: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20" },
};

const NotificationTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setTemplates((await notificationTemplateService.getAllTemplates()) || []);
    } catch (error) {
      console.error("Failed to load notification templates:", error);
      alert(error?.response?.data?.message || "Failed to load notification templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); }, []);

  const stats = useMemo(() => ({
    total: templates.length,
    active: templates.filter(t => t.active).length,
    inactive: templates.filter(t => !t.active).length,
    email: templates.filter(t => t.channel === "EMAIL").length,
    inApp: templates.filter(t => t.channel === "IN_APP").length,
    both: templates.filter(t => t.channel === "BOTH").length,
  }), [templates]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter(t =>
      (!q || t.templateCode?.toLowerCase().includes(q) ||
        t.templateName?.toLowerCase().includes(q) ||
        t.message?.toLowerCase().includes(q)) &&
      (channelFilter === "ALL" || t.channel === channelFilter) &&
      (statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && t.active) ||
        (statusFilter === "INACTIVE" && !t.active))
    );
  }, [templates, search, channelFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, channelFilter, statusFilter]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const openCreate = () => {
    setEditing(null); setForm(emptyForm); setDrawer(true);
  };

  const openEdit = t => {
    setEditing(t);
    setForm({
      templateCode: t.templateCode || "", templateName: t.templateName || "",
      channel: t.channel || "BOTH", title: t.title || "", message: t.message || "",
      emailSubject: t.emailSubject || "", emailBody: t.emailBody || "",
      active: t.active ?? true,
    });
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false); setEditing(null); setForm(emptyForm);
  };

  const change = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async e => {
    e.preventDefault();
    if (!form.templateName.trim()) return alert("Template name is required.");
    if (!editing && !form.templateCode.trim()) return alert("Template code is required.");
    if (!form.channel) return alert("Channel is required.");

    try {
      setSaving(true);
      const payload = {
        templateCode: form.templateCode.trim(),
        templateName: form.templateName.trim(),
        channel: form.channel, title: form.title, message: form.message,
        emailSubject: form.emailSubject, emailBody: form.emailBody, active: form.active,
      };
      if (editing) {
        await notificationTemplateService.updateTemplate(editing.id, payload);
        alert("Notification template updated successfully.");
      } else {
        await notificationTemplateService.createTemplate(payload);
        alert("Notification template created successfully.");
      }
      closeDrawer();
      await loadTemplates();
    } catch (error) {
      console.error("Failed to save notification template:", error);
      alert(error?.response?.data?.message || "Failed to save notification template.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async t => {
    try {
      await notificationTemplateService.toggleActive(t.id);
      await loadTemplates();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to update template status.");
    }
  };

  const dateText = value => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return <><div>{d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
      <div className="text-xs text-slate-400">{d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div></>;
  };

  return (
    <div className="min-h-0 sm:min-h-screen bg-slate-50 p-0 sm:p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-4 sm:mb-6 flex flex-col gap-4 sm:gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20"><Bell size={24}/></div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Notification Templates</h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 sm:line-clamp-none">Manage in-app notification and email templates. Create, edit and configure templates used across the system.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => alert("Available placeholders:\n\n" + PLACEHOLDERS.join("\n"))} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"><Eye size={17}/><span className="sm:hidden">Placeholders</span><span className="hidden sm:inline">View Placeholders</span></button>
            <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"><Plus size={18}/><span className="sm:hidden">Create</span><span className="hidden sm:inline">Create Template</span></button>
          </div>
        </header>

        <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-6 keep-grid">
          <Stat icon={FileText} value={stats.total} label="Total Templates" cls="from-indigo-50 to-blue-50 text-indigo-600 dark:from-indigo-500/10 dark:to-blue-500/10 dark:text-indigo-300"/>
          <Stat icon={Check} value={stats.active} label="Active Templates" cls="from-emerald-50 to-green-50 text-emerald-600 dark:from-emerald-500/10 dark:to-green-500/10 dark:text-emerald-300"/>
          <Stat icon={Pause} value={stats.inactive} label="Inactive Templates" cls="from-amber-50 to-orange-50 text-amber-600 dark:from-amber-500/10 dark:to-orange-500/10 dark:text-amber-300"/>
          <Stat icon={Mail} value={stats.email} label="Email Only" cls="from-fuchsia-50 to-purple-50 text-fuchsia-600 dark:from-fuchsia-500/10 dark:to-purple-500/10 dark:text-fuchsia-300"/>
          <Stat icon={Bell} value={stats.inApp} label="In-App Only" cls="from-sky-50 to-cyan-50 text-sky-600 dark:from-sky-500/10 dark:to-cyan-500/10 dark:text-sky-300"/>
          <Stat icon={Layers} value={stats.both} label="Both Channels" cls="from-teal-50 to-emerald-50 text-teal-600 dark:from-teal-500/10 dark:to-emerald-500/10 dark:text-teal-300"/>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(280px,1fr)_200px_180px_auto]">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by template code or name..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"/>
            </div>
            <Filter value={channelFilter} setValue={setChannelFilter} options={[["ALL","All Channels"],["BOTH","Both Channels"],["IN_APP","In-App Only"],["EMAIL","Email Only"]]}/>
            <Filter value={statusFilter} setValue={setStatusFilter} options={[["ALL","All Status"],["ACTIVE","Active"],["INACTIVE","Inactive"]]}/>
            <button type="button" onClick={() => {setSearch("");setChannelFilter("ALL");setStatusFilter("ALL");}} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"><RotateCcw size={16}/>Reset</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div><h2 className="font-semibold text-slate-900 dark:text-white">Templates</h2><p className="mt-0.5 text-xs text-slate-400">{filtered.length} templates found</p></div>
          </div>

          {loading ? <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">Loading templates...</div> :
           rows.length === 0 ? <div className="flex min-h-[300px] flex-col items-center justify-center text-center"><Bell size={28} className="mb-3 text-slate-300"/><p className="font-semibold text-slate-700 dark:text-slate-200">No notification templates found</p><p className="mt-1 text-sm text-slate-400">Try changing your filters or create a new template.</p></div> :
           <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px]">
                <thead><tr className="border-b border-slate-100 bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-5 py-3.5">#</th><th className="px-4 py-3.5">Template Name</th><th className="px-4 py-3.5">Template Code</th><th className="px-4 py-3.5">Channel</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Last Updated</th><th className="px-4 py-3.5 text-right">Actions</th>
                </tr></thead>
                <tbody>
                  {rows.map((t,i) => {
                    const c = channels[t.channel] || channels.BOTH; const Icon = c.icon;
                    return <tr key={t.id} className="border-b border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{(page-1)*PAGE_SIZE+i+1}</span></td>
                      <td className="max-w-[280px] px-4 py-4"><div className="font-semibold text-slate-800 dark:text-white">{t.templateName}</div><div className="mt-1 truncate text-xs text-slate-400">{t.message || "Notification template"}</div></td>
                      <td className="px-4 py-4"><span className="inline-flex max-w-[260px] rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t.templateCode}</span></td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${c.cls}`}><Icon size={13}/>{c.text}</span></td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${t.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"}`}><span className={`h-1.5 w-1.5 rounded-full ${t.active ? "bg-emerald-500" : "bg-rose-500"}`}/>{t.active ? "Active" : "Inactive"}</span></td>
                      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{dateText(t.updatedAt || t.createdAt)}</td>
                      <td className="px-4 py-4"><div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEdit(t)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"><Pencil size={14}/>Edit</button>
                        <button type="button" onClick={() => toggle(t)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${t.active ? "border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-300" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-300"}`}><Power size={14}/>{t.active ? "Disable" : "Enable"}</button>
                      </div></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-slate-100 lg:hidden dark:divide-slate-800">
              {rows.map((t,i) => { const c=channels[t.channel]||channels.BOTH; const Icon=c.icon; return <div key={t.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{(page-1)*PAGE_SIZE+i+1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-slate-800 dark:text-white">{t.templateName}</p>
                    <p className="mt-0.5 break-all font-mono text-[11px] text-slate-400">{t.templateCode}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" aria-label="Edit template" onClick={()=>openEdit(t)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"><Pencil size={16}/></button>
                    <button type="button" aria-label={t.active?"Disable template":"Enable template"} onClick={()=>toggle(t)} className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.active ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"}`}><Power size={16}/></button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{t.active?"Active":"Inactive"}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${c.cls}`}><Icon size={13}/>{c.text}</span>
                  <span className="flex gap-1 text-xs text-slate-400">{dateText(t.updatedAt||t.createdAt)}</span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">{t.message||"Notification template"}</p>
              </div>; })}
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Showing <b>{filtered.length ? (page-1)*PAGE_SIZE+1 : 0}</b> to <b>{Math.min(page*PAGE_SIZE,filtered.length)}</b> of <b>{filtered.length}</b> templates</p>
              <div className="flex items-center gap-1">
                <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 dark:border-slate-700"><ChevronLeft size={17}/></button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=><button key={n} onClick={()=>setPage(n)} className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold ${page===n?"bg-blue-600 text-white":"text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`}>{n}</button>)}
                <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 dark:border-slate-700"><ChevronRight size={17}/></button>
              </div>
            </div>
           </>}
        </div>
      </div>

      {drawer && <div className="fixed inset-0 z-50 flex justify-end">
        <button aria-label="Close" type="button" onClick={closeDrawer} className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"/>
        <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-violet-50 px-6 py-5 dark:border-slate-800 dark:from-blue-500/10 dark:via-slate-900 dark:to-violet-500/10">
            <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"><Pencil size={19}/></div><div><h2 className="font-bold text-slate-900 dark:text-white">{editing?"Edit Notification Template":"Create New Template"}</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{editing?"Update the notification and email content.":"Define a new notification template for in-app and/or email."}</p></div></div><button type="button" onClick={closeDrawer} className="rounded-lg p-2 text-slate-400 hover:bg-white dark:hover:bg-slate-800"><X size={19}/></button></div>
          </div>
          <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Template Code" required={!editing} helper={editing?"Template code cannot be changed.":"Unique code (use UPPERCASE with underscores)"}><input name="templateCode" value={form.templateCode} onChange={change} readOnly={!!editing} placeholder="e.g. APPRAISAL_CUSTOM_NOTIFICATION" className={`input ${editing?"cursor-not-allowed bg-slate-100 dark:bg-slate-800/70":""}`}/></Field>
                <Field label="Template Name" required helper="Display name for easy identification"><input name="templateName" value={form.templateName} onChange={change} placeholder="e.g. Custom Notification" className="input"/></Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Channel" required><div className="relative"><select name="channel" value={form.channel} onChange={change} className="input appearance-none pr-10"><option value="BOTH">BOTH - In-App + Email</option><option value="IN_APP">IN_APP - In-App Only</option><option value="EMAIL">EMAIL - Email Only</option></select><ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></div></Field>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-slate-800 dark:text-white">Active</p><p className="mt-0.5 text-xs text-slate-400">Enable this template</p></div><button type="button" onClick={()=>setForm(f=>({...f,active:!f.active}))} className={`relative h-6 w-11 rounded-full ${form.active?"bg-blue-600":"bg-slate-300 dark:bg-slate-600"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm ${form.active?"left-6":"left-1"}`}/></button></div></div>
              </div>
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="mb-4 flex items-center gap-2"><Bell size={16} className="text-sky-500"/><h3 className="text-sm font-bold text-slate-800 dark:text-white">In-App Notification</h3></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="In-App Title"><input name="title" value={form.title} onChange={change} placeholder="e.g. New Notification" className="input"/></Field>
                  <Field label="In-App Message" helper="Use placeholders like {employeeName}, {cycleName}, etc."><textarea name="message" value={form.message} onChange={change} rows={4} placeholder="Enter in-app notification message..." className="input resize-none"/></Field>
                </div>
              </section>
              <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="mb-4 flex items-center gap-2"><Mail size={16} className="text-purple-500"/><h3 className="text-sm font-bold text-slate-800 dark:text-white">Email Notification</h3></div>
                <div className="space-y-4">
                  <Field label="Email Subject"><input name="emailSubject" value={form.emailSubject} onChange={change} placeholder="e.g. Notification from BOIT" className="input"/></Field>
                  <Field label="Email Body" helper="Use placeholders like {employeeName}, {cycleName}, etc. HTML is allowed."><textarea name="emailBody" value={form.emailBody} onChange={change} rows={9} placeholder="Enter email content (HTML allowed)..." className="input resize-none font-mono text-xs"/></Field>
                </div>
              </section>
              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                <div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"><Code2 size={16}/></div><div><h3 className="text-sm font-bold text-slate-800 dark:text-white">Available Placeholders</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Use these placeholders in your template content:</p><div className="mt-3 flex flex-wrap gap-2">{PLACEHOLDERS.map(x=><button key={x} type="button" onClick={()=>navigator.clipboard?.writeText(x)} className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5 font-mono text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-slate-900 dark:text-blue-300">{x}</button>)}</div></div></div>
              </section>
            </div>
            <div className="border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900"><div className="flex justify-end gap-3"><button type="button" onClick={closeDrawer} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50">{editing?<Pencil size={16}/>:<Plus size={17}/>} {saving?"Saving...":editing?"Save Changes":"Create Template"}</button></div></div>
          </form>
        </aside>
      </div>}
    </div>
  );
};

const Stat = ({icon:Icon,value,label,cls}) => <div className={`rounded-2xl border border-white/70 bg-gradient-to-br p-4 shadow-sm dark:border-slate-800 ${cls}`}><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-sm dark:bg-slate-900/60"><Icon size={20}/></div><span className="text-2xl font-bold text-slate-800 dark:text-white">{value}</span></div><p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p></div>;

const Filter = ({value,setValue,options}) => <div className="relative"><select value={value} onChange={e=>setValue(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"/></div>;

const Field = ({label,required,helper,children}) => <div><label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}{required&&<span className="ml-1 text-rose-500">*</span>}</label>{children}{helper&&<p className="mt-1.5 text-[11px] leading-4 text-slate-400">{helper}</p>}</div>;

export default NotificationTemplates;
