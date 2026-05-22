export const SYMPTOMS = [
  { key: 'symptom_1', label: '기동시부하과다', labelEn: 'Excessive Startup Load' },
  { key: 'symptom_2', label: '부하과소', labelEn: 'Underload' },
  { key: 'symptom_3', label: '양수량감소', labelEn: 'Flow Rate Reduction' },
  { key: 'symptom_4', label: '양수불능', labelEn: 'Pump Inoperable' },
  { key: 'symptom_5', label: '베어링과열', labelEn: 'Bearing Overheating' },
  { key: 'symptom_6', label: '글랜드패킹과열', labelEn: 'Gland Overheating' },
  { key: 'symptom_7', label: '이상진동', labelEn: 'Abnormal Vibration' },
  { key: 'symptom_8', label: '만수불능', labelEn: 'Priming Failure' },
  { key: 'symptom_9', label: '과부하', labelEn: 'Overload' },
  { key: 'symptom_10', label: '압력계수값', labelEn: 'Discharge Pressure' },
  { key: 'symptom_11', label: '진공계수값', labelEn: 'Suction Vacuum' },
];

export const FAULT_MATRIX_DATA = [
  { cause: "양정 과다", causeEn: "Excessive Head", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_7: "○", symptom_10: "고" }, remarks: "", remarksEn: "" },
  { cause: "양정 과소", causeEn: "Insufficient Head", cells: { symptom_7: "○", symptom_9: "○", symptom_10: "저", symptom_11: "고" }, remarks: "", remarksEn: "" },
  { cause: "임펠러 역회전", causeEn: "Impeller Reverse Rotation", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_10: "저", symptom_11: "저" }, remarks: "", remarksEn: "" },
  { cause: "회전수 과소", causeEn: "Under-speed Operation", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_10: "저", symptom_11: "저" }, remarks: "주파수 저하", remarksEn: "Frequency Drop" },
  { cause: "회전수 과다", causeEn: "Over-speed Operation", cells: { symptom_9: "○", symptom_11: "약간 저" }, remarks: "", remarksEn: "" },
  { cause: "전압 강하 또는 전기품 고장", causeEn: "Voltage Drop / Motor Fault", cells: { symptom_9: "○" }, remarks: "", remarksEn: "" },
  { cause: "제수밸브 약간 개방", causeEn: "Control Valve Slightly Open", cells: { symptom_1: "○", symptom_2: "○", symptom_3: "○", symptom_10: "고", symptom_11: "약간 저" }, remarks: "", remarksEn: "" },
  { cause: "패킹누르게 한쪽 조임 또는 과다 조임", causeEn: "Gland Packing Over-tightened", cells: { symptom_1: "○", symptom_6: "○" }, remarks: "", remarksEn: "" },
  { cause: "조립 설치 불량 또는 축 중심 불일치", causeEn: "Rotor Shaft Misalignment", cells: { symptom_1: "○", symptom_4: "○", symptom_5: "○", symptom_6: "○" }, remarks: "", remarksEn: "" },
  { cause: "회전부 마모 또는 눌러붙음", causeEn: "Rotating Part Wear / Seizure", cells: { symptom_1: "○", symptom_5: "○" }, remarks: "손으로 돌리기 어려움", remarksEn: "Hard to turn manually" },
  { cause: "윤활유 부족 및 베어링장치 상태 나쁨", causeEn: "Bearing Wear / Grease Deficit", cells: { symptom_5: "○" }, remarks: "", remarksEn: "" },
  { cause: "실링 폐쇄 또는 축봉수 불량", causeEn: "Sealing Block / Gland Water Defect", cells: { symptom_3: "○", symptom_4: "○", symptom_6: "○", symptom_10: "저" }, remarks: "축봉수 불량", remarksEn: "Seal water defect" },
  { cause: "흡입관에서 공기 침입", causeEn: "Air Inflow in Suction Line", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_6: "○", symptom_7: "○", symptom_8: "○", symptom_10: "불안정", symptom_11: "불안정" }, remarks: "수면에 거품 발생", remarksEn: "Bubbles on water surface" },
  { cause: "흡입관에 공기주머니 발생", causeEn: "Air Pocket in Suction Line", cells: { symptom_3: "○", symptom_4: "○" }, remarks: "단속적인 양수", remarksEn: "Intermittent pumping" },
  { cause: "흡입관에 이물질이 걸렸을 때", causeEn: "Suction Strainer Clogged", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_5: "○", symptom_7: "○", symptom_10: "저", symptom_11: "고" }, remarks: "임펠러 입구 이물질", remarksEn: "Impeller inlet debris" },
  { cause: "송출관에 이물질이 있을 때", causeEn: "Discharge Pipe Blockage", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○" }, remarks: "송출라인 폐쇄", remarksEn: "Discharge line closed" },
  { cause: "라이너링 또는 임펠러 마모", causeEn: "Wearing Ring / Impeller Wear", cells: { symptom_3: "○", symptom_10: "저" }, remarks: "", remarksEn: "" },
  { cause: "회전체 불평형 및 잔류 안착 불일치", causeEn: "Rotor Unbalance & Imbalance", cells: { symptom_7: "○", symptom_2: "○" }, remarks: "XGBoost 융합 판정", remarksEn: "XGBoost Fusion Decision" },
  { cause: "구동 벨트 느슨함 및 송출 장력 저하", causeEn: "Drive Belt Slack / Tension Loss", cells: { symptom_3: "○", symptom_10: "저" }, remarks: "XGBoost 융합 판정", remarksEn: "XGBoost Fusion Decision" }
];

export const getMaintenanceGuideUrl = (rootCause) => {
  const cause = rootCause || "";
  if (cause.includes("축정렬불량") || cause.includes("축 중심") || cause.includes("조립 설치") || cause.includes("Misalignment")) {
    return "https://www.youtube.com/watch?v=kU_3zSCSz0o";
  }
  if (cause.includes("베어링불량") || cause.includes("윤활유") || cause.includes("베어링장치") || cause.includes("Bearing") || cause.includes("Grease")) {
    return "https://www.youtube.com/watch?v=N4vA-Hq0Y9E";
  }
  if (cause.includes("벨트느슨함") || cause.includes("구동 벨트") || cause.includes("Belt") || cause.includes("Slack")) {
    return "https://www.youtube.com/watch?v=2r7vF14r0fE";
  }
  return "https://www.youtube.com/watch?v=8y_l9K1E4W4";
};
