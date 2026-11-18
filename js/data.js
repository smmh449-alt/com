// data.js - 교재 및 채점 데이터 관리

const APP_DATA = {
  books2027: [
    {
      id: "2027-1",
      title: "컴퓨터활용능력 1급 실기 기본서",
      category: "1급 실기",
      year: 2027,
      subject: "excel_access",
      level: 1,
      coverBg: "#e07a5f",
      coverImage: "assets/covers/cover-2027-1.svg",
      badge: "베스트셀러",
      ready: false
    },
    {
      id: "2027-2",
      title: "컴퓨터활용능력 2급 실기 기본서",
      category: "2급 실기",
      year: 2027,
      subject: "excel",
      level: 2,
      coverBg: "#2a9d8f",
      coverImage: "assets/covers/cover-2027-2.svg",
      badge: "최신개정",
      ready: false
    },
    {
      id: "2027-3",
      title: "기출문제집 컴퓨터활용능력 1급 실기",
      category: "1급 기출",
      year: 2027,
      subject: "excel_access",
      level: 1,
      coverBg: "#6a4c93",
      coverImage: "assets/covers/cover-2027-3.svg",
      badge: "기출 100%",
      ready: false
    },
    {
      id: "2027-4",
      title: "기출문제집 컴퓨터활용능력 2급 실기",
      category: "2급 기출",
      year: 2027,
      subject: "excel",
      level: 2,
      coverBg: "#b5179e",
      coverImage: "assets/covers/cover-2027-4.svg",
      badge: "기출 100%",
      ready: false
    },
    {
      id: "2027-5",
      title: "올인원 컴퓨터활용능력 1급 실기",
      category: "1급 종합",
      year: 2027,
      subject: "excel_access",
      level: 1,
      coverBg: "#06d6a0",
      coverImage: "assets/covers/cover-2027-5.svg",
      badge: "인기",
      ready: false
    },
    {
      id: "2027-6",
      title: "올인원 컴퓨터활용능력 2급 실기",
      category: "2급 종합",
      year: 2027,
      subject: "excel",
      level: 2,
      coverBg: "#ff4d6d",
      coverImage: "assets/covers/cover-2027-6.svg",
      badge: "인기",
      ready: false
    },
    {
      id: "2027-7",
      title: "교재 준비중...",
      coverImage: "assets/covers/cover-2027-7.svg",
      ready: true
    },
    {
      id: "2027-8",
      title: "한권끝장 컴퓨터활용능력 2급 실기",
      category: "2급 요약",
      year: 2027,
      subject: "excel",
      level: 2,
      coverBg: "#1e3a5f",
      coverImage: "assets/covers/cover-2027-8.svg",
      badge: "초단기",
      ready: false
    }
  ],

  books2026: [
    {
      id: "2026-1",
      title: "컴퓨터활용능력 1급 실기 2026",
      category: "1급 실기",
      year: 2026,
      subject: "excel_access",
      level: 1,
      coverBg: "#406343",
      coverImage: "assets/covers/cover-2026-1.svg",
      badge: "2026개정",
      ready: false
    },
    {
      id: "2026-2",
      title: "컴퓨터활용능력 2급 실기 2026",
      category: "2급 실기",
      year: 2026,
      subject: "excel",
      level: 2,
      coverBg: "#006d77",
      coverImage: "assets/covers/cover-2026-2.svg",
      badge: "2026개정",
      ready: false
    },
    {
      id: "2026-3",
      title: "교재 준비중...",
      coverImage: "assets/covers/cover-2027-7.svg",
      ready: true
    },
    {
      id: "2026-4",
      title: "교재 준비중...",
      coverImage: "assets/covers/cover-2027-7.svg",
      ready: true
    }
  ],

  examRounds: [
    "대표기출따라하기",
    "상시기출문제1회",
    "상시기출문제2회",
    "상시기출문제3회",
    "상시기출문제4회",
    "상시기출문제5회",
    "상시기출문제6회",
    "상시기출문제7회",
    "상시기출문제8회",
    "상시기출문제9회",
    "상시기출문제10회",
    "기출유형문제1회",
    "기출유형문제2회",
    "기출유형문제3회",
    "기출유형문제4회",
    "기출유형문제5회",
    "기출유형문제6회",
    "기출유형문제7회"
  ],

  // 컴퓨터활용능력 2급 실기 공식 채점 기준표 (100점 만점 / 70점 이상 합격)
  gradingCriteria: {
    passScore: 70,
    totalMaxScore: 100,
    examTitle: "컴퓨터활용능력 2급 실기",
    passCriteriaText: "100점 만점에 70점 이상이면 합격입니다.",
    parts: [
      {
        partId: "part1",
        name: "기본작업",
        maxScore: 20,
        desc: "데이터 입력, 서식 지정, 외부데이터/조건부서식/필터 등 기본 환경 작업",
        items: [
          {
            subName: "기본작업-1 (데이터 입력)",
            score: 5,
            questions: "1문제",
            hasPartial: false,
            ruleText: "5점 (부분점수 없음, 오타나 띄어쓰기 등 하나라도 틀리면 0점 처리)"
          },
          {
            subName: "기본작업-2 (셀 서식 / 조건부 서식 등)",
            score: 10,
            questions: "5문항 (각 2점)",
            hasPartial: true,
            ruleText: "10점 (총 5문제, 각 2점씩 부분점수 있음)"
          },
          {
            subName: "기본작업-3 (고급필터, 조건부서식 등)",
            score: 5,
            questions: "1문제",
            hasPartial: false,
            ruleText: "5점 (부분점수 없음, 조건이나 결과 범위 오류 시 0점)"
          }
        ]
      },
      {
        partId: "part2",
        name: "계산작업",
        maxScore: 40,
        desc: "수식 및 함수를 이용한 데이터 처리 및 계산",
        items: [
          {
            subName: "함수 문제",
            score: 40,
            questions: "5문제 (각 8점)",
            hasPartial: false,
            ruleText: "총 5문제 (각 8점씩, 부분점수 없음 / 문제당 틀리면 -8점)",
            specialNote: "결과값이 정답과 일치하면 함수식의 세부 구조나 셀 참조 방식($ 절대참조 사용 여부 등)이 달라도 정답으로 인정됩니다."
          }
        ]
      },
      {
        partId: "part3",
        name: "분석작업",
        maxScore: 20,
        desc: "피벗테이블, 시나리오, 목표값 찾기, 데이터 표, 데이터 통합",
        items: [
          {
            subName: "분석작업 도구 (피벗테이블, 시나리오, 목표값 등)",
            score: 20,
            questions: "2문제 (각 10점)",
            hasPartial: false,
            ruleText: "총 2문제 (각 10점씩, 부분점수 없음)",
            specialNote: "하나라도 조건을 틀리거나 위치/레이아웃이 어긋나면 해당 문제 점수(10점)가 전부 감점됩니다."
          }
        ]
      },
      {
        partId: "part4",
        name: "기타작업",
        maxScore: 20,
        desc: "매크로 작성 및 차트 편집 작업",
        items: [
          {
            subName: "매크로 작업",
            score: 10,
            questions: "2문제 (각 5점)",
            hasPartial: true,
            ruleText: "총 2문제 (각 5점씩) - 매크로 기록 및 버튼/도형 생성 연결에 부분점수 있음 (세부 수행 여부에 따라 부분점수 부여)"
          },
          {
            subName: "차트 작업",
            score: 10,
            questions: "5문항 (각 2점)",
            hasPartial: true,
            ruleText: "총 5문항 (각 2점씩) - 세부 지시사항별로 각각 2점씩 부분점수 있음"
          }
        ]
      }
    ]
  },

  mockResults: {
    scores: {
      part1: { name: "기본작업(20점)", score: 20, max: 20 },
      part2: { name: "계산작업(40점)", score: 32, max: 40 }, // 5문제 중 1문제 오답 (-8점)
      part3: { name: "분석작업(20점)", score: 20, max: 20 }, // 2문제 모두 완벽 수행
      part4: { name: "기타작업(20점)", score: 18, max: 20 }, // 차트 5문항 중 1문항 감점 (-2점)
      total: 90
    },
    deductions: [
      {
        part: "문제2",
        partName: "계산작업",
        title: "계산작업 - 문제 2번 [INDEX, MATCH 함수]",
        points: -8,
        hasPartial: false,
        detail: "MATCH 함수의 옵션값이 0(정확히 일치)으로 지정되지 않아 잘못된 위치를 참조했습니다. [계산작업 함수문제: 각 8점 / 부분점수 없음]"
      },
      {
        part: "문제4",
        partName: "기타작업",
        title: "기타작업 - 차트작업 3번 [데이터 레이블 추가]",
        points: -2,
        hasPartial: true,
        detail: "지정된 특정 계열(영업1팀)이 아닌 전체 데이터 계열에 레이블이 표시되었습니다. [차트 세부 지시사항: 각 2점 부분점수 있음]"
      }
    ],
    studentRankings: [
      { name: "이** (합격권)", score: 710 },
      { name: "김** (열공중)", score: 620 },
      { name: "박** (달리는중)", score: 490 },
      { name: "최** (도전자)", score: 430 },
      { name: "정**", score: 370 },
      { name: "강**", score: 320 },
      { name: "조**", score: 280 },
      { name: "윤**", score: 210 }
    ],
    teacherRankings: [
      { name: "정선생님 (강남캠퍼스)", score: 138 },
      { name: "박선생님 (컴퓨터아카데미)", score: 132 },
      { name: "김선생님 (온라인반)", score: 95 },
      { name: "이선생님", score: 82 },
      { name: "최선생님", score: 68 }
    ],
    statsCharts: {
      totalScoreDist: {
        labels: [
          "0~10점미만[내점수]", "10~20점미만", "20~30점미만", "30~40점미만",
          "40~50점미만", "50~60점미만", "60~70점미만", "70~80점미만",
          "80~90점미만", "90~100점미만", "100"
        ],
        values: [50.5, 3.2, 4.1, 5.0, 6.2, 7.5, 9.9, 5.1, 4.3, 2.8, 1.4],
        colors: [
          "#3b5998", "#b83b5e", "#f08a5d", "#ee5a24",
          "#f39c12", "#00b894", "#10ac84", "#2e86de",
          "#6c5ce7", "#8854d0", "#5758bb"
        ]
      },
      part1Dist: {
        labels: ["0~5점미만[내점수]", "5~10점미만", "10~15점미만", "15~20점미만", "20"],
        values: [51.7, 9.5, 5.2, 7.2, 26.4],
        colors: ["#3b5998", "#b83b5e", "#f08a5d", "#10ac84", "#8854d0"]
      },
      part2Dist: {
        labels: ["0~5점미만[내점수]", "10~15점미만", "15~20점미만", "25~30점미만", "30~35점미만", "40"],
        values: [64.2, 4.5, 2.5, 9.3, 3.0, 16.5],
        colors: ["#3b5998", "#b83b5e", "#f08a5d", "#10ac84", "#0984e3", "#5758bb"]
      }
    }
  },

  // 영진닷컴 출판사 자료실 (컴퓨터활용능력 실기/필기 부록 및 정답·해설)
  archivePosts: [
    {
      id: 271,
      bookCode: "8223",
      title: "[8223] 2027 한 권 끝장 이기적 컴퓨터활용능력 1급 실기(커미조아)",
      author: "이기적人",
      date: "2026/11/04",
      views: 1420,
      fileType: "zip",
      fileName: "2027_com1_end_sample.zip"
    },
    {
      id: 270,
      bookCode: "8348",
      title: "[8348] 2027 이기적 컴퓨터활용능력 1급 실기 기출문제집",
      author: "관리자",
      date: "2026/11/09",
      views: 2130,
      fileType: "zip",
      fileName: "2027_com1_past_exam.zip"
    },
    {
      id: 269,
      bookCode: "8349",
      title: "[8349] 2027 이기적 컴퓨터활용능력 2급 실기 기출문제집",
      author: "관리자",
      date: "2026/10/20",
      views: 3890,
      fileType: "zip",
      fileName: "2027_com2_past_exam.zip"
    },
    {
      id: 268,
      bookCode: "8224",
      title: "[8224] 2027 한 권 끝장 이기적 컴퓨터활용능력 2급 실기(커미조아)",
      author: "이기적人",
      date: "2026/11/02",
      views: 988,
      fileType: "zip",
      fileName: "2027_com2_end_sample.zip"
    },
    {
      id: 267,
      bookCode: "8346",
      title: "[8346] 2027 이기적 컴퓨터활용능력 1급 실기 기본서",
      author: "관리자",
      date: "2026/08/26",
      views: 4601,
      fileType: "zip",
      fileName: "2027_com1_basic_data.zip"
    },
    {
      id: 266,
      bookCode: "8322",
      title: "[8322] 2027 이기적 컴퓨터활용능력 1급 필기+실기 올인원",
      author: "이기적人",
      date: "2026/10/28",
      views: 2782,
      fileType: "zip",
      fileName: "2027_com1_allinone.zip"
    },
    {
      id: 265,
      bookCode: "8321",
      title: "[8321] 2027 이기적 컴퓨터활용능력 2급 필기+실기 올인원",
      author: "이기적人",
      date: "2026/09/14",
      views: 7593,
      fileType: "zip",
      fileName: "2027_com2_allinone.zip"
    },
    {
      id: 264,
      bookCode: "8347",
      title: "[8347] 2027 이기적 컴퓨터활용능력 2급 실기 기본서",
      author: "관리자",
      date: "2026/07/21",
      views: 13547,
      fileType: "zip",
      fileName: "2027_com2_basic_data.zip"
    },
    {
      id: 263,
      bookCode: "7964",
      title: "[7964] 2026 이기적 컴퓨터활용능력 2급 필기 절대족보",
      author: "이기적人",
      date: "2025/11/05",
      views: 24640,
      fileType: "pdf",
      fileName: "2026_com2_jokbo.pdf"
    },
    {
      id: 262,
      bookCode: "7963",
      title: "[7963] 2026 이기적 컴퓨터활용능력 1급 필기 절대족보",
      author: "이기적人",
      date: "2025/10/25",
      views: 12777,
      fileType: "pdf",
      fileName: "2026_com1_jokbo.pdf"
    },
    {
      id: 261,
      bookCode: "7807",
      title: "[7807] 2026 한 권으로 끝장내는 이기적 X 커미조아가현샘 컴퓨터활용능력 1급 실기",
      author: "이기적人",
      date: "2026/09/17",
      views: 10719,
      fileType: "zip",
      fileName: "2026_com1_end_solution.zip"
    },
    {
      id: 260,
      bookCode: "7808",
      title: "[7808] 2026 한 권으로 끝장내는 이기적 X 커미조아가현샘 컴퓨터활용능력 2급 실기",
      author: "이기적人",
      date: "2025/11/20",
      views: 6643,
      fileType: "zip",
      fileName: "2026_com2_end_solution.zip"
    },
    {
      id: 259,
      bookCode: "8011",
      title: "[8011] 2026 이기적 컴퓨터활용능력 2급 실기 기출문제집",
      author: "이기적人",
      date: "2025/12/22",
      views: 42870,
      fileType: "zip",
      fileName: "2026_com2_past_data.zip"
    },
    {
      id: 258,
      bookCode: "8010",
      title: "[8010] 2026 이기적 컴퓨터활용능력 1급 실기 기출문제집",
      author: "이기적人",
      date: "2025/09/23",
      views: 19721,
      fileType: "zip",
      fileName: "2026_com1_past_data.zip"
    },
    {
      id: 257,
      bookCode: "7935",
      title: "[7935] 2026 이기적 컴퓨터활용능력 1급 필기+실기 올인원",
      author: "이기적人",
      date: "2025/08/22",
      views: 15371,
      fileType: "zip",
      fileName: "2026_com1_allinone.zip"
    },
    {
      id: 256,
      bookCode: "7936",
      title: "[7936] 2026 이기적 컴퓨터활용능력 2급 필기+실기 올인원",
      author: "이기적人",
      date: "2025/12/02",
      views: 50568,
      fileType: "zip",
      fileName: "2026_com2_allinone.zip"
    },
    {
      id: 255,
      bookCode: "8009",
      title: "[8009] 2026 이기적 컴퓨터활용능력 2급 실기 기본서",
      author: "이기적人",
      date: "2025/12/22",
      views: 98424,
      fileType: "zip",
      fileName: "2026_com2_basic_data.zip"
    },
    {
      id: 254,
      bookCode: "8008",
      title: "[8008] 2026 이기적 컴퓨터활용능력 1급 실기 기본서",
      author: "이기적人",
      date: "2025/12/22",
      views: 34388,
      fileType: "zip",
      fileName: "2026_com1_basic_data.zip"
    },
    {
      id: 253,
      bookCode: "7613",
      title: "[7613] 2025 이기적 컴퓨터활용능력 2급 필기 기출 800제",
      author: "이기적人",
      date: "2024/12/05",
      views: 35133,
      fileType: "pdf",
      fileName: "2025_com2_800je.pdf"
    },
    {
      id: 252,
      bookCode: "7612",
      title: "[7612] 2025 이기적 컴퓨터활용능력 1급 필기 기출 1200제",
      author: "이기적人",
      date: "2024/12/10",
      views: 17297,
      fileType: "pdf",
      fileName: "2025_com1_1200je.pdf"
    }
  ]
};