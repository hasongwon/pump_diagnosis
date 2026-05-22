// ─── 리포트 템플릿 16개 (다양한 원인 구성) ───────────────────────────────────
export const REPORT_TEMPLATES = [
  {
    titleKo: "축정렬 불량 및 커플링 편차 (진동+전류 이중 융합 확진)",
    titleEn: "Shaft Misalignment & Coupling Anomaly (Dual Sensor Fusion Confirmed)",
    descKo: "Z축 가속도 진폭 임계치 초과 및 3상 고주파 전류 왜곡 교차 검출. 즉시 정비 요망.",
    descEn: "Z-axis vibration amplitude threshold exceeded with 3-phase MCSA harmonic cross-detection. Immediate maintenance required.",
    statusType: "DANGER", prefix: "WO", hour: 3,
    keyAnomaly: { ko: "축 미스얼라인먼트 (커플링 편차 0.21mm 초과)", en: "Shaft Misalignment (Coupling Offset >0.21mm)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 진동 1X 성분이 지배적으로 상승(14.22 mm/s)하였으며, 동시에 MCSA 3상 위상 불균형도가 기준치(4.8%)를 초과하였습니다. 두 센서의 동기화 패턴이 축 중심 불일치에 의한 전형적인 교차 진동-전류 공명 패턴을 나타냅니다. 커플링 정렬 오차 수리가 즉각적으로 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: The 1X vibration component dominantly surged to 14.22 mm/s while MCSA 3-phase imbalance exceeded the 4.8% threshold. The synchronization pattern between both sensors indicates a classic cross-coupling resonance caused by shaft center offset. Immediate coupling alignment correction is required."
    },
    actions: {
      ko: ["커플링 오차 다이얼게이지 ±0.03mm 미세 얼라인먼트 보정 실시", "모터 베이스 플레이트 앵커 볼트 규정 토크 재잠금"],
      en: ["Calibrate coupling concentricity to ±0.03mm tolerance via dial gauge", "Re-tighten motor base plate anchor bolts to specified torque"]
    },
    metrics: { vib: "14.22 mm/s", temp: "72.4 °C", press: "12.5 bar", flow: "450 m³/h" }
  },
  {
    titleKo: "모터 구동 베어링 구름 마모 및 그리스 충진 경고",
    titleEn: "Motor Drive Bearing Rolling Wear & Grease Replenishment Alert",
    descKo: "베어링 하우징 온도 이상 상승 및 구름 마찰 주파수 스펙트럼 피크 검출.",
    descEn: "Bearing housing temperature anomaly rise and rolling friction frequency spectrum peak detected.",
    statusType: "WARNING", prefix: "DIAG", hour: 6,
    keyAnomaly: { ko: "베어링 구름 마모 (BPFI 스펙트럼 이상)", en: "Bearing Wear (BPFI Spectrum Anomaly)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 베어링 볼 통과 주파수(BPFI) 성분이 정상 기준 대비 2.3배 증가하였습니다. 하우징 온도 61.2°C는 임계 경고 수준이며, 그리스 점도 저하에 따른 마찰 증가가 확인됩니다. 즉시 그리스 보충 및 베어링 상태 정밀 점검이 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: The Ball Pass Frequency Inner Race (BPFI) component increased 2.3x above normal baseline. Housing temperature at 61.2°C is at critical warning level. Grease viscosity degradation causing elevated friction has been confirmed. Immediate grease replenishment and precision bearing inspection are required."
    },
    actions: {
      ko: ["규정 그리스 (NLGI #2) 정량 보충 및 그리스 주입구 청결 유지", "베어링 외륜 육안 점검 및 마모 측정 게이지 확인"],
      en: ["Replenish specified grease (NLGI #2) and keep grease port clean", "Visually inspect bearing outer race and verify wear gauge measurement"]
    },
    metrics: { vib: "4.85 mm/s", temp: "61.2 °C", press: "11.8 bar", flow: "430 m³/h" }
  },
  {
    titleKo: "원심펌프 가동 개시 및 베이스라인 정상 수립 리포트",
    titleEn: "Centrifugal Pump Commissioning & Baseline Stability Calibration Report",
    descKo: "모든 스펙트럼 Peak 에너지가 안정 임계값 내 분포 확인 완료. 정상 가동 상태.",
    descEn: "All spectrum peak energy confirmed within stable thresholds. Normal operational state established.",
    statusType: "NORMAL", prefix: "DIAG", hour: 8,
    keyAnomaly: { ko: "정상 기동 (전 채널 안정 임계값 내)", en: "Normal State (All channels within stable limits)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 진동 RMS 1.12 mm/s, 베어링 온도 44.1°C, 3상 전류 균형도가 모두 설계 기준 이내로 분포합니다. 멀티 센서 융합 RAG 연산 결과 이상 징후 없음이 99% 신뢰도로 확인되었습니다. 현재 가동 조건을 유지하십시오.",
      en: "AI Engine Cross-Fusion Verdict: Vibration RMS 1.12 mm/s, bearing temperature 44.1°C, and 3-phase current balance are all within design specification. Multi-sensor fusion RAG analysis confirms no anomaly with 99% confidence. Maintain current operational conditions."
    },
    actions: {
      ko: ["현재 수립된 24시간 실시간 교차 PdM 연산 및 자동 그리스 일정을 정상 유지", "다음 정기 점검 예정일 (30일 후) 준수"],
      en: ["Maintain current 24h real-time PdM cross-monitoring and auto-grease schedule", "Adhere to next scheduled inspection date (30 days from now)"]
    },
    metrics: { vib: "1.12 mm/s", temp: "44.1 °C", press: "14.0 bar", flow: "512 m³/h" }
  },
  {
    titleKo: "임펠러 흡입구 공동 현상(Cavitation) 초기 와류 감지",
    titleEn: "Impeller Inlet Cavitation & Fluid Vortex Early Warning Detection",
    descKo: "흡입 압력 강하 및 임펠러 입구 유체 유동 왜곡 초기 단계 검출.",
    descEn: "Suction pressure drop and impeller inlet fluid flow distortion detected at early stage.",
    statusType: "WARNING", prefix: "DIAG", hour: 10,
    keyAnomaly: { ko: "공동 현상 초기 (흡입 압력 저하 8.4 bar)", en: "Cavitation Onset (Suction Pressure Drop 8.4 bar)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 임펠러 내부 기포 터짐 및 와류(공동 현상)가 초기 단계로 감지되었습니다. 흡입 측 진공 압력 8.4 bar로 저하 신호와 급격한 유량 유동 변동치가 융합 매트릭스에 기록되었습니다. 날개 표면 피로 부식 예방을 위해 흡입 파이프라인 이물질 청소 및 밸브 전면 개방을 권장합니다.",
      en: "AI Engine Cross-Fusion Verdict: Early-stage cavitation bubble implosion and fluid vortex detected. Suction pressure drop to 8.4 bar and sharp flow fluctuation have been recorded in the fusion matrix. To prevent blade surface fatigue corrosion, inlet pipeline debris clearing and full valve opening are recommended."
    },
    actions: {
      ko: ["흡입 파이프 스크린 필터 내 오물 역세척 유체 정화 실시", "흡입 측 진공 게이지 지시값 한계 교정 점검"],
      en: ["Flush inlet pipe strainer screen of foreign particles with reverse flushing", "Verify vacuum pressure limit gauge calibration on suction side"]
    },
    metrics: { vib: "1.21 mm/s", temp: "45.2 °C", press: "8.4 bar", flow: "310 m³/h" }
  },
  {
    titleKo: "모터 고정자 권선 고온 과열 및 단락 이상 진단서 (MCSA 분석)",
    titleEn: "Motor Stator Winding Overheating & Short Circuit Fault Diagnosis (MCSA)",
    descKo: "U/V/W 3상 위상 전류 불평형율 기준치 초과. 권선 절연 열화 확인 필요.",
    descEn: "U/V/W 3-phase current imbalance exceeded threshold. Winding insulation degradation must be verified.",
    statusType: "DANGER", prefix: "WO", hour: 12,
    keyAnomaly: { ko: "권선 과열 (3상 불균형 7.2% / 온도 88.5°C)", en: "Winding Overheating (Phase Imbalance 7.2% / Temp 88.5°C)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: MCSA 분석 결과 U상 전류가 V·W상 대비 7.2% 불균형이 감지되었습니다. 동시에 스테이터 온도가 88.5°C로 절연 등급 임계치를 초과하였습니다. 권선 단락 또는 절연 피막 열화가 강하게 의심됩니다. 즉시 가동 중단 후 절연 저항 측정(메거 테스트)이 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: MCSA analysis reveals U-phase current imbalance of 7.2% compared to V and W phases. Simultaneously, stator temperature exceeded the insulation class threshold at 88.5°C. Winding short circuit or insulation film degradation is strongly suspected. Immediate shutdown and insulation resistance measurement (megger test) are required."
    },
    actions: {
      ko: ["즉시 펌프 가동 중단 및 전원 차단 후 메거 테스트 실시 (절연 저항 1MΩ 이상 확인)", "권선 절연 피막 손상 부위 확인 및 재권선 또는 모터 교체 검토"],
      en: ["Immediately shut down pump, cut power, and perform megger insulation test (confirm >1MΩ)", "Inspect winding insulation film damage and consider rewinding or motor replacement"]
    },
    metrics: { vib: "2.44 mm/s", temp: "88.5 °C", press: "13.1 bar", flow: "395 m³/h" }
  },
  {
    titleKo: "자동 그리스 윤활 시스템 정기 점검 및 필터 교체 완료",
    titleEn: "Automatic Grease Lubricator Dispatch & Filter Periodic Inspection Completed",
    descKo: "정기 예방보전 일정에 따른 그리스 보충 및 에어 필터 교체 완료. 정상.",
    descEn: "Routine PdM grease replenishment and air filter replacement completed per schedule. Normal.",
    statusType: "NORMAL", prefix: "DIAG", hour: 14,
    keyAnomaly: { ko: "정상 (정기 예방보전 완료)", en: "Normal (Routine PdM Completed)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 정기 예방보전 그리스 교체 후 베어링 마찰 주파수 성분이 기준값으로 복귀하였습니다. 에어 필터 교체로 냉각 효율이 개선되어 온도 감소가 확인됩니다. 전반적인 설비 상태가 최적 수준으로 유지되고 있습니다.",
      en: "AI Engine Cross-Fusion Verdict: After scheduled PdM grease replacement, bearing friction frequency component returned to baseline. Cooling efficiency improved following air filter replacement, with confirmed temperature reduction. Overall equipment condition is maintained at optimal level."
    },
    actions: {
      ko: ["다음 그리스 교체 주기 (250시간 후) 일정 캘린더 갱신", "현재 수립된 PdM 모니터링 일정 정상 유지"],
      en: ["Update next grease replacement schedule (250 hours later) in maintenance calendar", "Maintain current PdM monitoring schedule as planned"]
    },
    metrics: { vib: "0.98 mm/s", temp: "42.3 °C", press: "14.3 bar", flow: "518 m³/h" }
  },
  {
    titleKo: "브래킷 마운팅 볼트 느슨함 및 구조 공진 분석 보고서",
    titleEn: "Pump Bracket Mounting Bolt Looseness & Structural Resonance Analysis",
    descKo: "기초 앵커 볼트 이완으로 인한 공진 주파수 편이 감지. 토크 재체결 요망.",
    descEn: "Resonance frequency shift due to anchor bolt looseness detected. Torque re-tightening required.",
    statusType: "WARNING", prefix: "DIAG", hour: 16,
    keyAnomaly: { ko: "기초 볼트 이완 (공진 주파수 편이 감지)", en: "Foundation Bolt Looseness (Resonance Frequency Shift)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 1/2X 서브하모닉 진동 성분이 검출되어 구조적 공진 현상을 나타냅니다. 앵커 볼트 이완이 진동 전달 경로를 변경시켜 베이스 플레이트 전체가 공진 상태입니다. 즉시 토크 렌치를 이용한 볼트 규정 체결력 확인이 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: Sub-harmonic 1/2X vibration component detected, indicating structural resonance. Anchor bolt looseness has altered the vibration transmission path, causing the entire base plate to enter resonance state. Immediate verification of bolt torque specification using a torque wrench is required."
    },
    actions: {
      ko: ["토크 렌치를 이용한 기초 앵커 볼트 규정 체결력 확인 및 재체결", "방진 패드 상태 점검 및 필요시 교체"],
      en: ["Verify and re-tighten anchor bolt torque using torque wrench to specified value", "Inspect anti-vibration pads and replace if necessary"]
    },
    metrics: { vib: "3.55 mm/s", temp: "47.8 °C", press: "12.2 bar", flow: "468 m³/h" }
  },
  {
    titleKo: "회전체 불평형 및 잔류 불평형 보정 완료 리포트",
    titleEn: "Rotor Dynamic Unbalance Correction & Residual Balancing Completed Report",
    descKo: "현장 동적 밸런싱 작업 완료 후 진동 수준 정상 범위 복귀 확인.",
    descEn: "Field dynamic balancing completed. Vibration level confirmed returned to normal range.",
    statusType: "NORMAL", prefix: "DIAG", hour: 18,
    keyAnomaly: { ko: "정상 (동적 밸런싱 완료)", en: "Normal (Dynamic Balancing Completed)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 현장 동적 밸런싱 보정 작업 완료 후 1X 진동 성분이 14.22 mm/s에서 0.85 mm/s로 감소하였습니다. 3상 전류 불균형도 역시 정상 범위로 복귀하였습니다. 밸런싱 교정 작업이 성공적으로 완료되었습니다.",
      en: "AI Engine Cross-Fusion Verdict: After field dynamic balancing correction, the 1X vibration component decreased from 14.22 mm/s to 0.85 mm/s. The 3-phase current imbalance also returned to normal range. Balancing correction has been successfully completed."
    },
    actions: {
      ko: ["동적 밸런싱 완료 후 1주일간 집중 모니터링 실시", "다음 정기 밸런싱 점검 주기 설정 (6개월 후)"],
      en: ["Perform intensive 1-week monitoring after dynamic balancing completion", "Set next scheduled balancing inspection cycle (6 months later)"]
    },
    metrics: { vib: "0.85 mm/s", temp: "41.2 °C", press: "14.2 bar", flow: "520 m³/h" }
  },
  // ─── 추가 8개 템플릿 (다양성 확보) ──────────────────────────────────────────
  {
    titleKo: "흡입관 공기 침입 및 수면 거품 발생 이상 감지",
    titleEn: "Suction Line Air Inflow & Water Surface Bubble Anomaly Detection",
    descKo: "흡입관 내 공기 유입으로 양수량 감소 및 압력 불안정 신호 검출.",
    descEn: "Air inflow in suction line causing flow reduction and pressure instability signal detected.",
    statusType: "WARNING", prefix: "DIAG", hour: 5,
    keyAnomaly: { ko: "흡입관 공기 침입 (압력 불안정 감지)", en: "Suction Air Inflow (Pressure Instability)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 흡입관 연결부 기밀 불량으로 인한 공기 유입이 감지되었습니다. 압력 신호의 불규칙한 진동과 함께 양수량이 간헐적으로 감소하는 패턴이 확인됩니다. 흡입관 연결 플랜지 및 패킹 상태 점검이 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: Air inflow due to suction line connection seal failure has been detected. Irregular pressure signal oscillation with intermittent flow reduction pattern is confirmed. Inspection of suction pipe connection flange and packing condition is required."
    },
    actions: {
      ko: ["흡입관 플랜지 연결부 기밀 검사 및 패킹 교체", "흡입 수위 확인 및 공기 유입 경로 차단"],
      en: ["Inspect suction pipe flange connection airtightness and replace packing", "Check suction water level and block air inflow path"]
    },
    metrics: { vib: "2.15 mm/s", temp: "48.5 °C", press: "9.8 bar", flow: "285 m³/h" }
  },
  {
    titleKo: "분기별 예방보전 벨트 처짐 계측 및 풀리 정렬 검증",
    titleEn: "Quarterly PdM Drive Belt Tension Measurement & Pulley Alignment Validation",
    descKo: "구동 벨트 장력 규격 적합 및 풀리 수평 정렬 검증 완료. 이상 없음.",
    descEn: "Drive belt tension within spec and pulley horizontal alignment verified. No anomaly found.",
    statusType: "NORMAL", prefix: "DIAG", hour: 7,
    keyAnomaly: { ko: "정상 (벨트 장력 및 풀리 정렬 양호)", en: "Normal (Belt Tension & Pulley Alignment OK)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 분기별 예방보전 점검 결과 구동 벨트 장력이 규격 범위 내에 있음이 확인되었습니다. 풀리 수평 정렬 편차가 0.05mm 이내로 양호합니다. 다음 분기 정기 점검 시까지 정상 가동이 가능합니다.",
      en: "AI Engine Cross-Fusion Verdict: Quarterly PdM inspection confirms drive belt tension within specification range. Pulley horizontal alignment deviation is within 0.05mm tolerance. Normal operation is possible until next quarterly inspection."
    },
    actions: {
      ko: ["다음 분기 벨트 장력 및 풀리 정렬 점검 일정 등록", "벨트 마모 패턴 사진 기록 보관"],
      en: ["Register next quarterly belt tension and pulley alignment inspection schedule", "Archive drive belt wear pattern photographs"]
    },
    metrics: { vib: "0.92 mm/s", temp: "43.1 °C", press: "14.1 bar", flow: "508 m³/h" }
  },
  {
    titleKo: "라이너링 마모 및 임펠러 간격 확대 진단 (양수량 감소)",
    titleEn: "Wearing Ring Wear & Impeller Clearance Expansion Diagnosis (Flow Reduction)",
    descKo: "양수량 감소 패턴과 함께 라이너링 마모에 따른 내부 누설 증가 확인.",
    descEn: "Flow reduction pattern with confirmed internal leakage increase from wearing ring wear.",
    statusType: "WARNING", prefix: "DIAG", hour: 9,
    keyAnomaly: { ko: "라이너링 마모 (내부 누설 증가)", en: "Wearing Ring Wear (Internal Leakage Increase)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 양수량이 설계 유량 대비 18% 감소하였으며, 이는 라이너링 마모에 따른 내부 유체 누설로 판단됩니다. 임펠러와 라이너링 사이의 간격이 설계 기준치를 초과한 것으로 추정되며, 분해 점검 후 라이너링 교체가 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: Flow rate decreased 18% below design specification, assessed as internal fluid leakage from wearing ring wear. The clearance between impeller and wearing ring is estimated to exceed design tolerance. Disassembly inspection and wearing ring replacement are required."
    },
    actions: {
      ko: ["펌프 분해 후 임펠러-라이너링 간격 측정 (설계값 대비 비교)", "마모 기준 초과 시 라이너링 교체 실시"],
      en: ["Disassemble pump and measure impeller-wearing ring clearance vs design tolerance", "Replace wearing ring if wear exceeds specification limit"]
    },
    metrics: { vib: "1.85 mm/s", temp: "46.3 °C", press: "11.2 bar", flow: "348 m³/h" }
  },
  {
    titleKo: "전압 강하 및 전기품 고장 이상 감지 (과부하 경고)",
    titleEn: "Voltage Drop & Motor Electrical Fault Detection (Overload Warning)",
    descKo: "공급 전압 강하에 따른 모터 과부하 전류 증가 패턴 검출.",
    descEn: "Motor overload current increase pattern detected due to supply voltage drop.",
    statusType: "DANGER", prefix: "WO", hour: 11,
    keyAnomaly: { ko: "공급 전압 강하 (과부하 전류 147% 증가)", en: "Voltage Drop (Overload Current 147% Increase)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 공급 전압이 정격 대비 12% 강하하면서 모터 전류가 정격의 147%까지 증가하였습니다. 장시간 지속 시 과열로 인한 권선 손상이 우려됩니다. 전원 공급 계통 점검 및 전압 조정이 즉각적으로 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: Supply voltage dropped 12% below rated value, causing motor current to increase to 147% of rated capacity. Prolonged operation risks winding damage from overheating. Immediate power supply system inspection and voltage adjustment are required."
    },
    actions: {
      ko: ["변압기 2차 측 출력 전압 측정 및 탭 조정", "모터 과부하 보호 계전기 설정값 재확인"],
      en: ["Measure transformer secondary output voltage and adjust tap setting", "Re-verify motor overload protection relay setpoint values"]
    },
    metrics: { vib: "2.88 mm/s", temp: "78.2 °C", press: "12.8 bar", flow: "421 m³/h" }
  },
  {
    titleKo: "패킹누르게 한쪽 조임 과다 및 글랜드 패킹 과열 감지",
    titleEn: "Gland Packing Over-Tightening & Stuffing Box Overheating Detection",
    descKo: "글랜드 패킹 한쪽 과잉 체결로 인한 축봉수 불량 및 과열 발생.",
    descEn: "Gland packing one-side over-tightening causing seal water deficiency and overheating.",
    statusType: "WARNING", prefix: "DIAG", hour: 13,
    keyAnomaly: { ko: "글랜드 패킹 과열 (온도 63.5°C / 축봉수 불량)", en: "Gland Overheating (Temp 63.5°C / Seal Water Defect)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 글랜드 패킹 하우징 온도가 63.5°C로 과열 경고 기준을 초과하였습니다. 패킹 조임 불균형으로 축봉수 공급이 차단되어 마찰열이 발생하는 것으로 판단됩니다. 패킹 나사 균등 조임 및 축봉수 공급 확인이 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: Gland packing housing temperature exceeded the overheating warning threshold at 63.5°C. Uneven packing tightening has blocked seal water supply, generating frictional heat. Uniform packing bolt adjustment and seal water supply verification are required."
    },
    actions: {
      ko: ["글랜드 패킹 조임 나사 균등 조정 (좌우 대칭 체결)", "축봉수 공급 배관 및 유량 점검"],
      en: ["Adjust gland packing bolts uniformly (symmetrical tightening on both sides)", "Inspect seal water supply piping and flow rate"]
    },
    metrics: { vib: "2.12 mm/s", temp: "63.5 °C", press: "12.9 bar", flow: "441 m³/h" }
  },
  {
    titleKo: "흡입관 이물질 막힘 및 임펠러 입구 부하 과다 진단",
    titleEn: "Suction Strainer Clogging & Impeller Inlet Overload Diagnosis",
    descKo: "흡입 스트레이너 이물질 막힘으로 인한 양수량 감소 및 기동 과부하 감지.",
    descEn: "Flow reduction and startup overload detected from suction strainer clogging.",
    statusType: "DANGER", prefix: "WO", hour: 15,
    keyAnomaly: { ko: "흡입 스트레이너 막힘 (양수량 42% 감소)", en: "Suction Strainer Clogged (Flow Reduction 42%)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 양수량이 설계 유량 대비 42% 급감하였으며, 기동 시 전류 충격이 정격의 185%로 증가하였습니다. 흡입 스트레이너 이물질 완전 막힘으로 판단되며, 즉시 청소가 필요합니다. 지속 가동 시 임펠러 과부하로 인한 파손 위험이 있습니다.",
      en: "AI Engine Cross-Fusion Verdict: Flow rate dropped 42% below design specification with startup current shock increasing to 185% of rated value. Complete suction strainer clogging is confirmed. Immediate cleaning is required. Continued operation risks impeller damage from overload."
    },
    actions: {
      ko: ["즉시 펌프 가동 중단 후 흡입 스트레이너 분리 청소", "이물질 유입 방지를 위한 취수구 스크린 점검"],
      en: ["Immediately stop pump and remove/clean suction strainer", "Inspect intake screen to prevent foreign particle ingress"]
    },
    metrics: { vib: "5.44 mm/s", temp: "69.1 °C", press: "7.2 bar", flow: "245 m³/h" }
  },
  {
    titleKo: "3개월 예방보전 설비 종합 점검 완료 리포트",
    titleEn: "3-Month Preventive Maintenance Comprehensive Inspection Completed Report",
    descKo: "분기별 종합 예방보전 점검 완료. 전 채널 정상 수립.",
    descEn: "Quarterly comprehensive preventive maintenance completed. All channels normal.",
    statusType: "NORMAL", prefix: "DIAG", hour: 17,
    keyAnomaly: { ko: "정상 (분기 종합 점검 완료)", en: "Normal (Quarterly Comprehensive Inspection Completed)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 분기별 종합 예방보전 점검 결과 베어링, 패킹, 임펠러, 전기 계통 모두 정상 상태입니다. 다중 센서 융합 연산 결과 전 채널 이상 없음이 확인되었습니다. 다음 분기 점검까지 정상 가동이 가능합니다.",
      en: "AI Engine Cross-Fusion Verdict: Quarterly comprehensive inspection confirms bearings, packing, impeller, and electrical system are all in normal condition. Multi-sensor fusion analysis confirms no anomaly across all channels. Normal operation possible until next quarterly inspection."
    },
    actions: {
      ko: ["다음 분기 종합 점검 일정 (90일 후) 캘린더 등록", "이번 점검 결과 및 부품 이력 정비 대장 기록"],
      en: ["Register next quarterly comprehensive inspection (90 days later) in calendar", "Record inspection results and part history in maintenance logbook"]
    },
    metrics: { vib: "0.76 mm/s", temp: "40.8 °C", press: "14.4 bar", flow: "524 m³/h" }
  },
  {
    titleKo: "제수밸브 약간 개방 상태로 인한 양수량 감소 감지",
    titleEn: "Control Valve Slightly Open Causing Flow Rate Reduction Detection",
    descKo: "송출 제수밸브 미개방으로 인한 양수량 저하 및 기동 시 부하 과다.",
    descEn: "Flow rate reduction and startup overload due to partially closed discharge control valve.",
    statusType: "WARNING", prefix: "DIAG", hour: 19,
    keyAnomaly: { ko: "제수밸브 미개방 (양수량 25% 저하)", en: "Control Valve Partially Closed (Flow 25% Below Normal)" },
    explanation: {
      ko: "AI 엔진 교차 융합 진단 소견: 송출 측 압력이 비정상적으로 높고(14.8 bar) 양수량이 25% 낮은 패턴이 제수밸브 미개방 상태를 나타냅니다. 기동 시 과부하 전류도 간헐적으로 감지됩니다. 제수밸브 개도 확인 및 조정이 필요합니다.",
      en: "AI Engine Cross-Fusion Verdict: Abnormally high discharge pressure (14.8 bar) with 25% flow reduction indicates a partially closed control valve. Intermittent startup overload current is also detected. Control valve opening verification and adjustment are required."
    },
    actions: {
      ko: ["송출 측 제수밸브 전면 개방 확인 및 개도 조정", "밸브 구동부 상태 점검 (수동/전동 겸용 여부 확인)"],
      en: ["Verify full opening of discharge control valve and adjust opening degree", "Inspect valve actuator condition (check manual/motorized combination)"]
    },
    metrics: { vib: "1.68 mm/s", temp: "44.9 °C", press: "14.8 bar", flow: "358 m³/h" }
  },
];

// ─── 날짜 기반 결정적 셔플 (같은 날은 항상 같은 순서) ──────────────────────
function shuffleForDay(templates, date) {
  const seed   = date.getDate() * 3 + date.getMonth() * 17 + date.getFullYear() % 100;
  const offset = seed % templates.length;
  // rotate
  const rotated = [...templates.slice(offset), ...templates.slice(0, offset)];
  // pick 8
  return rotated.slice(0, 8);
}

// ─── 특정 날짜의 8개 리포트 생성 ─────────────────────────────────────────────
export function generateReportsForDay(date, isEn) {
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const dd   = String(date.getDate()).padStart(2, '0');

  const dayTemplates = shuffleForDay(REPORT_TEMPLATES, date);

  return dayTemplates.map((tmpl, idx) => {
    const hh      = String(tmpl.hour).padStart(2, '0');
    const dateStr = `${yyyy}.${mm}.${dd} ${hh}:00 KST`;
    const idStr   = `${tmpl.prefix}-${yyyy}-${mm}-${dd}-${String(idx + 1).padStart(3, '0')}`;

    const C = {
      DANGER:  { iconColor: "text-rose-400",    iconBg: "bg-rose-500/10",    iconBorder: "border-rose-500/25",    badgeCls: "text-rose-400 bg-rose-500/15 border-rose-500/20"    },
      WARNING: { iconColor: "text-amber-400",   iconBg: "bg-amber-500/10",   iconBorder: "border-amber-500/25",   badgeCls: "text-amber-400 bg-amber-500/15 border-amber-500/20"  },
      NORMAL:  { iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", iconBorder: "border-emerald-500/25", badgeCls: "text-emerald-400 bg-emerald-500/15 border-emerald-500/20" },
    }[tmpl.statusType];

    return {
      title:       isEn ? tmpl.titleEn  : tmpl.titleKo,
      desc:        isEn ? tmpl.descEn   : tmpl.descKo,
      id:          idStr,
      date:        dateStr,
      statusType:  tmpl.statusType,
      statusLabel: isEn ? tmpl.statusType : (tmpl.statusType === 'DANGER' ? '위험 감지' : tmpl.statusType === 'WARNING' ? '주의 요망' : '정상 가동'),
      metrics:     tmpl.metrics,
      // modal data
      keyAnomaly:  isEn ? tmpl.keyAnomaly.en  : tmpl.keyAnomaly.ko,
      explanation: isEn ? tmpl.explanation.en : tmpl.explanation.ko,
      actions:     isEn ? tmpl.actions.en     : tmpl.actions.ko,
      tagColor:    tmpl.statusType === 'DANGER'
        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
        : tmpl.statusType === 'WARNING'
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      timelineStart: `0${tmpl.hour - 3 < 10 ? '' : ''}${tmpl.hour - 3}:00 KST`,
      timelineEnd:   `${String(tmpl.hour).padStart(2,'0')}:00 KST`,
      ...C,
    };
  });
}

// ─── 하루 상태 요약 ────────────────────────────────────────────────────────────
export function summarizeDay(date) {
  const reports = generateReportsForDay(date, true);
  return {
    danger:  reports.filter(r => r.statusType === 'DANGER').length,
    warning: reports.filter(r => r.statusType === 'WARNING').length,
    normal:  reports.filter(r => r.statusType === 'NORMAL').length,
  };
}

// ─── 날짜 포맷 헬퍼 ──────────────────────────────────────────────────────────
export function formatDateLabel(date, isEn) {
  const mm  = date.getMonth() + 1;
  const dd  = date.getDate();
  const days = isEn
    ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    : ['일','월','화','수','목','금','토'];
  const dow = days[date.getDay()];
  return isEn ? `${mm}/${dd} (${dow})` : `${mm}월 ${dd}일 (${dow})`;
}

export function getWeekStart(refDate) {
  const d   = new Date(refDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addWeeks(weekStart, n) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + n * 7);
  return d;
}

export function getMonthStart(refDate) {
  return new Date(refDate.getFullYear(), refDate.getMonth(), 1);
}

export function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
