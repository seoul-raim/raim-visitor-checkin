## 📋 Summary
컴포넌트 구조 개선 및 관람실 관리 기능 추가. 연령대 시스템을 ID 기반으로 마이그레이션하여 다국어 지원 및 데이터 일관성 강화.

## 🛠 Key Changes

**1. 컴포넌트 구조 개선**
- 모달 컴포넌트를 `components/modals/` 폴더로 분리 (ErrorModal, SuccessModal, ScanConfirmModal)
- 대시보드 관련 컴포넌트를 `components/dashboard/` 폴더로 분리 (AgeGroupChart, GenderChart, BackupSection, RoomManagementModal)

**2. 연령대 시스템 마이그레이션**
- 한글 레이블 기반 → ID 기반(`toddler`, `child`, `teen`, `youth`, `middleAge`, `senior`)으로 전환
- 다방향 매핑 추가로 데이터 호환성 보장 (AGE_GROUP_ID_TO_LABEL, AGE_GROUP_LABEL_TO_ID 등)
- 레거시 데이터 자동 변환 기능 구현

**3. 관람실 관리 기능**
- Firebase Firestore 'locations' 컬렉션 추가
- 관람실 CRUD 함수 지원 (getRoomLocations, addRoomLocation, deleteRoomLocation)
- localStorage 캐시 전략으로 오프라인 지원
- 대시보드에 관람실 관리 모달 UI 추가

**4. 날짜 형식 표준화 & 코드 개선**
- ISO 8601 형식(YYYY-MM-DD)으로 통일하여 데이터 일관성 향상
- Firebase 초기화 보호 추가 (null 체크)
- 고유 ID 생성 유틸 함수 분리 (generateUniqueId)
- 데이터 제출 로직 통합 및 에러 처리 강화

## 📸 Screenshots

## 🔗 Related Issue
