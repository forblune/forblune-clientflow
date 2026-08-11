# ClientFlow benchmark brief

## 목적

소규모 서비스 사업자의 고객 문의 운영을 위한 공개 데모를 만들기 전에, 동종 제품의 검증된 상호작용 패턴을 조사했습니다. 화면·코드·브랜드 자산은 복제하지 않고 **정보 구조와 상태 모델만** 참고합니다.

## 공식 자료에서 확인한 패턴

### HubSpot CRM

- 파이프라인은 레코드의 진행 단계를 시각화하며, 리드·딜·티켓 등에 적용됩니다.
- 같은 데이터를 표와 보드로 바꿔 보고, 속성·담당자·최근 활동·다음 활동을 카드에 노출합니다.
- 저장된 필터 뷰와 단계별 합계는 우선순위를 빠르게 판단하는 데 쓰입니다.

Sources:
- https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines
- https://knowledge.hubspot.com/records/manage-index-page-types-and-tabs
- https://knowledge.hubspot.com/object-settings/select-properties-to-show-on-records-in-board-view

### Linear

- 목록과 보드를 동일한 데이터의 다른 관점으로 사용합니다.
- 필터된 뷰를 저장·공유하고, 상세 사이드바에서 문맥을 잃지 않은 채 속성을 확인합니다.
- 상태, 담당자, 우선순위, 기한처럼 운영 판단에 필요한 속성만 선택적으로 표시합니다.

Sources:
- https://linear.app/docs/custom-views
- https://linear.app/docs/display-options
- https://linear.app/docs/project-overview

### Airtable and Retool

- 대시보드 요약에서 원본 레코드로 드릴다운할 수 있어야 합니다.
- 테이블·검색·버튼·폼은 관리자 도구의 핵심 구성 요소입니다.
- 공개·편집 권한과 데이터 상태를 화면에서 명확히 구분합니다.

Sources:
- https://support.airtable.com/v1/docs/interface-layout-dashboard
- https://support.airtable.com/docs/managing-and-sharing-interfaces
- https://retool.com/use-case/admin-dashboard

## ClientFlow에 적용할 기준

1. `요약 → 필터된 목록 → 상세 기록`으로 끊김 없이 이동한다.
2. 표와 파이프라인 보드는 같은 리드 데이터를 공유한다.
3. 우선순위보다 **기한 초과와 다음 행동 부재**를 먼저 드러낸다.
4. 수치마다 가상 데이터 기반임을 표시하고 임의 성과 수치를 만들지 않는다.
5. 한국어·영어, 데스크톱·태블릿·모바일을 동일 기능 범위로 제공한다.
6. 실제 전송·결제·인증처럼 외부 효과가 있는 기능은 데모에서 주장하지 않는다.

## 차별화

- 대형 CRM의 설정 복잡도를 줄여, 문의가 적은 1~3인 서비스 팀의 하루 운영 화면에 집중합니다.
- 금액 중심 영업 화면에만 머무르지 않고 `다음 행동`, `기한`, `응답 필요`를 한 화면에서 연결합니다.
- 고객 개인정보나 실서비스 연결 없이도 기능 흐름을 검수할 수 있는 정직한 데모입니다.
