export type Lang = 'ko' | 'en';
export type View = 'dashboard' | 'leads' | 'pipeline' | 'inbox';
export type Stage = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won';
export type Priority = 'high' | 'medium' | 'low';

export interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  stage: Stage;
  priority: Priority;
  value: number;
  owner: string;
  source: string;
  dueOffset: number;
  lastActivityKo: string;
  lastActivityEn: string;
  nextActionKo: string;
  nextActionEn: string;
  noteKo: string;
  noteEn: string;
}

export const STAGES: Stage[] = ['new', 'qualified', 'proposal', 'negotiation', 'won'];

export const seedLeads: Lead[] = [
  {
    id: 'LD-1048', company: 'Morrow Studio', contact: 'Min Park', email: 'min.park@example.com',
    stage: 'proposal', priority: 'high', value: 4200000, owner: 'Geonhee', source: 'Website', dueOffset: 0,
    lastActivityKo: '요구사항 문서 확인', lastActivityEn: 'Reviewed requirements',
    nextActionKo: '오늘 17:00까지 범위 확인', nextActionEn: 'Confirm scope by 5 PM today',
    noteKo: '다국어 랜딩페이지와 문의 폼 개선. 기존 디자인 시스템 재사용 가능.',
    noteEn: 'Multilingual landing page and inquiry form improvement. Existing design system can be reused.',
  },
  {
    id: 'LD-1047', company: 'Northstar Labs', contact: 'Alex Chen', email: 'alex.chen@example.com',
    stage: 'qualified', priority: 'high', value: 6800000, owner: 'Geonhee', source: 'Referral', dueOffset: 1,
    lastActivityKo: '30분 미팅 완료', lastActivityEn: 'Completed discovery call',
    nextActionKo: '기술 질문 3개 정리', nextActionEn: 'Send three technical questions',
    noteKo: '운영 대시보드 리뉴얼. 데이터 소스와 권한 범위를 먼저 확인해야 함.',
    noteEn: 'Operations dashboard refresh. Data sources and permission scope need confirmation.',
  },
  {
    id: 'LD-1046', company: 'Studio Namu', contact: 'Jin Lee', email: 'jin.lee@example.com',
    stage: 'new', priority: 'medium', value: 1900000, owner: 'Mina', source: 'Wishket', dueOffset: 2,
    lastActivityKo: '신규 문의 접수', lastActivityEn: 'New inquiry received',
    nextActionKo: '포트폴리오 링크와 일정 회신', nextActionEn: 'Reply with portfolio and availability',
    noteKo: '모바일 메뉴와 결제 전환 화면의 UI 오류 수정 요청.',
    noteEn: 'Requests fixes for mobile navigation and checkout conversion screens.',
  },
  {
    id: 'LD-1045', company: 'Harbor Clinic', contact: 'Sara Kim', email: 'sara.kim@example.com',
    stage: 'negotiation', priority: 'high', value: 9300000, owner: 'Geonhee', source: 'Upwork', dueOffset: -1,
    lastActivityKo: '수정 견적 요청 수신', lastActivityEn: 'Received revised quote request',
    nextActionKo: '범위 변경과 결함 수정 분리', nextActionEn: 'Separate scope change from defect fixes',
    noteKo: '예약 운영 화면 개선. 의료 결과를 주장하지 않는 관리 UI 범위.',
    noteEn: 'Appointment operations UI. Administrative scope only, with no medical outcome claims.',
  },
  {
    id: 'LD-1044', company: 'Field Note', contact: 'Noah Choi', email: 'noah.choi@example.com',
    stage: 'won', priority: 'medium', value: 3600000, owner: 'Mina', source: 'Contra', dueOffset: 4,
    lastActivityKo: '계약 범위 확정', lastActivityEn: 'Scope confirmed',
    nextActionKo: '킥오프 자료 준비', nextActionEn: 'Prepare kickoff pack',
    noteKo: '반응형 제품 소개 페이지 구현. 콘텐츠와 에셋 수령 완료.',
    noteEn: 'Responsive product page implementation. Content and assets received.',
  },
  {
    id: 'LD-1043', company: 'Blue Basket', contact: 'Hana Oh', email: 'hana.oh@example.com',
    stage: 'proposal', priority: 'medium', value: 2800000, owner: 'Geonhee', source: 'Website', dueOffset: 3,
    lastActivityKo: '초안 견적 발송', lastActivityEn: 'Proposal draft sent',
    nextActionKo: '답변 없으면 금요일 확인', nextActionEn: 'Follow up Friday if no response',
    noteKo: '상품 CSV 정리와 관리자 목록 화면 개선을 함께 요청.',
    noteEn: 'Product CSV cleanup plus an admin list interface refresh.',
  },
  {
    id: 'LD-1042', company: 'Onda Works', contact: 'June Han', email: 'june.han@example.com',
    stage: 'qualified', priority: 'low', value: 1400000, owner: 'Mina', source: 'Email', dueOffset: 5,
    lastActivityKo: '예산 범위 확인', lastActivityEn: 'Budget range confirmed',
    nextActionKo: '작업 가능 일정 공유', nextActionEn: 'Share available dates',
    noteKo: '기존 정적 사이트의 링크·여백·접근성 소규모 개선.',
    noteEn: 'Small fixes for links, spacing, and accessibility on an existing static site.',
  },
  {
    id: 'LD-1041', company: 'Paper Plane', contact: 'Eli Jung', email: 'eli.jung@example.com',
    stage: 'new', priority: 'low', value: 2200000, owner: 'Geonhee', source: 'LinkedIn', dueOffset: 6,
    lastActivityKo: '문의 분류 완료', lastActivityEn: 'Inquiry triaged',
    nextActionKo: '샘플 데이터 요청', nextActionEn: 'Request sample data',
    noteKo: '주간 운영 보고서를 웹 대시보드로 전환하려는 초기 문의.',
    noteEn: 'Early inquiry about turning weekly operations reports into a web dashboard.',
  },
];

export const stageProbability: Record<Stage, number> = {
  new: 0.1, qualified: 0.3, proposal: 0.55, negotiation: 0.75, won: 1,
};

export function wonValue(leads: Lead[]): number {
  return leads.filter((lead) => lead.stage === 'won').reduce((sum, lead) => sum + lead.value, 0);
}

export function weightedPipeline(leads: Lead[]): number {
  return leads.reduce((sum, lead) => sum + lead.value * stageProbability[lead.stage], 0);
}

export function attentionLeads(leads: Lead[]): Lead[] {
  return leads.filter((lead) => lead.stage !== 'won' && (lead.priority === 'high' || lead.dueOffset <= 0));
}
