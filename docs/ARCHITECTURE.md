## 1. 전체 시스템 아키텍처

```mermaid
graph TB

    subgraph 사용자_계층
        USER["👤 사용자<br/>(웹 브라우저)"]
    end

    subgraph 접근_제어
        LOCK["관리자 잠금 화면<br/>최초 진입 시 필수<br/>관람실 선택 + 비밀번호"]
    end

    subgraph 프론트엔드_메인
        MAIN["메인 화면<br/>잠금 해제 후 접근"]
        UI1["카메라 체크인<br/>AI 얼굴 인식"]
        UI2["수동 입력<br/>직접 입력"]
        LOGO["로고 3번 터치<br/>대시보드 진입"]
    end

    subgraph 로컬_저장소
        LOCAL["localStorage<br/>일일 데이터 임시 저장<br/>자정마다 초기화"]
    end

    subgraph 관리자_기능
        ADMIN["관리자 대시보드<br/>일일 통계<br/>설정 관리<br/>수동 백업"]
    end

    subgraph AI_ML
        FACE["face-api.js<br/>얼굴 인식 엔진"]
        MODEL["성별 감지<br/>연령대 분류"]
    end

    subgraph 데이터_계층
        FIRESTORE["Firebase Firestore<br/>visitors 컬렉션<br/>locations 컬렉션<br/>Apps Script 전용 조회"]
        CACHE["localStorage 캐시<br/>일일 통계 저장<br/>관람실 목록 캐시"]
    end

    subgraph 자동화_계층
        APPS["Google Apps Script<br/>자동 스케줄러<br/>설정 간격"]
        FUNC1["데이터 조회"]
        FUNC2["Sheets 백업"]
        FUNC3["안전한 삭제"]
    end

    subgraph 백업_저장소
        SHEETS["Google Sheets<br/>영구 백업"]
    end

    subgraph 알림_시스템
        EMAIL["이메일 알림<br/>오류 추적"]
    end

    USER -->|1. 최초 접속| LOCK
    LOCK -->|관람실 목록<br/>캐시 우선| FIRESTORE
    LOCK -->|인증 성공| MAIN

    MAIN --> UI1
    MAIN --> UI2
    MAIN --> LOGO

    UI1 --> FACE
    FACE --> MODEL
    MODEL -->|성별, 연령대| UI1

    UI1 -->|데이터 저장| LOCAL
    UI2 -->|데이터 저장| LOCAL
    LOCAL -->|완료 버튼| FIRESTORE

    LOGO -->|3번 터치| ADMIN
    ADMIN -->|통계 조회| LOCAL
    ADMIN -->|관실 CRUD| FIRESTORE

    FIRESTORE -->|캐시| CACHE

    APPS --> FUNC1
    FUNC1 -->|읽기| FIRESTORE
    FUNC1 --> FUNC2
    FUNC2 -->|백업| SHEETS
    FUNC2 --> FUNC3
    FUNC3 -->|삭제| FIRESTORE

    APPS -->|오류 발생| EMAIL

    style USER fill:#e1f5ff
    style LOCK fill:#ffcdd2
    style MAIN fill:#fff3e0
    style LOCAL fill:#fff9c4
    style LOGO fill:#c8e6c9
    style ADMIN fill:#b3e5fc
    style FIRESTORE fill:#f3e5f5
    style SHEETS fill:#e8f5e9
    style APPS fill:#fce4ec
    style EMAIL fill:#ffebee
```

---

## 2. 배포 아키텍처

```mermaid
graph LR
    subgraph "개발"
        DEV["로컬 개발<br/>코드 작성"]
    end

    subgraph "버전 관리"
        GIT["GitHub<br/>Git Repository"]
    end

    subgraph "CI/CD"
        VERCEL["Vercel<br/>자동 빌드<br/>자동 배포"]
    end

    subgraph "프로덕션"
        PROD["Vercel Edge<br/>프로덕션 배포<br/>CDN 전역 배포"]
    end

    subgraph "백엔드"
        FB["Firebase<br/>Firestore + Auth"]
    end

    DEV -->|git push| GIT
    GIT -->|webhook| VERCEL
    VERCEL -->|빌드 성공| PROD
    PROD -->|API 호출| FB

    style DEV fill:#e3f2fd
    style GIT fill:#fff3e0
    style VERCEL fill:#f3e5f5
    style PROD fill:#c8e6c9
    style FB fill:#ffccbc
```

---

## 3. 컴포넌트 구조

### 프로젝트 레이아웃

```
src/components/
├── modals/                    # 모달 컴포넌트
│   ├── ErrorModal.jsx         # 오류 알림
│   ├── FinalConfirmModal.jsx   # AI 스캔/수동 입력 최종 확인
│   └── SuccessModal.jsx       # 성공 알림
├── dashboard/                 # 대시보드 컴포넌트
│   ├── AgeGroupChart.jsx      # 연령대 분포 막대 차트
│   ├── GenderChart.jsx        # 성별 분포 도넛 차트
│   ├── BackupSection.jsx      # 데이터 백업 섹션
│   └── RoomManagementModal.jsx# 관람실 추가/삭제 모달
├── AdminLockScreen.jsx        # 관리자 인증 화면
├── CameraCard.jsx             # 카메라 스캔 영역
├── Dashboard.jsx              # 메인 대시보드 컨테이너
├── LanguageToggle.jsx         # 다국어 전환
├── ManualEntryCard.jsx        # 수동 입력 폼
└── VisitorList.jsx            # 방문자 목록 관리
```

### 주요 상태 관리 계층

**App.jsx (최상위 컨테이너)**

- `visitors[]`: 현재 리스트의 방문자 데이터
- `scannedVisitors[]`: AI 스캔 결과
- `showScanConfirm`: 스캔 확인 모달 표시 여부
- `showSubmitConfirm`: 제출 확인 모달 표시 여부
- `isAIMode`: AI/수동 모드 토글
- `isModelLoaded`: face-api.js 모델 로드 상태
- Firebase 함수: `submitVisitors()` (통합 제출 로직)

---

## 4. 데이터베이스 스키마

```mermaid
erDiagram
    VISITORS {
        string timestamp "날짜/시간 (serverTimestamp)"
        string gender "성별: 남성/여성"
        string ageGroup "연령대: 유아(0~6세), . . 노년(65세 이상)"
        string source "입력방식: AI/수동"
        string location "위치"
    }

    LOCATIONS {
        string name "관람실 이름"
        string createdAt "생성 시간 (serverTimestamp)"
    }

    SHEETS_BACKUP {
        string timestamp "날짜/시간 (serverTimestamp)"
        string gender "성별: 남성/여성"
        string ageGroup "연령대"
        string source "입력방식"
        string location "위치"
    }

    VISITORS ||--|{ SHEETS_BACKUP : "백업"
```