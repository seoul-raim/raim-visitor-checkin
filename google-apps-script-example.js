/**
 * Google Apps Script 예제 코드
 * 
 * 이 파일은 React 앱에서 전송하는 데이터 형식을 처리하는
 * Google Apps Script의 예시입니다.
 * 
 * 실제 구현 시 Google Apps Script 편집기에 이 코드를 복사하여 사용하세요.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('시트1');
    var params = JSON.parse(e.postData.contents);
    var visitors = params.visitors;
    var date = new Date();

    visitors.forEach(function(person) {
      // 성별 변환: male/female → 남성/여성
      var gender = person.gender === 'male' ? '남성' : '여성';
      
      // 소스 변환: Manual/AI → 수동/AI
      var source = person.source === 'Manual' ? '수동' : 'AI';
      
      // 연령대는 이미 상세 형식으로 전송됨
      // 예: "청년(20세~39세)", "영유아(0~6세)" 등
      var ageGroup = person.ageGroup;

      // 스프레드시트에 데이터 추가
      sheet.appendRow([
        date,        // 등록 시간
        gender,      // 성별 (남성/여성)
        ageGroup,    // 연령대 (상세 정보 포함)
        source       // 입력 방식 (수동/AI)
      ]);
    });

    return ContentService.createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * React 앱에서 전송하는 데이터 형식 예시:
 * 
 * {
 *   "visitors": [
 *     {
 *       "id": 1234567890,
 *       "ageGroup": "청년(20세~39세)",
 *       "gender": "male",
 *       "source": "AI"
 *     },
 *     {
 *       "id": 1234567891,
 *       "ageGroup": "중년(40~49세)",
 *       "gender": "female", 
 *       "source": "Manual"
 *     }
 *   ]
 * }
 */

/**
 * 설정 방법:
 * 
 * 1. Google Apps Script 편집기 열기 (script.google.com)
 * 2. 새 프로젝트 생성
 * 3. 이 코드 복사하여 붙여넣기
 * 4. 배포 > 웹 앱으로 배포
 * 5. "웹 앱으로 실행" 설정 및 "누구나" 액세스 권한 설정
 * 6. 생성된 URL을 React 앱의 .env 파일에 설정:
 *    VITE_GOOGLE_SCRIPT_URL=생성된_URL
 */
