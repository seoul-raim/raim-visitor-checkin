# RAIM 방문자 체크인 시스템

서울로봇인공지능과학관(RAIM)의 지능형 방문자 관리 시스템입니다. AI 얼굴 인식 기술을 활용하여 방문자의 성별과 연령대를 자동으로 감지하고, Firebase를 통해 실시간 데이터를 수집·관리합니다.

## 주요 기능

### 🎯 핵심 기능
- **AI 얼굴 인식**: face-api.js를 활용한 실시간 성별/연령대 자동 감지
- **수동 입력 모드**: 카메라 미사용 시 직접 입력 옵션
- **다국어 지원**: 한국어/영어 실시간 전환 (i18next)
- **실시간 통계**: 일일 방문자 현황 대시보드
- **데이터 백업**: Firebase + Google Sheets 자동 백업 시스템

### 🔐 보안 기능
- 관리자 잠금 화면 (PIN 인증)
- 관람실별 접근 제어
- 로고 3번 탭으로 대시보드 진입

### 📊 관리자 대시보드
- 실시간 방문자 통계 (성별/연령대별 집계)
- 시간대별 방문 현황
- Excel 내보내기 (.xlsx)
- 전송 대기 중인 데이터 일괄 전송

## 기술 스택

### Frontend
- **Framework**: React 19.2 + Vite 7
- **AI/ML**: face-api.js 0.22.2
- **UI**: Lucide React (아이콘)
- **State Management**: React Hooks
- **i18n**: react-i18next

### Backend & Database
- **Firebase Firestore**: 방문자 데이터 저장
- **Google Apps Script**: 3시간마다 자동 백업 및 정리
- **Google Sheets**: 데이터 영구 백업

### 빌드 도구
- Vite 7.2.4
- ESLint 9.39

## 시작하기

### 사전 요구사항
```bash
Node.js >= 16.x
npm >= 8.x
```

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/your-org/raim-visitor-checkin.git
cd raim-visitor-checkin
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**

프로젝트 루트에 `.env` 파일을 생성하고 Firebase 설정값을 입력합니다:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_ADMIN_PIN=0000
```

**Firebase 프로젝트 설정 방법:**

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 설정 > 일반 > 내 앱 섹션에서 웹 앱 추가
4. 앱 등록 후 표시되는 `firebaseConfig` 객체의 값들을 `.env` 파일에 복사
5. Firestore Database 생성:
   - Build > Firestore Database 선택
   - 데이터베이스 만들기 (테스트 모드로 시작)
   - 보안 규칙 설정 (프로덕션 환경에서는 필수)

**관리자 PIN 설정:**
- `VITE_ADMIN_PIN`: 관리자 잠금 화면 비밀번호 (기본값: `0000`)
- 프로덕션 환경에서는 반드시 변경하세요

**보안 주의사항:**
- `.env` 파일은 절대 Git에 커밋하지 마세요 (`.gitignore`에 이미 포함됨)
- 프로덕션 환경에서는 Firebase 보안 규칙을 반드시 설정하세요
- 관리자 PIN은 강력한 번호로 변경하세요 (숫자 4자리 이상 권장)
- API 키는 공개 저장소에 노출되지 않도록 주의하세요

4. **개발 서버 실행**
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

5. **프로덕션 빌드**
```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
raim-visitor-checkin/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── AdminLockScreen.jsx
│   │   ├── CameraCard.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ManualEntryCard.jsx
│   │   └── VisitorList.jsx
│   ├── hooks/               # 커스텀 훅
│   │   └── useIsMobile.js
│   ├── i18n/                # 다국어 설정
│   │   ├── translations/
│   │   │   ├── en.json
│   │   │   └── ko.json
│   │   └── i18n.js
│   ├── utils/               # 유틸리티 함수
│   │   └── ageConverter.js
│   ├── App.jsx              # 메인 앱 컴포넌트
│   ├── constants.js         # 상수 정의
│   ├── firebase.js          # Firebase 설정
│   └── main.jsx             # 앱 진입점
├── public/
│   └── models/              # face-api.js AI 모델 (50MB+)
├── docs/                    # 프로젝트 문서
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── MAINTENANCE_GUIDE.md
│   ├── REQUIREMENTS.md
│   └── SETUP_GUIDE.md
└── package.json
```

## 사용 방법

1. **초기 설정**: 관리자 잠금 화면에서 관람실 선택 및 PIN 입력
2. **체크인 모드 선택**:
   - AI 모드: 카메라 앞에 서면 자동 감지
   - 수동 모드: 성별/연령대 직접 선택
3. **데이터 전송**: "완료" 버튼으로 Firebase에 저장
4. **통계 확인**: 로고 3번 탭 → 대시보드 진입

## 상세 문서

- [📋 기능 명세서](docs/FEATURES.md)
- [🏗️ 시스템 아키텍처](docs/ARCHITECTURE.md)
- [⚙️ 설치 가이드](docs/SETUP_GUIDE.md)
- [🔧 유지보수 가이드](docs/MAINTENANCE_GUIDE.md)
- [📝 요구사항 명세서](docs/REQUIREMENTS.md)

