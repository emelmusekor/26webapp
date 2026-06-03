# [EduBridge] AI Gifted Curriculum Matrix
> **Vision:** AI Native를 위한 5대 지능 × 5단 사고 엔진

## 1. Matrix Overview
이 매트릭스는 AI 영재가 갖춰야 할 **5가지 핵심 지능(Domain)**과 문제를 해결하는 **5단계 사고 과정(Process)**의 교차점에서 발생하는 구체적인 학습 목표를 정의합니다.

### 🧠 X-Axis: 5 AI Domains (AI의 지능)
| Domain | 설명 | 비유 (World) |
| :--- | :--- | :--- |
| **A. Vision AI** | 시각 정보를 인식하고 분석하는 능력 | 👁️ 그림과 지도의 세상 |
| **B. Logic AI** | 논리적 규칙과 순서를 설계하는 능력 | 🧩 약속과 순서의 세상 |
| **C. Data AI** | 수치 데이터를 처리하고 패턴을 발견하는 능력 | 📊 숫자와 암호의 세상 |
| **D. Network AI** | 관계를 이해하고 연결 구조를 최적화하는 능력 | 🌐 연결과 관계의 세상 |
| **E. System AI** | 전체 시스템을 조망하고 시뮬레이션하는 능력 | ⚙️ 세상과 시뮬레이션 |

### ⚙️ Y-Axis: 5 Thinking Steps (AI의 사고)
1. **Sensing** (인지): 무엇이 있는가? (Input)
2. **Preprocessing** (전처리): 쓸모 있는가? (Filter)
3. **Modeling** (모델링): 어떻게 연결할까? (Plan)
4. **Evaluation** (평가): 잘 작동하는가? (Test)
5. **Optimization** (최적화): 더 좋은 방법은? (Upgrade)

---

## 2. The 5x5 Precision Matrix
각 셀은 **[전문 용어]**와 **(아동용 설명)**으로 구성됩니다.

| Process ↓ Domain → | **A. Vision AI**<br>👁️ 시각 지능 | **B. Logic AI**<br>🧩 논리 지능 | **C. Data AI**<br>📊 데이터 지능 | **D. Network AI**<br>🌐 관계 지능 | **E. System AI**<br>⚙️ 시스템 지능 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Sensing**<br>📡 데이터 인지<br>*(관찰하기)* | **Visual Scanning**<br>(숨은 정보 찾기)<br>복잡한 배경 속 타겟 감지 | **Syntax Reading**<br>(명령어 읽기)<br>아이콘/기호의 의미 해석 | **Data Collecting**<br>(재료 모으기)<br>흩어진 정보 조각 수집 | **Node Identification**<br>(친구 찾기)<br>점(Node)과 선(Edge) 파악 | **Environment Scan**<br>(상황 파악하기)<br>날씨, 지형 등 환경 인식 |
| **2. Preprocessing**<br>🧹 데이터 전처리<br>*(정리하기)* | **Noise Reduction**<br>(방해물 지우기)<br>불필요한 시각 정보 제거 | **Decomposition**<br>(쪼개어 보기)<br>복잡한 문제를 작게 분해 | **Classification**<br>(끼리끼리 묶기)<br>속성에 따라 그룹 분류 | **Filtering**<br>(가지치기)<br>관계없는 연결 제외 | **Variable Definition**<br>(영향 요인 찾기)<br>핵심 변수 정의 |
| **3. Modeling**<br>🏗️ 알고리즘 설계<br>*(계획하기)* | **Path Planning**<br>(길 그리기)<br>목적지 이동 경로 설계 | **Control Flow**<br>(흐름 만들기)<br>조건(If)과 반복(Loop) | **Pattern Encoding**<br>(암호 만들기)<br>정보를 규칙으로 치환 | **Network Mapping**<br>(관계 잇기)<br>연결 구조(Graph) 완성 | **Rule Generation**<br>(법칙 만들기)<br>작동 원리/인과 수립 |
| **4. Evaluation**<br>⚖️ 성능 평가<br>*(검사하기)* | **Collision Check**<br>(부딪힘 확인)<br>장애물 충돌 여부 검사 | **Logic Debugging**<br>(오류 고치기)<br>논리적 결함 수정 | **Validation**<br>(정답 확인)<br>규칙에 맞는지 검증 | **Connectivity Check**<br>(연결 확인)<br>끊어진 곳 없는지 점검 | **Simulation Test**<br>(미리 돌려보기)<br>가상 실행 및 결과 예측 |
| **5. Optimization**<br>🚀 최적화<br>*(업그레이드)* | **Global Optimization**<br>(지름길 찾기)<br>최단 거리/시간 경로 | **Code Efficiency**<br>(블록 줄이기)<br>최소 명령어로 구현 | **Compression**<br>(짐 싸기)<br>데이터 용량 최소화 | **Cost Minimization**<br>(비용 아끼기)<br>최소 비용 네트워크 구축 | **Throughput Max**<br>(성능 높이기)<br>제한된 자원 내 최대 성과 |

---

## 3. Prototype Project: Toy Trader (장난감 무역왕)
> **Target Domain:** D-5 (Network AI > Optimization)

### 🎯 Mission Concept
- **상황**: 우리는 여러 마을(Node)을 돌아다니며 장난감을 교환하는 무역상입니다.
- **목표**: 시작점(Start)에서 목표지점(End)까지 물건을 교환하며 이동할 때, **가장 적은 수수료(Cost)**를 내는 경로를 찾아야 합니다.
- **핵심 원리**: 그래프 이론 (Graph Theory), 다익스트라 알고리즘 (Dijkstra), 탐욕 알고리즘의 한계(Greedy Failures)

### 🏆 Difficulty Levels
1.  **Level 1 (Easy)**: 갈림길이 적고 눈으로도 쉽게 보이는 최단 경로.
2.  **Level 2 (Normal)**: 경로가 다양하며, 단순히 짧아 보이는 길이 함정일 수 있음.
3.  **Level 3 (Hard)**: 복잡한 네트워크. 눈앞의 이익(작은 비용)만 쫓다가 전체 비용이 커지는 구조. (Greedy 함정)
