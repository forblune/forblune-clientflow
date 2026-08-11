import { FormEvent, useEffect, useMemo, useState, type ReactElement } from 'react';
import {
  STAGES,
  attentionLeads,
  seedLeads,
  weightedPipeline,
  wonValue,
  type Lang,
  type Lead,
  type Stage,
  type View,
} from './domain';

type IconName =
  | 'grid' | 'users' | 'pipeline' | 'inbox' | 'search' | 'filter' | 'plus'
  | 'arrow' | 'clock' | 'spark' | 'list' | 'board' | 'close' | 'chevron'
  | 'building' | 'mail' | 'calendar' | 'activity' | 'check' | 'globe' | 'reset';

const copy = {
  ko: {
    product: 'ClientFlow', productSub: '고객 문의 운영 데모', demo: 'DEMO DATA', local: '외부 전송 없음',
    dashboard: '개요', leads: '고객 문의', pipeline: '파이프라인', inbox: '응답함',
    dashboardTitle: '오늘의 고객 운영', dashboardSub: '놓치기 쉬운 문의와 다음 행동을 먼저 확인하세요.',
    leadsTitle: '고객 문의', leadsSub: '검색·필터·보드 전환으로 모든 리드를 한곳에서 관리합니다.',
    pipelineTitle: '수주 파이프라인', pipelineSub: '단계별 진행 상황과 예정 금액을 함께 봅니다.',
    inboxTitle: '응답이 필요한 대화', inboxSub: '최근 활동과 다음 답변 시점을 기준으로 정렬했습니다.',
    addLead: '새 문의', activeLeads: '진행 중 문의', attention: '오늘 확인', proposals: '제안·협상',
    weighted: '가중 파이프라인', won: '확정 금액', basedOnDemo: '화면의 가상 데이터 기준',
    focusTitle: '먼저 확인할 문의', focusSub: '기한과 우선순위 기준', pipelineHealth: '단계별 현황',
    recentActivity: '최근 활동', sourceMix: '유입 경로', viewAll: '전체 보기',
    search: '회사·담당자·ID 검색', allStages: '전체 단계', allOwners: '전체 담당자',
    list: '목록', board: '보드', company: '회사 / 담당자', stage: '단계', value: '예상 금액',
    owner: '담당', next: '다음 행동', due: '기한', source: '유입', noResults: '조건에 맞는 문의가 없습니다.',
    resetFilters: '필터 초기화', today: '오늘', overdue: '기한 초과', daysLater: '일 후',
    high: '높음', medium: '보통', low: '낮음', priority: '우선순위', contact: '연락처',
    activity: '최근 활동', note: '업무 메모', moveNext: '다음 단계로 이동', completed: '수주 완료',
    openDetail: '상세 열기', close: '닫기', newLeadTitle: '새 문의 추가', newLeadSub: '데모 세션에만 추가됩니다.',
    companyName: '회사명', contactName: '담당자', email: '이메일', expectedValue: '예상 금액 (KRW)',
    cancel: '취소', add: '추가', required: '회사명과 담당자를 입력해 주세요.',
    saved: '데모 문의가 추가되었습니다.', emptyInbox: '현재 응답 대기 문의가 없습니다.',
    needsReply: '응답 필요', scheduled: '예약됨', replyBy: '다음 행동', derived: '레코드에서 자동 계산',
    disclaimer: '모든 이름·연락처·금액은 기능 검증을 위한 가상 데이터입니다.',
  },
  en: {
    product: 'ClientFlow', productSub: 'Client operations demo', demo: 'DEMO DATA', local: 'No external transfer',
    dashboard: 'Overview', leads: 'Leads', pipeline: 'Pipeline', inbox: 'Response desk',
    dashboardTitle: "Today's client operations", dashboardSub: 'Start with inquiries and next actions that are easiest to miss.',
    leadsTitle: 'Client inquiries', leadsSub: 'Search, filter, and switch views without losing context.',
    pipelineTitle: 'Opportunity pipeline', pipelineSub: 'Review stage progress and expected value together.',
    inboxTitle: 'Conversations needing a response', inboxSub: 'Ordered by recent activity and next-response timing.',
    addLead: 'New inquiry', activeLeads: 'Active leads', attention: 'Needs attention', proposals: 'Proposal · negotiation',
    weighted: 'Weighted pipeline', won: 'Confirmed value', basedOnDemo: 'Based on visible demo records',
    focusTitle: 'Review first', focusSub: 'By due date and priority', pipelineHealth: 'Pipeline stages',
    recentActivity: 'Recent activity', sourceMix: 'Lead sources', viewAll: 'View all',
    search: 'Search company, contact, or ID', allStages: 'All stages', allOwners: 'All owners',
    list: 'List', board: 'Board', company: 'Company / contact', stage: 'Stage', value: 'Expected value',
    owner: 'Owner', next: 'Next action', due: 'Due', source: 'Source', noResults: 'No inquiries match these filters.',
    resetFilters: 'Reset filters', today: 'Today', overdue: 'Overdue', daysLater: 'd left',
    high: 'High', medium: 'Medium', low: 'Low', priority: 'Priority', contact: 'Contact',
    activity: 'Recent activity', note: 'Operations note', moveNext: 'Move to next stage', completed: 'Won',
    openDetail: 'Open detail', close: 'Close', newLeadTitle: 'Add demo inquiry', newLeadSub: 'Saved for this demo session only.',
    companyName: 'Company', contactName: 'Contact name', email: 'Email', expectedValue: 'Expected value (KRW)',
    cancel: 'Cancel', add: 'Add inquiry', required: 'Enter a company and contact name.',
    saved: 'Demo inquiry added.', emptyInbox: 'No inquiries are waiting for a response.',
    needsReply: 'Needs reply', scheduled: 'Scheduled', replyBy: 'Next action', derived: 'Calculated from records',
    disclaimer: 'All names, contact details, and amounts are fictional demo data.',
  },
} as const;

const stageCopy: Record<Lang, Record<Stage, string>> = {
  ko: { new: '신규', qualified: '요건 확인', proposal: '제안', negotiation: '협상', won: '수주' },
  en: { new: 'New', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won' },
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactElement> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    pipeline: <><path d="M4 5h6v5H4zM14 14h6v5h-6z"/><path d="M10 7.5h3a3 3 0 0 1 3 3V14M7 10v4a3 3 0 0 0 3 3h4"/></>,
    inbox: <><path d="M4 4h16v14H4z"/><path d="M4 14h4l2 3h4l2-3h4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7z"/>, plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>, clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>,
    board: <><rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="10" rx="1"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>, chevron: <path d="m9 18 6-6-6-6"/>,
    building: <><path d="M4 21V5l8-3 8 3v16M9 9h1M14 9h1M9 13h1M14 13h1M9 17h6"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    activity: <path d="M3 12h4l2-7 4 14 2-7h6"/>, check: <path d="m5 12 4 4L19 6"/>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
    reset: <><path d="M4 7h6V1"/><path d="M4.6 16A9 9 0 1 0 6 5.3L4 7"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function formatWon(value: number, lang: Lang) {
  if (lang === 'ko') return `${Math.round(value / 10_000).toLocaleString()}만 원`;
  return `₩${(value / 1_000_000).toFixed(1)}M`;
}

function dueLabel(offset: number, lang: Lang) {
  const t = copy[lang];
  if (offset < 0) return t.overdue;
  if (offset === 0) return t.today;
  return lang === 'ko' ? `${offset}${t.daysLater}` : `${offset}${t.daysLater}`;
}

function StageBadge({ stage, lang }: { stage: Stage; lang: Lang }) {
  return <span className={`stage stage--${stage}`}><i />{stageCopy[lang][stage]}</span>;
}

function PriorityBadge({ priority, lang }: { priority: Lead['priority']; lang: Lang }) {
  return <span className={`priority priority--${priority}`}>{copy[lang][priority]}</span>;
}

function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('clientflow-lang') === 'en' ? 'en' : 'ko'));
  const [view, setView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [display, setDisplay] = useState<'list' | 'board'>('list');
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [toast, setToast] = useState('');
  const t = copy[lang];

  useEffect(() => {
    localStorage.setItem('clientflow-lang', lang);
    document.documentElement.lang = lang;
    document.title = lang === 'ko' ? 'Forblune ClientFlow — 고객 문의 운영 데모' : 'Forblune ClientFlow — Client operations demo';
  }, [lang]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const selected = leads.find((lead) => lead.id === selectedId) ?? null;
  const owners = [...new Set(leads.map((lead) => lead.owner))];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesText = !q || [lead.id, lead.company, lead.contact, lead.email].some((value) => value.toLowerCase().includes(q));
      return matchesText && (stageFilter === 'all' || lead.stage === stageFilter) && (ownerFilter === 'all' || lead.owner === ownerFilter);
    });
  }, [leads, ownerFilter, search, stageFilter]);

  const nav: { id: View; icon: IconName; label: string; count?: number }[] = [
    { id: 'dashboard', icon: 'grid', label: t.dashboard },
    { id: 'leads', icon: 'users', label: t.leads, count: leads.filter((lead) => lead.stage !== 'won').length },
    { id: 'pipeline', icon: 'pipeline', label: t.pipeline },
    { id: 'inbox', icon: 'inbox', label: t.inbox, count: attentionLeads(leads).length },
  ];

  const titles: Record<View, [string, string]> = {
    dashboard: [t.dashboardTitle, t.dashboardSub], leads: [t.leadsTitle, t.leadsSub],
    pipeline: [t.pipelineTitle, t.pipelineSub], inbox: [t.inboxTitle, t.inboxSub],
  };

  const openLead = (id: string) => setSelectedId(id);
  const resetFilters = () => { setSearch(''); setStageFilter('all'); setOwnerFilter('all'); };

  const moveNext = (lead: Lead) => {
    const index = STAGES.indexOf(lead.stage);
    if (index >= STAGES.length - 1) return;
    const nextStage = STAGES[index + 1];
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, stage: nextStage } : item));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">F</span><div><strong>forblune.</strong><span>{t.product}</span></div></div>
        <div className="mode-card"><span className="live-dot"/><div><strong>{t.productSub}</strong><small>{t.local}</small></div></div>
        <nav aria-label="Primary">
          {nav.map((item) => (
            <button key={item.id} className={view === item.id ? 'nav-item is-active' : 'nav-item'} onClick={() => setView(item.id)}>
              <Icon name={item.icon}/><span>{item.label}</span>{item.count !== undefined && <em>{item.count}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span><Icon name="spark" size={16}/>{t.demo}</span>
          <p>{t.disclaimer}</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">F</span><strong>ClientFlow</strong></div>
          <div className="top-badges"><span className="demo-badge">{t.demo}</span><span className="safe-badge"><Icon name="check" size={14}/>{t.local}</span></div>
          <div className="top-actions">
            <button className="language" onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')} aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}>
              <Icon name="globe" size={16}/><span className={lang === 'ko' ? 'is-on' : ''}>한국어</span><i>/</i><span className={lang === 'en' ? 'is-on' : ''}>EN</span>
            </button>
            <button className="primary-button" onClick={() => setIsNewOpen(true)}><Icon name="plus" size={17}/>{t.addLead}</button>
          </div>
        </header>

        <section className="content-head">
          <div><p className="eyebrow">CLIENT OPERATIONS · LOCAL DEMO</p><h1>{titles[view][0]}</h1><p>{titles[view][1]}</p></div>
          <div className="date-stamp"><span><Icon name="calendar" size={16}/>{lang === 'ko' ? '2026년 8월 11일' : 'August 11, 2026'}</span><small>Asia / Seoul</small></div>
        </section>

        <div className="mobile-nav" aria-label="Mobile navigation">
          {nav.map((item) => <button key={item.id} className={view === item.id ? 'is-active' : ''} onClick={() => setView(item.id)}><Icon name={item.icon}/><span>{item.label}</span>{item.count ? <em>{item.count}</em> : null}</button>)}
        </div>

        {view === 'dashboard' && <Dashboard lang={lang} leads={leads} onOpen={openLead} onNavigate={setView}/>}
        {view === 'leads' && (
          <LeadsView lang={lang} leads={filtered} allCount={leads.length} search={search} setSearch={setSearch}
            stageFilter={stageFilter} setStageFilter={setStageFilter} ownerFilter={ownerFilter} setOwnerFilter={setOwnerFilter}
            owners={owners} display={display} setDisplay={setDisplay} onOpen={openLead} onReset={resetFilters}/>
        )}
        {view === 'pipeline' && <PipelineView lang={lang} leads={leads} onOpen={openLead}/>}
        {view === 'inbox' && <InboxView lang={lang} leads={leads} onOpen={openLead}/>}
      </main>

      {selected && <LeadDrawer lang={lang} lead={selected} onClose={() => setSelectedId(null)} onMoveNext={moveNext}/>}
      {isNewOpen && <NewLeadModal lang={lang} onClose={() => setIsNewOpen(false)} onAdd={(lead) => { setLeads((current) => [lead, ...current]); setIsNewOpen(false); setToast(t.saved); setView('leads'); }}/>}
      {toast && <div className="toast" role="status"><Icon name="check" size={17}/>{toast}</div>}
    </div>
  );
}

function Dashboard({ lang, leads, onOpen, onNavigate }: { lang: Lang; leads: Lead[]; onOpen(id: string): void; onNavigate(view: View): void }) {
  const t = copy[lang];
  const active = leads.filter((lead) => lead.stage !== 'won').length;
  const attention = attentionLeads(leads);
  const proposals = leads.filter((lead) => lead.stage === 'proposal' || lead.stage === 'negotiation').length;
  const sources = [...new Set(leads.map((lead) => lead.source))].map((source) => ({ source, count: leads.filter((lead) => lead.source === source).length })).sort((a, b) => b.count - a.count);
  const maxSource = Math.max(...sources.map((item) => item.count));
  const metrics = [
    { label: t.activeLeads, value: String(active), note: `${leads.length - active} ${t.completed}`, tone: 'mint' },
    { label: t.attention, value: String(attention.length), note: t.focusSub, tone: 'amber' },
    { label: t.proposals, value: String(proposals), note: t.derived, tone: 'violet' },
    { label: t.weighted, value: formatWon(weightedPipeline(leads), lang), note: t.basedOnDemo, tone: 'blue' },
  ];
  return (
    <div className="dashboard-view">
      <section className="metric-grid">
        {metrics.map((metric) => <article key={metric.label} className={`metric-card metric-card--${metric.tone}`}><div><span>{metric.label}</span><Icon name="activity" size={18}/></div><strong>{metric.value}</strong><small>{metric.note}</small></article>)}
      </section>
      <div className="dashboard-grid">
        <section className="panel focus-panel">
          <PanelHead title={t.focusTitle} sub={t.focusSub} action={t.viewAll} onAction={() => onNavigate('inbox')}/>
          <div className="focus-list">
            {attention.map((lead) => <button className="focus-row" key={lead.id} onClick={() => onOpen(lead.id)}><span className={`priority-dot priority-dot--${lead.priority}`}/><div><strong>{lead.company}</strong><span>{lang === 'ko' ? lead.nextActionKo : lead.nextActionEn}</span></div><div><PriorityBadge priority={lead.priority} lang={lang}/><small className={lead.dueOffset < 0 ? 'is-overdue' : ''}>{dueLabel(lead.dueOffset, lang)}</small></div><Icon name="chevron" size={17}/></button>)}
          </div>
        </section>
        <section className="panel pipeline-panel">
          <PanelHead title={t.pipelineHealth} sub={t.derived}/>
          <div className="pipeline-summary">
            {STAGES.map((stage) => { const stageLeads = leads.filter((lead) => lead.stage === stage); return <button key={stage} onClick={() => onNavigate('pipeline')}><span><i className={`stage-color stage-color--${stage}`}/>{stageCopy[lang][stage]}<em>{stageLeads.length}</em></span><div className="bar"><i style={{ width: `${Math.max(8, stageLeads.length / leads.length * 100)}%` }}/></div><small>{formatWon(stageLeads.reduce((sum, lead) => sum + lead.value, 0), lang)}</small></button>; })}
          </div>
        </section>
        <section className="panel activity-panel">
          <PanelHead title={t.recentActivity} sub={t.basedOnDemo}/>
          <div className="activity-list">{leads.slice(0, 4).map((lead, index) => <button key={lead.id} onClick={() => onOpen(lead.id)}><span className="activity-icon"><Icon name={index === 0 ? 'mail' : index === 1 ? 'activity' : 'check'} size={16}/></span><div><strong>{lang === 'ko' ? lead.lastActivityKo : lead.lastActivityEn}</strong><span>{lead.company} · {lead.contact}</span></div><small>{index === 0 ? (lang === 'ko' ? '12분 전' : '12m ago') : (lang === 'ko' ? `${index + 1}시간 전` : `${index + 1}h ago`)}</small></button>)}</div>
        </section>
        <section className="panel source-panel">
          <PanelHead title={t.sourceMix} sub={t.derived}/>
          <div className="source-chart">{sources.slice(0, 5).map((item) => <div key={item.source}><span>{item.source}</span><div><i style={{ width: `${item.count / maxSource * 100}%` }}/></div><strong>{item.count}</strong></div>)}</div>
          <div className="won-value"><span>{t.won}</span><strong>{formatWon(wonValue(leads), lang)}</strong></div>
        </section>
      </div>
    </div>
  );
}

function PanelHead({ title, sub, action, onAction }: { title: string; sub: string; action?: string; onAction?(): void }) {
  return <header className="panel-head"><div><h2>{title}</h2><span>{sub}</span></div>{action && <button onClick={onAction}>{action}<Icon name="arrow" size={15}/></button>}</header>;
}

function LeadsView(props: {
  lang: Lang; leads: Lead[]; allCount: number; search: string; setSearch(value: string): void;
  stageFilter: Stage | 'all'; setStageFilter(value: Stage | 'all'): void; ownerFilter: string; setOwnerFilter(value: string): void;
  owners: string[]; display: 'list' | 'board'; setDisplay(value: 'list' | 'board'): void; onOpen(id: string): void; onReset(): void;
}) {
  const { lang, leads, allCount, search, setSearch, stageFilter, setStageFilter, ownerFilter, setOwnerFilter, owners, display, setDisplay, onOpen, onReset } = props;
  const t = copy[lang];
  return <section className="leads-panel panel">
    <div className="toolbar">
      <label className="search-box"><Icon name="search"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search}/><kbd>⌘ K</kbd></label>
      <div className="filter-group"><label><Icon name="filter" size={16}/><select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as Stage | 'all')}><option value="all">{t.allStages}</option>{STAGES.map((stage) => <option value={stage} key={stage}>{stageCopy[lang][stage]}</option>)}</select></label><label><select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}><option value="all">{t.allOwners}</option>{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></label></div>
      <div className="view-toggle" role="group" aria-label="Display"><button className={display === 'list' ? 'is-active' : ''} onClick={() => setDisplay('list')}><Icon name="list" size={16}/>{t.list}</button><button className={display === 'board' ? 'is-active' : ''} onClick={() => setDisplay('board')}><Icon name="board" size={16}/>{t.board}</button></div>
    </div>
    <div className="result-meta"><strong>{leads.length}</strong><span>/ {allCount}</span><i/>{t.basedOnDemo}</div>
    {leads.length === 0 ? <div className="empty-state"><span><Icon name="search" size={28}/></span><h2>{t.noResults}</h2><button onClick={onReset}><Icon name="reset" size={16}/>{t.resetFilters}</button></div> : display === 'list' ? <LeadTable lang={lang} leads={leads} onOpen={onOpen}/> : <Board lang={lang} leads={leads} onOpen={onOpen}/>}
  </section>;
}

function LeadTable({ lang, leads, onOpen }: { lang: Lang; leads: Lead[]; onOpen(id: string): void }) {
  const t = copy[lang];
  return <div className="lead-table"><div className="table-head"><span>{t.company}</span><span>{t.stage}</span><span>{t.value}</span><span>{t.owner}</span><span>{t.next}</span><span>{t.due}</span><span/></div>{leads.map((lead) => <button className="lead-row" key={lead.id} onClick={() => onOpen(lead.id)} aria-label={`${t.openDetail}: ${lead.company}`}><span className="lead-company"><i>{lead.company.slice(0, 1)}</i><span><strong>{lead.company}</strong><small>{lead.contact} · {lead.id}</small></span></span><span><StageBadge stage={lead.stage} lang={lang}/></span><strong className="money">{formatWon(lead.value, lang)}</strong><span className="owner-cell"><i>{lead.owner.slice(0, 1)}</i>{lead.owner}</span><span className="next-cell">{lang === 'ko' ? lead.nextActionKo : lead.nextActionEn}</span><span className={lead.dueOffset < 0 ? 'due-cell is-overdue' : 'due-cell'}><Icon name="clock" size={14}/>{dueLabel(lead.dueOffset, lang)}</span><Icon name="chevron" size={17}/></button>)}</div>;
}

function Board({ lang, leads, onOpen }: { lang: Lang; leads: Lead[]; onOpen(id: string): void }) {
  return <div className="kanban">{STAGES.map((stage) => { const items = leads.filter((lead) => lead.stage === stage); return <section className="kanban-column" key={stage}><header><span><i className={`stage-color stage-color--${stage}`}/>{stageCopy[lang][stage]}</span><em>{items.length}</em><small>{formatWon(items.reduce((sum, lead) => sum + lead.value, 0), lang)}</small></header><div>{items.map((lead) => <button className="lead-card" key={lead.id} onClick={() => onOpen(lead.id)}><div><span>{lead.id}</span><PriorityBadge priority={lead.priority} lang={lang}/></div><h3>{lead.company}</h3><p>{lead.contact} · {lead.source}</p><strong>{formatWon(lead.value, lang)}</strong><footer><span className="owner-cell"><i>{lead.owner.slice(0, 1)}</i>{lead.owner}</span><span className={lead.dueOffset < 0 ? 'is-overdue' : ''}><Icon name="clock" size={13}/>{dueLabel(lead.dueOffset, lang)}</span></footer></button>)}</div></section>; })}</div>;
}

function PipelineView({ lang, leads, onOpen }: { lang: Lang; leads: Lead[]; onOpen(id: string): void }) {
  return <section className="pipeline-view"><div className="pipeline-kpis"><div><span>{copy[lang].weighted}</span><strong>{formatWon(weightedPipeline(leads), lang)}</strong><small>{copy[lang].derived}</small></div><div><span>{copy[lang].won}</span><strong>{formatWon(wonValue(leads), lang)}</strong><small>{copy[lang].basedOnDemo}</small></div></div><Board lang={lang} leads={leads} onOpen={onOpen}/></section>;
}

function InboxView({ lang, leads, onOpen }: { lang: Lang; leads: Lead[]; onOpen(id: string): void }) {
  const t = copy[lang];
  const items = [...leads].filter((lead) => lead.stage !== 'won').sort((a, b) => a.dueOffset - b.dueOffset || (a.priority === 'high' ? -1 : 1));
  return <section className="inbox-panel panel"><div className="inbox-summary"><span><Icon name="inbox" size={22}/></span><div><strong>{attentionLeads(leads).length}</strong><small>{t.needsReply}</small></div><p>{t.disclaimer}</p></div><div className="inbox-list">{items.length === 0 ? <div className="empty-state"><h2>{t.emptyInbox}</h2></div> : items.map((lead) => <button key={lead.id} onClick={() => onOpen(lead.id)}><span className="avatar">{lead.company.slice(0, 1)}</span><div className="inbox-copy"><div><strong>{lead.company}</strong><span>{lead.contact} · {lead.source}</span></div><p>{lang === 'ko' ? lead.lastActivityKo : lead.lastActivityEn}</p><small><Icon name="arrow" size={13}/>{lang === 'ko' ? lead.nextActionKo : lead.nextActionEn}</small></div><div className="inbox-status"><PriorityBadge priority={lead.priority} lang={lang}/><strong className={lead.dueOffset < 0 ? 'is-overdue' : ''}>{dueLabel(lead.dueOffset, lang)}</strong></div><Icon name="chevron" size={17}/></button>)}</div></section>;
}

function LeadDrawer({ lang, lead, onClose, onMoveNext }: { lang: Lang; lead: Lead; onClose(): void; onMoveNext(lead: Lead): void }) {
  const t = copy[lang];
  const nextDisabled = lead.stage === 'won';
  return <div className="drawer-layer"><button className="scrim" aria-label={t.close} onClick={onClose}/><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="lead-title"><header><div><span>{lead.id}</span><PriorityBadge priority={lead.priority} lang={lang}/></div><button className="icon-button" onClick={onClose} aria-label={t.close}><Icon name="close"/></button></header><div className="drawer-body"><section className="lead-identity"><span>{lead.company.slice(0, 1)}</span><div><h2 id="lead-title">{lead.company}</h2><p>{lead.contact} · {lead.source}</p></div></section><StageBadge stage={lead.stage} lang={lang}/><section className="detail-grid"><div><span><Icon name="mail" size={15}/>{t.contact}</span><strong>{lead.email}</strong></div><div><span><Icon name="building" size={15}/>{t.owner}</span><strong>{lead.owner}</strong></div><div><span><Icon name="activity" size={15}/>{t.value}</span><strong>{formatWon(lead.value, lang)}</strong></div><div><span><Icon name="clock" size={15}/>{t.due}</span><strong className={lead.dueOffset < 0 ? 'is-overdue' : ''}>{dueLabel(lead.dueOffset, lang)}</strong></div></section><section className="detail-section"><h3>{t.next}</h3><div className="next-action-card"><span><Icon name="arrow"/></span><div><strong>{lang === 'ko' ? lead.nextActionKo : lead.nextActionEn}</strong><small>{t.replyBy} · {dueLabel(lead.dueOffset, lang)}</small></div></div></section><section className="detail-section"><h3>{t.note}</h3><p className="note-card">{lang === 'ko' ? lead.noteKo : lead.noteEn}</p></section><section className="detail-section"><h3>{t.activity}</h3><div className="timeline"><div><i/><span><strong>{lang === 'ko' ? lead.lastActivityKo : lead.lastActivityEn}</strong><small>{lang === 'ko' ? '최근 기록 · 가상 데이터' : 'Latest record · demo data'}</small></span></div><div><i/><span><strong>{lang === 'ko' ? '문의가 ClientFlow에 분류됨' : 'Inquiry triaged in ClientFlow'}</strong><small>{lead.source}</small></span></div></div></section></div><footer><span>{t.local}</span><button disabled={nextDisabled} onClick={() => onMoveNext(lead)}>{nextDisabled ? t.completed : t.moveNext}<Icon name={nextDisabled ? 'check' : 'arrow'} size={16}/></button></footer></aside></div>;
}

function NewLeadModal({ lang, onClose, onAdd }: { lang: Lang; onClose(): void; onAdd(lead: Lead): void }) {
  const t = copy[lang];
  const [error, setError] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const company = String(data.get('company') ?? '').trim(); const contact = String(data.get('contact') ?? '').trim();
    if (!company || !contact) { setError(t.required); return; }
    onAdd({ id: `LD-${1050 + Math.floor(Math.random() * 49)}`, company, contact, email: String(data.get('email') ?? 'demo@example.com') || 'demo@example.com', stage: 'new', priority: 'medium', value: Number(data.get('value')) || 1_500_000, owner: 'Geonhee', source: 'Manual demo', dueOffset: 2, lastActivityKo: '데모 문의 직접 추가', lastActivityEn: 'Demo inquiry added manually', nextActionKo: '요구사항 확인 답변', nextActionEn: 'Reply to confirm requirements', noteKo: '이 브라우저 세션에만 존재하는 데모 문의입니다.', noteEn: 'This demo inquiry exists only in the current browser session.' });
  };
  return <div className="modal-layer"><button className="scrim" aria-label={t.close} onClick={onClose}/><form className="modal" onSubmit={submit}><header><div><span><Icon name="plus"/></span><div><h2>{t.newLeadTitle}</h2><p>{t.newLeadSub}</p></div></div><button type="button" className="icon-button" onClick={onClose} aria-label={t.close}><Icon name="close"/></button></header><div className="form-grid"><label><span>{t.companyName} *</span><input name="company" autoFocus placeholder={lang === 'ko' ? '예: 오로라 스튜디오' : 'e.g. Aurora Studio'}/></label><label><span>{t.contactName} *</span><input name="contact" placeholder={lang === 'ko' ? '예: 김하늘' : 'e.g. Hana Kim'}/></label><label><span>{t.email}</span><input name="email" type="email" placeholder="demo@example.com"/></label><label><span>{t.expectedValue}</span><input name="value" type="number" min="0" step="100000" placeholder="1500000"/></label></div>{error && <p className="form-error">{error}</p>}<footer><button type="button" onClick={onClose}>{t.cancel}</button><button className="primary-button" type="submit"><Icon name="plus" size={16}/>{t.add}</button></footer></form></div>;
}

export default App;
