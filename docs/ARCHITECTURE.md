# 시스템 아키텍처

## 1. 전체 시스템 아키텍처

```mermaid
graph TB
    subgraph "사용자 계층"
        USER["👤 사용자 (웹 브라우저)"]
    end
    
    subgraph "접근 제어"
        LOCK["관리자 잠금 화면<br/>최초 진입 시 필수<br/>관람실 선택 + 비밀번호"]
    end
    
    subgraph "프론트엔드 - 메인 화면"
        MAIN["메인 화면<br/>잠금 해제 후 접근"]
        UI1["카메라 체크인<br/>AI 얼굴 인식"]
        UI2["수동 입력<br/>직접 입력"]
        LOGO["로고 (3번 터치)<br/>대시보드 진입"]
    end
    
    subgraph "로컬 저장소"
        LOCAL["localStorage<br/>일일 데이터 임시 저장<br/>자정마다 초기화"]
    end
    
    subgraph "관리자 기능"
        ADMIN["관리자 대시보드<br/>일일 통계<br/>설정 관리<br/>수동 백업"]
    end
    
    subgraph "AI/ML 계층"
        FACE["face-api.js<br/>얼굴 인식 엔진"]
        MODEL["성별 감지<br/>연령대 분류"]
    end
    
    subgraph "데이터 계층"
        FIRESTORE["Firebase Firestore<br/>방문객 데이터 (visitors)<br/>관람실 데이터 (locations)<br/>Apps Script로만 조회"]
        CACHE["localStorage 캐시<br/>일일 통계 임시 저장<br/>관람실 목록 캐시"]
    end
    
    subgraph "자동화 계층"
        APPS["Google Apps Script<br/>자동 스케줄러<br/>설정 간격"]
        FUNC1["데이터 조회"]
        FUNC2["Sheets 백업"]
        FUNC3["안전한 삭제"]
    end
    
    subgraph "백업 저장소"
        SHEETS["Google Sheets<br/>영구 백업"]
    end
    
    subgraph "알림 시스템"
        EMAIL["이메일 알림<br/>오류 추적"]
    end
    
    USER -->|1. 최초 접속| LOCK
    LOCK -->|관람실 목록<br/>(캐시 우선)| FIRESTORE
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

## 2. 데이터 흐름 아키텍처

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Lock as 관리자 잠금 화면
    participant Main as 메인 화면
    participant Face as face-api.js
    participant Local as localStorage
    participant Firestore as Firestore
    participant Logo as 로고 (3번 터치)
    participant Dashboard as 대시보드
    participant Apps as Apps Script
    participant Sheets as Google Sheets
    
    User->>Lock: 1. 최초 접속
    Lock->>Lock: 관람실 선택 + 비밀번호 입력
    Lock->>Main: 2. 인증 성공 → 메인 화면
    
    rect rgb(200, 230, 255)
    Note over Main,Local: 3. 체크인 프로세스 (방문자 리스트 관리)
    Main->>Face: AI 모드: 얼굴 감지 요청
    Face-->>Main: 성별, 연령대 반환
    Main->>Main: 스캔 확인 모달 표시
    Main->>Main: "확인" 선택: 즉시 Firestore 전송<br/>"수정" 선택: 방문자 리스트 추가
    Main->>Main: 또는 수동 모드로 직접 입력
    Main->>Local: 방문자 데이터 저장 (일일 통계용)
    end
    
    rect rgb(255, 230, 200)
    Note over Local,Firestore: 4. Firestore 전송
    User->>Main: 완료 버튼 클릭 또는 스캔 확인 모달의 확인
    Main->>Firestore: 모든 데이터 일괄 전송
    Firestore-->>Main: 저장 완료
    Main->>Local: 전송 성공 후도 데이터 유지<br/>(일일 통계용, 과거 날짜는 앱 시작시 삭제)
    end
    
    rect rgb(240, 255, 240)
    Note over Main,Dashboard: 5. 관리자 대시보드 접근, 관실 관리 및 수동 백업
    User->>Logo: 로고 3번 터치
    Logo->>Dashboard: 대시보드 열림
    Dashboard->>Local: 일일 통계 조회 (관람실별 필터링)
    Local-->>Dashboard: 오늘 데이터 반환 (localStorage만)
    Note over Dashboard: Firestore 조회 없음<br/>기기별 임시 데이터만 표시
    
    alt 관램실 관리 필요 시
        User->>Dashboard: "관람실 관리" 버튼 클릭
        Dashboard->>Dashboard: RoomManagementModal 열림
        alt 관람실 추가
            User->>Dashboard: 이름 입력 + 추가 버튼
            Dashboard->>Firestore: locations 컬렉션에 추가
            Firestore-->>Dashboard: 성공
            Dashboard->>Local: 캐시 업데이트
        end
        alt 관람실 삭제
            User->>Dashboard: 삭제 버튼 클릭
            Dashboard->>Dashboard: 삭제 확인 모달
            Firestore->>Firestore: 문서 삭제
            Dashboard->>Local: 캐시 업데이트
        end
    end
    
    alt 수동 백업 필요 시
        Dashboard->>Dashboard: "백업 및 삭제 실행" 버튼 클릭
        Dashboard->>Dashboard: 2단계 확인 모달 표시
        User->>Dashboard: "실행하기" 선택
        Dashboard->>Apps: GET 요청 전송<br/>(CORS 안전)
        Apps->>Firestore: 모든 데이터 조회
        Apps->>Sheets: 즉시 백업
        Apps->>Firestore: 즉시 삭제
        Apps-->>Dashboard: 결과 반환
        Dashboard->>Dashboard: 성공/오류 메시지 표시
    end
    end
    
    rect rgb(230, 200, 230)
    Note over Firestore,Sheets: 6. 자동 백업 (설정 간격마다)
    Apps->>Firestore: 모든 데이터 조회
    Firestore-->>Apps: 데이터 반환
    Apps->>Sheets: 백업 저장
    Sheets-->>Apps: 성공 확인
    Apps->>Firestore: 백업된 데이터 삭제
    end
```

---

## 3. 사용자 접근 흐름도

```mermaid
stateDiagram-v2  
    [*] --> 웹사이트_접속

    웹사이트_접속 --> 관람실_확인: localStorage 확인

    관람실_확인 --> 관리자_잠금: 관람실 없음
    관람실_확인 --> 메인_화면: 관람실 있음

    관리자_잠금 --> 관람실_선택
    관람실_선택 --> 비밀번호_입력
    비밀번호_입력 --> 인증_실패: 비밀번호 오류
    비밀번호_입력 --> 메인_화면: 인증 성공

    인증_실패 --> 비밀번호_입력: 재입력

    메인_화면 --> AI_모드: 기본
    메인_화면 --> 수동_모드: 모드 전환

    AI_모드 --> 얼굴_인식: 스캔 버튼
    얼굴_인식 --> 스캔_확인_모달: 성별/연령대 감지

    수동_모드 --> 직접_입력: 성별/연령대 선택
    직접_입력 --> 방문자_리스트: 추가 버튼

    스캔_확인_모달 --> Firestore_전송: 확인 (즉시 전송)
    스캔_확인_모달 --> 방문자_리스트: 수정 (리스트 추가, 수동 모드 전환)
    스캔_확인_모달 --> AI_모드: 취소

    방문자_리스트 --> localStorage_저장: 임시 저장
    방문자_리스트 --> Firestore_전송: 완료 버튼
    Firestore_전송 --> 성공_모달
    성공_모달 --> 메인_화면

    메인_화면 --> 로고_터치: 로고 클릭
    로고_터치 --> 터치_카운트: 3회 이내
    터치_카운트 --> 관리자_대시보드: 3회 달성
    관리자_대시보드 --> 일일_통계: localStorage 조회
    관리자_대시보드 --> 설정_관리: 관람실/나이보정
    관리자_대시보드 --> 수동_백업: 백업 버튼 클릭
    수동_백업 --> 확인_모달: 2단계 확인
    확인_모달 --> Apps_Script: "실행하기" 선택
    Apps_Script --> 백업_완료: 즉시 백업 및 삭제
    백업_완료 --> 관리자_대시보드: 결과 표시
    관리자_대시보드 --> 메인_화면: 닫기

    터치_카운트 --> 메인_화면: 타임아웃
```

---

## 4. 배포 아키텍처

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

## 5. 컴포넌트 구조

### 프로젝트 레이아웃
```
src/components/
├── modals/                    # 모달 컴포넌트
│   ├── ErrorModal.jsx         # 오류 알림
│   ├── SuccessModal.jsx       # 성공 알림
│   └── ScanConfirmModal.jsx   # AI 스캔 결과 확인
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
- `isAIMode`: AI/수동 모드 토글
- `isModelLoaded`: face-api.js 모델 로드 상태
- Firebase 함수: `submitVisitors()` (통합 제출 로직)

---

## 6. 데이터베이스 스키마

```mermaid
erDiagram
    VISITORS {
        string timestamp "날짜/시간 (serverTimestamp)"
        string gender "성별: 남성/여성"
        string ageGroup "연령대: 유아(0~6세)~노년(65세 이상)"
        string source "입력방식: AI/수동"
        string location "위치"
    }

    LOCATIONS {
        string name "관람실 이름 (동적)"
        string createdAt "생성 시간 (serverTimestamp)"
    }

    SHEETS_BACKUP {
        string timestamp "백업 타임스탬프"
        string gender "성별: 남성/여성"
        string ageGroup "연령대"
        string source "입력방식"
        string location "위치"
    }

    VISITORS ||--|{ SHEETS_BACKUP : "백업"
```

